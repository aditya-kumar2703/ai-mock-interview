import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook that manages webcam stream + MediaPipe FaceMesh + Pose analysis.
 * All analysis runs client-side in the browser. No video data is sent to the server.
 * 
 * Exports:
 *  - videoRef: ref to attach to a <video> element
 *  - canvasRef: ref to attach to a hidden <canvas> for MediaPipe frame capture
 *  - isWebcamActive: boolean
 *  - isModelLoading: boolean
 *  - currentMetrics: real-time scores
 *  - allSnapshots: array of periodic snapshots
 *  - aggregateMetrics: final aggregate metrics for the report
 *  - toggleWebcam: start/stop webcam
 *  - startAnalysis: begin MediaPipe frame loop
 *  - stopAnalysis: stop and compute final aggregates
 */
export default function useWebcamAnalysis() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const faceMeshRef = useRef(null);
  const poseRef = useRef(null);
  const isAnalyzingRef = useRef(false);
  const startTimeRef = useRef(null);
  const lastSnapshotTimeRef = useRef(0);

  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);

  // Running metrics accumulators
  const metricsAccRef = useRef({
    frameCount: 0,
    eyeContactFrames: 0,
    totalHeadStability: 0,
    totalShoulderStability: 0,
    smileFrames: 0,
    smileEvents: 0,
    inSmile: false,
    smileDurations: [],
    currentSmileStart: null,
    gazeHistory: [], // for longest distraction
    prevNosePos: null,
    prevShoulderAngle: null,
  });

  const [currentMetrics, setCurrentMetrics] = useState({
    eyeContact: true,
    confidence: 0,
    engagement: 0,
    bodyLanguage: 0,
    isSmiling: false,
  });

  const [allSnapshots, setAllSnapshots] = useState([]);
  const [aggregateMetrics, setAggregateMetrics] = useState(null);

  // ─── Webcam Toggle ──────────────────────────────────────────────
  const toggleWebcam = useCallback(async () => {
    if (isWebcamActive) {
      // Turn off
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setWebcamStream(null);
      setIsWebcamActive(false);
      return;
    }

    // Turn on
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsWebcamActive(true);
    } catch (err) {
      console.error('Webcam access error:', err);
      alert(`Camera Error: ${err.message}. Please check permissions.`);
    }
  }, [isWebcamActive]);

  // ─── MediaPipe Initialization ────────────────────────────────────
  const initMediaPipe = useCallback(async () => {
    setIsModelLoading(true);

    try {
      // Dynamic import to avoid blocking initial bundle
      const { FaceMesh } = await import('@mediapipe/face_mesh');
      const { Pose } = await import('@mediapipe/pose');

      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true, // enables iris tracking
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      pose.setOptions({
        modelComplexity: 0, // lite model for speed
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMeshRef.current = faceMesh;
      poseRef.current = pose;

      setIsModelLoading(false);
      return { faceMesh, pose };
    } catch (err) {
      console.error('MediaPipe initialization error:', err);
      setIsModelLoading(false);
      return null;
    }
  }, []);

  // ─── Frame Analysis Helpers ──────────────────────────────────────

  /**
   * Analyze eye gaze direction from FaceMesh iris landmarks.
   * Returns true if looking at camera, false if looking away.
   */
  const analyzeEyeContact = (landmarks) => {
    if (!landmarks || landmarks.length < 478) return true; // no iris data

    // Right iris center: 468, Left iris center: 473
    // Right eye corners: 33 (inner), 133 (outer)
    // Left eye corners: 362 (inner), 263 (outer)
    const rightIris = landmarks[468];
    const leftIris = landmarks[473];
    const rightInner = landmarks[33];
    const rightOuter = landmarks[133];
    const leftInner = landmarks[362];
    const leftOuter = landmarks[263];

    // Calculate horizontal ratio for each eye (0 = looking left, 1 = looking right)
    const rightEyeWidth = Math.abs(rightOuter.x - rightInner.x);
    const leftEyeWidth = Math.abs(leftOuter.x - leftInner.x);

    if (rightEyeWidth === 0 || leftEyeWidth === 0) return true;

    const rightRatio = (rightIris.x - rightInner.x) / rightEyeWidth;
    const leftRatio = (leftIris.x - leftInner.x) / leftEyeWidth;

    // Average horizontal gaze. Center is ~0.5
    const avgHorizontalGaze = (rightRatio + leftRatio) / 2;

    // Vertical check: nose tip (1) vs forehead (10) vs chin (152)
    const noseTip = landmarks[1];
    const forehead = landmarks[10];
    const chin = landmarks[152];
    const faceHeight = Math.abs(forehead.y - chin.y);
    const headPitch = faceHeight > 0 ? (noseTip.y - forehead.y) / faceHeight : 0.5;

    // Thresholds: looking at screen if horizontal gaze is 0.3-0.7 and head isn't tilted too far
    const isHorizontalOk = avgHorizontalGaze > 0.3 && avgHorizontalGaze < 0.7;
    const isVerticalOk = headPitch > 0.2 && headPitch < 0.65;

    return isHorizontalOk && isVerticalOk;
  };

  /**
   * Detect smile using mouth landmark distances.
   */
  const detectSmile = (landmarks) => {
    if (!landmarks || landmarks.length < 400) return false;

    // Lip corners: 61 (left), 291 (right)
    // Upper lip center: 13, Lower lip center: 14
    const leftCorner = landmarks[61];
    const rightCorner = landmarks[291];
    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];

    // Mouth width vs height ratio
    const mouthWidth = Math.sqrt(
      Math.pow(rightCorner.x - leftCorner.x, 2) +
      Math.pow(rightCorner.y - leftCorner.y, 2)
    );
    const mouthHeight = Math.sqrt(
      Math.pow(upperLip.x - lowerLip.x, 2) +
      Math.pow(upperLip.y - lowerLip.y, 2)
    );

    if (mouthHeight === 0) return false;
    const ratio = mouthWidth / mouthHeight;

    // Also check if corners are above the midpoint of the lips (upturned)
    const lipMidY = (upperLip.y + lowerLip.y) / 2;
    const cornersAbove = (leftCorner.y < lipMidY) && (rightCorner.y < lipMidY);

    return ratio > 3.5 && cornersAbove;
  };

  /**
   * Measure head stability by tracking nose position over time.
   */
  const measureHeadStability = (landmarks) => {
    if (!landmarks || landmarks.length < 10) return 100;

    const noseTip = landmarks[1];
    const acc = metricsAccRef.current;

    if (!acc.prevNosePos) {
      acc.prevNosePos = { x: noseTip.x, y: noseTip.y };
      return 100;
    }

    const dx = Math.abs(noseTip.x - acc.prevNosePos.x);
    const dy = Math.abs(noseTip.y - acc.prevNosePos.y);
    const movement = Math.sqrt(dx * dx + dy * dy);

    acc.prevNosePos = { x: noseTip.x, y: noseTip.y };

    // Convert movement to stability score (less movement = higher stability)
    // movement of 0.02 is very still, 0.1 is very fidgety
    const stability = Math.max(0, Math.min(100, (1 - movement / 0.08) * 100));
    return stability;
  };

  /**
   * Analyze body language from Pose landmarks.
   */
  const analyzeBodyLanguage = (poseLandmarks) => {
    if (!poseLandmarks || poseLandmarks.length < 15) return 75;

    // Shoulder landmarks: 11 (left), 12 (right)
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];

    // Shoulder angle (should be close to 0 for level shoulders)
    const shoulderAngle = Math.atan2(
      rightShoulder.y - leftShoulder.y,
      rightShoulder.x - leftShoulder.x
    ) * (180 / Math.PI);

    const shoulderLevelness = Math.max(0, 100 - Math.abs(shoulderAngle) * 5);

    // Head position relative to shoulders (nose landmark from pose: 0)
    const nose = poseLandmarks[0];
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    const headAlignment = Math.max(0, 100 - Math.abs(nose.x - shoulderMidX) * 500);

    return Math.round((shoulderLevelness * 0.6 + headAlignment * 0.4));
  };

  // ─── Process a Single Frame ──────────────────────────────────────
  const processFrame = useCallback(async () => {
    if (!isAnalyzingRef.current) return;
    if (!videoRef.current || !canvasRef.current) return;
    if (videoRef.current.readyState < 2) {
      // Video not ready yet, try again
      animationRef.current = setTimeout(() => processFrame(), 200);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    ctx.drawImage(videoRef.current, 0, 0);

    const acc = metricsAccRef.current;
    let faceResults = null;
    let poseResults = null;

    // Run FaceMesh
    try {
      if (faceMeshRef.current) {
        faceResults = await new Promise((resolve) => {
          faceMeshRef.current.onResults((r) => resolve(r));
          faceMeshRef.current.send({ image: canvas });
        });
      }
    } catch (e) {
      // Model may not be ready yet
    }

    // Run Pose
    try {
      if (poseRef.current) {
        poseResults = await new Promise((resolve) => {
          poseRef.current.onResults((r) => resolve(r));
          poseRef.current.send({ image: canvas });
        });
      }
    } catch (e) {
      // Model may not be ready yet
    }

    acc.frameCount++;

    // Face analysis
    if (faceResults && faceResults.multiFaceLandmarks && faceResults.multiFaceLandmarks.length > 0) {
      const landmarks = faceResults.multiFaceLandmarks[0];

      // Eye contact
      const hasEyeContact = analyzeEyeContact(landmarks);
      if (hasEyeContact) acc.eyeContactFrames++;
      acc.gazeHistory.push(hasEyeContact);

      // Smile
      const isSmiling = detectSmile(landmarks);
      if (isSmiling) acc.smileFrames++;

      if (isSmiling && !acc.inSmile) {
        acc.inSmile = true;
        acc.currentSmileStart = Date.now();
        acc.smileEvents++;
      } else if (!isSmiling && acc.inSmile) {
        acc.inSmile = false;
        if (acc.currentSmileStart) {
          acc.smileDurations.push((Date.now() - acc.currentSmileStart) / 1000);
        }
      }

      // Head stability
      const headStability = measureHeadStability(landmarks);
      acc.totalHeadStability += headStability;

      // Update live metrics
      const eyeContactPct = acc.frameCount > 0 ? (acc.eyeContactFrames / acc.frameCount) * 100 : 0;
      const avgHeadStability = acc.frameCount > 0 ? acc.totalHeadStability / acc.frameCount : 75;

      setCurrentMetrics(prev => ({
        ...prev,
        eyeContact: hasEyeContact,
        confidence: Math.round(avgHeadStability * 0.6 + eyeContactPct * 0.4),
        isSmiling,
        engagement: Math.round(eyeContactPct * 0.5 + (isSmiling ? 20 : 0) + avgHeadStability * 0.3),
      }));
    }

    // Pose analysis
    if (poseResults && poseResults.poseLandmarks) {
      const bodyScore = analyzeBodyLanguage(poseResults.poseLandmarks);
      acc.totalShoulderStability += bodyScore;

      setCurrentMetrics(prev => ({
        ...prev,
        bodyLanguage: Math.round(acc.totalShoulderStability / acc.frameCount),
      }));
    }

    // Periodic snapshot (every 5 seconds)
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    if (elapsed - lastSnapshotTimeRef.current >= 5) {
      lastSnapshotTimeRef.current = elapsed;
      const eyePct = acc.frameCount > 0 ? (acc.eyeContactFrames / acc.frameCount) * 100 : 0;
      const headAvg = acc.frameCount > 0 ? acc.totalHeadStability / acc.frameCount : 75;
      const bodyAvg = acc.frameCount > 0 ? acc.totalShoulderStability / acc.frameCount : 75;

      const snapshot = {
        timestamp: Math.round(elapsed),
        eyeContactScore: Math.round(eyePct),
        confidenceScore: Math.round(headAvg * 0.6 + eyePct * 0.4),
        engagementScore: Math.round(eyePct * 0.5 + headAvg * 0.3 + (acc.smileFrames / Math.max(1, acc.frameCount)) * 20),
        bodyLanguageScore: Math.round(bodyAvg),
      };

      setAllSnapshots(prev => [...prev, snapshot]);
    }

    // Schedule next frame (~5 FPS to save CPU)
    if (isAnalyzingRef.current) {
      animationRef.current = setTimeout(() => processFrame(), 200);
    }
  }, []);

  // ─── Start / Stop Analysis ───────────────────────────────────────
  const startAnalysis = useCallback(async () => {
    if (!isWebcamActive) return;

    const models = await initMediaPipe();
    if (!models) return;

    // Reset accumulators
    metricsAccRef.current = {
      frameCount: 0,
      eyeContactFrames: 0,
      totalHeadStability: 0,
      totalShoulderStability: 0,
      smileFrames: 0,
      smileEvents: 0,
      inSmile: false,
      smileDurations: [],
      currentSmileStart: null,
      gazeHistory: [],
      prevNosePos: null,
      prevShoulderAngle: null,
    };
    setAllSnapshots([]);
    setAggregateMetrics(null);
    startTimeRef.current = Date.now();
    lastSnapshotTimeRef.current = 0;
    isAnalyzingRef.current = true;
    setIsAnalyzing(true);

    processFrame();
  }, [isWebcamActive, initMediaPipe, processFrame]);

  const stopAnalysis = useCallback(() => {
    isAnalyzingRef.current = false;
    setIsAnalyzing(false);

    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    // Compute final aggregates
    const acc = metricsAccRef.current;
    const totalFrames = Math.max(1, acc.frameCount);
    const eyeContactScore = Math.round((acc.eyeContactFrames / totalFrames) * 100);
    const headStabilityAvg = Math.round(acc.totalHeadStability / totalFrames);
    const bodyAvg = Math.round(acc.totalShoulderStability / Math.max(1, acc.totalShoulderStability > 0 ? totalFrames : 1));
    const smilePct = (acc.smileFrames / totalFrames) * 100;

    // Compute longest distraction (consecutive false entries in gazeHistory)
    let longestDistraction = 0;
    let currentStreak = 0;
    for (const lookingAtScreen of acc.gazeHistory) {
      if (!lookingAtScreen) {
        currentStreak++;
        longestDistraction = Math.max(longestDistraction, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    // Each frame is ~200ms
    const longestDistractionSeconds = (longestDistraction * 0.2);

    const avgSmileDuration = acc.smileDurations.length > 0
      ? acc.smileDurations.reduce((a, b) => a + b, 0) / acc.smileDurations.length
      : 0;

    const confidenceScore = Math.round(headStabilityAvg * 0.5 + eyeContactScore * 0.3 + (smilePct > 5 ? 20 : smilePct * 4));
    const engagementScore = Math.round(eyeContactScore * 0.4 + headStabilityAvg * 0.3 + Math.min(smilePct * 2, 30));
    const smileScore = Math.round(Math.min(100, smilePct * 5 + (avgSmileDuration > 1 ? 20 : 0)));

    const final = {
      eyeContactScore,
      confidenceScore: Math.min(100, confidenceScore),
      bodyLanguageScore: bodyAvg || 75,
      engagementScore: Math.min(100, engagementScore),
      smileScore: Math.min(100, smileScore),
      screenFocusPercentage: eyeContactScore,
      lookingAwayPercentage: 100 - eyeContactScore,
      longestDistractionSeconds: Math.round(longestDistractionSeconds * 10) / 10,
      smileFrequency: acc.smileEvents,
      averageSmileDuration: Math.round(avgSmileDuration * 10) / 10,
    };

    setAggregateMetrics(final);
    return final;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isAnalyzingRef.current = false;
      if (animationRef.current) clearTimeout(animationRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    isWebcamActive,
    isModelLoading,
    isAnalyzing,
    currentMetrics,
    allSnapshots,
    aggregateMetrics,
    webcamStream,
    toggleWebcam,
    startAnalysis,
    stopAnalysis,
  };
}

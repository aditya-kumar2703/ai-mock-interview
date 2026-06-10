import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui';

export default function VoiceRecorder({ onRecordingComplete, onCancel, disabled, autoStart, onLiveTranscriptChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  
  const isRecordingRef = useRef(isRecording);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isRecordingRef.current = isRecording;
    isPausedRef.current = isPaused;
  }, [isRecording, isPaused]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopTimer();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    if (!autoStart) {
      hasAutoStartedRef.current = false;
    } else if (autoStart && !isRecording && !isPaused && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      startRecording();
    }
  }, [autoStart, isRecording, isPaused]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setLiveTranscript('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Setup Web Speech API for live transcription feedback
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          
          let finalTranscript = '';
          
          recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            const fullTranscript = finalTranscript + interimTranscript;
            setLiveTranscript(fullTranscript);
            if (onLiveTranscriptChange) {
              onLiveTranscriptChange(fullTranscript);
            }
          };

          // If it stops unexpectedly, try to restart unless we explicitly stopped it
          recognition.onend = () => {
            if (isRecordingRef.current && !isPausedRef.current) {
              try { recognition.start(); } catch(e) {}
            }
          };

          recognitionRef.current = recognition;
          recognition.start();
        }
      } catch (speechError) {
        console.warn('Speech recognition failed to start (may be unsupported or blocked):', speechError);
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob, recordingTime);
      };

      mediaRecorder.start(200); // gather chunks every 200ms
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert(`Microphone Error: ${error?.message || error}. (If you are on a phone/network, ensure you are using HTTPS. Otherwise, check if another app is using the mic)`);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Controls Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-2">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-800">
            {!isRecording ? (
              <Mic className="text-surface-400" size={20} />
            ) : (
              <>
                {/* Pulse animation when actively recording */}
                {!isPaused && (
                  <div className="absolute inset-0 rounded-full bg-danger-500/20 animate-ping" />
                )}
                <Mic className="text-danger-500 relative z-10" size={20} />
              </>
            )}
          </div>
          
          <div>
            <div className="text-sm font-medium text-surface-200">
              {!isRecording ? 'Ready to record' : isPaused ? 'Paused' : 'Recording...'}
            </div>
            <div className="text-xs text-surface-400 font-mono">
              {formatTime(recordingTime)}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
          {!isRecording ? (
            <>
              <Button variant="ghost" size="sm" onClick={onCancel} disabled={disabled} className="w-full sm:w-auto">
                Type Answer
              </Button>
              <Button variant="primary" size="sm" onClick={startRecording} disabled={disabled} className="w-full sm:w-auto">
                Start Recording
              </Button>
            </>
          ) : (
            <>
              {isPaused ? (
                <Button variant="ghost" size="sm" onClick={resumeRecording} icon={<Play size={16} />}>
                  Resume
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={pauseRecording} icon={<Pause size={16} />}>
                  Pause
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={stopRecording} icon={<Square size={16} fill="currentColor" />}>
                Stop & Submit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

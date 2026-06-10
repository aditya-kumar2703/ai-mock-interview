import { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Camera, CameraOff, Loader2, Smile } from 'lucide-react';

/**
 * Draggable floating Picture-in-Picture webcam preview with real-time behavioral indicators.
 */
export default function WebcamPreview({
  videoRef,
  canvasRef,
  isWebcamActive,
  isModelLoading,
  isAnalyzing,
  currentMetrics,
  onToggle,
  stream, // receive stream directly to attach
}) {
  // Drag state
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: null, y: null }); // null = use CSS default
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Attach stream to video element directly
  useEffect(() => {
    if (videoRef?.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream, videoRef, isWebcamActive]);

  // ─── Drag Handlers ────────────────────────────────────────
  const handleMouseDown = useCallback((e) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.body.style.userSelect = 'none';
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (!containerRef.current || e.touches.length !== 1) return;
    isDragging.current = true;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }, []);

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (!isDragging.current) return;
      const newX = clientX - dragOffset.current.x;
      const newY = clientY - dragOffset.current.y;

      // Clamp to viewport
      const maxX = window.innerWidth - 200;
      const maxY = window.innerHeight - 180;
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const stopDrag = () => {
      isDragging.current = false;
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', stopDrag);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDrag);
    };
  }, []);

  const positionStyle = position.x !== null
    ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto' }
    : { right: '1.5rem', top: '7rem' };

  if (!isWebcamActive) {
    return (
      <div className="fixed z-40" style={positionStyle}>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-900/90 backdrop-blur-xl border border-surface-700/60 text-surface-300 hover:text-surface-100 hover:border-primary-500/40 transition-all duration-300 shadow-xl hover:shadow-glow-sm"
        >
          <CameraOff size={16} />
          <span className="text-xs font-medium">Enable Camera</span>
        </button>
      </div>
    );
  }

  const getEyeContactLabel = () => {
    if (!isAnalyzing) return null;
    return currentMetrics.eyeContact
      ? { text: 'Eye Contact', color: 'text-success-500', bg: 'bg-success-500/15', icon: <Eye size={10} /> }
      : { text: 'Looking Away', color: 'text-warning-500', bg: 'bg-warning-500/15', icon: <EyeOff size={10} /> };
  };

  const getConfidenceLabel = () => {
    if (!isAnalyzing || !currentMetrics.confidence) return null;
    const score = currentMetrics.confidence;
    if (score >= 75) return { text: 'Confident', color: 'text-success-500' };
    if (score >= 50) return { text: 'Moderate', color: 'text-warning-500' };
    return { text: 'Nervous', color: 'text-danger-500' };
  };

  const eyeLabel = getEyeContactLabel();
  const confLabel = getConfidenceLabel();

  return (
    <div
      ref={containerRef}
      className="fixed z-40 select-none"
      style={positionStyle}
    >
      <div className="relative group">
        {/* Drag Handle */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full bg-surface-800/90 border border-surface-700/50 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-surface-400" />
            <div className="w-1 h-1 rounded-full bg-surface-400" />
            <div className="w-1 h-1 rounded-full bg-surface-400" />
            <div className="w-1 h-1 rounded-full bg-surface-400" />
            <div className="w-1 h-1 rounded-full bg-surface-400" />
          </div>
        </div>

        {/* Video Preview */}
        <div
          className="relative w-52 h-40 rounded-2xl overflow-hidden border-2 border-surface-700/60 shadow-2xl bg-surface-950 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Loading overlay */}
          {isModelLoading && (
            <div className="absolute inset-0 bg-surface-950/80 flex flex-col items-center justify-center gap-2">
              <Loader2 size={20} className="text-primary-500 animate-spin" />
              <span className="text-[10px] text-surface-400">Loading AI Models...</span>
            </div>
          )}

          {/* Live indicator dot */}
          {isAnalyzing && (
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
              <span className="text-[9px] text-surface-300 font-medium uppercase tracking-wider bg-surface-950/60 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
          )}

          {/* Smile indicator */}
          {isAnalyzing && currentMetrics.isSmiling && (
            <div className="absolute top-2 right-2">
              <Smile size={14} className="text-warning-400" />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-surface-900/80 hover:bg-danger-500/80 text-surface-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <CameraOff size={12} />
          </button>
        </div>

        {/* Floating Metric Badges */}
        {isAnalyzing && (
          <div className="flex items-center gap-1.5 mt-2 justify-center flex-wrap">
            {eyeLabel && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${eyeLabel.bg} ${eyeLabel.color}`}>
                {eyeLabel.icon}
                {eyeLabel.text}
              </span>
            )}
            {confLabel && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-800/80 ${confLabel.color}`}>
                {confLabel.text}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hidden canvas for MediaPipe frame capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

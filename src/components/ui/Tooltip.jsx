import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

/**
 * Tooltip component.
 *
 * @param {Object} props
 * @param {string} props.content — tooltip text
 * @param {'top'|'bottom'|'left'|'right'} props.position
 * @param {number} props.delay — show delay in ms
 */
export default function Tooltip({
  content,
  position = 'top',
  delay = 300,
  children,
  className,
}) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap',
            'bg-surface-800 text-surface-200 border border-surface-700 shadow-elevated',
            'animate-fade-in pointer-events-none',
            positionClasses[position]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

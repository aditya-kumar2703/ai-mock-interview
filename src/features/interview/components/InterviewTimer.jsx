import { cn } from '../../../lib/utils';
import { formatDuration } from '../../../lib/utils';
import { Clock } from 'lucide-react';

/**
 * Interview session timer display.
 */
export default function InterviewTimer({
  seconds = 0,
  isRunning = false,
  className,
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-xl',
        'bg-surface-900/80 border border-surface-700',
        isRunning && 'animate-pulse-glow',
        className
      )}
    >
      <Clock size={16} className={cn(isRunning ? 'text-primary-400' : 'text-surface-500')} />
      <span className={cn('font-mono text-lg font-bold', isRunning ? 'text-surface-100' : 'text-surface-400')}>
        {formatDuration(seconds)}
      </span>
    </div>
  );
}

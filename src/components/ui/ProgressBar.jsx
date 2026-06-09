import { cn } from '../../lib/utils';

/**
 * ProgressBar component.
 *
 * @param {Object} props
 * @param {number} props.value — current value
 * @param {number} props.max — maximum value
 * @param {'primary'|'success'|'warning'|'danger'|'accent'} props.color
 * @param {'sm'|'md'|'lg'} props.size
 * @param {boolean} props.animated — pulse glow animation
 * @param {boolean} props.showLabel — show percentage text
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'primary',
  size = 'md',
  animated = false,
  showLabel = false,
  className,
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    accent: 'bg-accent-500',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-surface-400">Progress</span>
          <span className="text-xs font-medium text-surface-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-surface-800 overflow-hidden',
          heights[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colors[color],
            animated && 'animate-pulse-glow'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

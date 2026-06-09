import { cn } from '../../lib/utils';

const badgeVariants = {
  success: 'bg-success-500/15 text-success-400 border-success-500/20',
  warning: 'bg-warning-500/15 text-warning-400 border-warning-500/20',
  danger: 'bg-danger-500/15 text-danger-400 border-danger-500/20',
  info: 'bg-primary-500/15 text-primary-400 border-primary-500/20',
  neutral: 'bg-surface-500/15 text-surface-400 border-surface-500/20',
  accent: 'bg-accent-500/15 text-accent-400 border-accent-500/20',
};

/**
 * Badge / chip component.
 *
 * @param {Object} props
 * @param {'success'|'warning'|'danger'|'info'|'neutral'|'accent'} props.variant
 * @param {'sm'|'md'} props.size
 * @param {boolean} props.dot — show a status dot
 */
export default function Badge({
  variant = 'info',
  size = 'sm',
  dot = false,
  children,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border rounded-full font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-success-400',
            variant === 'warning' && 'bg-warning-400',
            variant === 'danger' && 'bg-danger-400',
            variant === 'info' && 'bg-primary-400',
            variant === 'neutral' && 'bg-surface-400',
            variant === 'accent' && 'bg-accent-400'
          )}
        />
      )}
      {children}
    </span>
  );
}

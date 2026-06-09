import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Loading spinner.
 *
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} props.size
 * @param {string} props.label — accessible label
 */
export default function Spinner({
  size = 'md',
  label = 'Loading...',
  className,
}) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 40,
  };

  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      role="status"
      aria-label={label}
    >
      <Loader2
        size={sizes[size]}
        className="animate-spin text-primary-500"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

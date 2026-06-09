import { cn, getInitials } from '../../lib/utils';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

/**
 * Avatar component with image fallback to initials.
 *
 * @param {Object} props
 * @param {string} props.src — image URL
 * @param {string} props.name — fallback name for initials
 * @param {'sm'|'md'|'lg'|'xl'} props.size
 * @param {boolean} props.online — show online indicator
 */
export default function Avatar({
  src,
  name = '',
  size = 'md',
  online,
  className,
  ...props
}) {
  return (
    <div className={cn('relative inline-flex shrink-0', className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            'rounded-full object-cover ring-2 ring-surface-800',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold',
            'bg-gradient-to-br from-primary-500 to-accent-500 text-white',
            'ring-2 ring-surface-800',
            sizeClasses[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-surface-900',
            size === 'sm' ? 'h-2 w-2' : 'h-3 w-3',
            online ? 'bg-success-500' : 'bg-surface-500'
          )}
        />
      )}
    </div>
  );
}

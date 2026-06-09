import { cn } from '../../lib/utils';

/**
 * Toggle / Switch component.
 *
 * @param {Object} props
 * @param {boolean} props.checked
 * @param {Function} props.onChange
 * @param {string} props.label
 * @param {'sm'|'md'} props.size
 */
export default function Toggle({
  checked = false,
  onChange,
  label,
  size = 'md',
  id,
  className,
  ...props
}) {
  const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const track = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
  };

  const thumb = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
  };

  const translate = {
    sm: checked ? 'translate-x-4' : 'translate-x-0.5',
    md: checked ? 'translate-x-5' : 'translate-x-0.5',
  };

  return (
    <label
      htmlFor={toggleId}
      className={cn('inline-flex items-center gap-2.5 cursor-pointer', className)}
    >
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative inline-flex shrink-0 rounded-full transition-default',
          track[size],
          checked ? 'bg-primary-600' : 'bg-surface-700'
        )}
        {...props}
      >
        <span
          className={cn(
            'rounded-full bg-white shadow-xs transition-default transform',
            thumb[size],
            translate[size],
            'mt-0.5'
          )}
        />
      </button>
      {label && (
        <span className="text-sm text-surface-300 select-none">{label}</span>
      )}
    </label>
  );
}

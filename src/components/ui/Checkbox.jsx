import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

/**
 * Checkbox component with label.
 */
const Checkbox = forwardRef(function Checkbox(
  { label, id, className, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex items-center gap-2.5 cursor-pointer group',
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            'h-5 w-5 rounded-md border-2 transition-default',
            'border-surface-600 bg-surface-900/50',
            'peer-checked:bg-primary-600 peer-checked:border-primary-600',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/50',
            'group-hover:border-surface-500'
          )}
        />
        <Check
          size={12}
          className="absolute text-white opacity-0 peer-checked:opacity-100 transition-default"
          strokeWidth={3}
        />
      </div>
      {label && (
        <span className="text-sm text-surface-300 select-none">{label}</span>
      )}
    </label>
  );
});

export default Checkbox;

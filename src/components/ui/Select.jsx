import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, AlertCircle } from 'lucide-react';

/**
 * Reusable Select component.
 */
const Select = forwardRef(function Select(
  { label, error, options = [], className, fullWidth = true, ...props },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
      {label && (
        <label className="text-sm font-medium text-surface-200">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          ref={ref}
          className={cn(
            'flex h-12 w-full appearance-none rounded-full border bg-surface-950 px-4 py-2 pr-10 text-sm text-surface-100 transition-default placeholder:text-surface-500',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:border-primary-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-danger-500 focus-visible:ring-danger-500/50' : 'border-surface-800 hover:border-surface-700'
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-500">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="text-xs font-medium text-danger-500 mt-1 pl-4">{error}</p>}
    </div>
  );
});

export default Select;

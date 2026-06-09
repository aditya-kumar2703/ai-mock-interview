import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable Input component.
 */
const Input = forwardRef(function Input(
  { label, error, icon, className, fullWidth = true, ...props },
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
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-primary-400 transition-colors pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-full border bg-surface-950 px-4 py-2 text-sm text-surface-100 transition-default file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-surface-500',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:border-primary-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-danger-500 focus-visible:ring-danger-500/50' : 'border-surface-800 hover:border-surface-700',
            icon && 'pl-11'
          )}
          {...props}
        />
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-danger-500 pointer-events-none">
            <AlertCircle size={16} />
          </div>
        )}
      </div>
      {error && <p className="text-xs font-medium text-danger-500 mt-1 pl-4">{error}</p>}
    </div>
  );
});

export default Input;

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Textarea component with label and error state.
 */
const Textarea = forwardRef(function Textarea(
  { label, error, id, rows = 4, className, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-surface-300"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn(
          'w-full rounded-lg border bg-surface-900/50 px-4 py-2.5 text-sm text-surface-100',
          'placeholder:text-surface-500 resize-none',
          'transition-default',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
          error
            ? 'border-danger-500/50 focus:ring-danger-500/50 focus:border-danger-500'
            : 'border-surface-700 hover:border-surface-600',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger-400 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

export default Textarea;

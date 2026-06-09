import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

/**
 * Custom dropdown menu.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.trigger — the trigger element
 * @param {'left'|'right'} props.align
 */
export default function Dropdown({
  trigger,
  align = 'right',
  children,
  className,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger || (
          <button className="flex items-center gap-1 text-surface-300 hover:text-surface-100 transition-default">
            <span className="text-sm">Menu</span>
            <ChevronDown size={14} />
          </button>
        )}
      </div>

      {open && (
        <div
          className={cn(
            'absolute top-full mt-2 z-50 min-w-[180px]',
            'bg-surface-900 border border-surface-700 rounded-xl shadow-elevated',
            'animate-scale-in origin-top py-1',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Dropdown menu item.
 */
export function DropdownItem({ icon, children, danger, className, ...props }) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-default',
        danger
          ? 'text-danger-400 hover:bg-danger-500/10'
          : 'text-surface-300 hover:bg-surface-800 hover:text-surface-100',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

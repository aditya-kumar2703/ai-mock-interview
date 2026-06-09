import { cn } from '../../lib/utils';
import { Bell } from 'lucide-react';

/**
 * Notification bell with unread indicator.
 *
 * @param {Object} props
 * @param {number} props.count — unread count
 * @param {Function} props.onClick
 */
export default function NotificationBell({
  count = 0,
  onClick,
  className,
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
      className={cn(
        'relative p-2 rounded-lg transition-default',
        'text-surface-400 hover:text-surface-200 hover:bg-surface-800',
        className
      )}
    >
      <Bell size={18} />
      {count > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white ring-2 ring-surface-900">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

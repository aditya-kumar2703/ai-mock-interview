import { cn } from '../../lib/utils';
import { InboxIcon } from 'lucide-react';
import { Button } from '../ui';

/**
 * Empty state placeholder.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {React.ReactNode} props.icon
 * @param {string} props.actionLabel
 * @param {Function} props.onAction
 */
export default function EmptyState({
  title = 'No data yet',
  description = 'Get started by creating your first item.',
  icon,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in-up',
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-surface-800/50 mb-4">
        {icon || <InboxIcon size={32} className="text-surface-500" />}
      </div>
      <h3 className="text-lg font-semibold text-surface-200 mb-1">{title}</h3>
      <p className="text-sm text-surface-400 max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

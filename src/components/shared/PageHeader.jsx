import { cn } from '../../lib/utils';

/**
 * Page header with title, subtitle, and optional action slot.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {React.ReactNode} props.actions — right-side slot
 */
export default function PageHeader({
  title,
  subtitle,
  actions,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in',
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold text-surface-100">{title}</h1>
        {subtitle && (
          <p className="text-sm text-surface-400 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

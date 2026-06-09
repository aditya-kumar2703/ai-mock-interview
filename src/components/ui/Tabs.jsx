import { cn } from '../../lib/utils';

/**
 * Tabs component.
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string, icon?: React.ReactNode}>} props.items
 * @param {string} props.activeTab
 * @param {Function} props.onChange
 * @param {'underline'|'pill'} props.variant
 */
export default function Tabs({
  items = [],
  activeTab,
  onChange,
  variant = 'underline',
  className,
}) {
  if (variant === 'pill') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 p-1 rounded-xl bg-surface-900/80 border border-surface-800',
          className
        )}
        role="tablist"
      >
        {items.map((item) => (
          <button
            key={item.value}
            role="tab"
            aria-selected={activeTab === item.value}
            onClick={() => onChange?.(item.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-default',
              activeTab === item.value
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  // underline variant
  return (
    <div
      className={cn(
        'flex items-center gap-6 border-b border-surface-800',
        className
      )}
      role="tablist"
    >
      {items.map((item) => (
        <button
          key={item.value}
          role="tab"
          aria-selected={activeTab === item.value}
          onClick={() => onChange?.(item.value)}
          className={cn(
            'flex items-center gap-2 pb-3 text-sm font-medium transition-default relative',
            activeTab === item.value
              ? 'text-primary-400'
              : 'text-surface-400 hover:text-surface-200'
          )}
        >
          {item.icon}
          {item.label}
          {activeTab === item.value && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

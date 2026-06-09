import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui';

/**
 * Stat card with title, value, trend indicator, and icon.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string|number} props.value
 * @param {string} props.change — e.g. "+12%"
 * @param {'up'|'down'} props.trend
 * @param {React.ReactNode} props.icon
 */
export default function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  className,
}) {
  return (
    <Card variant="glass" hoverable className={cn('group', className)}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-surface-400">{title}</span>
          <span className="text-2xl font-bold text-surface-100">{value}</span>
          {change && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend === 'up' ? 'text-success-400' : 'text-danger-400'
              )}
            >
              {trend === 'up' ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-default">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

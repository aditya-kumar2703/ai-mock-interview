import { Card, Badge } from '../../../components/ui';
import EmptyState from '../../../components/shared/EmptyState';
import { cn } from '../../../lib/utils';
import { Clock, ChevronRight } from 'lucide-react';

/**
 * Recent interviews list on dashboard.
 * Renders placeholder empty state until backend is connected.
 */
export default function RecentInterviews({ className, historyData = [] }) {
  const interviews = historyData.slice(0, 3);
  if (interviews.length === 0) {
    return (
      <Card className={className}>
        <h3 className="text-lg font-semibold text-surface-100 mb-4">
          Recent Interviews
        </h3>
        <EmptyState
          title="No interviews yet"
          description="Start your first mock interview to see your history here."
          actionLabel="Start Interview"
        />
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-surface-100">
          Recent Interviews
        </h3>
        <button className="text-xs text-primary-400 hover:text-primary-300 transition-default flex items-center gap-1">
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {interviews.map((interview, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30 hover:bg-surface-800/50 transition-default cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-200">
                  {interview.role}
                </p>
                <p className="text-xs text-surface-500">{interview.date}</p>
              </div>
            </div>
            <Badge variant={interview.score >= 80 ? 'success' : interview.score >= 60 ? 'warning' : 'danger'}>
              {interview.score}%
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

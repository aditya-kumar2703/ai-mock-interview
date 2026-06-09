import { Card } from '../../../components/ui';
import EmptyState from '../../../components/shared/EmptyState';
import { CalendarDays } from 'lucide-react';

/**
 * Upcoming practice plan section.
 */
export default function UpcomingPlan({ className }) {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-surface-100 mb-4">
        Upcoming Plan
      </h3>
      <EmptyState
        title="No plan set"
        description="Create a practice plan to stay on track with your preparation."
        icon={<CalendarDays size={28} className="text-surface-500" />}
        actionLabel="Create Plan"
      />
    </Card>
  );
}

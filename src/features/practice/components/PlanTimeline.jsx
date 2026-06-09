import { Card, Badge, ProgressBar } from '../../../components/ui';
import EmptyState from '../../../components/shared/EmptyState';
import { cn } from '../../../lib/utils';
import { CalendarDays } from 'lucide-react';

/**
 * Practice plan timeline.
 */
export default function PlanTimeline({ className }) {
  return (
    <Card className={className}>
      <EmptyState
        title="No practice plan yet"
        description="Generate a personalized plan based on your target role and skill level."
        icon={<CalendarDays size={28} className="text-surface-500" />}
        actionLabel="Generate Plan"
      />
    </Card>
  );
}

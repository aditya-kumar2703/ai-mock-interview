import { Card, Badge, ProgressBar } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { BookOpen } from 'lucide-react';

/**
 * Topic card for practice plan.
 */
export default function TopicCard({
  title = 'Topic Name',
  description = 'Topic description goes here',
  progress = 0,
  status = 'not-started',
  className,
}) {
  const statusVariants = {
    'not-started': 'neutral',
    'in-progress': 'warning',
    completed: 'success',
  };

  return (
    <Card variant="default" hoverable className={cn('', className)}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400 shrink-0">
          <BookOpen size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-surface-200 truncate">
              {title}
            </h4>
            <Badge variant={statusVariants[status]} size="sm">
              {status.replace('-', ' ')}
            </Badge>
          </div>
          <p className="text-xs text-surface-500 mb-3">{description}</p>
          <ProgressBar value={progress} max={100} size="sm" color="primary" />
        </div>
      </div>
    </Card>
  );
}

import { Card, Badge } from '../../../components/ui';
import { cn } from '../../../lib/utils';

/**
 * Question display panel during interview session.
 */
export default function QuestionPanel({
  questionNumber = 1,
  totalQuestions = 5,
  question = 'Questions will appear here during the interview session.',
  category = 'General',
  className,
}) {
  return (
    <Card variant="glass" className={cn('', className)}>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="info">
          Question {questionNumber} of {totalQuestions}
        </Badge>
        <Badge variant="neutral">{category}</Badge>
      </div>
      <p className="text-lg text-surface-200 leading-relaxed">{question}</p>
    </Card>
  );
}

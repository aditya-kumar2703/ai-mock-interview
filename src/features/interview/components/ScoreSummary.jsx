import { Card, ProgressBar, Badge } from '../../../components/ui';
import { cn } from '../../../lib/utils';

/**
 * Score summary card for interview results.
 */
export default function ScoreSummary({ 
  overallScore = 0,
  technicalScore = 0,
  communicationScore = 0,
  problemSolvingScore = 0,
  confidenceScore = 0,
  className 
}) {
  const categories = [
    { label: 'Technical Knowledge', score: technicalScore, color: 'primary' },
    { label: 'Communication', score: communicationScore, color: 'accent' },
    { label: 'Problem Solving', score: problemSolvingScore, color: 'success' },
    { label: 'Confidence', score: confidenceScore, color: 'warning' },
  ];

  return (
    <Card variant="glass" className={cn('', className)}>
      <div className="text-center mb-6">
        <p className="text-sm text-surface-400 mb-1">Overall Score</p>
        <span className="text-5xl font-bold text-gradient">
          {overallScore > 0 ? `${overallScore}%` : '—'}
        </span>
        <p className="text-sm text-surface-500 mt-1">
          {overallScore > 0 ? 'Great job! Keep practicing.' : 'Complete an interview to see your score'}
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-surface-300">{cat.label}</span>
              <span className="text-sm font-medium text-surface-400">{cat.score}%</span>
            </div>
            <ProgressBar value={cat.score} max={100} color={cat.color} size="sm" />
          </div>
        ))}
      </div>
    </Card>
  );
}

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
  behavioralScore = null,
  className 
}) {
  const categories = [
    { label: 'Technical Knowledge', score: technicalScore, color: 'primary' },
    { label: 'Communication', score: communicationScore, color: 'accent' },
    { label: 'Problem Solving', score: problemSolvingScore, color: 'success' },
    { label: 'Verbal Confidence', score: confidenceScore, color: 'warning' },
  ];

  const unifiedScore = behavioralScore !== null ? Math.round((overallScore * 0.6) + (behavioralScore * 0.4)) : null;

  return (
    <Card variant="glass" className={cn('', className)}>
      <div className="text-center mb-6 pb-6 border-b border-surface-800">
        <p className="text-sm text-surface-400 mb-1">
          {unifiedScore !== null ? 'Holistic Interview Match' : 'Overall Answer Score'}
        </p>
        <span className="text-6xl font-bold text-gradient">
          {unifiedScore !== null ? `${unifiedScore}%` : (overallScore > 0 ? `${overallScore}%` : '—')}
        </span>
        <p className="text-sm text-surface-500 mt-2">
          {unifiedScore !== null 
            ? 'Combined verbal and non-verbal score' 
            : (overallScore > 0 ? 'Great job! Keep practicing.' : 'Complete an interview to see your score')}
        </p>
      </div>

      {behavioralScore !== null && (
        <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-surface-800 text-center">
          <div className="bg-surface-900/50 rounded-xl p-3 border border-surface-800">
            <p className="text-xs text-surface-400 mb-1">Verbal Score</p>
            <p className="text-2xl font-bold text-primary-500">{overallScore}%</p>
          </div>
          <div className="bg-surface-900/50 rounded-xl p-3 border border-surface-800">
            <p className="text-xs text-surface-400 mb-1">Non-Verbal Score</p>
            <p className="text-2xl font-bold text-accent-500">{behavioralScore}%</p>
          </div>
        </div>
      )}

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

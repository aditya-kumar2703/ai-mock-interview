import { Card, ProgressBar } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { Target } from 'lucide-react';

/**
 * Readiness score card displaying overall preparedness.
 */
export default function ReadinessScoreCard({ className, skillsData = [50] }) {
  // Average the skills data to get a readiness score
  const readinessScore = Math.round(skillsData.reduce((a, b) => a + b, 0) / skillsData.length);
  
  let readinessLevel = 'Needs Practice';
  let levelColor = 'text-danger-400';
  let message = "Keep practicing to improve your readiness.";
  
  if (readinessScore >= 80) {
    readinessLevel = 'Interview Ready';
    levelColor = 'text-success-400';
    message = "You're performing well across all key areas. Keep it up!";
  } else if (readinessScore >= 60) {
    readinessLevel = 'Almost There';
    levelColor = 'text-warning-400';
    message = "You're getting there! Focus on your weaker areas.";
  }
  
  return (
    <Card variant="glass" className={cn('relative overflow-hidden', className)}>
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Target size={120} />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-surface-400 mb-2">Interview Readiness</h3>
        
        <div className="flex items-end gap-3 mb-6">
          <span className="text-5xl font-bold text-gradient">{readinessScore}</span>
          <span className="text-sm text-surface-500 pb-1.5">/ 100</span>
        </div>
        
        <ProgressBar 
          value={readinessScore} 
          max={100} 
          color={readinessScore >= 80 ? 'success' : readinessScore >= 60 ? 'warning' : 'danger'} 
          className="mb-4"
        />
        
        <p className="text-xs text-surface-400 leading-relaxed max-w-[80%]">
          {readinessScore >= 80 
            ? "You're in great shape! Ready to tackle most technical interviews." 
            : "You're making good progress. Focus on your weakest areas to boost your score."}
        </p>
      </div>
    </Card>
  );
}

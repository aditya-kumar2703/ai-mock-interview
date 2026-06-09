import { Card, ProgressBar } from '../../../components/ui';

/**
 * Resume score display card.
 */
export default function ResumeScoreCard({ className, score = 0, isAnalyzed = false, skills = [] }) {
  return (
    <Card variant="glass" className={className}>
      <h3 className="text-sm font-medium text-surface-400 mb-3">Resume Score</h3>
      <div className="flex items-end gap-3 mb-4">
        <span className="text-4xl font-bold text-gradient">{isAnalyzed ? score : '—'}</span>
        <span className="text-sm text-surface-500 pb-1">/ 100</span>
      </div>
      <ProgressBar 
        value={isAnalyzed ? score : 0} 
        max={100} 
        color={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'primary'} 
        showLabel={false} 
      />
      <p className="text-xs text-surface-500 mt-3 mb-6">
        {isAnalyzed 
          ? score >= 80 
            ? "Your resume is looking strong! Ready for applications." 
            : "Good start, but some improvements will help you stand out."
          : "Upload your resume to get an AI-powered score"}
      </p>

      {isAnalyzed && skills && skills.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-surface-800">
          <h4 className="text-xs font-semibold text-surface-300 uppercase tracking-wider">
            Extracted Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="px-2.5 py-1 text-xs font-medium bg-primary-500/10 text-primary-400 rounded-md border border-primary-500/20">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

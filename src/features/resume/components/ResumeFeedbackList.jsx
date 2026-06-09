import { Card, Badge } from '../../../components/ui';
import EmptyState from '../../../components/shared/EmptyState';
import { MessageSquare, AlertTriangle, CheckCircle, Info } from 'lucide-react';

/**
 * List of AI feedback items for the resume.
 */
export default function ResumeFeedbackList({ className, isAnalyzed = false, feedbacks = [] }) {
  const getIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle size={18} className="text-success-500" />;
      case 'warning': return <AlertTriangle size={18} className="text-warning-500" />;
      case 'danger': return <Info size={18} className="text-danger-500" />;
      default: return <Info size={18} className="text-surface-500" />;
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-100">
          AI Feedback
        </h3>
        {isAnalyzed && (
          <Badge variant="primary">{feedbacks.length} Suggestions</Badge>
        )}
      </div>

      {!isAnalyzed ? (
        <EmptyState
          title="No feedback yet"
          description="Upload your resume to receive detailed AI analysis and suggestions."
          icon={<MessageSquare size={28} className="text-surface-500" />}
        />
      ) : (
        <div className="space-y-4">
          {feedbacks.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-surface-900/50 border border-surface-800">
              <div className="mt-0.5 shrink-0 bg-surface-800 p-2 rounded-lg">
                {getIcon(item.status)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-surface-200">{item.category}</span>
                  <Badge variant={item.status} size="sm" className="px-1.5 py-0 text-[10px]">
                    {item.status === 'danger' ? 'High Priority' : item.status === 'warning' ? 'Medium' : 'Good'}
                  </Badge>
                </div>
                <p className="text-sm text-surface-400 leading-relaxed">
                  {item.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

import { Card, Badge } from '../../../components/ui';
import { Sparkles } from 'lucide-react';

/**
 * AI feedback card for individual answers.
 */
export default function AIFeedbackCard({ className }) {
  return (
    <Card variant="glass" className={className}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg gradient-primary">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-surface-200">AI Feedback</span>
        <Badge variant="info" size="sm">Live</Badge>
      </div>
      <p className="text-sm text-surface-400 leading-relaxed">
        Submit your answer to receive AI-powered feedback on your response quality,
        communication clarity, and technical accuracy.
      </p>
    </Card>
  );
}

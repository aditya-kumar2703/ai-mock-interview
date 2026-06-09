import { Card, Badge, Button } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { BookOpen, Code2, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AI Practice recommendations based on performance.
 */
export default function PracticeRecommendations({ className, practicePlan }) {
  const uncompletedGoals = practicePlan?.dailyGoals?.filter(g => !g.completed) || [];
  const recommendations = uncompletedGoals.slice(0, 3);

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-surface-100">
            Recommended for You
          </h3>
          <p className="text-xs text-surface-400 mt-0.5">Based on your recent performance</p>
        </div>
        <Link to="/practice-plan" className="text-xs text-primary-400 hover:text-primary-300 transition-default flex items-center gap-1">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="text-sm text-surface-400 p-4 text-center">
            {practicePlan ? "All caught up on goals! Regenerate your plan for more." : "Generate a practice plan to see recommendations!"}
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec._id}
              className="group flex items-center justify-between p-3 rounded-xl bg-surface-900/50 border border-surface-800 hover:border-primary-500/30 transition-default cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg mt-0.5",
                  rec.category.toLowerCase().includes('behavioral') ? "bg-success-500/10 text-success-400" : "bg-accent-500/10 text-accent-400"
                )}>
                  {rec.category.toLowerCase().includes('behavioral') ? <MessageSquare size={16} /> : <Code2 size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-200 group-hover:text-primary-300 transition-default">
                    {rec.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="neutral" size="sm">{rec.category}</Badge>
                    <span className="text-[10px] text-surface-500">{rec.time}</span>
                  </div>
                </div>
              </div>
              <Link to="/practice-plan">
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
                  View
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

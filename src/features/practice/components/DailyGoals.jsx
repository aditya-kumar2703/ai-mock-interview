import { useState, useEffect } from 'react';
import { Card, Badge, ProgressBar } from '../../../components/ui';
import { Check, Target, Play } from 'lucide-react';
import { cn } from '../../../lib/utils';

/**
 * Daily goals checklist for practice plan.
 */
export default function DailyGoals({ className, initialGoals = [] }) {
  const [goals, setGoals] = useState(initialGoals);

  // Sync state when new plan is generated
  useEffect(() => {
    setGoals(initialGoals);
  }, [initialGoals]);

  const toggleGoal = async (id) => {
    // Optimistic UI update
    const targetGoal = goals.find(g => g._id === id);
    if (!targetGoal) return;
    
    const newStatus = !targetGoal.completed;
    setGoals(goals.map(g => g._id === id ? { ...g, completed: newStatus } : g));
    
    // Persist to backend
    try {
      const token = localStorage.getItem('amie_token');
      await fetch(`/api/practice/goals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: newStatus })
      });
    } catch (error) {
      console.error('Failed to update goal', error);
      // Revert on error
      setGoals(goals.map(g => g._id === id ? { ...g, completed: !newStatus } : g));
    }
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progress = Math.round((completedCount / goals.length) * 100);

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-surface-100 flex items-center gap-2">
            <Target size={20} className="text-accent-400" />
            Today's Goals
          </h3>
          <p className="text-sm text-surface-400 mt-1">Keep up your 5-day streak!</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-surface-200">{completedCount}</span>
          <span className="text-surface-500">/{goals.length}</span>
        </div>
      </div>

      <ProgressBar value={progress} max={100} color="accent" size="sm" className="mb-6" />

      {goals.length === 0 ? (
        <p className="text-sm text-surface-500 text-center py-4 border border-dashed border-surface-700 rounded-xl">No goals generated.</p>
      ) : (
        <div className="space-y-3">
          {goals.map(goal => (
            <div 
              key={goal._id} 
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-default cursor-pointer group",
                goal.completed 
                  ? "bg-surface-900/40 border-surface-800 opacity-60" 
                  : "bg-surface-900 border-surface-700 hover:border-primary-500/30"
              )}
              onClick={() => toggleGoal(goal._id)}
            >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-default",
                goal.completed ? "bg-accent-500 text-white" : "border-2 border-surface-600 group-hover:border-primary-400"
              )}>
                {goal.completed && <Check size={14} strokeWidth={3} />}
              </div>
              <div>
                <p className={cn("text-sm font-medium transition-default", goal.completed ? "text-surface-400 line-through" : "text-surface-200")}>
                  {goal.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="neutral" size="sm" className="px-1.5 py-0 text-[10px]">{goal.category}</Badge>
                  <span className="text-xs text-surface-500">{goal.time}</span>
                </div>
              </div>
            </div>
            
            {!goal.completed && (
              <button className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Play size={14} className="ml-0.5" />
              </button>
            )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

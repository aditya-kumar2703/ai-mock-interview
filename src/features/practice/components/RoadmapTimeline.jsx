import { Card, Badge } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { Lock, CheckCircle, CircleDashed } from 'lucide-react';

/**
 * Vertical timeline showing weekly practice progression.
 */
export default function RoadmapTimeline({ className, weeks = [] }) {

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-surface-100 mb-6">
        Preparation Roadmap
      </h3>

      {weeks.length === 0 ? (
        <p className="text-sm text-surface-500 py-8 text-center border border-dashed border-surface-700 rounded-xl">No roadmap generated.</p>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-surface-700 before:to-transparent">
          {weeks.map((week, i) => (
          <div key={week.week} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            
            {/* Timeline Marker */}
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm",
              week.status === 'completed' ? "bg-success-500 border-surface-900 text-surface-900" :
              week.status === 'active' ? "bg-primary-500 border-primary-500/30 text-white animate-pulse-glow" :
              "bg-surface-800 border-surface-900 text-surface-500"
            )}>
              {week.status === 'completed' ? <CheckCircle size={18} /> : 
               week.status === 'active' ? <CircleDashed size={18} className="animate-spin-slow" /> : 
               <Lock size={16} />}
            </div>

            {/* Content Card */}
            <div className={cn(
              "w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border transition-default",
              week.status === 'active' ? "bg-surface-900/80 border-primary-500/50 shadow-glow" :
              week.status === 'completed' ? "bg-surface-900/40 border-surface-800 opacity-80" :
              "bg-surface-950 border-surface-800 opacity-50"
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Week {week.week}</span>
                <Badge variant={
                  week.status === 'completed' ? 'success' : 
                  week.status === 'active' ? 'primary' : 'neutral'
                } size="sm">
                  {week.status}
                </Badge>
              </div>
              <h4 className={cn("text-base font-semibold mb-3", week.status === 'locked' ? 'text-surface-400' : 'text-surface-200')}>
                {week.title}
              </h4>
              <ul className="space-y-1.5">
                {week.modules.map((mod, j) => (
                  <li key={j} className="text-sm text-surface-400 flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", week.status === 'completed' ? 'bg-success-500/50' : 'bg-surface-700')} />
                    {mod}
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        ))}
      </div>
      )}
    </Card>
  );
}

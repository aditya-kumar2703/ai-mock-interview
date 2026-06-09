import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { Mic, FileText, Target, BarChart3 } from 'lucide-react';

const actions = [
  {
    label: 'Mock Interview',
    description: 'Start a new practice session',
    icon: Mic,
    path: '/interview/setup',
    color: 'bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20',
  },
  {
    label: 'Resume Review',
    description: 'Upload and analyze your resume',
    icon: FileText,
    path: '/resume-analysis',
    color: 'bg-accent-500/10 text-accent-400 group-hover:bg-accent-500/20',
  },
  {
    label: 'Practice Plan',
    description: 'Follow your study roadmap',
    icon: Target,
    path: '/practice-plan',
    color: 'bg-success-500/10 text-success-400 group-hover:bg-success-500/20',
  },
  {
    label: 'View Analytics',
    description: 'Check your performance',
    icon: BarChart3,
    path: '/analytics',
    color: 'bg-warning-500/10 text-warning-400 group-hover:bg-warning-500/20',
  },
];

/**
 * Quick action cards for fast navigation.
 */
export default function QuickActions({ className }) {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.path}
            to={action.path}
            className="group p-4 rounded-2xl bg-surface-900/60 border border-surface-800 hover:border-surface-700 transition-default"
          >
            <div className={cn('p-2.5 w-fit rounded-xl transition-default mb-3', action.color)}>
              <Icon size={20} />
            </div>
            <h3 className="text-sm font-semibold text-surface-200 group-hover:text-surface-100 transition-default">
              {action.label}
            </h3>
            <p className="text-xs text-surface-500 mt-0.5">{action.description}</p>
          </Link>
        );
      })}
    </div>
  );
}

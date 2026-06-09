import { cn } from '../../../lib/utils';
import { INTERVIEW_ROLES } from '../../../lib/constants';

/**
 * Role selection grid for interview setup.
 */
export default function RoleSelector({ selected, onSelect, className }) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      {INTERVIEW_ROLES.map((role) => (
        <button
          key={role}
          onClick={() => onSelect?.(role)}
          className={cn(
            'px-6 py-3 rounded-full text-sm font-semibold text-center transition-default border',
            selected === role
              ? 'bg-primary-500/15 border-primary-500/50 text-primary-400 shadow-glow-sm'
              : 'bg-surface-900/50 border-surface-700 text-surface-300 hover:border-surface-600 hover:text-surface-100 hover:bg-surface-800'
          )}
        >
          {role}
        </button>
      ))}
    </div>
  );
}

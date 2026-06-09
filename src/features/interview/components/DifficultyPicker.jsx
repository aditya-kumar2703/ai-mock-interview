import { cn } from '../../../lib/utils';
import { DIFFICULTY_LEVELS } from '../../../lib/constants';
import { Badge } from '../../../components/ui';

/**
 * Difficulty level picker for interview setup.
 */
export default function DifficultyPicker({ selected, onSelect, className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {DIFFICULTY_LEVELS.map((level) => (
        <button
          key={level.value}
          onClick={() => onSelect?.(level.value)}
          className={cn(
            'flex-1 p-5 rounded-[2rem] border text-center transition-default',
            selected === level.value
              ? 'border-primary-500/50 bg-primary-500/10 shadow-glow-sm'
              : 'border-surface-700 bg-surface-900/50 hover:border-surface-600 hover:bg-surface-800'
          )}
        >
          <Badge
            variant={level.color}
            size="md"
            className="mb-2"
          >
            {level.label}
          </Badge>
          <p className="text-xs text-surface-500 mt-1">
            {level.value === 'easy' && 'Perfect for beginners'}
            {level.value === 'medium' && 'Standard difficulty'}
            {level.value === 'hard' && 'Expert-level challenge'}
          </p>
        </button>
      ))}
    </div>
  );
}

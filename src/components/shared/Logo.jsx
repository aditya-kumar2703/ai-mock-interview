import { cn } from '../../lib/utils';
import { Sparkles } from 'lucide-react';

/**
 * AMIE brand logo.
 *
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} props.size
 * @param {boolean} props.showText
 */
export default function Logo({ size = 'md', showText = true, className }) {
  const iconSizes = { sm: 20, md: 28, lg: 36 };
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-xl gradient-primary',
          size === 'sm' && 'h-8 w-8',
          size === 'md' && 'h-10 w-10',
          size === 'lg' && 'h-12 w-12'
        )}
      >
        <Sparkles size={iconSizes[size]} className="text-white" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              'font-bold tracking-tight text-gradient',
              textSizes[size]
            )}
          >
            AMIE
          </span>
          {size === 'lg' && (
            <span className="text-xs text-surface-400 -mt-0.5">
              AI Mock Interview
            </span>
          )}
        </div>
      )}
    </div>
  );
}

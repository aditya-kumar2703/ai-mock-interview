import { cn } from '../../lib/utils';

const cardVariants = {
  default: 'bg-surface-900/80 border border-surface-800',
  glass: 'bg-surface-900/60 backdrop-blur-2xl border border-surface-700/80 shadow-[0_8px_30px_rgb(0,0,0,0.3)]',
  bordered: 'bg-surface-900/40 border-2 border-surface-700',
  gradient: 'gradient-surface border border-surface-800',
};

/**
 * Card wrapper component.
 *
 * @param {Object} props
 * @param {'default'|'glass'|'bordered'|'gradient'} props.variant
 * @param {'sm'|'md'|'lg'} props.padding
 * @param {boolean} props.hoverable
 */
export default function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  children,
  className,
  ...props
}) {
  const paddings = {
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };

  return (
    <div
      className={cn(
        'rounded-[2rem]',
        cardVariants[variant],
        paddings[padding],
        hoverable &&
          'hover:border-primary-500/40 hover:shadow-glow-lg hover:-translate-y-1 cursor-pointer transition-default',
        'animate-fade-in',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

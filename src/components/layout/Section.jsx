import { cn } from '../../lib/utils';

/**
 * Reusable Section component for consistent page layouts.
 * Automatically wraps content in a responsive container with standard padding.
 * 
 * @param {Object} props
 * @param {string} props.id - Optional ID for anchor linking
 * @param {string} props.className - Custom outer classes (e.g., bg colors)
 * @param {string} props.innerClassName - Custom inner container classes (e.g., text-center)
 * @param {'none'|'sm'|'md'|'lg'|'xl'|'2xl'} props.padding - Vertical padding size
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'|'full'} props.containerSize - Max width of inner content
 * @param {React.ReactNode} props.children
 */
export default function Section({
  id,
  className,
  innerClassName,
  padding = 'lg',
  containerSize = '2xl',
  children,
  ...props
}) {
  const paddingStyles = {
    none: '',
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-24',
    xl: 'py-24 sm:py-32',
    '2xl': 'py-32 sm:py-48',
  };

  const containerStyles = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <section 
      id={id}
      className={cn('relative w-full', paddingStyles[padding], className)} 
      {...props}
    >
      <div 
        className={cn(
          'mx-auto px-6 sm:px-8 lg:px-12', 
          containerStyles[containerSize],
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}

import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 shadow-glow-sm',
  secondary:
    'bg-surface-800 text-surface-200 hover:bg-surface-700 focus-visible:ring-surface-500 border border-surface-700',
  ghost:
    'text-surface-300 hover:bg-surface-800/60 hover:text-surface-100',
  danger:
    'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500 shadow-glow-sm',
  outline:
    'border border-primary-500 text-primary-400 hover:bg-primary-500/10 focus-visible:ring-primary-500',
  accent:
    'gradient-primary text-white hover:opacity-90 shadow-glow-lg',
};

const sizes = {
  sm: 'px-4 py-1.5 text-xs rounded-full gap-1.5',
  md: 'px-6 py-2.5 text-sm rounded-full gap-2',
  lg: 'px-8 py-3.5 text-base rounded-full gap-2.5',
};

/**
 * Button component with multiple variants and sizes.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  children,
  className,
  to,
  href,
  ...props
}) {
  const Component = to ? Link : href ? 'a' : 'button';
  
  return (
    <Component
      to={to}
      href={href}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-default',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </Component>
  );
}

import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Search, X } from 'lucide-react';

/**
 * Search bar component with clear button.
 *
 * @param {Object} props
 * @param {string} props.value
 * @param {Function} props.onChange
 * @param {string} props.placeholder
 */
export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search...',
  className,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        'relative flex items-center transition-default',
        focused ? 'w-72' : 'w-60',
        className
      )}
    >
      <Search
        size={16}
        className="absolute left-3 text-surface-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-9 pr-8 py-2 text-sm rounded-lg',
          'bg-surface-900/50 border border-surface-700 text-surface-200',
          'placeholder:text-surface-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50',
          'transition-default'
        )}
      />
      {value && (
        <button
          onClick={() => onChange?.('')}
          className="absolute right-2 text-surface-500 hover:text-surface-300 transition-default"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

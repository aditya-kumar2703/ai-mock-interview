import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useSidebar } from '../../hooks/useSidebar';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Menu } from 'lucide-react';
import SearchBar from '../shared/SearchBar';
import NotificationBell from '../shared/NotificationBell';
import ThemeToggle from '../shared/ThemeToggle';
import UserMenu from '../shared/UserMenu';

/**
 * Top navigation bar for the dashboard layout.
 */
export default function Topbar() {
  const { isCollapsed, toggleMobile } = useSidebar();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [searchValue, setSearchValue] = useState('');

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between h-20 px-6 lg:px-10',
        'bg-surface-950/80 backdrop-blur-2xl border-b border-surface-800/50',
        'transition-all duration-300'
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        {!isDesktop && (
          <button
            onClick={toggleMobile}
            className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-default"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        )}
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          className="hidden sm:flex"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell count={3} />
        <div className="w-px h-6 bg-surface-800 mx-1 hidden sm:block" />
        <UserMenu />
      </div>
    </header>
  );
}

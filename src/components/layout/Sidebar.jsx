import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useSidebar } from '../../hooks/useSidebar';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Logo from '../shared/Logo';
import { Tooltip } from '../ui';
import {
  LayoutDashboard,
  FileText,
  Mic,
  Target,
  BarChart3,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  History,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  FileText,
  Mic,
  Target,
  BarChart3,
  User,
  History,
};

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Resume Analysis', path: '/resume-analysis', icon: 'FileText' },
  { label: 'Interview', path: '/interview/setup', icon: 'Mic' },
  { label: 'History', path: '/interviews/history', icon: 'History' },
  { label: 'Practice Plan', path: '/practice-plan', icon: 'Target' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Profile', path: '/profile', icon: 'User' },
];

/**
 * Sidebar navigation component.
 * Collapsible on desktop, slide-over on mobile.
 */
export default function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const isActiveRoute = (path) => {
    if (path === '/interview/setup') {
      return location.pathname === '/interview/setup' || location.pathname === '/interview/session' || location.pathname === '/interview/result';
    }
    if (path === '/interviews/history') {
      return location.pathname.startsWith('/interviews');
    }
    return location.pathname === path;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-surface-800/50">
        <Logo size={isCollapsed ? 'sm' : 'md'} showText={!isCollapsed} />
        {isDesktop ? (
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-default"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        ) : (
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-default lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActiveRoute(item.path);

          const link = (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-default group relative',
                active
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60'
              )}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full" />
              )}
              <Icon size={20} className={cn(active && 'text-primary-400')} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );

          if (isCollapsed && isDesktop) {
            return (
              <Tooltip key={item.path} content={item.label} position="right">
                {link}
              </Tooltip>
            );
          }
          return link;
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-surface-800/50">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-2">
            <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-xs text-surface-500">AI Engine Active</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen bg-surface-900/95 border-r border-surface-800',
          'transition-all duration-300 ease-in-out',
          // Desktop
          isDesktop && (isCollapsed ? 'w-[72px]' : 'w-[280px]'),
          // Mobile
          !isDesktop && 'w-[280px]',
          !isDesktop && (isMobileOpen ? 'translate-x-0' : '-translate-x-full')
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

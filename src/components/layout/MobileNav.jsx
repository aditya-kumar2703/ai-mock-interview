import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  FileText,
  Mic,
  Target,
  BarChart3,
} from 'lucide-react';

const mobileNavItems = [
  { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Resume', path: '/resume-analysis', icon: FileText },
  { label: 'Interview', path: '/interview/setup', icon: Mic },
  { label: 'Plan', path: '/practice-plan', icon: Target },
  { label: 'Stats', path: '/analytics', icon: BarChart3 },
];

/**
 * Bottom tab bar for mobile navigation.
 * Only visible on screens < 1024px.
 */
export default function MobileNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/interview/setup') {
      return location.pathname.startsWith('/interview');
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="bg-surface-900/95 backdrop-blur-lg border-t border-surface-800 px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 py-1 min-w-0"
              >
                <div
                  className={cn(
                    'p-1.5 rounded-xl transition-default',
                    active ? 'bg-primary-500/15' : ''
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(
                      'transition-default',
                      active ? 'text-primary-400' : 'text-surface-500'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium transition-default',
                    active ? 'text-primary-400' : 'text-surface-500'
                  )}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

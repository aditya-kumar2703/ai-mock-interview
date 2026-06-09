import { Outlet } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useSidebar } from '../../hooks/useSidebar';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';

/**
 * DashboardLayout — sidebar + topbar + main content area.
 * Used for all authenticated routes.
 */
export default function DashboardLayout() {
  const { isCollapsed } = useSidebar();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main wrapper — offset by sidebar width */}
      <div
        className={cn(
          'transition-all duration-300',
          isDesktop && (isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]')
        )}
      >
        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <main className="max-w-[1440px] mx-auto p-6 lg:p-10 pb-24 lg:pb-12 min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}

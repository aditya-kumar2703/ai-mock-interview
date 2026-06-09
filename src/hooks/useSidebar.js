import { useContext } from 'react';
import { SidebarContext } from '../context/SidebarContext';

/**
 * Hook to access sidebar context.
 * @returns {{ isCollapsed, isMobileOpen, toggleCollapse, toggleMobile, closeMobile }}
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

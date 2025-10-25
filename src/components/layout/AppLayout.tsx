import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn, hasAnyRole } from '@/lib/utils';

// Components
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
      // Auto-collapse on smaller desktop screens
      if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed !== null) {
      setSidebarCollapsed(savedCollapsed === 'true');
    }
  }, []);

  const toggleSidebarCollapse = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', String(newCollapsed));
  };

  // Check if current route should hide sidebar
  const hideSidebarRoutes: string[] = [];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden w-full">
      {/* Sidebar - Desktop */}
      {!isMobile && !shouldHideSidebar && (
        <aside className={cn(
          "fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-20" : "w-64"
        )}>
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-out">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className={cn(
        'flex-1 flex flex-col min-h-screen bg-gray-50 transition-all duration-300 ease-in-out w-full overflow-x-hidden',
        !isMobile && !shouldHideSidebar && (sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64')
      )}>
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={isMobile}
        />

        {/* Page Content */}
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="h-full px-4 py-6 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px] mx-auto">
            <div className="animate-fade-in w-full overflow-x-hidden">
              {children}
            </div>
          </div>
        </main>

        {/* Mobile Navigation with Spacer */}
        {isMobile && (
          <>
            <div className="h-20 shrink-0"></div> {/* Spacer for fixed bottom nav */}
            <MobileNav />
          </>
        )}
      </div>

      {/* Global keyboard shortcuts */}
      <GlobalKeyboardShortcuts />
    </div>
  );
};

// Global Keyboard Shortcuts Component
const GlobalKeyboardShortcuts: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts when not in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      // Ctrl/Cmd + K for search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        // TODO: Open search modal
        console.log('Search shortcut triggered');
      }

      // Ctrl/Cmd + N for new project
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        navigate('/request-design');
      }

      // G + D for dashboard
      if (event.altKey && event.key === 'd') {
        event.preventDefault();
        navigate('/dashboard');
      }

      // G + P for projects
      if (event.altKey && event.key === 'p') {
        event.preventDefault();
        navigate('/projects');
      }

      // Escape to close modals/overlays
      if (event.key === 'Escape') {
        // TODO: Close any open modals
        console.log('Escape key pressed');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return null;
};

export default AppLayout;

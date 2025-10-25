import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasAnyRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  EyeIcon,
  CheckCircleIcon,
  PrinterIcon,
  CogIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  UsersIcon,
  FireIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
} from '@heroicons/react/24/solid';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconActive?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  roles?: string[];
  divider?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  mobile = false, 
  onClose,
  collapsed = false,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      iconActive: HomeIconSolid,
    },
    {
      name: 'Semua Proyek',
      href: '/projects',
      icon: DocumentTextIcon,
      iconActive: DocumentTextIconSolid,
      badge: '12', // TODO: Get from API
    },
    {
      name: 'Request Desain',
      href: '/request-design',
      icon: PlusCircleIcon,
      roles: ['requester', 'admin'],
    },
    {
      name: 'Panel Desainer',
      href: '/designer-panel',
      icon: PencilSquareIcon,
      roles: ['designer_internal', 'designer_external'],
      badge: '3', // TODO: Get from API
    },
    {
      name: 'Panel Review',
      href: '/review-panel',
      icon: EyeIcon,
      roles: ['reviewer', 'approver', 'admin'],
      badge: '5', // TODO: Get from API
    },
    {
      name: 'Antrian Cetak',
      href: '/print-queue',
      icon: PrinterIcon,
      roles: ['designer_external', 'admin'],
      badge: '2', // TODO: Get from API
    },
    {
      name: 'Admin Panel',
      href: '/admin',
      icon: CogIcon,
      roles: ['admin'],
      divider: true,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      roles: ['admin'],
    },
    {
      name: 'Manajemen User',
      href: '/admin/users',
      icon: UsersIcon,
      roles: ['admin'],
    },
  ];

  // Filter navigation items based on user roles
  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true;
    return user && hasAnyRole(user, item.roles as any[]);
  });

  const handleLogout = () => {
    logout();
    if (mobile && onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className={cn(
      'flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300',
      mobile ? 'w-64' : collapsed ? 'w-20' : 'w-64'
    )}>
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
        <div className="flex items-center min-w-0 flex-1">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="ml-3 min-w-0 flex-1">
              <h1 className="text-base font-bold text-gray-900 truncate">DesignFlow</h1>
              <p className="text-xs text-gray-500 truncate">Review System</p>
            </div>
          )}
        </div>
        
        {/* Toggle Button - Desktop Only */}
        {!mobile && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg 
              className={cn("w-5 h-5 transition-transform duration-300", collapsed && "rotate-180")} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href || 
                         (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          
          const Icon = isActive ? item.iconActive || item.icon : item.icon;

          if (item.divider) {
            return (
              <div key={item.name} className="pt-3 mt-3 border-t border-gray-200">
                <NavLink
                  to={item.href}
                  onClick={mobile ? onClose : undefined}
                  title={collapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 relative',
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                      collapsed && 'justify-center'
                    )
                  }
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full" />}
                  <Icon className={cn(
                    'h-5 w-5 flex-shrink-0',
                    isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'
                  )} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.name}</span>
                      {item.badge && (
                        <span className={cn(
                          'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full',
                          isActive 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {typeof item.badge === 'number' && item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </NavLink>
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={mobile ? onClose : undefined}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 relative',
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  collapsed && 'justify-center'
                )
              }
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full" />}
              <Icon className={cn(
                'h-5 w-5 flex-shrink-0',
                isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'
              )} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.badge && (
                    <span className={cn(
                      'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full',
                      isActive 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {typeof item.badge === 'number' && item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={cn(
        "border-t border-gray-200 p-3 bg-gray-50/50",
        collapsed && "px-2"
      )}>
        {!collapsed ? (
          <>
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm">
                <UserIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {user?.role || 'No role'}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <NavLink
                to="/profile"
                onClick={mobile ? onClose : undefined}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-gray-500" />
                <span>Profil</span>
              </NavLink>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <NavLink
              to="/profile"
              onClick={mobile ? onClose : undefined}
              title="Profil"
              className="flex items-center justify-center p-2.5 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UserIcon className="w-5 h-5 text-gray-500" />
            </NavLink>
            
            <button
              onClick={handleLogout}
              title="Keluar"
              className="w-full flex items-center justify-center p-2.5 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Version Info */}
      {!collapsed && (
        <div className="px-4 py-2 text-xs text-gray-400 text-center border-t border-gray-200 bg-gray-50/30">
          v1.0.0
        </div>
      )}
    </div>
  );

  if (mobile) {
    return (
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
        {sidebarContent}
      </div>
    );
  }

  return sidebarContent;
};

export default Sidebar;

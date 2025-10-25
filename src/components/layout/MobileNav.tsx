import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, hasAnyRole } from '@/contexts/AuthContext';
import { useUnreadNotificationsCount, useProjects } from '@/hooks';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  EyeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
} from '@heroicons/react/24/solid';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconActive?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  roles?: string[];
}

const MobileNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Get dynamic badge counts from API
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const { data: projects = [] } = useProjects();
  
  // Count projects that need review (for reviewer/approver)
  const reviewCount = projects.filter(p => 
    p.status === 'ready_for_review' || p.status === 'approved'
  ).length;

  const navigation: NavItem[] = [
    {
      name: 'Beranda',
      href: '/dashboard',
      icon: HomeIcon,
      iconActive: HomeIconSolid,
    },
    {
      name: 'Proyek',
      href: '/projects',
      icon: DocumentTextIcon,
      iconActive: DocumentTextIconSolid,
      badge: projects.length > 0 ? projects.length : undefined,
    },
    {
      name: 'Request',
      href: '/request-design',
      icon: PlusCircleIcon,
      roles: ['requester', 'admin'],
    },
    {
      name: 'Review',
      href: '/review-panel',
      icon: EyeIcon,
      roles: ['reviewer', 'approver', 'admin'],
      badge: reviewCount > 0 ? reviewCount : undefined,
    },
    {
      name: 'Profil',
      href: '/profile',
      icon: UserCircleIcon,
    },
  ];

  // Filter navigation items based on user roles
  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true;
    return user && hasAnyRole(user, item.roles as any[]);
  });

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      aria-label="Mobile navigation"
    >
      <div className="safe-area-inset-bottom">
        <div className={cn(
          "grid gap-1 px-2 py-2",
          filteredNavigation.length <= 4 ? "grid-cols-4" : "grid-cols-5"
        )}>
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            
            const Icon = isActive ? item.iconActive || item.icon : item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 relative min-h-[60px] active:scale-95',
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                  )
                }
                aria-label={item.name}
              >
                <div className="relative mb-1">
                  <Icon className={cn(
                    'h-6 w-6',
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  )} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {typeof item.badge === 'number' && item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-full leading-tight">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;

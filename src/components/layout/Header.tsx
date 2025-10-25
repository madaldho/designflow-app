import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, useUnreadNotificationsCount, useMarkNotificationAsRead } from '@/hooks';
import { cn, formatDateTime, getRelativeTime } from '@/lib/utils';
import {
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { NotificationIcon } from '@/components/icons';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, showMenuButton = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get notifications from database
  const { data: notificationsData } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const markAsRead = useMarkNotificationAsRead();

  const notifications = notificationsData || [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (!target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      
      if (!target.closest('.profile-dropdown')) {
        setShowProfile(false);
      }
      
      if (!target.closest('.search-container')) {
        setShowSearch(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="flex-shrink-0 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                aria-label="Open menu"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}

            {/* Search Bar - Desktop */}
            <div className="hidden md:block search-container flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  placeholder="Cari proyek..."
                  className="input pl-10 pr-4 py-2 w-full text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              {/* Search Dropdown */}
              {showSearch && searchQuery && (
                <div className="absolute left-0 right-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-4">
                    <form onSubmit={handleSearch}>
                      <p className="text-sm text-gray-600 mb-3">Tekan Enter untuk mencari:</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-primary-600 font-medium truncate">"{searchQuery}"</span>
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm flex-shrink-0"
                        >
                          Cari
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex-shrink-0 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 md:hidden focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative notification-dropdown">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex-shrink-0 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && !showNotifications && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-danger-500 text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{unreadCount} belum dibaca</p>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">Belum ada notifikasi</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => {
                            if (!notification.read) {
                              markAsRead.mutate(notification.id);
                            }
                          }}
                          className={cn(
                            'p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0',
                            !notification.read && 'bg-primary-50'
                          )}
                        >
                          <div className="flex items-start">
                            <div className={cn(
                              'w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0',
                              !notification.read ? 'bg-primary-600' : 'bg-transparent'
                            )}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {getRelativeTime(new Date(notification.createdAt))}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Lihat Semua Notifikasi
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                  )}
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[120px] capitalize">{user?.role}</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowProfile(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <UserCircleIcon className="w-4 h-4 mr-3 text-gray-400" />
                      Profil
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowProfile(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Cog6ToothIcon className="w-4 h-4 mr-3 text-gray-400" />
                      Pengaturan
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="md:hidden fixed inset-0 bg-white z-40 p-4 pt-20">
          <button
            onClick={() => setShowSearch(false)}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari proyek..."
                autoFocus
                className="input pl-10 pr-4 py-3 w-full text-lg"
              />
            </div>
            
            {searchQuery && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Tekan Enter untuk mencari: <span className="font-medium text-primary-600">"{searchQuery}"</span>
                </p>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Cari Sekarang
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;

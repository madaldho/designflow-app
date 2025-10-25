import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, hasAnyRole } from '@/contexts/AuthContext';
import { useProjects, useActivities, useDashboardStats } from '@/hooks';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DashboardSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyProjects, EmptyActivities } from '@/components/ui/EmptyState';
import { 
  PlusIcon, FolderIcon, EyeIcon, CheckCircleIcon, ClockIcon,
  ChartBarIcon, ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: activities = [], isLoading: activitiesLoading } = useActivities(8);
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  if (projectsLoading || statsLoading || activitiesLoading) {
    return <DashboardSkeleton />;
  }

  const recentProjects = projects.slice(0, 5);

  // Stats Cards Data
  const statsCards = [
    {
      title: 'Total Proyek',
      value: stats?.totalProjects || 0,
      icon: FolderIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase' as const,
    },
    {
      title: 'Siap Review',
      value: stats?.projectsByStatus?.['ready_for_review'] || 0,
      icon: EyeIcon,
      color: 'bg-yellow-500',
      change: '3 proyek',
      changeType: 'neutral' as const,
    },
    {
      title: 'Disetujui',
      value: stats?.projectsByStatus?.['approved'] || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase' as const,
    },
    {
      title: 'Deadline Dekat',
      value: stats?.upcomingDeadlines?.length || 0,
      icon: ClockIcon,
      color: 'bg-red-500',
      change: '5 hari',
      changeType: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            Selamat datang, {user?.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Berikut ringkasan aktivitas Anda hari ini
          </p>
        </div>
        
        {hasAnyRole(user, ['requester', 'admin']) && (
          <Link
            to="/request-design"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md font-medium text-sm sm:text-base w-full sm:w-auto shrink-0"
          >
            <PlusIcon className="w-5 h-5 shrink-0" />
            <span className="truncate">Request Desain Baru</span>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all w-full min-w-0"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <div className={`${stat.color} rounded-lg p-2.5 sm:p-3 shrink-0`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm shrink-0">
                {stat.changeType === 'increase' && (
                  <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                )}
                <span className={`font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' :
                  stat.changeType === 'warning' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{stat.title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 w-full min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Proyek Terbaru</h2>
            <Link
              to="/projects"
              className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium shrink-0"
            >
              Lihat Semua →
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <EmptyProjects onCreateProject={() => window.location.href = '/request-design'} />
          ) : (
            <div className="space-y-2 sm:space-y-3 w-full">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md hover:border-gray-300 transition-all w-full min-w-0"
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate flex-1 min-w-0">
                          {project.title}
                        </h3>
                        <StatusBadge status={project.status} size="sm" />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <span className="flex items-center gap-1 shrink-0">
                          <FolderIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          {project.type}
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <ChartBarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          {project.quantity} pcs
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          {formatDistanceToNow(new Date(project.deadline), {
                            addSuffix: true,
                            locale: idLocale,
                          })}
                        </span>
                      </div>
                      
                      {project.institution && (
                        <p className="text-xs text-gray-500 mt-2 truncate">
                          {project.institution.name}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="space-y-3 sm:space-y-4 w-full min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Aktivitas Terbaru</h2>
          </div>

          {activities.length === 0 ? (
            <EmptyActivities />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 w-full overflow-hidden">
              {activities.map((activity: any) => (
                <div key={activity.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors w-full">
                  <div className="flex gap-2 sm:gap-3 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-700">
                          {activity.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-xs sm:text-sm text-gray-900 break-words">
                        <span className="font-medium">{activity.user?.name || 'User'}</span>
                        {' '}
                        <span className="text-gray-600">{activity.description}</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                          locale: idLocale,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 && (
        <div className="space-y-3 sm:space-y-4 w-full">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Deadline Mendekati</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
            {stats.upcomingDeadlines.map((project: any) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white rounded-xl border border-red-200 p-3 sm:p-4 hover:shadow-md hover:border-red-300 transition-all w-full min-w-0"
              >
                <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                  <div className="flex-shrink-0">
                    <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate mb-1">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-red-600 font-medium">
                      {formatDistanceToNow(new Date(project.deadline), {
                        addSuffix: true,
                        locale: idLocale,
                      })}
                    </p>
                    {project.institution && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {project.institution.name}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

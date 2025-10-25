import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasAnyRole } from '@/contexts/AuthContext';
import { useProjects, useActivities, useDashboardStats } from '@/hooks';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/Card';
import { StatusBadge, MediaTypeBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  PlusCircleIcon, DocumentTextIcon, EyeIcon, PencilSquareIcon, CheckCircleIcon, ClockIcon, 
  ExclamationTriangleIcon, FireIcon, ChartBarIcon, UserGroupIcon, CalendarIcon, 
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, HomeIcon as HomeIconSolid
} from '@heroicons/react/24/outline';
import { formatDate, isOverdue, isDeadlineImminent, cn } from '@/lib/utils';
import { ProjectStatus } from '@/types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: activities = [], isLoading: activitiesLoading } = useActivities(5);
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  
  // Add timeout for loading state
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);
  
  React.useEffect(() => {
    if (projectsLoading || statsLoading) {
      const timer = setTimeout(() => {
        console.warn('[Dashboard] Loading timeout - showing warning');
        setLoadingTimeout(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [projectsLoading, statsLoading]);
  
  if ((projectsLoading || statsLoading) && !loadingTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          <p className="text-xs text-gray-400 mt-2">Fetching data from server...</p>
        </div>
      </div>
    );
  }
  
  // Show warning if loading takes too long
  if (loadingTimeout && (projectsLoading || statsLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Takes Too Long</h2>
          <p className="text-gray-600 mb-4">
            The server is taking longer than expected. Please check:
          </p>
          <ul className="text-left text-sm text-gray-700 mb-6 space-y-2">
            <li>✓ Backend server is running (npm run server)</li>
            <li>✓ Database is seeded (npm run server:seed)</li>
            <li>✓ Check <a href="/diagnostic" className="text-blue-600 underline">diagnostic page</a></li>
          </ul>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()} 
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
            <a 
              href="/diagnostic" 
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center"
            >
              Run Diagnostic
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Projects</CardTitle>
          </CardHeader>
          <CardContent className="text-red-700">
            {projectsError instanceof Error ? projectsError.message : 'Failed to load projects'}
          </CardContent>
        </Card>
      </div>
    );
  }

  const recentProjects = projects.slice(0, 6);
  const recentActivities = activities;

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{value}</p>
            {trend && (
              <div className="flex items-center mt-2 sm:mt-3">
                {trend.isPositive ? (
                  <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-success-500 mr-1 flex-shrink-0" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-danger-500 mr-1 flex-shrink-0" />
                )}
                <span className={cn(
                  "text-xs sm:text-sm font-medium truncate",
                  trend.isPositive ? 'text-success-600' : 'text-danger-600'
                )}>
                  {trend.value > 0 ? '+' : ''}{trend.value} minggu lalu
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-2.5 sm:p-3 rounded-lg flex-shrink-0 ml-3 sm:ml-4",
            color
          )}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getProjectPriority = (project: any): 'high' | 'medium' | 'low' => {
    if (isOverdue(new Date(project.deadline))) return 'high';
    if (isDeadlineImminent(new Date(project.deadline), 3)) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'medium': return 'bg-warning-100 text-warning-800 border-warning-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
            Selamat datang, {user?.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1.5">
            Ini adalah dashboard Anda hari ini, {formatDate(new Date(), { weekday: 'long' })}.
          </p>
        </div>
        
        {hasAnyRole(user, ['requester', 'admin']) && (
          <Link to="/request-design" className="flex-shrink-0">
            <Button 
              className="w-full sm:w-auto"
              leftIcon={<PlusCircleIcon className="w-5 h-5" />}
            >
              <span className="hidden sm:inline">Request Desain Baru</span>
              <span className="sm:hidden">Request Desain</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Proyek"
          value={stats?.totalProjects || 0}
          icon={DocumentTextIcon}
          color="bg-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="Siap Review"
          value={stats?.projectsByStatus['ready_for_review'] || 0}
          icon={EyeIcon}
          color="bg-yellow-500"
        />
        
        <StatCard
          title="Siap Cetak"
          value={stats?.projectsByStatus['approved_for_print'] || 0}
          icon={CheckCircleIcon}
          color="bg-green-500"
        />
        
        <StatCard
          title="Perlu Revisi"
          value={stats?.projectsByStatus['changes_requested'] || 0}
          icon={ExclamationTriangleIcon}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Proyek Terkini</CardTitle>
                  <CardDescription>
                    Proyek yang Anda ikuti terakhir kali diperbarui
                  </CardDescription>
                </div>
                <Link to="/projects">
                  <Button variant="ghost" size="sm">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentProjects.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada proyek</p>
                  <Link to="/request-design">
                    <Button className="mt-4" size="sm">
                      Buat Proyek Baru
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProjects.map((project: any) => {
                    const priority = getProjectPriority(project);
                    
                    return (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {project.title}
                              </h3>
                              <Badge 
                                size="sm" 
                                className={getPriorityColor(priority)}
                              >
                                {priority === 'high' ? 'DARURAT' : priority === 'medium' ? 'CEPAT' : 'NORMAL'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                              <MediaTypeBadge type={project.type} size="sm" />
                              <StatusBadge status={project.status} size="sm" />
                              <span className="flex items-center">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                {formatDate(new Date(project.deadline))}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-600">
                              {project.institution.name} • v{project.version}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end ml-4">
                            {isOverdue(new Date(project.deadline)) && (
                              <Badge variant="danger" size="sm" className="mb-2">
                                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                                Terlambat
                              </Badge>
                            )}
                            {isDeadlineImminent(new Date(project.deadline)) && !isOverdue(new Date(project.deadline)) && (
                              <Badge variant="warning" size="sm" className="mb-2">
                                <ClockIcon className="w-3 h-3 mr-1" />
                                Deadline Dekat
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hasAnyRole(user, ['requester', 'admin']) && (
                <Link to="/request-design">
                  <Button variant="outline" className="w-full justify-start" leftIcon={<PlusCircleIcon className="w-5 h-5" />}>
                    Request Desain
                  </Button>
                </Link>
              )}
              
              {hasAnyRole(user, ['designer_internal', 'designer_external']) && (
                <Link to="/designer-panel">
                  <Button variant="outline" className="w-full justify-start" leftIcon={<PencilSquareIcon className="w-5 h-5" />}>
                    Panel Desainer {[(stats?.projectsByStatus['ready_for_review'] || 0) + (stats?.projectsByStatus['changes_requested'] || 0)]}
                  </Button>
                </Link>
              )}
              
              {hasAnyRole(user, ['reviewer', 'approver']) && (
                <Link to="/review-panel">
                  <Button variant="outline" className="w-full justify-start" leftIcon={<EyeIcon className="w-5 h-5" />}>
                    Panel Review {[stats?.projectsByStatus['ready_for_review'] || 0]}
                  </Button>
                </Link>
              )}
              
              {hasAnyRole(user, ['designer_external']) && (
                <Link to="/print-queue">
                  <Button variant="outline" className="w-full justify-start" leftIcon={<CheckCircleIcon className="w-5 h-5" />}>
                    Antrian Cetak {[stats?.projectsByStatus['approved_for_print'] || 0]}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aktivitas Terkini</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <ClockIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Belum ada aktivitas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity: any) => {
                    const getIcon = () => {
                      switch (activity.type) {
                        case 'proof_uploaded':
                          return PencilSquareIcon;
                        case 'approved_for_print':
                          return CheckCircleIcon;
                        case 'changes_requested':
                          return ExclamationTriangleIcon;
                        default:
                          return DocumentTextIcon;
                      }
                    };
                    
                    const Icon = getIcon();
                    
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span>{activity.user.name}</span>
                            <span className="mx-1">•</span>
                            <span>{formatDate(new Date(activity.createdAt))}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

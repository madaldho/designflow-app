import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge, MediaTypeBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { 
  PencilSquareIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';
import { useProjects } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';

const DesignerPanelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'needs-design' | 'ready-to-print'>('needs-design');
  const { user } = useAuth();
  const { data: allProjects = [], isLoading, refetch } = useProjects();

  // Filter projects based on designer role
  const isDesignerExternal = user?.role === 'designer_external';
  
  // Projects needing design/revision (Draft, Designing, Changes Requested)
  const needsDesignProjects = allProjects.filter(p => 
    ['draft', 'designing', 'changes_requested', 'ready_for_review'].includes(p.status) &&
    (isDesignerExternal || p.assignee?.id === user?.id || !p.assignee)
  );

  // Projects approved for print (for designer to track)
  const readyToPrintProjects = allProjects.filter(p => 
    ['approved_for_print', 'in_print', 'ready'].includes(p.status) &&
    (p.assignee?.id === user?.id || p.createdBy?.id === user?.id)
  );

  const tabs = [
    {
      id: 'needs-design' as const,
      label: 'Perlu Desain/Revisi',
      count: needsDesignProjects.length,
      icon: PencilSquareIcon,
    },
    {
      id: 'ready-to-print' as const,
      label: 'Siap Cetak',
      count: readyToPrintProjects.length,
      icon: CheckCircleIcon,
    },
  ];

  const ProjectCard: React.FC<{
    project: any;
    showUploadButton?: boolean;
  }> = ({ project, showUploadButton = true }) => {
    const isUrgent = new Date(project.deadline) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    
    return (
      <Card className={`hover:shadow-md transition-shadow ${isUrgent ? 'border-red-300' : ''}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {project.title}
                </h3>
                {isUrgent && (
                  <ExclamationCircleIcon className="w-5 h-5 text-red-600 shrink-0" title="Deadline dekat!" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{project.institution?.name || 'N/A'}</p>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <MediaTypeBadge type={project.type} />
            <span className="text-xs sm:text-sm text-gray-500">v{project.version || 1}</span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">{project.size} • {project.quantity} pcs</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 shrink-0" />
              <span className={`truncate ${isUrgent ? 'text-red-600 font-semibold' : ''}`}>
                Deadline: {formatDate(new Date(project.deadline))}
              </span>
            </div>
          </div>

          {project.description && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 break-words">{project.description}</p>
            </div>
          )}

          {project.status === 'changes_requested' && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-xs font-semibold text-orange-800 mb-1">Perlu Revisi</p>
              <p className="text-xs text-orange-700">Reviewer meminta perubahan pada desain</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Link to={`/projects/${project.id}`} className="flex-1">
              <Button size="sm" variant="outline" fullWidth>
                <EyeIcon className="w-4 h-4 mr-2" />
                Lihat Detail
              </Button>
            </Link>
            
            {showUploadButton && (
              <Link to={`/projects/${project.id}?action=upload`} className="flex-1">
                <Button size="sm" fullWidth>
                  <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                  Upload Desain
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Panel Desainer</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Kelola semua proyek desain yang sedang dikerjakan
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Perlu Desain</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{needsDesignProjects.length}</p>
              </div>
              <div className="p-2.5 sm:p-3 bg-blue-500 rounded-lg shrink-0">
                <PencilSquareIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Perlu Revisi</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {needsDesignProjects.filter(p => p.status === 'changes_requested').length}
                </p>
              </div>
              <div className="p-2.5 sm:p-3 bg-orange-500 rounded-lg shrink-0">
                <ExclamationCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Siap Cetak</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{readyToPrintProjects.length}</p>
              </div>
              <div className="p-2.5 sm:p-3 bg-green-500 rounded-lg shrink-0">
                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-primary-200 text-primary-800 font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-3 sm:space-y-4">
            {activeTab === 'needs-design' && (
              <>
                {needsDesignProjects.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <PencilSquareIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      Tidak Ada Proyek
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Semua proyek telah selesai atau belum ada yang ditugaskan
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:gap-4">
                    {needsDesignProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        showUploadButton={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'ready-to-print' && (
              <>
                {readyToPrintProjects.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <CheckCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      Tidak Ada Proyek Siap Cetak
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Belum ada proyek yang disetujui untuk cetak
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:gap-4">
                    {readyToPrintProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        showUploadButton={false}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignerPanelPage;

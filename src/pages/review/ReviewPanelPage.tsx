import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects, useCreateReview, useApproveForPrint } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge, MediaTypeBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { 
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';

const ReviewPanelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'request_changes'>('approve');
  const [reviewComments, setReviewComments] = useState('');
  
  const { user } = useAuth();
  const { data: allProjects = [], isLoading, refetch } = useProjects();
  const createReviewMutation = useCreateReview();
  const approveForPrintMutation = useApproveForPrint();
  
  const isReviewer = user?.role === 'reviewer' || user?.role === 'admin';
  const isApprover = user?.role === 'approver' || user?.role === 'admin';
  
  // Filter projects
  const pendingProjects = allProjects.filter(
    p => p.status === 'ready_for_review' || p.status === 'designing'
  );
  
  const approvedProjects = allProjects.filter(
    p => p.status === 'approved' || p.status === 'approved_for_print' || p.status === 'in_print' || p.status === 'ready'
  );

  const tabs = [
    {
      id: 'pending' as const,
      label: 'Menunggu Review',
      count: pendingProjects.length,
      icon: EyeIcon,
    },
    {
      id: 'approved' as const,
      label: 'Sudah Direview',
      count: approvedProjects.length,
      icon: CheckCircleIcon,
    },
  ];

  const handleOpenReviewModal = (project: any, action: 'approve' | 'request_changes') => {
    setSelectedProject(project);
    setReviewAction(action);
    setReviewComments('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewAction === 'request_changes' && !reviewComments.trim()) {
      alert('Harap berikan komentar untuk perubahan yang diminta');
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        projectId: selectedProject.id,
        decision: reviewAction === 'approve' ? 'approved' : 'changes_requested',
        comments: reviewComments,
      });
      setShowReviewModal(false);
      refetch();
    } catch (error) {
      console.error('Review error:', error);
    }
  };

  const handleApproveForPrint = async (projectId: string) => {
    if (!confirm('Yakin ingin menyetujui proyek ini untuk cetak?')) return;

    try {
      await approveForPrintMutation.mutateAsync(projectId);
      refetch();
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const ProjectCard: React.FC<{
    project: any;
    showReviewActions?: boolean;
  }> = ({ project, showReviewActions = true }) => {
    const canReview = isReviewer && showReviewActions;
    const canApproveForPrint = isApprover && project.status === 'approved';

    return (
      <Card className="hover:shadow-md transition-shadow w-full overflow-hidden">
        <CardContent className="p-4 sm:p-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate flex-1 min-w-0">
                  {project.title}
                </h3>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{project.institution?.name || 'No institution'}</p>
            </div>
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
              <span className="truncate">Deadline: {formatDate(new Date(project.deadline))}</span>
            </div>
            {project.createdBy && (
              <div className="flex items-center gap-2">
                <PencilSquareIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">Dibuat oleh {project.createdBy.name} • {formatDate(new Date(project.createdAt))}</span>
              </div>
            )}
          </div>

          {project.description && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg overflow-hidden">
              <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 break-words">{project.description}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <Link to={`/projects/${project.id}`} className="w-full">
              <Button size="sm" fullWidth>
                <EyeIcon className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">Preview & Review</span>
              </Button>
            </Link>
            
            {canReview && (
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleOpenReviewModal(project, 'request_changes')}
                  disabled={createReviewMutation.isPending}
                >
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate text-xs sm:text-sm">Minta Revisi</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="success"
                  onClick={() => handleOpenReviewModal(project, 'approve')}
                  disabled={createReviewMutation.isPending}
                >
                  <CheckCircleIcon className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate text-xs sm:text-sm">Approve</span>
                </Button>
              </div>
            )}

            {canApproveForPrint && (
              <Button 
                size="sm" 
                variant="success"
                fullWidth
                onClick={() => handleApproveForPrint(project.id)}
                disabled={approveForPrintMutation.isPending}
              >
                <CheckCircleIcon className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">Setujui untuk Cetak</span>
              </Button>
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
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Panel Review</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Review dan berikan feedback pada desain yang diajukan
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 w-full">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Menunggu Review</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{pendingProjects.length}</p>
              </div>
              <div className="p-2.5 sm:p-3 bg-yellow-500 rounded-lg shrink-0">
                <EyeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Prioritas Tinggi</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {pendingProjects.filter(p => new Date(p.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
              <div className="p-2.5 sm:p-3 bg-red-500 rounded-lg shrink-0">
                <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Sudah Direview</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{approvedProjects.length}</p>
              </div>
              <div className="p-2.5 sm:p-3 bg-green-500 rounded-lg shrink-0">
                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="w-full overflow-hidden">
        <CardContent className="p-4 sm:p-6 w-full">
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
          <div className="space-y-3 sm:space-y-4 w-full">
            {activeTab === 'pending' && (
              <>
                {pendingProjects.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <EyeIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      Semua Desain Sudah Direview
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Tidak ada desain yang menunggu review saat ini
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:gap-4 w-full">
                    {pendingProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        showReviewActions={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'approved' && (
              <>
                {approvedProjects.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <CheckCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      Belum Ada Review
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Belum ada desain yang selesai direview
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:gap-4 w-full">
                    {approvedProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        showReviewActions={false}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      {showReviewModal && selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowReviewModal(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitReview}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {reviewAction === 'approve' ? 'Approve Proyek' : 'Minta Revisi'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{selectedProject.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{selectedProject.institution?.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Komentar {reviewAction === 'request_changes' && '*'}
                    </label>
                    <textarea
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                      className="input min-h-[120px]"
                      placeholder={
                        reviewAction === 'approve' 
                          ? "Komentar opsional..." 
                          : "Jelaskan perubahan yang perlu dilakukan..."
                      }
                      required={reviewAction === 'request_changes'}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                  <Button
                    type="submit"
                    variant={reviewAction === 'approve' ? 'success' : 'warning'}
                    disabled={createReviewMutation.isPending}
                    loading={createReviewMutation.isPending}
                  >
                    {reviewAction === 'approve' ? 'Approve' : 'Kirim Revisi'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPanelPage;

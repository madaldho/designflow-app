import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge, MediaTypeBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeftIcon,
  PencilSquareIcon,
  EyeIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentIcon,
  TrashIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: project, isLoading, error } = useProject(id);
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const [showUploadModal, setShowUploadModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail proyek...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Proyek Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Proyek yang Anda cari tidak ditemukan atau telah dihapus</p>
          <Link to="/projects">
            <Button>Kembali ke Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = user?.role === 'admin' || project.createdById === user?.id;
  const canDelete = user?.role === 'admin' || project.createdById === user?.id;
  const canUpload = ['designer_internal', 'designer_external', 'admin'].includes(user?.role || '');

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.')) return;

    try {
      await deleteProjectMutation.mutateAsync(project.id);
      toast.success('Proyek berhasil dihapus');
      navigate('/projects');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{project.title}</h1>
            <p className="text-sm sm:text-base text-gray-600 truncate">{project.institution?.name || 'N/A'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={project.status} />
          <MediaTypeBadge type={project.type} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Project Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Informasi Proyek</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Judul</label>
                  <p className="text-sm sm:text-base text-gray-900 break-words">{project.title}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={project.status} />
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Jenis Media</label>
                  <p className="text-sm sm:text-base text-gray-900 capitalize">{project.type}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Ukuran</label>
                  <p className="text-sm sm:text-base text-gray-900">{project.size}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Jumlah</label>
                  <p className="text-sm sm:text-base text-gray-900">{project.quantity} pcs</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Deadline</label>
                  <p className="text-sm sm:text-base text-gray-900 font-semibold">
                    {formatDate(new Date(project.deadline))}
                  </p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Lembaga</label>
                  <p className="text-sm sm:text-base text-gray-900">{project.institution?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Versi</label>
                  <p className="text-sm sm:text-base text-gray-900">v{project.version || 1}</p>
                </div>
              </div>
              
              {project.description && (
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Deskripsi</label>
                  <p className="text-sm sm:text-base text-gray-900 mt-1 break-words">{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Latest Proof */}
          {project.proofs && project.proofs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Proof Terbaru (v{project.proofs[0].version})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <DocumentIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600">Preview akan ditampilkan di sini</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" fullWidth>
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" fullWidth>
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions Card */}
          {canUpload && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Aksi Desainer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button fullWidth onClick={() => setShowUploadModal(true)}>
                    <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                    Upload Versi Baru
                  </Button>
                  <Button variant="outline" fullWidth>
                    <PencilSquareIcon className="w-4 h-4 mr-2" />
                    Tandai Siap Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* People Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-primary-600" />
                Tim Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Dibuat oleh</label>
                <p className="text-sm font-medium text-gray-900">{project.createdBy?.name || 'N/A'}</p>
                <p className="text-xs text-gray-500">{project.createdBy?.email || ''}</p>
              </div>
              
              {project.assignee && (
                <div className="pt-3 border-t">
                  <label className="text-xs font-medium text-gray-500">Desainer</label>
                  <p className="text-sm font-medium text-gray-900">{project.assignee.name}</p>
                  <p className="text-xs text-gray-500">{project.assignee.email}</p>
                </div>
              )}
              
              {project.reviewer && (
                <div className="pt-3 border-t">
                  <label className="text-xs font-medium text-gray-500">Reviewer</label>
                  <p className="text-sm font-medium text-gray-900">{project.reviewer.name}</p>
                  <p className="text-xs text-gray-500">{project.reviewer.email}</p>
                </div>
              )}
              
              {project.approver && (
                <div className="pt-3 border-t">
                  <label className="text-xs font-medium text-gray-500">Approver</label>
                  <p className="text-sm font-medium text-gray-900">{project.approver.name}</p>
                  <p className="text-xs text-gray-500">{project.approver.email}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-primary-600" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <label className="text-xs font-medium text-gray-500">Dibuat</label>
                <p className="text-sm text-gray-900">{formatDate(new Date(project.createdAt))}</p>
              </div>
              <div className="pt-3 border-t">
                <label className="text-xs font-medium text-gray-500">Terakhir Diupdate</label>
                <p className="text-sm text-gray-900">{formatDate(new Date(project.updatedAt))}</p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          {canDelete && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="danger" 
                  size="sm" 
                  fullWidth
                  onClick={handleDelete}
                  disabled={deleteProjectMutation.isPending}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Hapus Proyek
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowUploadModal(false)}></div>
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Upload Versi Baru</h3>
              <p className="text-sm text-gray-600 mb-4">Fitur upload dalam pengembangan</p>
              <Button onClick={() => setShowUploadModal(false)} fullWidth>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;

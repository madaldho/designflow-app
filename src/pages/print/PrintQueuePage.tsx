import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge, MediaTypeBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  PrinterIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  FlagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';
import { useProjects } from '@/hooks';
import toast from 'react-hot-toast';

const PrintQueuePage: React.FC = () => {
  const { data: projects = [], isLoading, refetch } = useProjects();
  
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [pickupData, setPickupData] = useState({
    takerName: '',
    picName: '',
    notes: '',
  });

  // Filter approved projects
  const approvedProjects = projects.filter(
    p => p.status === 'approved_for_print' || p.status === 'in_print' || p.status === 'ready'
  );

  // Transform to print queue format
  const printQueue = approvedProjects.map(project => ({
    ...project,
    printStatus: project.status === 'ready' ? 'ready' : 
                 project.status === 'in_print' ? 'in_progress' : 'queued',
  }));

  const getPrintStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrintStatusLabel = (status: string) => {
    switch (status) {
      case 'queued': return 'Dalam Antrian';
      case 'in_progress': return 'Sedang Dicetak';
      case 'ready': return 'Siap Diambil';
      default: return status;
    }
  };

  const handleOpenPickupModal = (project: any) => {
    setSelectedProject(project);
    setPickupData({ takerName: '', picName: '', notes: '' });
    setShowPickupModal(true);
  };

  const handleSubmitPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupData.takerName.trim()) {
      toast.error('Nama pengambil harus diisi!');
      return;
    }

    toast.success(`Proyek "${selectedProject.title}" berhasil ditandai diambil oleh ${pickupData.takerName}`);
    setShowPickupModal(false);
    // TODO: Call API to create pickup log
  };

  const ProjectCard: React.FC<{ project: any }> = ({ project }) => (
    <Card className="hover:shadow-md transition-shadow w-full overflow-hidden">
      <CardContent className="p-4 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mb-1">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{project.institution?.name || 'N/A'}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={project.status} />
            <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getPrintStatusColor(project.printStatus)}`}>
              {getPrintStatusLabel(project.printStatus)}
            </span>
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
          {project.approver && (
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">Disetujui oleh {project.approver.name}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
          <Button size="sm" className="w-full sm:w-auto" onClick={() => window.open(`/projects/${project.id}`, '_blank')}>
            <EyeIcon className="w-4 h-4 mr-2 shrink-0" />
            <span className="truncate">Preview</span>
          </Button>
          
          {project.printStatus === 'queued' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => toast('Fitur dalam pengembangan')}
            >
              <PrinterIcon className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">Mulai Cetak</span>
            </Button>
          )}
          
          {project.printStatus === 'in_progress' && (
            <Button 
              size="sm" 
              variant="success" 
              className="w-full sm:w-auto"
              onClick={() => toast('Fitur dalam pengembangan')}
            >
              <CheckCircleIcon className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">Tandai Selesai</span>
            </Button>
          )}
          
          {project.printStatus === 'ready' && (
            <Button 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => handleOpenPickupModal(project)}
            >
              <FlagIcon className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">Konfirmasi Diambil</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const queuedProjects = printQueue.filter(p => p.printStatus === 'queued');
  const inProgressProjects = printQueue.filter(p => p.printStatus === 'in_progress');
  const completedProjects = printQueue.filter(p => p.printStatus === 'ready');

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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Antrian Cetak</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Kelola semua permintaan cetak yang telah disetujui
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 w-full">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                <div className="p-2 sm:p-3 bg-gray-500 rounded-lg shrink-0">
                  <DocumentTextIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{printQueue.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Menunggu</p>
                <div className="p-2 sm:p-3 bg-yellow-500 rounded-lg shrink-0">
                  <ClockIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{queuedProjects.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Dicetak</p>
                <div className="p-2 sm:p-3 bg-blue-500 rounded-lg shrink-0">
                  <PrinterIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{inProgressProjects.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Selesai</p>
                <div className="p-2 sm:p-3 bg-green-500 rounded-lg shrink-0">
                  <CheckCircleIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{completedProjects.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Queue */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Semua Antrian Cetak</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full shrink-0"></span>
              <span className="text-gray-600 whitespace-nowrap">Menunggu ({queuedProjects.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full shrink-0"></span>
              <span className="text-gray-600 whitespace-nowrap">Cetak ({inProgressProjects.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full shrink-0"></span>
              <span className="text-gray-600 whitespace-nowrap">Selesai ({completedProjects.length})</span>
            </div>
          </div>
        </div>

        {printQueue.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 sm:py-12">
              <PrinterIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Antrian Cetak Kosong
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Tidak ada proyek yang siap untuk dicetak saat ini
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4 w-full">
            {printQueue.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Pickup Modal */}
      {showPickupModal && selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowPickupModal(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitPickup}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Konfirmasi Pengambilan
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowPickupModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{selectedProject.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{selectedProject.institution?.name}</p>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Nama Pengambil *"
                      value={pickupData.takerName}
                      onChange={(e) => setPickupData({ ...pickupData, takerName: e.target.value })}
                      placeholder="Nama lengkap pengambil"
                      required
                    />

                    <Input
                      label="PIC / Unit"
                      value={pickupData.picName}
                      onChange={(e) => setPickupData({ ...pickupData, picName: e.target.value })}
                      placeholder="Contoh: Humas, Bendahara"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catatan (Opsional)
                      </label>
                      <textarea
                        value={pickupData.notes}
                        onChange={(e) => setPickupData({ ...pickupData, notes: e.target.value })}
                        className="input min-h-[80px]"
                        placeholder="Catatan tambahan..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                  <Button type="submit">
                    Konfirmasi Diambil
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPickupModal(false)}
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

export default PrintQueuePage;

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '@/hooks';
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
import { Input } from '@/components/ui/Input';
import { 
  PlusCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilSquareIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { 
  formatDate, 
  isOverdue, 
  isDeadlineImminent,
  cn
} from '@/lib/utils';
import { ProjectStatus, Project } from '@/types';

const ProjectsPage: React.FC = () => {
  const { data: projects = [], isLoading, error, refetch } = useProjects();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'medium': return 'bg-warning-100 text-warning-800 border-warning-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'deadline' | 'updated' | 'created'>('updated');
  
  // Timeout for loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.warn('[ProjectsPage] Loading timeout');
        setLoadingTimeout(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.institution.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(project => statusFilter.includes(project.status));
    }

    // Apply type filter
    if (typeFilter.length > 0) {
      filtered = filtered.filter(project => typeFilter.includes(project.type));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const deadlineA = new Date(a.deadline).getTime();
      const deadlineB = new Date(b.deadline).getTime();
      const updatedA = new Date(a.updatedAt).getTime();
      const updatedB = new Date(b.updatedAt).getTime();
      const createdA = new Date(a.createdAt).getTime();
      const createdB = new Date(b.createdAt).getTime();
      
      switch (sortBy) {
        case 'deadline':
          return deadlineA - deadlineB;
        case 'updated':
          return updatedB - updatedA;
        case 'created':
          return createdB - createdA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchQuery, statusFilter, typeFilter, sortBy]);

  const getProjectPriority = (project: any): 'high' | 'medium' | 'low' => {
    const deadline = new Date(project.deadline);
    if (isOverdue(deadline)) return 'high';
    if (isDeadlineImminent(deadline, 3)) return 'medium';
    return 'low';
  };

  if (isLoading && !loadingTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat proyek...</p>
          <p className="text-xs text-gray-400 mt-2">Connecting to server...</p>
        </div>
      </div>
    );
  }
  
  if (loadingTimeout && isLoading) {
    return (
      <div className="p-6">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">⚠️ Loading Timeout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-yellow-700">
              Server tidak merespons. Pastikan backend running dan database ter-setup.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="outline">
                Coba Lagi
              </Button>
              <Button onClick={() => window.location.href = '/diagnostic'} variant="outline">
                Run Diagnostic
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Error Memuat Proyek</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-700">
              {error instanceof Error ? error.message : 'Gagal memuat data proyek dari database'}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectTypes = [
    { value: 'baliho', label: 'Baliho' },
    { value: 'poster', label: 'Poster' },
    { value: 'rundown', label: 'Rundown' },
    { value: 'spanduk', label: 'Spanduk' },
    { value: 'leaflet', label: 'Leaflet' },
    { value: 'brosur', label: 'Brosur' },
    { value: 'kartu_nama', label: 'Kartu Nama' },
    { value: 'stiker', label: 'Stiker' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'designing', label: 'Dalam Desain' },
    { value: 'ready_for_review', label: 'Siap Review' },
    { value: 'changes_requested', label: 'Perlu Revisi' },
    { value: 'approved', label: 'Disetujui' },
    { value: 'approved_for_print', label: 'Siap Cetak' },
    { value: 'in_print', label: 'Sedang Dicetak' },
    { value: 'ready', label: 'Siap Diambil' },
    { value: 'picked_up', label: 'Sudah Diambil' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Semua Proyek</h1>
          <p className="text-gray-600">
            Kelola semua proyek desain dalam satu tempat
          </p>
        </div>
        <Link to="/request-design">
          <Button leftIcon={<PlusCircleIcon className="w-5 h-5" />}>
            Request Desain Baru
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Top Row - Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search - Full width on mobile */}
              <div className="flex-1 min-w-0">
                <Input
                  placeholder="Cari proyek atau lembaga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
                  className="w-full"
                />
              </div>

              {/* Filter and Sort - Stack on mobile, inline on tablet+ */}
              <div className="flex gap-2 sm:gap-3">
                {/* Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  leftIcon={<FunnelIcon className="w-5 h-5" />}
                  className="flex-1 sm:flex-initial whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Filter</span>
                  <span className="sm:hidden">Filter</span>
                  {(statusFilter.length > 0 || typeFilter.length > 0) && (
                    <Badge size="sm" className="ml-1.5 sm:ml-2 bg-primary-600 text-white">
                      {statusFilter.length + typeFilter.length}
                    </Badge>
                  )}
                </Button>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="input flex-1 sm:flex-initial sm:min-w-[180px] text-sm"
                  aria-label="Urutkan berdasarkan"
                  title="Urutkan berdasarkan"
                >
                  <option value="updated">Terbaru Diperbarui</option>
                  <option value="created">Terbaru Dibuat</option>
                  <option value="deadline">Deadline Terdekat</option>
                </select>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Filter Status
                  </label>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    {statusOptions.map((status) => (
                      <label key={status.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-md transition-colors">
                        <input
                          type="checkbox"
                          checked={statusFilter.includes(status.value as ProjectStatus)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStatusFilter([...statusFilter, status.value as ProjectStatus]);
                            } else {
                              setStatusFilter(statusFilter.filter(s => s !== status.value));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-gray-700">{status.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Filter Jenis Media
                  </label>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    {projectTypes.map((type) => (
                      <label key={type.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-md transition-colors">
                        <input
                          type="checkbox"
                          checked={typeFilter.includes(type.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTypeFilter([...typeFilter, type.value]);
                            } else {
                              setTypeFilter(typeFilter.filter(t => t !== type.value));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(statusFilter.length > 0 || typeFilter.length > 0) && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStatusFilter([]);
                      setTypeFilter([]);
                    }}
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    }
                  >
                    Hapus Semua Filter
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter.length > 0 || typeFilter.length > 0 
                ? 'Tidak ada proyek yang ditemukan' 
                : 'Belum ada proyek'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter.length > 0 || typeFilter.length > 0 
                ? 'Coba ubah filter atau kata kunci pencarian' 
                : 'Mulai dengan membuat request desain pertama Anda'}
            </p>
            <Link to="/request-design">
              <Button leftIcon={<PlusCircleIcon className="w-5 h-5" />}>
                Request Desain Baru
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const priority = getProjectPriority(project);
            
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block group"
              >
                <Card className="h-full hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.institution.name}
                        </p>
                      </div>
                      
                      {/* Priority Badge */}
                      <Badge
                        size="sm"
                        className={getPriorityColor(priority)}
                      >
                        {priority === 'high' ? 'DARURAT' : priority === 'medium' ? 'CEPAT' : 'NORMAL'}
                      </Badge>
                    </div>

                    {/* Status and Type */}
                    <div className="flex items-center gap-2 mb-4">
                      <MediaTypeBadge type={project.type} />
                      <StatusBadge status={project.status} />
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Deadline: {formatDate(new Date(project.deadline))}
                        {isOverdue(new Date(project.deadline)) && (
                          <span className="ml-2 text-danger-600 font-medium">
                            (Terlambat)
                          </span>
                        )}
                        {isDeadlineImminent(new Date(project.deadline)) && !isOverdue(new Date(project.deadline)) && (
                          <span className="ml-2 text-warning-600 font-medium">
                            ({Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} hari)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 mr-2" />
                        {project.quantity} • {project.size}
                      </div>
                      <div className="flex items-center">
                        <DocumentTextIcon className="w-4 h-4 mr-2" />
                        Versi v{project.version}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {formatDate(new Date(project.updatedAt), { day: 'numeric', month: 'short' })}
                      </span>
                      <div className="flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm font-medium">Buka Detail</span>
                        <ArrowPathIcon className="w-4 h-4 ml-1 transform rotate-180" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

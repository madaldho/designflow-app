import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useProjects, useDashboardStats } from '@/hooks';
import { 
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  // Calculate analytics from real data
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => ['ready', 'picked_up', 'archived'].includes(p.status)).length;
  const inProgressProjects = projects.filter(p => !['ready', 'picked_up', 'archived', 'cancelled'].includes(p.status)).length;
  // Real calculated stats
  const analyticsStats = {
    totalProjects,
    completedProjects,
    avgRequestToReview: 2.3, // TODO: Calculate from real data
    avgReviewToApprove: 1.5, // TODO: Calculate from real data
    avgApproveToComplete: 3.2, // TODO: Calculate from real data
    totalRevisions: 0, // TODO: Calculate from real data
    avgRevisionsPerProject: 1.8, // TODO: Calculate from real data
    onTimeDelivery: completedProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
  };

  if (projectsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data analytics...</p>
        </div>
      </div>
    );
  }

  const timeRanges = [
    { value: '7d', label: '7 Hari' },
    { value: '30d', label: '30 Hari' },
    { value: '90d', label: '90 Hari' },
    { value: '1y', label: '1 Tahun' },
  ];

  // Project by status (REAL DATA)
  const statusCounts = {
    draft: projects.filter(p => p.status === 'draft').length,
    designing: projects.filter(p => p.status === 'designing').length,
    ready_for_review: projects.filter(p => p.status === 'ready_for_review').length,
    approved: projects.filter(p => p.status === 'approved' || p.status === 'approved_for_print').length,
    completed: completedProjects,
  };

  const projectsByStatus = [
    { status: 'Draft', count: statusCounts.draft, percentage: totalProjects > 0 ? Math.round((statusCounts.draft / totalProjects) * 100) : 0, color: 'bg-gray-500' },
    { status: 'Designing', count: statusCounts.designing, percentage: totalProjects > 0 ? Math.round((statusCounts.designing / totalProjects) * 100) : 0, color: 'bg-blue-500' },
    { status: 'Ready Review', count: statusCounts.ready_for_review, percentage: totalProjects > 0 ? Math.round((statusCounts.ready_for_review / totalProjects) * 100) : 0, color: 'bg-yellow-500' },
    { status: 'Approved', count: statusCounts.approved, percentage: totalProjects > 0 ? Math.round((statusCounts.approved / totalProjects) * 100) : 0, color: 'bg-green-500' },
    { status: 'Completed', count: statusCounts.completed, percentage: totalProjects > 0 ? Math.round((statusCounts.completed / totalProjects) * 100) : 0, color: 'bg-success-500' },
  ];

  // Project by type
  const projectsByType = [
    { type: 'Baliho', count: 45, percentage: 18, revisions: 2.1 },
    { type: 'Poster', count: 78, percentage: 32, revisions: 1.5 },
    { type: 'Spanduk', count: 54, percentage: 22, revisions: 1.8 },
    { type: 'Banner', count: 32, percentage: 13, revisions: 1.6 },
    { type: 'Kartu Nama', count: 21, percentage: 9, revisions: 1.2 },
    { type: 'Lainnya', count: 17, percentage: 7, revisions: 2.3 },
  ];

  // Project by institution
  const projectsByInstitution = [
    { name: 'Pondok Pesantren Al-Hikmah', count: 67, avgTime: 5.2 },
    { name: 'MA Maitine', count: 54, avgTime: 4.8 },
    { name: 'SMP Negeri 1', count: 43, avgTime: 6.1 },
    { name: 'Yayasan Pendidikan Utama', count: 38, avgTime: 5.5 },
    { name: 'SMK Teknologi', count: 29, avgTime: 4.9 },
    { name: 'Lainnya', count: 16, avgTime: 5.8 },
  ];

  // Performance by role
  const performanceByRole = [
    { role: 'Requester', avgTime: 0.5, bottleneck: false, count: 45 },
    { role: 'Designer Internal', avgTime: 2.8, bottleneck: true, count: 3 },
    { role: 'Designer External', avgTime: 2.1, bottleneck: false, count: 2 },
    { role: 'Reviewer', avgTime: 1.6, bottleneck: false, count: 5 },
    { role: 'Approver', avgTime: 0.9, bottleneck: false, count: 4 },
  ];

  // Monthly trends (simplified bars)
  const monthlyTrends = [
    { month: 'Jul', projects: 42, completed: 38 },
    { month: 'Aug', projects: 51, completed: 47 },
    { month: 'Sep', projects: 48, completed: 45 },
    { month: 'Oct', projects: 56, completed: 43 },
  ];

  const formatDays = (days: number | undefined) => {
    if (!days || days === undefined) return '0 hari';
    if (days < 1) return `${Math.round(days * 24)} jam`;
    return `${days.toFixed(1)} hari`;
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics & Laporan</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Statistik dan performa sistem secara keseluruhan
          </p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                timeRange === range.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Proyek</p>
              <FolderIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{analyticsStats.totalProjects}</p>
            <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm">
              <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500">vs bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Selesai</p>
              <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{analyticsStats.completedProjects}</p>
            <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm">
              <span className="text-gray-600 font-medium">{Math.round((analyticsStats.completedProjects / analyticsStats.totalProjects) * 100)}%</span>
              <span className="text-gray-500">completion rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Rata-rata Waktu</p>
              <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {(analyticsStats.avgRequestToReview + analyticsStats.avgReviewToApprove + analyticsStats.avgApproveToComplete).toFixed(1)}
              <span className="text-base sm:text-lg font-normal text-gray-600 ml-1">hari</span>
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm">
              <ArrowTrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="text-green-600 font-medium">-8%</span>
              <span className="text-gray-500">vs bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600">On-Time Delivery</p>
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {analyticsStats.onTimeDelivery}
              <span className="text-base sm:text-lg font-normal text-gray-600">%</span>
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm">
              <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="text-green-600 font-medium">+5%</span>
              <span className="text-gray-500">vs bulan lalu</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Breakdown */}
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Rata-rata Waktu per Tahapan</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Request → Ready Review</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">{formatDays(analyticsStats.avgRequestToReview)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Ready Review → Approved</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">{formatDays(analyticsStats.avgReviewToApprove)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Approved → Selesai</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">{formatDays(analyticsStats.avgApproveToComplete)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '47%' }}></div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-bold text-gray-900">Total Waktu</span>
                <span className="text-base sm:text-lg font-bold text-primary-600">
                  {formatDays(analyticsStats.avgRequestToReview + analyticsStats.avgReviewToApprove + analyticsStats.avgApproveToComplete)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
        {/* Project by Status */}
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Proyek per Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3">
              {projectsByStatus.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color} shrink-0`}></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{item.count}</span>
                      <span className="text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project by Type */}
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Proyek per Jenis Media</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3">
              {projectsByType.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{item.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{item.count}</span>
                      <span className="text-[10px] sm:text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">
                        {item.revisions}x revisi
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project by Institution */}
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Proyek per Lembaga</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3">
              {projectsByInstitution.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">Rata-rata: {item.avgTime} hari</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm sm:text-base font-bold text-gray-900">{item.count}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">proyek</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance by Role (Bottleneck Analysis) */}
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
              Bottleneck Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3">
              {performanceByRole.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border-2 ${
                    item.bottleneck ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.role}</p>
                        {item.bottleneck && (
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                            BOTTLENECK
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-600">{item.count} orang</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm sm:text-base font-bold ${
                        item.bottleneck ? 'text-red-700' : 'text-gray-900'
                      }`}>
                        {formatDays(item.avgTime)}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500">avg time</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-900">
                <strong>💡 Rekomendasi:</strong> Tambah 1-2 desainer internal untuk mengurangi bottleneck
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Tren Bulanan</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 sm:h-64">
            {monthlyTrends.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div className="w-full flex flex-col gap-1 justify-end h-full">
                  <div 
                    className="w-full bg-primary-600 rounded-t-lg transition-all hover:bg-primary-700"
                    style={{ height: `${(item.projects / 60) * 100}%` }}
                    title={`${item.projects} proyek`}
                  ></div>
                  <div 
                    className="w-full bg-green-600 rounded-t-lg transition-all hover:bg-green-700"
                    style={{ height: `${(item.completed / 60) * 100}%` }}
                    title={`${item.completed} selesai`}
                  ></div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">{item.month}</p>
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-bold text-gray-900">{item.projects}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{item.completed} done</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-600 rounded"></div>
              <span className="text-xs sm:text-sm text-gray-600">Total Proyek</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span className="text-xs sm:text-sm text-gray-600">Selesai</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-primary-600" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-green-900">Performa Baik</p>
                <p className="text-xs sm:text-sm text-green-700 mt-1">
                  On-time delivery meningkat 5% bulan ini. Tim reviewer dan approver bekerja efisien.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-yellow-900">Perhatian</p>
                <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                  Baliho dan Spanduk memiliki rata-rata revisi tertinggi (2.1x dan 1.8x). Pertimbangkan checklist pra-desain lebih detail.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <ClockIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-red-900">Bottleneck Terdeteksi</p>
                <p className="text-xs sm:text-sm text-red-700 mt-1">
                  Desainer Internal adalah bottleneck utama (2.8 hari rata-rata). Rekomendasi: tambah kapasitas atau distribusikan ke eksternal.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;

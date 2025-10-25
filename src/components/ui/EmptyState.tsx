import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-12 px-4',
      className
    )}>
      {Icon && (
        <div className="mb-4 rounded-full bg-gray-100 p-3">
          <Icon className="h-10 w-10 text-gray-400" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 max-w-md mb-6">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          {action.icon && <action.icon className="h-4 w-4" />}
          {action.label}
        </button>
      )}
    </div>
  );
}

// Pre-built Empty States
export function EmptyProjects({ onCreateProject }: { onCreateProject?: () => void }) {
  return (
    <EmptyState
      title="Belum Ada Proyek"
      description="Mulai dengan membuat proyek desain pertama Anda. Klik tombol di bawah untuk memulai."
      action={onCreateProject ? {
        label: 'Buat Proyek Baru',
        onClick: onCreateProject,
      } : undefined}
    />
  );
}

export function EmptyActivities() {
  return (
    <EmptyState
      title="Belum Ada Aktivitas"
      description="Aktivitas terbaru akan muncul di sini setelah ada perubahan pada proyek."
    />
  );
}

export function EmptySearchResults() {
  return (
    <EmptyState
      title="Tidak Ada Hasil"
      description="Coba ubah kata kunci pencarian atau filter yang Anda gunakan."
    />
  );
}

export function EmptyInstitutions({ onCreateInstitution }: { onCreateInstitution?: () => void }) {
  return (
    <EmptyState
      title="Belum Ada Institusi"
      description="Tambahkan institusi atau lembaga untuk mulai mengelola proyek desain."
      action={onCreateInstitution ? {
        label: 'Tambah Institusi',
        onClick: onCreateInstitution,
      } : undefined}
    />
  );
}

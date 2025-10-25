import React from 'react';
import { ProjectStatus, MediaType } from '@/types';
import { getStatusColor as getStatusColorUtil, getStatusLabel as getStatusLabelUtil, getMediaTypeLabel } from '@/lib/utils';
import { getStatusColor, getStatusLabel } from '@/lib/design-system';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface MediaTypeBadgeProps {
  type: MediaType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className, 
  size = 'md' 
}) => {
  const colorConfig = getStatusColor(status);
  const label = getStatusLabel(status);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border transition-colors',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: colorConfig.bg,
        color: colorConfig.text,
        borderColor: colorConfig.border,
      }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: colorConfig.text }} />
      {label}
    </span>
  );
};

const MediaTypeBadge: React.FC<MediaTypeBadgeProps> = ({ 
  type, 
  className, 
  size = 'md' 
}) => {
  const typeColors = {
    baliho: 'bg-blue-100 text-blue-800',
    poster: 'bg-purple-100 text-purple-800',
    rundown: 'bg-green-100 text-green-800',
    spanduk: 'bg-yellow-100 text-yellow-800',
    leaflet: 'bg-pink-100 text-pink-800',
    brosur: 'bg-indigo-100 text-indigo-800',
    kartu_nama: 'bg-gray-100 text-gray-800',
    stiker: 'bg-orange-100 text-orange-800',
    lainnya: 'bg-gray-100 text-gray-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        typeColors[type],
        sizeClasses[size],
        className
      )}
    >
      {getMediaTypeLabel(type)}
    </span>
  );
};

export { StatusBadge, MediaTypeBadge };

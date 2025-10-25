import React from 'react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { getRoleColor, getRoleLabel } from '@/lib/design-system';

interface RoleBadgeProps {
  role: UserRole | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RoleBadge({ role, className, size = 'sm' }: RoleBadgeProps) {
  const colorConfig = getRoleColor(role);
  const label = getRoleLabel(role);

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
      {label}
    </span>
  );
}

/**
 * Design System - DesignFlow
 * Consistent colors, spacing, typography, and styles
 * World-class professional design
 */

// Color Palette
export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary/Accent
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  
  // Status Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Neutrals
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Status Badge Colors
export const statusColors = {
  draft: { bg: colors.gray[100], text: colors.gray[700], border: colors.gray[300] },
  designing: { bg: colors.info[50], text: colors.info[700], border: colors.info[200] },
  ready_for_review: { bg: colors.warning[50], text: colors.warning[700], border: colors.warning[200] },
  changes_requested: { bg: colors.danger[50], text: colors.danger[700], border: colors.danger[200] },
  approved: { bg: colors.success[50], text: colors.success[700], border: colors.success[200] },
  approved_for_print: { bg: colors.success[100], text: colors.success[800], border: colors.success[300] },
  in_print: { bg: colors.accent[50], text: colors.accent[700], border: colors.accent[200] },
  ready: { bg: colors.success[500], text: 'white', border: colors.success[600] },
  picked_up: { bg: colors.gray[600], text: 'white', border: colors.gray[700] },
  archived: { bg: colors.gray[100], text: colors.gray[600], border: colors.gray[200] },
  cancelled: { bg: colors.danger[100], text: colors.danger[700], border: colors.danger[300] },
};

// Status Labels (Bahasa Indonesia)
export const statusLabels: Record<string, string> = {
  draft: 'Draft',
  designing: 'Sedang Didesain',
  ready_for_review: 'Siap Review',
  changes_requested: 'Perlu Revisi',
  approved: 'Disetujui',
  approved_for_print: 'Siap Cetak',
  in_print: 'Sedang Dicetak',
  ready: 'Selesai',
  picked_up: 'Sudah Diambil',
  archived: 'Diarsipkan',
  cancelled: 'Dibatalkan',
};

// Role Labels & Colors
export const roleLabels: Record<string, string> = {
  admin: 'Admin',
  approver: 'Approver',
  reviewer: 'Reviewer',
  designer_internal: 'Designer Internal',
  designer_external: 'Designer Eksternal',
  requester: 'Requester',
};

export const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  admin: { bg: colors.danger[50], text: colors.danger[700], border: colors.danger[200] },
  approver: { bg: colors.accent[50], text: colors.accent[700], border: colors.accent[200] },
  reviewer: { bg: colors.info[50], text: colors.info[700], border: colors.info[200] },
  designer_internal: { bg: colors.primary[50], text: colors.primary[700], border: colors.primary[200] },
  designer_external: { bg: colors.success[50], text: colors.success[700], border: colors.success[200] },
  requester: { bg: colors.gray[100], text: colors.gray[700], border: colors.gray[300] },
};

// Spacing Scale (px)
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// Typography
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
};

// Animation Durations
export const durations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
};

// Z-Index Scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Component Styles
export const components = {
  button: {
    base: `inline-flex items-center justify-center font-medium transition-all duration-${durations.fast} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`,
    sizes: {
      sm: `px-3 py-1.5 text-sm rounded-${borderRadius.md}`,
      md: `px-4 py-2 text-base rounded-${borderRadius.lg}`,
      lg: `px-6 py-3 text-lg rounded-${borderRadius.lg}`,
    },
    variants: {
      primary: `bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md`,
      secondary: `bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300`,
      success: `bg-success-600 hover:bg-success-700 text-white shadow-sm hover:shadow-md`,
      danger: `bg-danger-600 hover:bg-danger-700 text-white shadow-sm hover:shadow-md`,
      ghost: `hover:bg-gray-100 text-gray-700`,
    },
  },
  
  card: {
    base: `bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-${durations.normal}`,
    hover: `hover:shadow-md hover:border-gray-300`,
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  
  input: {
    base: `w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-${durations.fast}`,
    error: `border-danger-500 focus:ring-danger-500 focus:border-danger-500`,
    success: `border-success-500 focus:ring-success-500 focus:border-success-500`,
  },
  
  badge: {
    base: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border`,
  },
};

// Helper Functions
export function getStatusColor(status: string) {
  return statusColors[status as keyof typeof statusColors] || statusColors.draft;
}

export function getStatusLabel(status: string) {
  return statusLabels[status as keyof typeof statusLabels] || status;
}

export function getRoleColor(role: string) {
  return roleColors[role as keyof typeof roleColors] || roleColors.requester;
}

export function getRoleLabel(role: string) {
  return roleLabels[role] || role;
}

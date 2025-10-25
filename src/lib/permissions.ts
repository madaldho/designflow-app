import { User, Project } from '@/types';

export type UserRole = 
  | 'requester'
  | 'designer_internal'
  | 'designer_external'
  | 'reviewer'
  | 'approver'
  | 'admin';

export interface Permission {
  action: string;
  resource: string;
}

// Role-based permissions
const PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    // Admin bisa segalanya
    { action: 'view', resource: 'all_projects' },
    { action: 'view', resource: 'all_users' },
    { action: 'edit', resource: 'all_projects' },
    { action: 'delete', resource: 'all_projects' },
    { action: 'manage', resource: 'users' },
    { action: 'manage', resource: 'system' },
  ],
  requester: [
    // Requester (pembuat project) - lihat project mereka sendiri + dapat di-review
    { action: 'view', resource: 'own_projects' },
    { action: 'create', resource: 'projects' },
    { action: 'edit', resource: 'own_projects' },
    { action: 'view', resource: 'project_status' },
    { action: 'view', resource: 'notifications' },
  ],
  designer_internal: [
    // Designer internal - lihat projects yang di-assign, upload proof, lihat reviews
    { action: 'view', resource: 'assigned_projects' },
    { action: 'edit', resource: 'assigned_projects' },
    { action: 'upload', resource: 'proofs' },
    { action: 'view', resource: 'reviews_on_own_proofs' },
  ],
  designer_external: [
    // Designer external (percetakan) - dapat download final, set print status, dan pickup log
    { action: 'view', resource: 'assigned_projects' },
    { action: 'edit', resource: 'assigned_projects' },
    { action: 'upload', resource: 'proofs' },
    { action: 'view', resource: 'reviews_on_own_proofs' },
    { action: 'download', resource: 'final_proofs' },
    { action: 'update', resource: 'print_status' },
    { action: 'create', resource: 'pickup_logs' },
  ],
  reviewer: [
    // Reviewer - lihat projects yang perlu di-review, add comments/annotations, approve ke atasan
    { action: 'view', resource: 'projects_for_review' },
    { action: 'review', resource: 'proofs' },
    { action: 'annotate', resource: 'proofs' },
    { action: 'comment', resource: 'proofs' },
    { action: 'request_changes', resource: 'proofs' },
    { action: 'approve', resource: 'reviews' },
  ],
  approver: [
    // Approver (atasan) - final approval "Setujui untuk Cetak" (hijau)
    { action: 'view', resource: 'projects_for_approval' },
    { action: 'comment', resource: 'proofs' },
    { action: 'approve', resource: 'projects' },
    { action: 'approve_for_print', resource: 'projects' },
    { action: 'reject', resource: 'projects' },
    { action: 'view', resource: 'all_reviews' },
  ],
};

export function hasPermission(role: UserRole, action: string, resource: string): boolean {
  const rolePermissions = PERMISSIONS[role] || [];
  return rolePermissions.some(p => p.action === action && p.resource === resource);
}

export function canViewProject(project: Project, user: User): boolean {
  const role = user.role as UserRole;
  
  // Admin bisa lihat semua
  if (role === 'admin') return true;
  
  // Requester bisa lihat project mereka sendiri
  if (role === 'requester' && project.createdBy.id === user.id) return true;
  
  // Designer lihat projects yang di-assign ke mereka
  if ((role === 'designer_internal' || role === 'designer_external') && project.assignee?.id === user.id) return true;
  
  // Reviewer lihat projects yang status-nya ready_for_review
  if (role === 'reviewer' && project.status === 'ready_for_review') return true;
  
  // Approver lihat projects yang status-nya ready_for_approval
  if (role === 'approver' && (project.status === 'ready_for_review' || project.status === 'changes_requested')) return true;
  
  return false;
}

export function canEditProject(project: Project, user: User): boolean {
  const role = user.role as UserRole;
  
  // Admin bisa edit semua
  if (role === 'admin') return true;
  
  // Requester bisa edit project mereka sendiri (status draft)
  if (role === 'requester' && project.createdBy.id === user.id && project.status === 'draft') return true;
  
  // Designer bisa edit projects yang di-assign
  if ((role === 'designer_internal' || role === 'designer_external') && project.assignee?.id === user.id && project.status === 'designing') return true;
  
  return false;
}

export function canCreateProject(user: User): boolean {
  const role = user.role as UserRole;
  return role === 'requester' || role === 'admin';
}

export function canReviewProject(user: User): boolean {
  const role = user.role as UserRole;
  return role === 'reviewer' || role === 'approver' || role === 'admin';
}

export function canApproveProject(user: User): boolean {
  const role = user.role as UserRole;
  return role === 'approver' || role === 'admin';
}

export function canDownloadFinalProof(user: User): boolean {
  const role = user.role as UserRole;
  return role === 'designer_external' || role === 'admin';
}

export function canSetPrintStatus(user: User): boolean {
  const role = user.role as UserRole;
  return role === 'designer_external' || role === 'admin';
}

export function canLogPickup(user: User): boolean {
  const role = user.role as UserRole;
  return role === 'designer_external' || role === 'admin';
}

export function canCommentOnProof(user: User): boolean {
  const role = user.role as UserRole;
  return role === 'reviewer' || role === 'approver' || role === 'admin';
}

export function canUploadProof(project: Project, user: User): boolean {
  const role = user.role as UserRole;
  
  // Admin bisa upload
  if (role === 'admin') return true;
  
  // Designer bisa upload ke projects yang di-assign
  if ((role === 'designer_internal' || role === 'designer_external') && project.assignee?.id === user.id) return true;
  
  return false;
}

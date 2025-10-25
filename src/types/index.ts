// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;  // Changed from roles array to single role
  status: 'active' | 'pending' | 'suspended';
  institutions?: Institution[];  // User can belong to multiple institutions
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Institution {
  id: string;
  name: string;
  type: 'pondok' | 'yayasan' | 'smp' | 'sma' | 'smk' | 'lainnya';
  address?: string;
  phone?: string;
  email?: string;
}

export type UserRole = 
  | 'requester'
  | 'designer_internal'
  | 'designer_external'
  | 'reviewer'
  | 'approver'
  | 'admin';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  institutionId: string;
  role: UserRole;
  agreeToTerms: boolean;
}

// Project and Design Types
export interface Project {
  id: string;
  title: string;
  type: MediaType;
  size: string;
  quantity: number;
  deadline: Date;
  institution: Institution;
  status: ProjectStatus;
  assignee?: User;
  reviewer?: User;
  approver?: User;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  description?: string;
  brief?: string;
  attachments: ProjectAsset[];
  finalProof?: Proof;
  currentProof?: Proof;
}

export type MediaType = 
  | 'baliho'
  | 'poster'
  | 'rundown'
  | 'spanduk'
  | 'leaflet'
  | 'brosur'
  | 'kartu_nama'
  | 'stiker'
  | 'lainnya';

export type ProjectStatus = 
  | 'draft'
  | 'designing'
  | 'ready_for_review'
  | 'changes_requested'
  | 'approved'
  | 'approved_for_print'
  | 'in_print'
  | 'ready'
  | 'picked_up'
  | 'archived'
  | 'cancelled';

export interface ProjectAsset {
  id: string;
  type: 'file' | 'gdrive_link' | 'sketch';
  name: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: User;
}

export interface Proof {
  id: string;
  projectId: string;
  version: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  notes?: string;
  uploadedBy: User;
  uploadedAt: Date;
  annotations: Annotation[];
  reviews?: Review[];
  isFinal: boolean;
}

export interface Annotation {
  id: string;
  proofId: string;
  type: 'pencil' | 'circle' | 'arrow' | 'highlight' | 'text';
  coordinates: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    points?: { x: number; y: number }[];
    text?: string;
  };
  comment?: string;
  createdBy: User;
  createdAt: Date;
  status: 'active' | 'resolved';
}

export interface Review {
  id: string;
  proofId: string;
  reviewerId: string;
  decision: 'approved' | 'changes_requested';
  comment?: string;
  changeRequests?: string[];
  checklistState?: ChecklistState;
  reviewedAt: Date;
  reviewer: User;
}

export interface ChecklistState {
  [key: string]: boolean;
}

export interface Approval {
  id: string;
  projectId: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  approvedAt?: Date;
  approver: User;
}

// Print Job Types
export interface PrintJob {
  id: string;
  projectId: string;
  status: PrintStatus;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  printer?: string;
  estimatedFinish?: Date;
  actualCost?: number;
  createdBy: User;
}

export type PrintStatus = 
  | 'queued'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export interface PickupLog {
  id: string;
  projectId: string;
  takerName: string;
  takerInstitution?: string;
  takerPhone?: string;
  notes?: string;
  pickedUpAt: Date;
  confirmedBy: User;
  attachment?: ProjectAsset; // Photo/proof of pickup
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  channels: ('email' | 'whatsapp')[];
  createdAt: Date;
  readAt?: Date;
}

export type NotificationType = 
  | 'project_created'
  | 'proof_uploaded'
  | 'review_requested'
  | 'review_completed'
  | 'changes_requested'
  | 'approved_for_print'
  | 'print_started'
  | 'print_completed'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'deadline_reminder'
  | 'system';

// Dashboard and Analytics Types
export interface DashboardStats {
  totalProjects: number;
  projectsByStatus: Record<ProjectStatus, number>;
  projectsByType: Record<MediaType, number>;
  upcomingDeadlines: Project[];
  recentActivity: Activity[];
  myTasks: {
    pendingReview: number;
    pendingApproval: number;
    needsDesign: number;
    readyToPrint: number;
  };
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  userId: string;
  projectId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  user: User;
  project?: Project;
}

// Admin Types
export interface UserManagementFilters {
  search?: string;
  role?: UserRole;
  status?: User['status'];
  institution?: string;
}

export interface SystemConfig {
  allowedFileTypes: string[];
  maxFileSize: number;
  defaultDeadlineDays: number;
  notificationSettings: NotificationSettings;
  approvalRoutes: ApprovalRoute[];
  prepressChecklist: ChecklistTemplate[];
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    templates: Record<NotificationType, string>;
  };
  whatsapp: {
    enabled: boolean;
    templates: Record<NotificationType, string>;
  };
}

export interface ApprovalRoute {
  id: string;
  institutionType: Institution['type'];
  reviewers: string[]; // User IDs
  approver: string; // User ID
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  items: ChecklistItem[];
  isDefault: boolean;
  applicableFor: MediaType[];
  created_by: User;
  created_at: Date;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  category: string;
  order: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form and UI Types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: any;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Filter and Sort Types
export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus[];
  type?: MediaType[];
  institution?: string[];
  assignee?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: 'low' | 'medium' | 'high';
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

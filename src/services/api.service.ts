import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5175';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('designflow_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<any>) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('designflow_token');
          localStorage.removeItem('designflow_user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to perform this action');
        } else if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else if (error.message === 'Network Error') {
          toast.error('Cannot connect to server. Please check if the server is running.');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(data: { name: string; email: string; password: string; phone?: string; role?: string }) {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Users endpoints
  async getUsers() {
    const response = await this.api.get('/users');
    return response.data;
  }

  async getUserById(id: string) {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async getUsersByRole(role: string) {
    const response = await this.api.get(`/users/role/${role}`);
    return response.data;
  }

  async updateUser(id: string, data: any) {
    const response = await this.api.patch(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await this.api.delete(`/users/${id}`);
    return response.data;
  }

  // Projects endpoints
  async getProjects(filters?: { status?: string; type?: string }) {
    const response = await this.api.get('/projects', { params: filters });
    return response.data;
  }

  async getProjectById(id: string) {
    const response = await this.api.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: any) {
    const response = await this.api.post('/projects', data);
    return response.data;
  }

  async updateProject(id: string, data: any) {
    const response = await this.api.patch(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string) {
    const response = await this.api.delete(`/projects/${id}`);
    return response.data;
  }

  async getDashboardStats() {
    const response = await this.api.get('/projects/stats/dashboard');
    return response.data;
  }

  // Institutions endpoints
  async getInstitutions() {
    const response = await this.api.get('/institutions');
    return response.data;
  }

  async getInstitutionById(id: string) {
    const response = await this.api.get(`/institutions/${id}`);
    return response.data;
  }

  async createInstitution(data: any) {
    const response = await this.api.post('/institutions', data);
    return response.data;
  }

  async updateInstitution(id: string, data: any) {
    const response = await this.api.patch(`/institutions/${id}`, data);
    return response.data;
  }

  async deleteInstitution(id: string) {
    const response = await this.api.delete(`/institutions/${id}`);
    return response.data;
  }

  // Activities endpoints
  async getActivities(params?: { limit?: number; projectId?: string }) {
    const response = await this.api.get('/activities', { params });
    return response.data;
  }

  async logActivity(data: { type: string; description: string; projectId?: string; metadata?: any }) {
    const response = await this.api.post('/activities', data);
    return response.data;
  }

  // Notifications endpoints
  async getNotifications(params?: { unreadOnly?: boolean }) {
    const response = await this.api.get('/notifications', { params });
    return response.data;
  }

  async getUnreadNotificationsCount() {
    const response = await this.api.get('/notifications/unread-count');
    return response.data;
  }

  async markNotificationAsRead(id: string) {
    const response = await this.api.put(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await this.api.put('/notifications/mark-all-read');
    return response.data;
  }

  async deleteNotification(id: string) {
    const response = await this.api.delete(`/notifications/${id}`);
    return response.data;
  }

  // Proofs endpoints
  async uploadProof(data: {
    projectId: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    notes?: string;
    isFinal?: boolean;
  }) {
    const response = await this.api.post('/proofs', data);
    return response.data;
  }

  async getProofsByProject(projectId: string) {
    const response = await this.api.get(`/proofs/project/${projectId}`);
    return response.data;
  }

  async getProofById(id: string) {
    const response = await this.api.get(`/proofs/${id}`);
    return response.data;
  }

  async deleteProof(id: string) {
    const response = await this.api.delete(`/proofs/${id}`);
    return response.data;
  }

  // Reviews & Annotations endpoints
  async createAnnotation(data: {
    proofId: string;
    type: string;
    coordinates: string;
    comment?: string;
  }) {
    const response = await this.api.post('/reviews/annotations', data);
    return response.data;
  }

  async getAnnotationsByProof(proofId: string) {
    const response = await this.api.get(`/reviews/annotations/proof/${proofId}`);
    return response.data;
  }

  async updateAnnotation(id: string, data: { comment?: string; status?: string }) {
    const response = await this.api.patch(`/reviews/annotations/${id}`, data);
    return response.data;
  }

  async deleteAnnotation(id: string) {
    const response = await this.api.delete(`/reviews/annotations/${id}`);
    return response.data;
  }

  async submitReview(data: {
    projectId: string;
    proofId: string;
    decision: 'approved' | 'changes_requested';
    comment?: string;
    changeRequests?: string;
  }) {
    const response = await this.api.post('/reviews', data);
    return response.data;
  }

  async getReviewsByProject(projectId: string) {
    const response = await this.api.get(`/reviews/project/${projectId}`);
    return response.data;
  }

  // Approvals endpoints
  async createApproval(data: {
    projectId: string;
    status: 'approved' | 'rejected';
    comment?: string;
  }) {
    const response = await this.api.post('/approvals', data);
    return response.data;
  }

  async getApprovalsByProject(projectId: string) {
    const response = await this.api.get(`/approvals/project/${projectId}`);
    return response.data;
  }

  async getApprovalById(id: string) {
    const response = await this.api.get(`/approvals/${id}`);
    return response.data;
  }

  // Print Jobs endpoints
  async getPrintJobs(params?: { status?: string }) {
    const response = await this.api.get('/print-jobs', { params });
    return response.data;
  }

  async getReadyForPrint() {
    const response = await this.api.get('/print-jobs/ready');
    return response.data;
  }

  async createPrintJob(data: {
    projectId: string;
    notes?: string;
    estimatedFinish?: string;
  }) {
    const response = await this.api.post('/print-jobs', data);
    return response.data;
  }

  async updatePrintJob(id: string, data: {
    status?: string;
    notes?: string;
  }) {
    const response = await this.api.patch(`/print-jobs/${id}`, data);
    return response.data;
  }

  async getPrintJobById(id: string) {
    const response = await this.api.get(`/print-jobs/${id}`);
    return response.data;
  }

  // Pickup Logs endpoints
  async getPickupLogs() {
    const response = await this.api.get('/pickup-logs');
    return response.data;
  }

  async createPickupLog(data: {
    projectId: string;
    takerName: string;
    takerInstitution?: string;
    takerPhone?: string;
    notes?: string;
  }) {
    const response = await this.api.post('/pickup-logs', data);
    return response.data;
  }

  async getPickupLogsByProject(projectId: string) {
    const response = await this.api.get(`/pickup-logs/project/${projectId}`);
    return response.data;
  }

  async getPickupLogById(id: string) {
    const response = await this.api.get(`/pickup-logs/${id}`);
    return response.data;
  }

  async updatePickupLog(id: string, data: {
    takerName?: string;
    takerInstitution?: string;
    takerPhone?: string;
    notes?: string;
  }) {
    const response = await this.api.patch(`/pickup-logs/${id}`, data);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/types';
import { apiService } from '@/services/api.service';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

/**
 * Custom hooks for projects with React Query caching
 */

// Cache keys
const PROJECT_KEYS = {
  all: ['projects'] as const,
  lists: () => [...PROJECT_KEYS.all, 'list'] as const,
  list: (filters?: any) => [...PROJECT_KEYS.lists(), { filters }] as const,
  details: () => [...PROJECT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PROJECT_KEYS.details(), id] as const,
};

/**
 * Get all projects accessible to current user
 * Auto-refetch every 5 minutes, can also trigger manual refresh
 */
export function useProjects(filters?: { status?: string; type?: string }) {
  const { user } = useAuth();

  return useQuery<Project[]>({
    queryKey: PROJECT_KEYS.list(filters),
    queryFn: async () => {
      const response = await apiService.getProjects(filters);
      return response.projects;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

// useProject dipindahkan ke file terpisah: useProject.ts

/**
 * Create new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, any>({
    mutationFn: async (projectData: any) => {
      const response = await apiService.createProject(projectData);
      return response.project;
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() });
      queryClient.setQueryData(PROJECT_KEYS.detail(newProject.id), newProject);
      toast.success('Proyek berhasil dibuat');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal membuat proyek');
    },
  });
}

/**
 * Update project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, { id: string; updates: any }>({
    mutationFn: async ({ id, updates }) => {
      const response = await apiService.updateProject(id, updates);
      return response.project;
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(PROJECT_KEYS.detail(updatedProject.id), updatedProject);
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() });
      toast.success('Proyek berhasil diupdate');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal update proyek');
    },
  });
}

/**
 * Delete project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (projectId: string) => {
      await apiService.deleteProject(projectId);
    },
    onSuccess: (_, projectId) => {
      queryClient.removeQueries({ queryKey: PROJECT_KEYS.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() });
      toast.success('Proyek berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal menghapus proyek');
    },
  });
}

/**
 * Change project status
 */
export function useChangeProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, { projectId: string; status: string }>({
    mutationFn: async ({ projectId, status }) => {
      const response = await apiService.updateProject(projectId, { status });
      return response.project;
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(PROJECT_KEYS.detail(updatedProject.id), updatedProject);
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() });
      toast.success(`Status proyek diupdate`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal update status');
    },
  });
}

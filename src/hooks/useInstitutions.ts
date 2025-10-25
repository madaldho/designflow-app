import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Institution } from '@/types';
import { apiService } from '@/services/api.service';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

/**
 * Custom hooks for institutions with React Query caching
 */

// Cache keys
const INSTITUTION_KEYS = {
  all: ['institutions'] as const,
  lists: () => [...INSTITUTION_KEYS.all, 'list'] as const,
  list: (filters?: any) => [...INSTITUTION_KEYS.lists(), { filters }] as const,
  details: () => [...INSTITUTION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...INSTITUTION_KEYS.details(), id] as const,
};

/**
 * Get all institutions
 */
export function useInstitutions() {
  const { user } = useAuth();

  return useQuery<Institution[]>({
    queryKey: INSTITUTION_KEYS.lists(),
    queryFn: async () => {
      const response = await apiService.getInstitutions();
      return response.institutions;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes - institutions don't change often
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Get single institution by ID
 */
export function useInstitution(institutionId: string) {
  const { user } = useAuth();

  return useQuery<Institution>({
    queryKey: INSTITUTION_KEYS.detail(institutionId),
    queryFn: async () => {
      const response = await apiService.getInstitutionById(institutionId);
      return response.institution;
    },
    enabled: !!user && !!institutionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Create new institution
 */
export function useCreateInstitution() {
  const queryClient = useQueryClient();

  return useMutation<Institution, Error, any>({
    mutationFn: async (institutionData: any) => {
      const response = await apiService.createInstitution(institutionData);
      return response.institution;
    },
    onSuccess: (newInstitution) => {
      queryClient.invalidateQueries({ queryKey: INSTITUTION_KEYS.lists() });
      queryClient.setQueryData(INSTITUTION_KEYS.detail(newInstitution.id), newInstitution);
      toast.success('Institution berhasil dibuat');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal membuat institution');
    },
  });
}

/**
 * Update institution
 */
export function useUpdateInstitution() {
  const queryClient = useQueryClient();

  return useMutation<Institution, Error, { id: string; updates: any }>({
    mutationFn: async ({ id, updates }) => {
      const response = await apiService.updateInstitution(id, updates);
      return response.institution;
    },
    onSuccess: (updatedInstitution) => {
      queryClient.setQueryData(INSTITUTION_KEYS.detail(updatedInstitution.id), updatedInstitution);
      queryClient.invalidateQueries({ queryKey: INSTITUTION_KEYS.lists() });
      toast.success('Institution berhasil diupdate');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal update institution');
    },
  });
}

/**
 * Delete institution
 */
export function useDeleteInstitution() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (institutionId: string) => {
      await apiService.deleteInstitution(institutionId);
    },
    onSuccess: (_, institutionId) => {
      queryClient.removeQueries({ queryKey: INSTITUTION_KEYS.detail(institutionId) });
      queryClient.invalidateQueries({ queryKey: INSTITUTION_KEYS.lists() });
      toast.success('Institution berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal menghapus institution');
    },
  });
}

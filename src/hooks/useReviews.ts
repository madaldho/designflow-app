import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export interface ReviewData {
  projectId: string;
  decision: 'approved' | 'changes_requested';
  comments?: string;
  annotations?: any[];
}

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReviewData) => {
      const response = await api.post('/reviews', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      
      if (variables.decision === 'approved') {
        toast.success('Proyek berhasil disetujui!');
      } else {
        toast.success('Revisi berhasil diminta!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal membuat review');
    },
  });
};

export const useApproveForPrint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await api.post(`/projects/${projectId}/approve-for-print`);
      return response.data;
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
      toast.success('Proyek disetujui untuk cetak!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal approve untuk cetak');
    },
  });
};

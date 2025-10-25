import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface PrintJob {
  id: string;
  projectId: string;
  status: 'queued' | 'in_progress' | 'completed' | 'ready';
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  project?: any;
}

export const usePrintJobs = (status?: string) => {
  return useQuery({
    queryKey: ['printJobs', status],
    queryFn: async () => {
      try {
        const params = status ? `?status=${status}` : '';
        const response = await api.get(`/print-jobs${params}`);
        return response.data.printJobs || [];
      } catch (error) {
        console.error('Error fetching print jobs:', error);
        return [];
      }
    },
  });
};

export const useUpdatePrintJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PrintJob> }) => {
      const response = await api.patch(`/print-jobs/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printJobs'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useCreatePickupLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { projectId: string; takerName: string; picName?: string; notes?: string }) => {
      const response = await api.post('/pickup-logs', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printJobs'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

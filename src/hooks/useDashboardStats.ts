import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api.service';

// Cache keys
const STATS_KEYS = {
  all: ['stats'] as const,
  dashboard: () => [...STATS_KEYS.all, 'dashboard'] as const,
};

/**
 * Get dashboard statistics
 */
export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: STATS_KEYS.dashboard(),
    queryFn: async () => {
      const response = await apiService.getDashboardStats();
      return response.stats;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

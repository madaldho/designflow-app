import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity } from '@/types';
import { apiService } from '@/services/api.service';
import { useAuth } from '@/contexts/AuthContext';

// Cache keys
const ACTIVITY_KEYS = {
  all: ['activities'] as const,
  lists: () => [...ACTIVITY_KEYS.all, 'list'] as const,
  list: (limit?: number) => [...ACTIVITY_KEYS.lists(), { limit }] as const,
};

/**
 * Get recent activities
 */
export function useActivities(limit: number = 10) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ACTIVITY_KEYS.list(limit),
    queryFn: async () => {
      const response = await apiService.getActivities({ limit });
      return response.activities;
    },
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time feel
  });
}

/**
 * Invalidate activities cache (useful after mutations)
 */
export function useInvalidateActivities() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.all });
  };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: string | null;
  read: boolean;
  readAt?: Date | null;
  createdAt: Date;
}

// Cache keys
const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  lists: () => [...NOTIFICATION_KEYS.all, 'list'] as const,
  list: (filters?: any) => [...NOTIFICATION_KEYS.lists(), { filters }] as const,
  unreadCount: () => [...NOTIFICATION_KEYS.all, 'unread-count'] as const,
};

/**
 * Get user notifications
 */
export function useNotifications(unreadOnly?: boolean) {
  const { user } = useAuth();

  return useQuery<Notification[]>({
    queryKey: NOTIFICATION_KEYS.list({ unreadOnly }),
    queryFn: async () => {
      const response = await apiService.getNotifications({ unreadOnly });
      return response.notifications;
    },
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000, // Refetch every minute
    refetchOnWindowFocus: true,
  });
}

/**
 * Get unread notifications count
 */
export function useUnreadNotificationsCount() {
  const { user } = useAuth();

  return useQuery<number>({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: async () => {
      const response = await apiService.getUnreadNotificationsCount();
      return response.count;
    },
    enabled: !!user,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000, // Refetch every minute
    refetchOnWindowFocus: true,
  });
}

/**
 * Mark notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (notificationId: string) => {
      const response = await apiService.markNotificationAsRead(notificationId);
      return response.notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount() });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal menandai notifikasi sebagai dibaca');
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await apiService.markAllNotificationsAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount() });
      toast.success('Semua notifikasi ditandai sebagai dibaca');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal menandai semua notifikasi');
    },
  });
}

/**
 * Delete notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (notificationId: string) => {
      await apiService.deleteNotification(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount() });
      toast.success('Notifikasi dihapus');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal menghapus notifikasi');
    },
  });
}

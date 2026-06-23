import api from './api';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  category: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationFeed {
  items: AppNotification[];
  unreadCount: number;
}

export const getNotifications = async (): Promise<NotificationFeed> => {
  const response = await api.get<NotificationFeed>('/Notifications');
  return response.data;
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await api.put(`/Notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.put('/Notifications/read-all');
};
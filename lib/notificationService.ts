// import apiClient from './apiClient';
import { Notification } from '@/types/notification';

const API_BASE_URL = 'http://localhost:5000/api';

export interface PaginatedNotifications {
  notifications: Notification[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const getMyNotifications = async (locale: string, token: string, page = 1, pageSize = 10): Promise<PaginatedNotifications> => {
  const params = new URLSearchParams({
    Page: page.toString(),
    PageSize: pageSize.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/Notification/my-notifications?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Accept-Language': locale,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  const result = await response.json();
  return result.data;
};

export const markNotificationAsRead = async (locale: string, token: string, notificationId: number): Promise<void> => {
  const response =  await fetch(`${API_BASE_URL}/Notification/${notificationId}/mark-as-read`, {
    method: 'POST',
    headers: {
      'Accept-Language': locale,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  console.log(response)

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to mark notification as read:', errorText);
    throw new Error(`Failed to mark notification as read: ${response.statusText}`);
  }
};

export const markAllNotificationsAsRead = async (locale: string, token: string): Promise<void> => {
  console.log(token)
  const response = await fetch(`${API_BASE_URL}/Notification/mark-all-as-read`, {
    method: 'POST',
    headers: {
      'Accept-Language': locale,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to mark all notifications as read:', errorText);
    throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
  }
};

export const getUnreadNotificationsCount = async (locale: string, token: string): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/Notification/unread-count`, {
    method: 'GET',
    headers: {
      'Accept-Language': locale,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch unread notifications count');
  }

  const result = await response.json();
  return result.data.unreadCount;
}; 
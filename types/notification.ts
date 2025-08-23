export interface Notification {
  id: number;
  title: string;
  body: string;
  imageUrl: string | null;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
  notificationType: string;
} 
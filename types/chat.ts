export interface User {
  id: number;
  name: string;
  phoneNumber: string;
  profilePhotoUrl: string | null;
}

export interface Message {
  id: number;
  message: string;
  date: string;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  readDate: string | null;
}

export interface Chat {
  id: number;
  user: User;
  lastMessage?: {
    id: number;
    message: string;
    date: string;
    senderId: number;
    receiverId: number;
    isRead: boolean;
    readDate: string | null;
  };
  unreadCount?: number;
} 
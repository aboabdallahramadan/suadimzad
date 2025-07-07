export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  participants: ChatUser[];
  lastMessage?: Message;
  lastMessageTime?: Date;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatPreview {
  id: string;
  otherUser: ChatUser;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
} 
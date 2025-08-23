
export interface ChatResponse {
  success: boolean;
  data: {
    id: number;
    user: {
      id: number;
      name: string;
      phoneNumber: string;
      profilePhotoUrl: string | null;
    };
  };
  message: string;
}

export interface MessagesResponse {
  success: boolean;
  data: {
    messages: {
      id: number;
      message: string;
      date: string;
      senderId: number;
      receiverId: number;
      isRead: boolean;
      readDate: string | null;
    }[];
    hasMore: boolean;
    lastMessageId: number;
  };
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    id: number;
    message: string;
    date: string;
    senderId: number;
    receiverId: number;
    isRead: boolean;
    readDate: null;
  };
  message: string;
}

const getHeaders = (token: string, locale: string) => {

  return {
    'Authorization': `Bearer ${token}`,
    'Accept-Language': locale,
    'Content-Type': 'application/json',
  };
};

export const getOrCreateChatWithUser = async (userId: number, token: string, locale: string): Promise<ChatResponse> => {
  try {
    const response = await fetch(`http://alaamohamad-001-site1.qtempurl.com/api/Chat/with-user/${userId}`, {
      method: 'GET',
      headers: getHeaders(token, locale),
    });

    if (!response.ok) {
      throw new Error('Failed to get chat');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error getting chat:', error);
    throw error;
  }
};

export const getChatMessages = async (
  chatId: number,
  token: string,
  locale: string,
  lastMessageId?: number,
  pageSize: number = 20
): Promise<MessagesResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (lastMessageId) queryParams.append('lastMessageId', lastMessageId.toString());
    if (pageSize) queryParams.append('pageSize', pageSize.toString());
    const url = `http://alaamohamad-001-site1.qtempurl.com/api/Chat/${chatId}/messages?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token, locale),
    });

    if (!response.ok) {
      throw new Error('Failed to get messages');
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

export const sendMessage = async (chatId: number, message: string, token: string, locale: string): Promise<SendMessageResponse> => {
  try {
    const response = await fetch(`http://alaamohamad-001-site1.qtempurl.com/api/Chat/${chatId}/send`, {
      method: 'POST',
      headers: getHeaders(token, locale),
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}; 
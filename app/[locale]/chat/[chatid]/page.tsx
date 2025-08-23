"use client";
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, Send } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Chat, Message } from '@/types/chat';
import { getChatMessages, sendMessage, getOrCreateChatWithUser } from '@/app/services/chatService';
import { getCookie } from 'cookies-next';
import { useAuth } from '@/lib/auth-context';

export default function ChatPage() {
  const t = useTranslations();
  const params = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<number | undefined>(undefined);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { getToken, user } = useAuth();
  const locale = useLocale();

  // Get current user ID from auth context
  const currentUserId = user?.id;

  // Fetch chat data
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // If the URL contains a userId instead of a chatId, we need to get or create a chat
        const chatParam = params.chatid as string;
        // if (chatParam && typeof chatParam === 'string' && chatParam.startsWith('user-')) {
        const userId = parseInt(chatParam.replace('user-', ''), 10);
        const response = await getOrCreateChatWithUser(userId, getToken(), locale);

        if (response.success) {
          setChat(response.data);
        } else {
          setError(response.message);
        }
        // }
      } catch (error) {
        setError(t('chat.errorLoadingChat'));
        console.error('Failed to load chat:', error);
      }
    };

    fetchChatData();
  }, [params.chatid, t]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chat) return;
      try {
        setLoading(true);
        const response = await getChatMessages(chat.id, getToken(), locale);

        if (response.success) {
          // Sort messages by timestamp from oldest to newest
          const sortedMessages = [...response.data.messages].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setMessages(sortedMessages);
          setHasMore(response.data.hasMore);
          setLastMessageId(response.data.lastMessageId);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError(t('chat.errorLoading'));
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chat, t]);

  // Load more messages
  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const response = await getChatMessages(chat.id, getToken(), locale, lastMessageId);

      if (response.success) {
        setMessages(prevMessages => [...prevMessages, ...response.data.messages]);
        setHasMore(response.data.hasMore);
        setLastMessageId(response.data.lastMessageId);
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setLoading(false);
    }
  }, [chat, hasMore, lastMessageId, loading]);

  // Handle scroll to load more messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !chat) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !loading) {
        loadMoreMessages();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadMoreMessages, loading, chat]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [loading]);

  // Format time display
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return t('chat.now');
    if (minutes < 60) return t('chat.minutesAgo', { minutes });
    if (hours < 24) return t('chat.hoursAgo', { hours });
    if (days === 1) return t('chat.yesterday');
    return t('chat.daysAgo', { days });
  };

  // Send message
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || sending) return;

    try {
      setSending(true);
      const response = await sendMessage(chat.id, newMessage.trim(), getToken(), locale);

      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(t('chat.errorSending'));
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get other user from chat
  const getOtherUser = () => {
    if (!chat) return null;
    return chat.user;
  };

  const otherUser = getOtherUser();

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as { [key: string]: Message[] });

  if (error) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <p className="text-red-600">{error}</p>
          <Link href="/chats" className="mt-4 block text-center bg-primary-accent text-white py-2 px-4 rounded">
            {t('common.backToChats')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/chats" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {otherUser?.profilePhotoUrl ? (
                      <img
                        src={`http://alaamohamad-001-site1.qtempurl.com/uploads/${otherUser.profilePhotoUrl}`}
                        alt={otherUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                <div>
                  <h1 className="font-semibold text-gray-900">{otherUser?.name || t('chat.loading')}</h1>
                  {otherUser?.phoneNumber && (
                    <p className="text-xs text-gray-500">{otherUser.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto"
        ref={messagesContainerRef}
      >
        <div className="container mx-auto max-w-4xl p-4">
          {loading && messages.length === 0 ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent"></div>
            </div>
          ) : (
            <>
              {hasMore && (
                <div className="flex justify-center mb-4">
                  <button
                    onClick={loadMoreMessages}
                    disabled={loading}
                    className="text-sm text-primary-accent hover:underline"
                  >
                    {loading ? t('chat.loading') : t('chat.loadMore')}
                  </button>
                </div>
              )}

              {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                <div key={date} className="mb-6">
                  {/* Date divider */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-xs text-gray-600">
                        {new Date(date).toLocaleDateString(getCookie('NEXT_LOCALE') as string || 'en', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Messages for this date */}
                  {dayMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${message.senderId === currentUserId ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`p-3 rounded-lg ${message.senderId === currentUserId
                            ? 'bg-primary-accent text-white'
                            : 'bg-white border border-gray-200'
                            }`}
                        >
                          <p className="text-sm wrap-anywhere">{message.message}</p>
                          <div className={`flex items-center gap-1 mt-1 ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-xs ${message.senderId === currentUserId ? 'text-white/70' : 'text-gray-500'}`}>
                              {formatTime(message.date)}
                            </span>
                            {message.isRead && message.senderId === currentUserId && (
                              <span className="text-xs text-white/70">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.typeMessage')}
                disabled={sending}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent resize-none"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={newMessage.trim() === '' || sending}
              className={`p-2 rounded-full transition-colors ${newMessage.trim() === '' || sending
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-accent text-white hover:bg-primary-dark'
                }`}
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
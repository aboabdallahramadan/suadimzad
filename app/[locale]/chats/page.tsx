"use client";
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { User, ArrowLeft, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
interface ChatUser {
  id: number;
  name: string;
  phoneNumber: string;
  profilePhotoUrl: string | null;
}

interface ChatResponse {
  success: boolean;
  data: {
    id: number;
    user: ChatUser;
  }[];
  message: string;
}

interface ChatPreview {
  id: number;
  otherUser: ChatUser;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export default function ChatsPage() {
  const t = useTranslations();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { getToken } = useAuth();
  const locale = useLocale();

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);

        const token = getToken();
        const acceptLanguage = locale || 'en';

        if (typeof token !== 'string') {
          throw new Error('Invalid authentication token');
        }

        const response = await fetch('http://localhost:5000/api/chat/my-chats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept-Language': acceptLanguage as string,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }

        const data: ChatResponse = await response.json();
        console.log(data);

        if (data.success) {
          // Transform API response to our ChatPreview format
          const chatPreviews = data.data.map((chat) => {
            return {
              id: chat.id,
              otherUser: chat.user,
              // These fields are not available in the new API
              lastMessage: undefined,
              lastMessageTime: undefined,
              unreadCount: 0
            };
          });

          setChats(chatPreviews);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(t('chat.errorLoadingChats'));
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [t]);

  // Format time
  const formatTime = (dateStr: string | undefined) => {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else if (days === 1) {
      return t('chat.yesterday');
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Filter chats based on search query
  const filteredChats = searchQuery
    ? chats.filter(chat =>
      chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : chats;

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="font-semibold text-lg text-gray-900">{t('chat.messages')}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
              placeholder={t('chat.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary-accent hover:underline"
              >
                {t('common.retry')}
              </button>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                {searchQuery ? t('chat.noSearchResults') : t('chat.noChats')}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredChats.map((chat) => (
                <li key={chat.id}>
                  <Link href={`/chat/${chat.otherUser.id}`} className="block hover:bg-gray-50 transition-colors">
                    <div className="p-4">
                      <div className="flex items-center">
                        {/* Avatar */}
                        <div className="mr-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {chat.otherUser.profilePhotoUrl ? (
                                <img
                                  src={`http://localhost:5000/uploads/${chat.otherUser.profilePhotoUrl}`}
                                  alt={chat.otherUser.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            {chat.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 bg-primary-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between">
                            <h2 className="text-base font-semibold text-gray-900 truncate">
                              {chat.otherUser.name}
                            </h2>
                            {chat.lastMessageTime && (
                              <span className="text-xs text-gray-500">
                                {formatTime(chat.lastMessageTime)}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-600 truncate">
                            {chat.lastMessage || t('chat.noMessages')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 
"use client";
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { MessageCircle, Search, MoreVertical, Clock, Check, CheckCheck, User } from 'lucide-react';
import { ChatPreview } from '@/types/chat';

// Mock data for chats
const mockChats: ChatPreview[] = [
  {
    id: '1',
    otherUser: {
      id: '2',
      name: 'Ahmed Mohammed',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    },
    lastMessage: 'Is this item still available? I am interested in buying it.',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    unreadCount: 2,
  },
  {
    id: '2',
    otherUser: {
      id: '3',
      name: 'Sara Al-Rashid',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    },
    lastMessage: 'Thank you for the information. I will contact you tomorrow.',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 0,
  },
  {
    id: '3',
    otherUser: {
      id: '4',
      name: 'Khaled Ibrahim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    },
    lastMessage: 'Can we meet at 3 PM today?',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 1,
  },
  {
    id: '4',
    otherUser: {
      id: '5',
      name: 'Fatima Al-Zahra',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',  
    },
    lastMessage: 'I have sent you the details via email.',
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    unreadCount: 0,

  },
  {
    id: '5',
    otherUser: {
      id: '6',
      name: 'Omar Hassan',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',

    },
    lastMessage: 'The furniture is in excellent condition.',
    lastMessageTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    unreadCount: 0,

  }
];

export default function ChatsPage() {
  const t = useTranslations();
  const [chats] = useState<ChatPreview[]>(mockChats);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format time display
  const formatTime = (date: Date) => {
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

  // Get total unread count
  const totalUnreadCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="min-h-screen bg-primary-bg py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary-accent" />
                  {t('chat.title')}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  {totalUnreadCount > 0 
                    ? `${totalUnreadCount} ${t('chat.newMessage')}`
                    : t('chat.noChats')
                  }
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('chat.searchChats')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
              />
            </div>
          </div>

          {/* Chats List */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent"></div>
                <span className="ml-3 text-gray-600">{t('chat.loading')}</span>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-16 px-4">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No chats found' : t('chat.noChats')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'Try adjusting your search terms' : t('chat.noChatsDesc')}
                </p>
                {!searchQuery && (
                  <Link
                    href="/categories"
                    className="inline-flex items-center px-4 py-2 bg-primary-accent text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Browse Ads
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                            {chat.otherUser.avatar ? (
                              <img
                                src={chat.otherUser.avatar}
                                alt={chat.otherUser.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                            )}
                          </div>

                        </div>

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {chat.otherUser.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              {chat.lastMessageTime && (
                                <>
                                  <Clock className="w-3 h-3" />
                                  {formatTime(chat.lastMessageTime)}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Last Message */}
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm text-gray-600 truncate flex-1">
                                {chat.lastMessage}
                              </p>
                            {chat.unreadCount > 0 && (
                              <span className="flex-shrink-0 w-5 h-5 bg-primary-accent text-white text-xs rounded-full flex items-center justify-center">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
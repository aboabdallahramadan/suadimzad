"use client";
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Bell, Filter, Search, Loader2 } from 'lucide-react';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/notificationService';
import { Notification } from '@/types/notification';
import { useAuth } from '@/lib/auth-context';

export default function NotificationsPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const locale = useLocale();
  const { getToken } = useAuth();
  const fetchNotifications = async (reset = false) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      console.log(getToken())
      const data = await getMyNotifications(locale, getToken(), currentPage, 20);
      setNotifications(prev => (reset ? data.notifications : [...prev, ...data.notifications]));
      setHasMore(data.notifications.length === 20);
      if (reset) setPage(2);
      else setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(true);
  }, [user]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' ||
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'read' && notification.isRead);

    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.body.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(locale, getToken(), id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(locale, getToken());
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-primary-bg py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-primary-accent" />
                  {t('notifications.title')}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications are read'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-accent bg-primary-accent/10 rounded-lg hover:bg-primary-accent/20 transition-colors"
                >
                  {t('notifications.markAllRead')}
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
                />
              </div>

              <div className="relative sm:w-auto">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent w-full sm:w-auto"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {isLoading && notifications.length === 0 ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-primary-accent animate-spin mx-auto" />
              <p className="mt-4 text-lg text-gray-600">Loading notifications...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              {filteredNotifications.length === 0 ? (
                <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                  <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 font-medium text-base sm:text-lg">{t('notifications.noNotifications')}</p>
                  <p className="text-gray-400 text-sm sm:text-base mt-1 sm:mt-2">{t('notifications.noNotificationsDesc')}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : ''}`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`p-2 sm:p-3 rounded-full bg-blue-50 flex-shrink-0`}>
                          <Bell className={`w-4 h-4 sm:w-5 sm:h-5 text-primary-accent`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2">
                              <h3 className={`text-sm sm:text-base font-medium text-gray-900 ${!notification.isRead ? 'font-semibold' : ''}`}>
                                {notification.title}
                                {!notification.isRead && (
                                  <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                                )}
                              </h3>
                              <p className="text-sm sm:text-base text-gray-600 mt-1 leading-relaxed">
                                {notification.body}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 ml-2 sm:ml-4">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="px-2 sm:px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors whitespace-nowrap"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {hasMore && !isLoading && (
            <div className="text-center mt-6">
              <button
                onClick={() => fetchNotifications()}
                className="bg-primary-accent text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
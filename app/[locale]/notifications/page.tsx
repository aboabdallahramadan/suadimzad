"use client";
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Bell, Filter, Search, Trash } from 'lucide-react';

// Extended notifications data
const allNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'New message from Ahmad',
    description: 'Interested in your Toyota Camry listing. "Is this still available? Can we meet tomorrow?"',
    time: '2 minutes ago',
    isRead: false,
    icon: Bell,
    iconColor: 'text-primary-accent',
    bgColor: 'bg-blue-50'
  },
  {
    id: 2,
    type: 'like',
    title: 'Someone liked your ad',
    description: 'Your "iPhone 14 Pro" listing received a new like from Sara M.',
    time: '15 minutes ago',
    isRead: false,
    icon: Bell,
    iconColor: 'text-primary-accent',
    bgColor: 'bg-blue-50'
  },
  {
    id: 3,
    type: 'view',
    title: 'Ad performance update',
    description: 'Your apartment listing has 25 new views today and 3 contact requests.',
    time: '1 hour ago',
    isRead: true,
    icon: Bell,
    iconColor: 'text-primary-accent',
    bgColor: 'bg-blue-50'
  },
  {
    id: 4,
    type: 'system',
    title: 'Premium feature unlocked',
    description: 'You can now use advanced search filters and priority listing features.',
    time: '3 hours ago',
    isRead: true,
    icon: Bell,
    iconColor: 'text-primary-accent',
    bgColor: 'bg-blue-50'
  },
  {
    id: 5,
    type: 'payment',
    title: 'Payment successful',
    description: 'Your premium listing package is now active. Your ads will appear at the top.',
    time: '1 day ago',
    isRead: true,
    icon: Bell,
    iconColor: 'text-primary-accent',
    bgColor: 'bg-blue-50'
  },
  {
    id: 6,
    type: 'message',
    title: 'New message from Khalid',
    description: 'Question about your furniture set: "What is the condition of the sofa?"',
    time: '2 days ago',
    isRead: true,
    icon: Bell,
    iconColor: 'text-primary-accent',
    bgColor: 'bg-blue-50'
  },
  {
    id: 7,
    type: 'like',
    title: 'Multiple likes received',
    description: 'Your "Gaming Setup" ad received 5 new likes in the last hour.',
    time: '2 days ago',
    isRead: true,
    icon: Bell,
    iconColor: 'text-primary-accent',
    bgColor: 'bg-blue-50'
  }
];

export default function NotificationsPage() {
  const t = useTranslations();
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.isRead) ||
                         (filter === 'read' && notification.isRead) ||
                         notification.type === filter;
    
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
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
                  onClick={markAllAsRead}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-accent bg-primary-accent/10 rounded-lg hover:bg-primary-accent/20 transition-colors"
                >
                  {t('notifications.markAllRead')}
                </button>
                <button
                  onClick={clearAllNotifications}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  {t('notifications.clearAll')}
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              {/* Search */}
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

              {/* Filter */}
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

          {/* Notifications List */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-500 font-medium text-base sm:text-lg">{t('notifications.noNotifications')}</p>
                <p className="text-gray-400 text-sm sm:text-base mt-1 sm:mt-2">{t('notifications.noNotificationsDesc')}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`relative px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`p-2 sm:p-3 rounded-full ${notification.bgColor} flex-shrink-0`}>
                          <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${notification.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2">
                              <h3 className={`text-sm sm:text-base font-medium text-gray-900 ${
                                !notification.isRead ? 'font-semibold' : ''
                              }`}>
                                {notification.title}
                                {!notification.isRead && (
                                  <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                                )}
                              </h3>
                              <p className="text-sm sm:text-base text-gray-600 mt-1 leading-relaxed">
                                {notification.description}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3">
                                {notification.time}
                              </p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 ml-2 sm:ml-4">
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="px-2 sm:px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors whitespace-nowrap"
                                >
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                              >
                                <Trash className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
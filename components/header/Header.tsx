'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Bell, User, Menu, X, Heart, LogIn, LayoutGrid, MessageCircle } from 'lucide-react';
import { MobileMenu } from '../MobileMenu';
import { LanguageToggle } from '../LanguageToggle';
import SearchBar from './SearchBar';

// Sample notifications data
const sampleNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'New message from Ahmad',
    description: 'Interested in your Toyota Camry listing',
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
    description: 'Your "iPhone 14 Pro" listing received a new like',
    time: '15 minutes ago',
    isRead: false,
    icon: Bell,
    iconColor: 'text-primary-accent',
    bgColor: 'bg-blue-50'
  },
  {
    id: 3,
    type: 'sale',
    title: 'Ad performance update',
    description: 'Your apartment listing has 25 new views today',
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
    description: 'You can now use advanced search filters',
    time: '3 hours ago',
    isRead: true,
    icon: Bell,
    iconColor: 'text-primary-accent',
    bgColor: 'bg-blue-50'
  },
  {
    id: 5,
    type: 'order',
    title: 'Payment successful',
    description: 'Your premium listing package is now active',
    time: '1 day ago',
    isRead: true,
    icon: Bell,
    iconColor: 'text-primary-accent',
    bgColor: 'bg-blue-50'
  }
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  // Mock user data (you can replace this with actual user data from context/state)
  const isLoggedIn = true; // Change this based on actual authentication state
  const currentUser = {
    name: 'Ahmed Al-Mansouri',
    phone: '+974 5555 1234'
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <header className="bg-white shadow-sm relative z-50">
        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-12'>
              {/* Logo */}
              <Link href={`/`} className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Mzad Qatar"
                  width={120}
                  height={40}
                  className="h-14 w-auto"
                />
              </Link>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-6">
              {/* Categories Button */}
              <Link 
                href="/categories"
                className="text-gray-600 hover:text-primary-accent transition-colors cursor-pointer p-2 rounded-full hover:bg-gray-100"
              >
                <LayoutGrid className="w-6 h-6" />
              </Link>

              {/* Notification Button */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative text-gray-600 hover:text-primary-accent transition-colors cursor-pointer p-2 rounded-full hover:bg-gray-100"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-10 translate-x-1/2 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[80vh] sm:max-h-[70vh]">
                    {/* Header */}
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-primary-accent">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-white">{t('notifications.title')}</h3>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                              {unreadCount} {t('notifications.newCount')}
                            </span>
                          )}
                          <button
                            onClick={() => setIsNotificationOpen(false)}
                            className="text-white/80 hover:text-white transition-colors p-1"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {notifications.length > 0 && (
                      <div className="px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={markAllAsRead}
                            className="text-xs sm:text-sm text-primary-accent hover:text-primary-dark font-medium transition-colors"
                          >
                            {t('notifications.markAllRead')}
                          </button>
                          <button
                            onClick={clearAllNotifications}
                            className="text-xs sm:text-sm text-gray-500 hover:text-red-600 transition-colors"
                          >
                            {t('notifications.clearAll')}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Notifications List */}
                    <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
                          <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium text-sm sm:text-base">{t('notifications.noNotifications')}</p>
                          <p className="text-gray-400 text-xs sm:text-sm mt-1">{t('notifications.noNotificationsDesc')}</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => {
                            const IconComponent = notification.icon;
                            return (
                              <div
                                key={notification.id}
                                onClick={() => !notification.isRead && markAsRead(notification.id)}
                                className={`px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                  !notification.isRead ? 'bg-blue-50/50' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-full ${notification.bgColor} flex-shrink-0`}>
                                    <IconComponent className={`w-3 h-3 sm:w-4 sm:h-4 ${notification.iconColor}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <p className={`text-xs sm:text-sm font-medium text-gray-900 pr-2 ${
                                        !notification.isRead ? 'font-semibold' : ''
                                      }`}>
                                        {notification.title}
                                      </p>
                                      {!notification.isRead && (
                                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                                      )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                                      {notification.description}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                      {notification.time}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 sm:px-6 py-2 sm:py-3 border-t border-gray-200 bg-gray-50">
                        <Link
                          href="/notifications"
                          className="text-xs sm:text-sm text-primary-accent hover:text-primary-dark font-medium transition-colors block text-center"
                          onClick={() => setIsNotificationOpen(false)}
                        >
                          {t('notifications.viewAll')}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Button */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative text-gray-600 hover:text-primary-accent transition-colors cursor-pointer p-2 rounded-full hover:bg-gray-100"
                >
                  <User className="w-6 h-6" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute end-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    {isLoggedIn ? (
                      <>
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.phone}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4 text-primary-accent" />
                            {t('user.profile')}
                          </Link>
                          <Link
                            href="/chats"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <MessageCircle className="w-4 h-4 text-primary-accent" />
                            {t('user.chats')}
                          </Link>
                          <Link
                            href="/favorites"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="w-4 h-4 text-primary-accent" />
                            {t('user.favorites')}
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <Link
                          href="/login"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LogIn className="w-4 h-4 text-primary-accent" />
                          {t('user.login')}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Link href="/post-ad" className="hidden sm:block bg-primary-color text-white px-4 py-2 rounded-lg hover:text-primary-accent transition-colors font-bold cursor-pointer">
                {t('nav.postAd')}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-primary-accent transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <LanguageToggle />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="border-t border-gray-100">
          <div className="mx-auto py-4">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

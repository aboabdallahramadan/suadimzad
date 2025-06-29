"use client";
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { User, Phone, Calendar, Users, Heart, Share2, UserCheck } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { AdSmall } from '@/types/adSmall';

// Mock data
const currentUser = {
  id: 1,
  name: 'Ahmed Al-Mansouri', 
  phone: '+974 5555 1234',
  joinedDate: 'January 2023',
  followersCount: 45,
  followingCount: 12,
  adsCount: 23
};

const followingUsers = [
  {
    id: 2,
    name: 'Sara Al-Khalifa',
    phone: '+974 5555 5678',
    adsCount: 15,
    lastActive: '2 hours ago',
    isFollowing: true
  },
  {
    id: 3,
    name: 'Mohammed Al-Thani',
    phone: '+974 5555 9012',
    adsCount: 8,
    lastActive: '1 day ago',
    isFollowing: true
  }
];

const userAds: AdSmall[] = [
  {
    id: '1',
    title: 'Toyota Camry 2020 - Excellent Condition',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    comments: 27,
    likes: 5,
  },
  {
    id: '2',
    title: '3 Bedroom Apartment for Rent',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
    comments: 15,
    likes: 1,
  }
];

export default function ProfilePage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('info');
  const [following, setFollowing] = useState(followingUsers);

  const handleUnfollow = (userId: number) => {
    setFollowing(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: false }
          : user
      )
    );
  };

  return (
    <div className="min-h-screen bg-primary-bg py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-accent to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                    <p className="text-gray-600 mt-1">{t('user.joinedDate')} {currentUser.joinedDate}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <Share2 className="w-4 h-4" />
                      {t('profile.shareProfile')}
                    </button>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{currentUser.adsCount}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{t('user.myAds')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{currentUser.followersCount}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{t('user.followers')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{currentUser.followingCount}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{t('user.following')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg mb-6 overflow-hidden">
            <div className="flex border-b border-gray-200">
              {['info', 'following', 'ads'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 text-sm sm:text-base font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-primary-accent border-b-2 border-primary-accent bg-primary-accent/5'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'info' && t('user.userInfo')}
                  {tab === 'following' && t('user.followingUsers')}
                  {tab === 'ads' && t('user.myAds')}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            {/* User Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('user.userInfo')}</h2>
                
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-primary-accent" />
                    <div>
                      <p className="text-sm text-gray-500">{t('user.name')}</p>
                      <p className="font-medium text-gray-900">{currentUser.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-primary-accent" />
                    <div>
                      <p className="text-sm text-gray-500">{t('user.phoneNumber')}</p>
                      <p className="font-medium text-gray-900">{currentUser.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-accent" />
                    <div>
                      <p className="text-sm text-gray-500">{t('user.joinedDate')}</p>
                      <p className="font-medium text-gray-900">{currentUser.joinedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Following Tab */}
            {activeTab === 'following' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('user.followingUsers')}</h2>
                  <span className="text-sm text-gray-500">{following.filter(u => u.isFollowing).length} {t('user.following').toLowerCase()}</span>
                </div>
                
                {following.filter(u => u.isFollowing).length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium text-lg">{t('user.noFollowing')}</p>
                    <p className="text-gray-400 mt-2">{t('user.noFollowingDesc')}</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {following.filter(u => u.isFollowing).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-accent to-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.adsCount} {t('common.ads')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center flex-col sm:flex-row gap-2">
                          <Link
                            href={`/profile/${user.id}`}
                            className="px-3 py-1.5 text-xs sm:text-sm text-primary-accent bg-white border border-primary-accent rounded-lg hover:bg-primary-accent hover:text-white transition-colors"
                          >
                            {t('user.viewProfile')}
                          </Link>
                          <button
                            onClick={() => handleUnfollow(user.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm text-red-600 bg-white border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                          >
                            <UserCheck className="w-3 h-3" />
                            {t('user.unfollow')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Ads Tab */}
            {activeTab === 'ads' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('user.myAds')}</h2>
                  <Link
                    href="/post-ad"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-accent rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {t('nav.postAd')}
                  </Link>
                </div>

                <div className="flex gap-4 border-b border-gray-200">
                  <button className="px-4 py-2 text-sm font-medium text-primary-accent border-b-2 border-primary-accent">
                    {t('user.myAds')} ({userAds.length})
                  </button>
                </div>
                
                {userAds.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium text-lg">{t('user.noAds')}</p>
                    <p className="text-gray-400 mt-2">{t('user.noAdsDesc')}</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userAds.map((ad) => (
                      <Link href={`/ad/${ad.id}`} key={ad.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-[4/3] relative">
                            <img 
                            src={ad.image} 
                            alt={ad.title}
                            className="w-full h-full object-cover"
                            />
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{ad.title}</h3>
                          <p className="text-lg font-bold text-primary-accent mb-2">{ad.price}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{ad.comments} comments</span>
                            <span>{ad.likes} likes</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
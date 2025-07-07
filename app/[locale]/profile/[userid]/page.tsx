"use client";
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { User, Calendar, Users, Share2, UserPlus, UserCheck, Phone } from 'lucide-react';
import { useParams } from 'next/navigation';
import { AdSmall } from '@/types/adSmall';
import { Link } from '@/i18n/navigation';
import WatermarkedImgTag from '@/components/WatermarkedImgTag';

// Mock user data based on ID
const getUserData = (id: string) => {
  const users = {
    '2': {
      id: 2,
      name: 'Sara Al-Khalifa',
      phone: '+974 5555 5678',
      joinedDate: 'March 2023',
      followersCount: 28,
      followingCount: 15,
      adsCount: 12,
      isFollowing: false
    },
    '3': {
      id: 3,
      name: 'Mohammed Al-Thani',
      phone: '+974 5555 9012',
      joinedDate: 'February 2023',
      followersCount: 35,
      followingCount: 8,
      adsCount: 18,
      isFollowing: true
    }
  };
  
  return users[id as keyof typeof users] || {
    id: parseInt(id),
    name: 'Unknown User',
    phone: '+974 0000 0000',
    joinedDate: 'Unknown',
    followersCount: 0,
    followingCount: 0,
    adsCount: 0,
    isFollowing: false
  };
};

// Mock user ads
const getUserAds = (userId: string) => {
  const allAds: AdSmall[] = [
    {
      id: '1',
      title: 'Luxury Villa for Sale - 5 Bedrooms',
      price: 2500000,
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
      comments: 15,
      likes: 1,
    },
    {
      id: '2',
      title: 'Brand New Apartment for Rent',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
      comments: 15,
      likes: 1,
    },
    {
      id: '3',
      title: 'Mercedes S-Class 2022 - Premium',
      price: 285000,
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
      comments: 15,
      likes: 1,
    },
    {
      id: '4',
      title: 'Gaming Setup - Complete Package',
      price: 15500,
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
      comments: 15,
      likes: 1,
    }
  ];
  
    return allAds.filter(ad => ad.id <= userId);
};

export default function UserProfilePage() {
  const t = useTranslations();
  const params = useParams();
  const userId = params.userid as string;
  const [user, setUser] = useState(getUserData(userId));
  const userAds = getUserAds(userId);

  const handleFollowToggle = () => {
    setUser(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
    }));
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-gray-600 mt-1">{t('user.joinedDate')} {user.joinedDate}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleFollowToggle}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        user.isFollowing
                          ? 'text-red-600 bg-red-50 border border-red-600 hover:bg-red-100'
                          : 'text-white bg-primary-accent hover:bg-primary-dark'
                      }`}
                    >
                      {user.isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          {t('user.unfollow')}
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          {t('user.follow')}
                        </>
                      )}
                    </button>
                    
                    
                    <div className="relative">
                      <button onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: user.name,
                            text: `Check out this user: ${user.name}`,
                            url: window.location.href
                          }).catch(console.error);
                        } else {
                          navigator.clipboard.writeText(window.location.href).then(() => {
                            alert('Link copied to clipboard!');
                          }).catch(() => {
                            alert('Failed to copy link');
                          });
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{user.adsCount}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{t('common.ads')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{user.followersCount}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{t('user.followers')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{user.followingCount}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{t('user.following')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t('profile.userProfile')}</h2>
            
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-primary-accent" />
                <div>
                  <p className="text-sm text-gray-500">{t('user.name')}</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-primary-accent" />
                <div>
                    <p className="text-sm text-gray-500">{t('user.phoneNumber')}</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
                </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary-accent" />
                <div>
                  <p className="text-sm text-gray-500">{t('user.joinedDate')}</p>
                  <p className="font-medium text-gray-900">{user.joinedDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Ads */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.name} {t('common.ads')}
              </h2>
              <span className="text-sm text-gray-500">{userAds.length} {t('common.ads')}</span>
            </div>
            
            {userAds.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg">{t('user.noAds')}</p>
                <p className="text-gray-400 mt-2">{t('user.noAdsDescUser')}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userAds.map((ad) => (
                    <Link href={`/ad/${ad.id}`}  key={ad.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gray-200 relative">
                        <div className="aspect-[4/3] relative">
                                                    <WatermarkedImgTag
                          src={ad.image}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                          watermarkPosition="bottom-right"
                          watermarkSize="medium"
                        />
                        </div>
                        </div>
                        
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{ad.title}</h3>
                            <p className="text-lg font-bold text-primary-accent mb-2">{ad.price}</p>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{ad.likes} {t('user.likes')}</span>
                            <span>{ad.comments} {t('user.comments')}</span>
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
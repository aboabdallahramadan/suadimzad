"use client";
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { User, Phone, Calendar, Users, Heart, Share2, UserCheck } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import WatermarkedImgTag from '@/components/WatermarkedImgTag';
import axios from 'axios';
import { useAuth } from '@/lib/auth-context';
import { toggleFollow } from '@/lib/api';

// API types
interface UserProfile {
  id: number;
  name: string;
  phoneNumber: string;
  userType: number;
  profilePhotoUrl: string | null;
  offers: Offer[];
}

interface FollowedUser {
  id: string;
  name: string;
  phoneNumber: string;
  profilePhotoUrl: string | null;
}

interface Offer {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  regionId: number;
  regionName: string;
  mainImageUrl: string;
  createdAt: string;
}

interface ApiResponse {
  data: UserProfile | null;
  success: boolean;
  message: string;
}

interface FollowersApiResponse {
  data: FollowedUser[];
  success: boolean;
  message: string;
}

export default function ProfilePage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('info');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followersError, setFollowersError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const locale = useLocale();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = getToken();
        console.log(token);

        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get<ApiResponse>('http://localhost:5000/api/User/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept-Language': locale,
          }
        });

        if (response.data.success && response.data.data) {
          setProfile(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [getToken]);

  const fetchFollowedUsers = async () => {
    try {
      setFollowersLoading(true);
      setFollowersError(null);
      const token = getToken();

      if (!token) {
        setFollowersError('Not authenticated');
        return;
      }

      const response = await axios.get<FollowersApiResponse>('http://localhost:5000/api/followers/following', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': locale,
        }
      });

      if (response.data.success) {
        setFollowedUsers(response.data.data || []);
      } else {
        setFollowersError(response.data.message || 'Failed to fetch followed users');
      }
    } catch (err) {
      setFollowersError('Failed to fetch followed users');
      console.error(err);
    } finally {
      setFollowersLoading(false);
    }
  };

  // Fetch followed users when switching to following tab
  useEffect(() => {
    if (activeTab === 'following' && followedUsers.length === 0 && !followersLoading) {
      fetchFollowedUsers();
    }
  }, [activeTab]);

  const handleUnfollow = async (userId: string) => {
    try {
      const response = await toggleFollow(parseInt(userId), locale);

      if (response.success) {
        // If the user is now unfollowed, remove them from the list
        if (!response.data?.isFollowed) {
          setFollowedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        }
      } else {
        console.error('Failed to unfollow user:', response.message);
        alert(response.message || 'Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      alert('Failed to unfollow user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('common.error')}</h2>
          <p className="text-gray-600">{error || 'Unable to load profile data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-accent text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  const joinedDate = new Date(profile.offers[0]?.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="min-h-screen bg-primary-bg py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-accent to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                {profile.profilePhotoUrl ? (
                  <img
                    src={`http://localhost:5000/uploads/${profile.profilePhotoUrl}`}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <p className="text-gray-600 mt-1">{t('user.joinedDate')} {joinedDate}</p>
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
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{profile.offers.length}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{t('user.myAds')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">0</div>
                    <div className="text-xs sm:text-sm text-gray-500">{t('user.followers')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {followersLoading ? '...' : followedUsers.length}
                    </div>
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
                  className={`flex-1 px-6 py-4 text-sm sm:text-base font-medium transition-colors ${activeTab === tab
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
                      <p className="font-medium text-gray-900">{profile.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-primary-accent" />
                    <div>
                      <p className="text-sm text-gray-500">{t('user.phoneNumber')}</p>
                      <p className="font-medium text-gray-900">{profile.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-accent" />
                    <div>
                      <p className="text-sm text-gray-500">{t('user.joinedDate')}</p>
                      <p className="font-medium text-gray-900">{joinedDate}</p>
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
                  <span className="text-sm text-gray-500">
                    {followersLoading ? '...' : followedUsers.length} {t('user.following').toLowerCase()}
                  </span>
                </div>

                {followersLoading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-primary-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">{t('common.loading')}</p>
                  </div>
                ) : followersError ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-red-300 mx-auto mb-4" />
                    <p className="text-red-500 font-medium text-lg">{t('common.error')}</p>
                    <p className="text-gray-400 mt-2">{followersError}</p>
                    <button
                      onClick={fetchFollowedUsers}
                      className="mt-4 px-4 py-2 bg-primary-accent text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      {t('common.tryAgain')}
                    </button>
                  </div>
                ) : followedUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium text-lg">{t('user.noFollowing')}</p>
                    <p className="text-gray-400 mt-2">{t('user.noFollowingDesc')}</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {followedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-accent to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                            {user.profilePhotoUrl ? (
                              <img
                                src={`http://localhost:5000/uploads/${user.profilePhotoUrl}`}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.phoneNumber}</p>
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
                    {t('user.myAds')} ({profile.offers.length})
                  </button>
                </div>

                {profile.offers.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium text-lg">{t('user.noAds')}</p>
                    <p className="text-gray-400 mt-2">{t('user.noAdsDesc')}</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.offers.map((offer) => (
                      <Link href={`/ad/${offer.id}`} key={offer.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-[4/3] relative">
                          <WatermarkedImgTag
                            src={`http://localhost:5000/uploads/${offer.mainImageUrl}`}
                            alt={offer.name}
                            className="w-full h-full object-cover"
                            watermarkPosition="bottom-right"
                            watermarkSize="medium"
                          />
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{offer.name}</h3>
                          <p className="text-lg font-bold text-primary-accent mb-2">{offer.price}</p>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{offer.categoryName}</span>
                            <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
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
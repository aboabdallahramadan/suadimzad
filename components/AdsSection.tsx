'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Heart, MessageCircle, Clock, MapPin, Eye } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import WatermarkedImgTag from './WatermarkedImgTag';
import axios from 'axios';
import { useAuth } from '@/lib/auth-context';

// Updated Ad type to match API response
interface AdSmall {
  id: number;
  name: string;
  price: number;
  mainImageUrl: string;
  categoryId: number;
  categoryName: string;
  regionId: number;
  regionName: string;
  createdAt: string;
  description?: string;
  // We'll keep these fields for UI compatibility but they won't be populated from API
  numberOfViews: number;
  numberOfComments: number;
  numberOfFavorites: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    items: AdSmall[];
    hasMore: boolean;
    nextCursor: number | null;
  };
}

interface AdsSectionProps {
  search?: string;
}

const AdsSection: React.FC<AdsSectionProps> = ({ search }) => {
  const t = useTranslations();
  const [ads, setAds] = useState<AdSmall[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const locale = useLocale();


  const API_BASE_URL = 'http://alaamohamad-001-site1.qtempurl.com';

  const fetchAds = async (cursor: number | null = null) => {
    setLoading(true);
    setError(null);

    try {
      // Build params for axios request
      const params: Record<string, string | number> = {
        limit: 12
      };

      if (cursor) {
        params.cursor = cursor;
      }
      if (search) {
        params.searchTerm = search;
      }

      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/api/offers`, {
        params,
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Accept-Language': locale
        }
      });
      console.log(response.data)

      return response.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch ads');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch ads');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initialize ads only on the client side
  useEffect(() => {
    const initializeAds = async () => {
      const result = await fetchAds();
      if (result) {
        setAds(result.items);
        setHasMore(result.hasMore);
        setNextCursor(result.nextCursor);
      } else {
        setAds([]);
        setHasMore(false);
        setNextCursor(null);
      }
      setMounted(true);
    };

    initializeAds();
  }, [search]);

  const loadMoreAds = async () => {
    if (!nextCursor || loading) return;

    const result = await fetchAds(nextCursor);
    if (result) {
      setAds(prevAds => [...prevAds, ...result.items]);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const getTimeAgo = (dateString: string) => {
    if (!mounted) return ''; // Return empty string during server-side rendering

    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return t('ads.today');
    if (diffInDays === 1) return t('ads.yesterday');
    if (diffInDays < 7) return t('ads.daysAgo', { days: diffInDays });
    if (diffInDays < 30) return t('ads.weeksAgo', { weeks: Math.floor(diffInDays / 7) });
    return t('ads.monthsAgo', { months: Math.floor(diffInDays / 30) });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('ads.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('ads.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-color to-secondary-color mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {/* Loading State (Initial Load) */}
        {!mounted && loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-accent"></div>
          </div>
        )}

        {/* Ads Grid */}
        {mounted && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {ads.map((ad) => (
              <Link
                key={ad.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                href={`/ad/${ad.id}`}
              >
                {/* Ad Image */}
                <div className="relative overflow-hidden">
                  <WatermarkedImgTag
                    src={`http://alaamohamad-001-site1.qtempurl.com/uploads/${ad.mainImageUrl}`} // Fallback image if mainImageUrl is missing
                    alt={ad.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    watermarkPosition="bottom-right"
                    watermarkSize="medium"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    {ad.categoryName}
                  </div>
                </div>

                {/* Ad Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-accent transition-colors">
                    {ad.name}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{ad.regionName}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>{mounted ? getTimeAgo(ad.createdAt) : ''}</span>
                  </div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0">
                    <div className="text-2xl font-bold text-primary-accent">
                      {formatPrice(ad.price)} QR
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{ad.numberOfFavorites || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{ad.numberOfComments || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{ad.numberOfViews || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {mounted && ads.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('ads.noAdsAvailable')}</p>
          </div>
        )}

        {/* Load More Button */}
        {mounted && hasMore && (
          <div className="text-center">
            <button
              onClick={loadMoreAds}
              disabled={loading}
              className={`
                px-8 py-4 rounded-full font-semibold text-white text-lg
                bg-gradient-to-r from-primary-color to-secondary-color
                hover:from-primary-accent hover:to-primary-color
                transform hover:scale-105 transition-all duration-300
                shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                relative overflow-hidden
              `}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  {t('ads.loading')}
                </div>
              ) : (
                t('ads.seeMore')
              )}
            </button>
          </div>
        )}

        {/* No More Ads Message */}
        {mounted && !hasMore && ads.length > 0 && (
          <div className="text-center">
            <p className="text-gray-500 text-lg">{t('ads.noMoreAds')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdsSection;
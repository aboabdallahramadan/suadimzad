'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AdSmall } from '@/types/adSmall';
import { Heart, MessageCircle, Clock, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import WatermarkedImgTag from './WatermarkedImgTag';

// Dummy data for ads
const generateDummyAds = (count: number, startId: number = 1): AdSmall[] => {
  const categories = ['Cars', 'Electronics', 'Real Estate', 'Furniture', 'Services', 'Jobs'];
  const locations = ['Doha', 'Al Rayyan', 'Al Wakrah', 'Umm Salal', 'Al Khor', 'Al Shamal'];
  const titles = [
    'iPhone 15 Pro Max - Excellent Condition',
    'Toyota Camry 2023 - Low Mileage',
    'Luxury Villa in Al Rayyan - 4 Bedrooms',
    'Modern Sofa Set - Like New',
    'Professional Cleaning Services',
    'Senior Software Developer Position',
    'Samsung Galaxy S24 Ultra',
    'Honda Civic 2022 - Single Owner',
    'Spacious Apartment in West Bay',
    'Dining Table Set - Wooden',
    'Home Maintenance Services',
    'Marketing Manager Job Opening',
    'MacBook Pro M3 - 16 inch',
    'Nissan Altima 2023 - Pristine',
    'Commercial Office Space',
    'Bedroom Set - Complete',
    'Landscaping Services',
    'Accountant Position Available',
    'iPad Pro 2024 - 12.9 inch',
    'BMW X5 2022 - Luxury SUV'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: (startId + index).toString(),
    title: titles[index % titles.length],
    price: Math.floor(Math.random() * 50000) + 1000,
    image: `https://picsum.photos/300/200?random=${startId + index}`,
    comments: Math.floor(Math.random() * 50) + 1,
    likes: Math.floor(Math.random() * 100) + 5,
    category: categories[index % categories.length],
    location: locations[index % locations.length],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
  }));
};

const AdsSection: React.FC = () => {
  const t = useTranslations();
  const [ads, setAds] = useState<AdSmall[]>(generateDummyAds(12));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreAds = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAds = generateDummyAds(20, ads.length + 1);
    setAds(prevAds => [...prevAds, ...newAds]);
    
    // Simulate end of data after 100 ads
    if (ads.length >= 80) {
      setHasMore(false);
    }
    
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const getTimeAgo = (dateString: string) => {
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

        {/* Ads Grid */}
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
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  watermarkPosition="bottom-right"
                  watermarkSize="medium"
                />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {ad.category}
                </div>
              </div>

              {/* Ad Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-accent transition-colors">
                  {ad.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{ad.location}</span>
                  <Clock className="w-4 h-4 ml-3 mr-1" />
                  <span>{getTimeAgo(ad.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-accent">
                    {formatPrice(ad.price)} QR
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{ad.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{ad.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
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
        {!hasMore && (
          <div className="text-center">
            <p className="text-gray-500 text-lg">{t('ads.noMoreAds')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdsSection;
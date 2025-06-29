"use client";
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Heart, Search, MessageCircle, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { AdSmall } from '@/types/adSmall';

// Mock favorite ads data
const favoriteAds: AdSmall[] = [
  {
    id: '1',
    title: 'BMW X5 2021 - Full Options',
    price: 195000,
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
    comments: 15,
    likes: 1,
  },
  {
    id: '2',
    title: 'Luxury Villa for Sale - 5 Bedrooms',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
    comments: 15,
    likes: 1,
  },
  {
    id: '3',
    title: 'MacBook Pro M2 16" - Like New',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
    comments: 15,
    likes: 1,
  },
  {
    id: '4',
    title: 'Professional Photography Services',
    price: 500,
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
    comments: 15,
    likes: 1,
  }
];

export default function FavoritesPage() {
  const t = useTranslations();
  const [favorites, setFavorites] = useState(favoriteAds);
  const [searchQuery, setSearchQuery] = useState('');

  // Remove from favorites
    const removeFromFavorites = (adId: string) => {
    setFavorites(prev => prev.filter(ad => ad.id !== adId));
  };

  // Filter favorites
  const filteredFavorites = favorites.filter(ad => {
    return ad.title.toLowerCase().includes(searchQuery.toLowerCase())
  });

  return (
    <div className="min-h-screen bg-primary-bg py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary-accent" />
                  {t('user.favoriteAds')}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  {favorites.length} {favorites.length === 1 ? 'favorite ad' : 'favorite ads'}
                </p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
                />
              </div>
            </div>
          </div>

          {/* Favorites List */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            {filteredFavorites.length === 0 ? (
              <div className="px-4 sm:px-6 py-12 sm:py-16 text-center">
                <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg sm:text-xl">{t('user.noFavorites')}</p>
                <p className="text-gray-400 text-sm sm:text-base mt-2">{t('user.noFavoritesDesc')}</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 mt-6 text-white bg-primary-accent rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {t('user.startBrowsing')}
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 p-4 sm:p-6">
                {filteredFavorites.map((ad) => (
                  <div key={ad.id} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                    {/* Image */}
                    <div className="w-full sm:w-48 h-48 sm:h-32 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                        <div className="aspect-[4/3] relative">
                            <img 
                            src={ad.image} 
                            alt={ad.title}
                            className="w-full h-full object-cover"
                            />
                        </div>
                      
                      {/* Remove from favorites button */}
                      <button
                        onClick={() => removeFromFavorites(ad.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                        <div className="flex-1 flex flex-col justify-between items-start">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2 mb-2">
                            {ad.title}
                          </h3>
                          
                          <p className="text-xl sm:text-2xl font-bold text-primary-accent mb-2">
                            {ad.price}
                          </p>
                          
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {ad.comments}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {ad.likes}
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                          <Link
                            href={`/ad/${ad.id}`}
                            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-primary-accent border border-primary-accent rounded-lg hover:bg-primary-accent hover:text-white transition-colors text-center"
                          >
                            {t('user.viewDetails')}
                          </Link>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
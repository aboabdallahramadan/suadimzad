"use client";
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Heart, Search, MessageCircle, X, Eye } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import axios from 'axios';
import { useAuth } from '@/lib/auth-context';

// Define type for favorite offer
interface FavoriteOffer {
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
  numberOfFavorites: number;
  numberOfViews: number;
  numberOfComments: number;
}

// Define response type
interface FavoritesResponse {
  data: {
    items: FavoriteOffer[];
    hasMore: boolean;
    nextCursor: number | null;
  };
  success: boolean;
  message: string;
}

export default function FavoritesPage() {
  const t = useTranslations();
  // Remove unused variables
  // const router = useRouter();
  // const searchParams = useSearchParams();

  // State for favorites data
  const [favorites, setFavorites] = useState<FavoriteOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const locale = useLocale();
  const { getToken } = useAuth()
  
  // Fetch favorites with current filters
  const fetchFavorites = async (cursor: number | null = null) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor.toString());
      if (searchTerm) params.append('searchTerm', searchTerm);

      const response = await axios.get<FavoritesResponse>(`http://alaamohamad-001-site1.qtempurl.com/api/offers/my-favorites${params.toString() != '' ? '?' + params.toString() : ''}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Accept-Language': locale
        }
      });
      if (response.data.success) {
        if (cursor) {
          // Append to existing results for pagination
          setFavorites(prev => [...prev, ...response.data.data.items]);
        } else {
          // Replace results for new search/filter
          setFavorites(response.data.data.items);
        }

        setHasMore(response.data.data.hasMore);
        setNextCursor(response.data.data.nextCursor);
        setError(null);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(t('errors.failedToLoadFavorites'));
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFavorites();
  };

  // Remove from favorites
  const removeFromFavorite = async (offerId: number) => {
    try {
      // Call API to remove from favorites
      await fetch(`http://alaamohamad-001-site1.qtempurl.com/api/offers/${offerId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
          'Accept-Language': locale
        },
      });

      // Update local state by refetching the data
      fetchFavorites();
    } catch (err) {
      console.error('Failed to remove from favorites:', err);
      // Optionally show error message
    }
  };

  // Load more results
  const loadMore = () => {
    if (nextCursor) {
      fetchFavorites(nextCursor);
    }
  };


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
                  {favorites.length} {favorites.length === 1 ? t('user.favoriteAd') : t('user.favoriteAds')}
                </p>
              </div>
            </div>

            {/* Search and Filter */}
            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('search.searchFavorites')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 sm:py-3 text-white bg-primary-accent rounded-lg hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2"
              >
                {t('common.search')}
              </button>
            </form>
          </div>

          {/* Favorites List */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            {loading && favorites.length === 0 ? (
              <div className="p-8 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ) : error ? (
              <div className="px-4 sm:px-6 py-12 sm:py-16 text-center">
                <p className="text-red-500 font-medium text-lg sm:text-xl">{error}</p>
                <button
                  onClick={() => fetchFavorites()}
                  className="inline-flex items-center gap-2 px-6 py-3 mt-6 text-white bg-primary-accent rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {t('common.tryAgain')}
                </button>
              </div>
            ) : favorites.length === 0 ? (
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
              <>
                <div className="grid gap-4 sm:gap-6 p-4 sm:p-6">
                  {favorites.map((offer) => (
                    <div key={offer.id} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                      {/* Image */}
                      <div className="w-full sm:w-48 h-48 sm:h-32 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                        <div className="aspect-[4/3] relative">
                          <img
                            src={'http://alaamohamad-001-site1.qtempurl.com/uploads/' + offer.mainImageUrl}
                            alt={offer.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Remove from favorites button */}
                        <button
                          onClick={() => removeFromFavorite(offer.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors shadow-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                          <div className="flex-1 flex flex-col justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                  {offer.categoryName}
                                </span>
                                <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                  {offer.regionName}
                                </span>
                              </div>
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2 mt-1 mb-2">
                                {offer.name}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {offer.description}
                              </p>
                            </div>

                            <p className="text-xl sm:text-2xl font-bold text-primary-accent mb-2">
                              {offer.price}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {offer.numberOfComments}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {offer.numberOfFavorites}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {offer.numberOfViews}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(offer.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                            <Link
                              href={`/ad/${offer.id}`}
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

                {/* Load more button */}
                {hasMore && (
                  <div className="p-4 sm:p-6 flex justify-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent transition-colors"
                    >
                      {loading ? t('common.loading') : t('common.loadMore')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
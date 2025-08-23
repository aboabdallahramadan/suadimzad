'use client';

import { use, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AdSmall } from '@/types/adSmall';
import { Link } from '@/i18n/navigation';
import WatermarkedImgTag from '@/components/WatermarkedImgTag';

// API base URL
const API_BASE_URL = 'http://alaamohamad-001-site1.qtempurl.com';

// Interface for API offer response
interface ApiOfferItem {
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

// Interface for Location
interface Location {
  id: number;
  name: string;
}

// Interface for formatted location options
interface LocationOption {
  key: string;
  value: string;
}

// Function to fetch offers from API
async function fetchOffers(params?: {
  categoryId?: string;
  regionId?: string;
  limit?: number;
  sortDescending?: boolean;
  searchTerm?: string;
  locale?: string;
  cursor?: number;
  minPrice?: number;
  maxPrice?: number;
}): Promise<{ offers: AdSmall[]; hasMore: boolean; nextCursor: number | null }> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.categoryId) {
      searchParams.append('categoryId', params.categoryId);
    }
    if (params?.regionId) {
      searchParams.append('regionId', params.regionId);
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params?.sortDescending !== undefined) {
      searchParams.append('sortDescending', params.sortDescending.toString());
    }
    if (params?.searchTerm) {
      searchParams.append('searchTerm', params.searchTerm);
    }
    if (params?.cursor) {
      searchParams.append('cursor', params.cursor.toString());
    }
    if (params?.minPrice !== undefined) {
      searchParams.append('minPrice', params.minPrice.toString());
    }
    if (params?.maxPrice !== undefined) {
      searchParams.append('maxPrice', params.maxPrice.toString());
    }

    const url = `${API_BASE_URL}/api/offers?${searchParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': params?.locale || 'en'
      },
      cache: 'no-store', // Ensure fresh data on each request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch offers');
    }

    // Transform API response to AdSmall format
    const offers: AdSmall[] = result.data.items.map((item: ApiOfferItem) => ({
      id: item.id.toString(),
      title: item.name,
      price: item.price,
      image: `${API_BASE_URL}/uploads/${item.mainImageUrl}`,
      comments: item.numberOfComments,
      likes: item.numberOfFavorites,
      category: item.categoryName,
      location: item.regionName,
      createdAt: item.createdAt,
    }));

    return {
      offers,
      hasMore: result.data.hasMore || false,
      nextCursor: result.data.nextCursor || null
    };
  } catch (error) {
    console.error('Error fetching offers:', error);
    return { offers: [], hasMore: false, nextCursor: null }; // Return empty result on error
  }
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ subcategoryid: string }>;
}) {
  const resolvedParams = use(params);
  const t = useTranslations();
  const locale = useLocale();
  const [offers, setOffers] = useState<AdSmall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine sort parameters based on selected option
        let sortDescending = true;
        if (sortOption === 'oldest') {
          sortDescending = false;
        }
        // Note: Price sorting would need additional API parameters if supported

        const result = await fetchOffers({
          categoryId: resolvedParams.subcategoryid,
          regionId: selectedLocationId || undefined,
          limit: 20,
          sortDescending: sortDescending,
          locale: locale,
        });
        setOffers(result.offers);
        setHasMore(result.hasMore);
        setNextCursor(result.nextCursor);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load offers');
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, [resolvedParams.subcategoryid, locale, selectedLocationId, sortOption]);

  const loadMoreOffers = async () => {
    if (!hasMore || !nextCursor || loading) return;

    try {
      setLoading(true);

      // Determine sort parameters based on selected option
      let sortDescending = true;
      if (sortOption === 'oldest') {
        sortDescending = false;
      }

      const result = await fetchOffers({
        categoryId: resolvedParams.subcategoryid,
        regionId: selectedLocationId || undefined,
        cursor: nextCursor,
        limit: 20,
        sortDescending: sortDescending,
        locale: locale,
      });
      setOffers(prev => [...prev, ...result.offers]);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more offers');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocationId(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://alaamohamad-001-site1.qtempurl.com/api/admin/regions/dropdown', {
          headers: {
            'Accept-Language': locale
          }
        })

        if (!response.ok) {
          console.error('Failed to fetch locations:', response.statusText)
          return
        }

        const responseData = await response.json()

        if (responseData.success && Array.isArray(responseData.data)) {
          const formattedLocations = responseData.data.map((loc: Location) => ({ key: String(loc.id), value: loc.name }))
          setLocations(formattedLocations)
        } else {
          console.error('Failed to fetch locations:', responseData.message || 'Response data is not in the expected format.')
        }
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }

    fetchLocations()
  }, [locale])

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a href={`/`} className="hover:text-primary-accent">
                {t('common.home')}
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">
              {t('nav.allCategories')}
            </li>
          </ol>
        </nav>

        {/* Content Area */}
        <div className="grid grid-cols-1 gap-6">
          {/* Listings Grid */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-accent"
                    value={selectedLocationId}
                    onChange={handleLocationChange}
                  >
                    <option value="">{t('category.allLocations')}</option>
                    {locations.map((location) => (
                      <option key={location.key} value={location.key}>
                        {location.value}
                      </option>
                    ))}
                  </select>
                </div>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-accent"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="newest">{t('category.newest')}</option>
                  <option value="oldest">{t('category.oldest')}</option>
                  <option value="priceLowToHigh">{t('category.priceLowToHigh')}</option>
                  <option value="priceHighToLow">{t('category.priceHighToLow')}</option>
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  <p>{error}</p>
                </div>
              )}

              {/* Conditional Content */}
              {offers.length > 0 ? (
                /* Ads Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {offers.map((ad) => (
                    <Link key={ad.id} href={`/ad/${ad.id}`} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative cursor-pointer">

                      {/* Ad Image */}
                      <div className="aspect-[4/3] relative">
                        <WatermarkedImgTag
                          src={ad.image}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                          watermarkPosition="bottom-right"
                          watermarkSize="medium"
                        />
                      </div>

                      {/* Ad Content */}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">
                          {ad.title}
                        </h3>

                        <div className="text-lg font-bold text-primary-color mb-3">
                          {ad.price} SAR
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-gray-500 text-xs">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                              </svg>
                              {ad.comments}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              {ad.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Coming Soon Message */
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('category.comingSoon')}
                    </h3>
                    <p className="text-gray-600">
                      {t('category.comingSoonDescription')}
                    </p>
                  </div>
                </div>
              )}

              {/* Load More Button */}
              {offers.length > 0 && hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMoreOffers}
                    disabled={loading}
                    className="bg-primary-accent text-white px-6 py-3 rounded-lg hover:bg-primary-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('common.loading')}
                      </span>
                    ) : (
                      t('common.loadMore')
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

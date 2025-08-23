"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Ad } from '@/types/ad';
import Images from '@/components/adDetails/Images';
import AdDetails from '@/components/adDetails/AdDetails';
import UserProfileSection from '@/components/adDetails/UserProfileSection';
import CommentsSection from '@/components/adDetails/CommentsSection';
import SimilarAds from '@/components/adDetails/SimilarAds';
import { useLocale } from 'next-intl';
import { useAuth } from '@/lib/auth-context';

interface OfferResponse {
  data: {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    categoryName: string;
    regionId: number;
    regionName: string;
    mainImageUrl: string;
    additionalImages: string[];
    createdAt: string;
    isActive: boolean;
    providerId: number;
    providerIsFollowed: boolean;
    providerName: string;
    providerPhoneNumber: string;
    providerProfilePhotoUrl: string;
    providerCreatedAt: string;
    numberOfFavorites: number;
    isFavorite: boolean;
    numberOfViews: number;
  };
  success: boolean;
  message: string;
}

// Function to fetch offer data from API
async function getOfferById(id: string, locale: string = 'en', token: string = ''): Promise<OfferResponse> {
  try {
    // Use absolute URL to avoid issues with relative paths
    const baseUrl = 'http://alaamohamad-001-site1.qtempurl.com';
    const response = await fetch(`${baseUrl}/api/offers/${id}`, {
      cache: 'no-store', // Don't cache this request
      headers: {
        'Accept-Language': locale,
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch offer data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching offer data:', error);
    throw error;
  }
}

// Map API response to Ad structure
function mapOfferToAd(offer: OfferResponse['data']): Ad {
  return {
    id: offer.id.toString(),
    adDetails: {
      id: offer.id,
      title: offer.name,
      price: offer.price,
      category: offer.categoryName,
      location: offer.regionName,
      timeAgo: new Date(offer.createdAt).toLocaleDateString(),
      numberOfViews: offer.numberOfViews,
      numberOfFavorites: offer.numberOfFavorites,
      isFavorite: offer.isFavorite,
      extraInfo: [

        {
          name: 'Region',
          value: offer.regionName
        }
      ],
      likes: 0,
      description: offer.description,
    },
    images: [offer.mainImageUrl, ...offer.additionalImages],
    user: {
      id: offer.providerId,
      name: offer.providerName,
      avatar: offer.providerProfilePhotoUrl,
      memberSince: offer.providerCreatedAt,
      phoneNumber: offer.providerPhoneNumber,
      isFollowed: offer.providerIsFollowed
    },
    comments: [],
    similarAds: []
  };
}

export default function AdDetailPage() {
  const params = useParams();
  const adId = params.adid as string;
  const locale = useLocale();
  const { getToken } = useAuth();

  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        setIsLoading(true);
        const offerResponse = await getOfferById(adId, locale, getToken());

        if (!offerResponse.success || !offerResponse.data) {
          setError(offerResponse.message || 'Failed to load offer details');
          return;
        }

        setAd(mapOfferToAd(offerResponse.data));
      } catch (error) {
        console.error('Failed to load offer details:', error);
        setError('Failed to load offer details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdDetails();
  }, [adId, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl font-medium">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="mt-2">{error || 'Failed to load offer details'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Images */}
        <Images images={ad.images || []} />

        {/* Ad Details */}
        <AdDetails adDetails={ad.adDetails} />

        {/* User Profile */}
        <UserProfileSection adUser={ad.user} />

        {/* Similar Ads - Can be kept for now with empty data */}
        <SimilarAds ads={[]} />

        {/* Comments Section - Can be kept for now with empty data */}
        <CommentsSection />
      </div>
    </div>
  );
}
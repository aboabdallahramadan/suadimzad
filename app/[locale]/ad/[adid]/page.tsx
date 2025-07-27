import { Ad } from '@/types/ad';
import Images from '@/components/adDetails/Images';
import AdDetails from '@/components/adDetails/AdDetails';
import UserProfileSection from '@/components/adDetails/UserProfileSection';
import CommentsSection from '@/components/adDetails/CommentsSection';
import SimilarAds from '@/components/adDetails/SimilarAds';

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
    providerName: string;
    providerPhoneNumber: string;
    providerProfilePhotoUrl: string;
    providerCreatedAt: string;
  };
  success: boolean;
  message: string;
}

// Function to fetch offer data from API
async function getOfferById(id: string): Promise<OfferResponse> {
  try {
    // Use absolute URL to avoid issues with relative paths
    const baseUrl = 'http://localhost:5000';
    const response = await fetch(`${baseUrl}/api/offers/${id}`, {
      cache: 'no-store', // Don't cache this request
    });

    if (!response.ok) {
      throw new Error('Failed to fetch offer data');
    }

    return await response.json();
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
      title: offer.name,
      price: offer.price,
      category: offer.categoryName,
      location: offer.regionName,
      timeAgo: new Date(offer.createdAt).toLocaleDateString(),
      extraInfo: [

        {
          name: 'Region',
          value: offer.regionName
        }
        // ,
        // {
        //   name: 'Status',
        //   value: offer.isActive ? 'Active' : 'Inactive'
        // }
      ],
      likes: 0,
      views: 0,
      description: offer.description,
    },
    images: [offer.mainImageUrl, ...offer.additionalImages],
    user: {
      id: offer.providerId.toString(),
      name: offer.providerName,
      avatar: offer.providerProfilePhotoUrl,
      memberSince: offer.providerCreatedAt,
      phoneNumber: offer.providerPhoneNumber
    },
    comments: [],
    similarAds: []
  };
}

export default async function AdDetailPage({ params }: { params: { adid: string } }) {
  try {
    // Fetch offer data from API
    const offerResponse = await getOfferById(params.adid);

    if (!offerResponse.success || !offerResponse.data) {
      return (
        <div className="min-h-screen bg-primary-bg flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-500">Error</h1>
            <p className="mt-2">{offerResponse.message || 'Failed to load offer details'}</p>
          </div>
        </div>
      );
    }

    const ad = mapOfferToAd(offerResponse.data);

    return (
      <div className="min-h-screen bg-primary-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Images */}
          <Images images={ad.images || []} />

          {/* Ad Details */}
          <AdDetails adDetails={ad.adDetails} />

          {/* User Profile */}
          <UserProfileSection user={ad.user} />

          {/* Similar Ads - Can be kept for now with empty data */}
          <SimilarAds ads={[]} />

          {/* Comments Section - Can be kept for now with empty data */}
          <CommentsSection />
        </div>
      </div>
    );
  } catch (error) {
    // Log error for debugging purposes
    console.error('Failed to load offer details:', error);

    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="mt-2">Failed to load offer details. Please try again later.</p>
        </div>
      </div>
    );
  }
}
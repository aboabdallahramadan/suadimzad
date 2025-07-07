import { getTranslations } from 'next-intl/server';
import { AdSmall } from '@/types/adSmall';
import { Link } from '@/i18n/navigation';
import WatermarkedImgTag from '@/components/WatermarkedImgTag';

// Dummy ad data
const dummyAds: AdSmall[] = [
  {
    id: '1',
    title: 'Haring driver. snoonu.',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    comments: 27,
    likes: 5
  },
  {
    id: '2',
    title: 'EXCELLENT DELIVERY',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
    comments: 15,
    likes: 1
  },
  {
    id: '3',
    title: 'BARISTA STAFF HIRING',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    comments: 7,
    likes: 2
  },
  {
    id: '4',
    title: 'Delivery driver',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop',
    comments: 53,
    likes: 15
  },
  {
    id: '5',
    title: '3d visualiser -interior design',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
    comments: 12,
    likes: 8
  },
  {
    id: '6',
    title: 'مطلوب مندوب',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop',
    comments: 9,
    likes: 3
  },{
    id: '7',
    title: 'EXCELLENT DELIVERY',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
    comments: 15,
    likes: 1
  },
  {
    id: '8',
    title: 'BARISTA STAFF HIRING',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    comments: 7,
    likes: 2
  },
  {
    id: '9',
    title: 'Delivery driver',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop',
    comments: 53,
    likes: 15
  },
  {
    id: '10',
    title: '3d visualiser -interior design',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
    comments: 12,
    likes: 8
  },
  {
    id: '11',
    title: 'مطلوب مندوب',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop',
    comments: 9,
    likes: 3
  },
  
];

export default async function CategoryPage() {
  const t = await getTranslations();
  


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
                  <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-accent">
                    <option>{t('category.allLocations')}</option>
                  </select>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-accent">
                  <option>{t('category.newest')}</option>
                  <option>{t('category.oldest')}</option>
                  <option>{t('category.priceLowToHigh')}</option>
                  <option>{t('category.priceHighToLow')}</option>
                </select>
              </div>

              {/* Conditional Content */}
              {dummyAds.length > 0 ? (
                /* Ads Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dummyAds.map((ad) => (
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Ad } from '@/types/ad';
import Images from '@/components/adDetails/Images';
import AdDetails from '@/components/adDetails/AdDetails';
import UserProfileSection from '@/components/adDetails/UserProfileSection';
import CommentsSection from '@/components/adDetails/CommentsSection';

// Dummy ad data for detail page
const dummyAdDetail: Ad = {
  id: '1',
  adDetails: {
    title: 'Haring driver. snoonu. carcon',
    price: 6000,
    category: 'Job',
    subcategory: 'Drivers &',
    location: 'Doha',
    timeAgo: '1 week ago',
    extraInfo: [{
      name: 'Ad Type',
      value: 'Job Offer'
    },
    {
      name: 'Gender',
      value: 'Both'
    },
    {
      name: 'Nationality',
      value: 'Any'
    },
    {
      name: 'Qualification',
      value: 'Any'
    },
    {
      name: 'Experience',
      value: '3 years'
    },
    {
      name: 'Salary',
      value: 'Commission'
    },
    {
      name: 'Career',
      value: 'Experienced'
    },
    {
      name: 'Is Driver',
      value: 'Yes'
    },
    {
      name: 'Job Type',
      value: 'Full Time'
    }],
    likes: 5,
    views: 15482,
    description: 'Hiring male and female drivers with their own cars. Quick registration. Reliable delivery services at Al-Hadaf Delivery Services Company. *Available Jobs:* 1. *Drivers with their own cars* 200 vacancies. Application fee: 14 riyals. 2. Motorcycle drivers: 100 vacancies. Application fee: 10 riyals, including the Sununu app. Valid Qatari residency. Valid Qatari license. Vehicle registration. Benefits: Car maintenance garage. Ain Khaled, next to Ramez. Area 56, Street 964, Building No. 139. To contact: 31010766. Al-Hadaf Delivery Services Company',
  },
  images: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop'
  ],
  user: {
    id: '1',
    name: 'Mohammad Al-Haj',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    memberSince: '11 months ago',
    phoneNumber: '74036872'
  },
  comments: [
    {
      id: '1',
      user: {
        name: 'Abdul Faheem',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
      },
      comment: '74036872',
      timeAgo: '23 hours ago'
    },
    {
      id: '2',
      user: {
        name: 'MUHAMMAD HAYAT',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
      },
      comment: 'Interested in this position',
      timeAgo: '1 day ago'
    }
  ]
};

export default async function AdDetailPage() {

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Images */}
        <Images images={dummyAdDetail.images || []} />

        {/* Ad Details */}
        <AdDetails adDetails={dummyAdDetail.adDetails} />


        {/* User Profile */}
        <UserProfileSection user={dummyAdDetail.user} />

        {/*comments section */ }
        <CommentsSection adComments={dummyAdDetail.comments} />
        
      </div>
    </div>
  );
}
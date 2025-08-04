import { BannerCarousel } from '@/components/BannerCarousel';
import AdsSection from '@/components/AdsSection';



export default async function HomePage({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Latest Ads Section */}
      <AdsSection search={searchParams.search} />
    </div>
  );
}

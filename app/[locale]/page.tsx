import { BannerCarousel } from '@/components/BannerCarousel';
import { CategoriesGrid } from '@/components/category/CategoriesGrid';



export default async function HomePage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Banner Carousel */}
      <BannerCarousel />


      {/* Categories Grid */}
      <div className='bg-white'>

        <div className="container mx-auto px-4 py-8">
          <CategoriesGrid />
        </div>
      </div>
    </div>
  );
}

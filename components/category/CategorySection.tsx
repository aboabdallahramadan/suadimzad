import { Link } from '@/i18n/navigation';
import { Category } from '@/types/category';
import WatermarkedImgTag from '../WatermarkedImgTag';

interface CategorySectionProps {
    category: Category;
  }
  let totalWidth = 3;
  // Function to get col-span class
  const getColSpanClass = (index: number) => {
    const randomWidth = Math.floor(Math.random() * (totalWidth - 1)) + 1; // Random 1 or 2
    totalWidth -= randomWidth;
    if(index === 0 || totalWidth === 0) {
      totalWidth = 3;
    }
    const classes = {
      1: 'col-span-1',
      2: 'col-span-2'
    };
    return classes[randomWidth as keyof typeof classes];
  }
  
 export function CategorySection({ category }: CategorySectionProps) {
  
    return (
      <div className="mb-8">
        {/* Category Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-gray-900 uppercase">
            {category.title}
          </h2>
          <span className="text-gray-500 text-sm">
            {category.adsCount.toLocaleString()} Ads
          </span>
        </div>
  
        {/* Subcategories Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {category.subcategories.map((sub, index) => (
            <Link
              key={index}
              href={`/${sub.id}`}
              className={`group block sm:${getColSpanClass(index)}`}
            >
              <div className={`bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-4 hover:shadow-xl hover:scale-[1.02] hover:border-primary-accent/30 transition-all duration-300 relative h-28 overflow-hidden`}>
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex items-center justify-between h-full relative z-10">
                  {/* Text content on the left */}
                  <div className="flex-1 h-full flex flex-col justify-center pr-4">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-accent transition-colors duration-300 leading-tight mb-1">
                      {sub.title}
                    </h3>
                    <div className="w-8 h-0.5 bg-primary-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                  
                  {/* Image on the right */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-white group-hover:ring-primary-accent/20 transition-all duration-300">
                    <WatermarkedImgTag
                      src={sub.image} 
                      alt={sub.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      watermarkPosition="bottom-right"
                      watermarkSize="small"
                    />
                  </div>
                </div>
                
                {/* Hover arrow indicator */}
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-1 h-1 bg-primary-accent rounded-full"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
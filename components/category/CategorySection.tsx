import { Link } from '@/i18n/navigation';
import { Category } from '@/types/category';

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


  // Function to get background color based on category/subcategory
  const getBackgroundColor = () => {
    const colors = [
      'bg-blue-100', // Light blue
      'bg-green-100', // Light green  
      'bg-orange-100', // Light orange
      'bg-purple-100', // Light purple
      'bg-pink-100', // Light pink
      'bg-yellow-100', // Light yellow
      'bg-indigo-100', // Light indigo
      'bg-red-100', // Light red
      'bg-teal-100', // Light teal
      'bg-cyan-100', // Light cyan
      'bg-lime-100', // Light lime
      'bg-amber-100', // Light amber
      'bg-emerald-100', // Light emerald
      'bg-sky-100', // Light sky
    ];
    
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  
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
        <div className='grid grid-cols-3 gap-4'>
          {category.subcategories.map((sub, index) => (
            <Link
              key={index}
              href={`/${sub.id}`}
              className={`group block ${getColSpanClass(index)}`}
            >
              <div className={`${getBackgroundColor()} rounded-2xl p-2 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative h-24`}>
                <div className="flex items-center justify-between h-full">
                  {/* Text content on the left */}
                  <div className="flex-1 h-full relative">
                    <div className="absolute top-0 left-0">
                      <h3 className="text-base text-gray-800 group-hover:text-gray-900 transition-colors leading-tight">
                        {sub.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Image on the right */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <img 
                      src={sub.image} 
                      alt={sub.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
import { CategorySection } from './CategorySection';
import { Category } from '@/types/category';

const categories: Category[] = [
  {
    id: '1',
    title: 'Real Estate',
    adsCount: 27460,
    subcategories: [
      { id: '1', title: 'Properties for Rent', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&h=200&fit=crop' },
      { id: '2', title: 'Lands', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=200&fit=crop' },
      { id: '3', title: 'Properties for Sale', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop' },
      { id: '4', title: 'Furniture', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: '2',
    title: 'Vehicles',
    adsCount: 36523,
    subcategories: [
      { id: '1', title: 'Cars', image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop' },
      { id: '2', title: 'Car Showrooms', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&h=200&fit=crop' },
      { id: '3', title: 'Motorcycles', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop' },
      { id: '4', title: 'Car Rentals', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop' },
      { id: '5', title: 'Offshore Tools', image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=200&fit=crop' },
      { id: '6', title: 'Spare Parts', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop' },
      { id: '7', title: 'Heavy Equipment', image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=200&h=200&fit=crop' },
      { id: '8', title: 'Mzad Yard', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: '3',
    title: 'Services',
    adsCount: 36357,
    subcategories: [

      { id: '3', title: 'Cleaning Services', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop' },
      { id: '4', title: 'Occasions', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=200&fit=crop' },
      { id: '5', title: 'Construction', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop' },
      { id: '6', title: 'Furniture Moving', image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop' },
      { id: '7', title: 'Transport Services', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088' }
    ]
  },
  {
    id: '4',
    title: 'Family Needs',
    adsCount: 15006,
    subcategories: [
      { id: '1', title: 'Men Fashion', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
      { id: '2', title: 'Women Fashion', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop' },
      { id: '3', title: 'Kids Products', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop' },
      { id: '4', title: 'Gifts', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop' },
      { id: '5', title: 'Food', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: '5',
    title: 'Jobs',
    adsCount: 5868,
    subcategories: [
      { id: '1', title: 'Job Vacancies', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
      { id: '2', title: 'Job Seekers', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop' },
      { id: '3', title: 'Freelancers', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: '6',
    title: 'Electronics',
    adsCount: 21425,
    subcategories: [
      { id: '1', title: 'Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop' },
      { id: '2', title: 'Electronics', image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=200&h=200&fit=crop' },
      { id: '3', title: 'Home Appliances', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop' },
      { id: '4', title: 'Cameras', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=200&fit=crop' },
      { id: '5', title: 'Electronic Games', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: '7',
    title: 'Sport',
    adsCount: 7036,
    subcategories: [
      { id: '1', title: 'Health', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop' },
      { id: '2', title: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop' },
      { id: '3', title: 'Scooter', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: '8',
    title: 'Travel',
    adsCount: 6667,
    subcategories: [
      { id: '1', title: 'Tourism', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop' },
      { id: '2', title: 'Trips', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: '9',
    title: 'Numbers',
    adsCount: 4978,
    subcategories: [
      { id: '1', title: 'Mobile Numbers', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop' },
      { id: '2', title: 'Mobile Numbers Auction', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop' },
      { id: '3', title: 'Car Plates', image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop' },
      { id: '4', title: 'Car Plates Auction', image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: '10',
    title: 'Animals',
    adsCount: 6874,
    subcategories: [
      { id: '1', title: 'Horses', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=200&h=200&fit=crop' },
      { id: '2', title: 'Camel Auctions', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=200&h=200&fit=crop' },
      { id: '3', title: 'Birds', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200&h=200&fit=crop' },
      { id: '4', title: 'Other Animals', image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: '11',
    title: 'Others',
    adsCount: 3244,
    subcategories: [

      { id: '3', title: 'Charity', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=200&h=200&fit=crop' },
      { id: '4', title: 'Others', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop' },
      { id: '5', title: 'Inquires', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' }
    ]
  }
];

export function CategoriesGrid() {


  return (
    <div className="space-y-12">

      <div className="xl:col-count-2 xl:col-gap-12 xl:col-w-1/2 xl:col-rule-1 xl:col-rule-solid xl:col-rule-gray-200">
        {categories.map((category) => (
          <div key={category.id} className="w-full break-inside-avoid mb-12">
          <CategorySection
            category={category}
          />
        </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { CategorySection } from './CategorySection';
import { Category } from '@/types/category';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ApiSubCategory {
  id: number;
  name: string;
  imageUrl: string;
  numberOfOffers: number;
}

interface ApiCategory {
  id: number;
  name: string;
  numberOfOffers: number;
  subCategories: ApiSubCategory[];
}

export function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const params = useParams();
  const locale = params.locale as string;
  console.log(locale);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log(locale);
        const response = await fetch('http://alaamohamad-001-site1.qtempurl.com/api/shared/categories/all-categories', {
          headers: {
            'Accept': 'text/plain',
            'Accept-Language': locale
          }
        });
        const result = await response.json();
        console.log(result);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        if (result.success && result.data) {
          console.log(result.data);
          const mappedCategories: Category[] = result.data.map((category: ApiCategory) => ({
            id: category.id.toString(),
            title: category.name,
            adsCount: category.numberOfOffers,
            subcategories: category.subCategories.map((sub: ApiSubCategory) => ({
              id: sub.id.toString(),
              title: sub.name,
              image: `http://alaamohamad-001-site1.qtempurl.com/uploads/${sub.imageUrl}`
            }))
          }));
          setCategories(mappedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [locale]);


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

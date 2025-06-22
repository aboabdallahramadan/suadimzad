'use client'
import { Search } from 'lucide-react'
import React from 'react'
import { useTranslations } from 'next-intl';
import SubcategorySelector from './SubcategorySelector';

const SearchBar = () => {
  const t = useTranslations();
  return (
    <div className="bg-secondary-bg w-full">
      <div className='container mx-auto px-4 py-4'>      
        <div className="flex items-center justify-center">
          <div className="flex max-w-2xl w-full gap-2 lg:gap-6 rounded-lg shadow-sm">
            {/* Search Input */}
            <div className="flex-1 bg-white rounded-lg">
              <input
                type="text"
                placeholder={t('common.searchPlaceholder')}
                className="w-full h-12 px-4 border-0 outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            
            {/* Category Selector */}
            <div className="border-l border-gray-200 bg-white rounded-lg">
              <SubcategorySelector />
            </div>
            
            {/* Search Button */}
            <button className="bg-white hover:bg-gray-100 transition-colors px-4 flex items-center justify-center rounded-lg cursor-pointer">
              <Search className="w-5 h-5 text-primary-color" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
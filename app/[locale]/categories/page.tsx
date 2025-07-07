import { CategoriesGrid } from '@/components/category/CategoriesGrid'
import { useTranslations } from 'next-intl'
import React from 'react'

const page = () => {
    const t = useTranslations('categories')
  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="container mx-auto px-4 py-8">
        <h1 className='text-2xl font-bold'>{t('title')}</h1>
        <p className='text-gray-500'>{t('description')}</p>
      </div>
        {/* Categories Grid */}
      <div className='bg-white'>

        <div className="container mx-auto px-4 py-8">
          <CategoriesGrid />
        </div>
      </div>
    </div>
  )
}

export default page
'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { X, ChevronRight } from 'lucide-react';
import { Category } from '@/types/category';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories: Omit<Category, 'adsCount' | 'subcategories'>[] = [
  {
    id: '1',
    title: 'categories.realEstate',
  },
  {
    id: '2',
    title: 'categories.vehicles',
  },
  {
    id: '3',
    title: 'categories.services',
  },
  {
    id: '4',
    title: 'categories.familyNeeds',
  },
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className={`absolute top-0 right-0 h-full w-80 bg-white shadow-xl`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{t('nav.allCategories')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <Link
              href={`/post-ad`}
              className="flex items-center justify-between p-3 text-white hover:text-primary-accent font-semibold bg-primary-color rounded-lg"
              onClick={onClose}
            >
              {t('nav.postAd')}
            </Link>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 mb-3">{t('nav.allCategories')}</h3>

              {/* Categories */}
              {categories.map((category, index) => (
                <CategoryItem
                  key={index}
                  href={`/${category.id}`}
                  label={t(category.title)}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Login Button */}
        <div className="p-4 border-t">
          <Link
            href={`/login`}
            className="block w-full text-center py-3 bg-primary-accent text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            onClick={onClose}
          >
            {t('nav.login')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function CategoryItem({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      onClick={onClick}
    >
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </Link>
  );
}

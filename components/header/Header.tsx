'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Bell, User, Menu } from 'lucide-react';
import { MobileMenu } from '../MobileMenu';
import { LanguageToggle } from '../LanguageToggle';
import SearchBar from './SearchBar';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations();

  return (
    <>
      <header className="bg-white shadow-sm relative z-50">

        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-12'>

            
              {/* Logo */}
              <Link href={`/`} className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Mzad Qatar"
                  width={120}
                  height={40}
                  className="h-14 w-auto"
                />
              </Link>

              {/* Desktop Navigation */}
              {/* <nav className="hidden lg:flex items-center gap-6 font-bold">
                <div className="relative">
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-accent transition-colors cursor-pointer"
                  >
                    {t('nav.categories')}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </nav> */}
            </div>


            {/* Right side actions */}
            <div className="flex items-center gap-4 sm:gap-12">

              <button className="text-gray-600 hover:text-primary-accent transition-colors cursor-pointer">
                <Bell className="w-6 h-6" />
              </button>

              <button className="text-gray-600 hover:text-primary-accent transition-colors cursor-pointer">
                <User className="w-6 h-6" />
              </button>

              <LanguageToggle />

              

              <Link href="/post-ad" className="hidden sm:block bg-primary-color text-white px-4 py-2 rounded-lg hover:text-primary-accent transition-colors font-bold cursor-pointer">
                {t('nav.postAd')}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-gray-600 hover:text-primary-accent transition-colors cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <SearchBar />

      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

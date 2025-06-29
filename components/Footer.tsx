"use client";
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';


export function Footer() {
  const t = useTranslations();
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Image
              src={'/logo.png'}
              alt="Mzad Qatar"
              width={120}
              height={40}
              className="h-20 w-auto mb-4 filter brightness-0 invert"
            />
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/real-estate`} className="text-gray-300 hover:text-white transition-colors">
                  {t('categories.realEstate')}
                </Link>
              </li>
              <li>
                <Link href={`/vehicles`} className="text-gray-300 hover:text-white transition-colors">
                  {t('categories.vehicles')}
                </Link>
              </li>
              <li>
                <Link href={`/jobs`} className="text-gray-300 hover:text-white transition-colors">
                  {t('categories.jobs')}
                </Link>
              </li>
              <li>
                <Link href={`/electronics`} className="text-gray-300 hover:text-white transition-colors">
                  {t('categories.electronics')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t('footer.support')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/contact`} className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href={`/privacy`} className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/terms`} className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Download Apps */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t('nav.downloadApp')}
            </h3>
            <div className="space-y-3">
              <Link href="#" className="block">
                <Image
                  src="https://ext.same-assets.com/2145698040/520926225.png"
                  alt="Download on App Store"
                  width={140}
                  height={42}
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
              <Link href="#" className="block">
                <Image
                  src="https://ext.same-assets.com/2145698040/3311889595.png"
                  alt="Get it on Google Play"
                  width={140}
                  height={42}
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
              <Link href="#" className="block">
                <Image
                  src="https://ext.same-assets.com/2145698040/2184484851.svg"
                  alt="Download from Huawei AppGallery"
                  width={140}
                  height={42}
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}

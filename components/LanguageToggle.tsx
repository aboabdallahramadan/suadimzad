'use client';

import { useRouter, useParams } from 'next/navigation';

export function LanguageToggle() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.push(`/${newLocale}`);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-gray-600 hover:text-primary-accent transition-colors font-bold cursor-pointer"
    >
      <span className="text-sm font-medium">
        {locale === 'en' ? 'AR' : 'EN'}
      </span>
    </button>
  );
}

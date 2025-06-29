"use client";
import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-primary-bg py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('privacy.pageTitle')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('privacy.lastUpdated')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy.introduction')}
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('privacy.infoCollection')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy.infoCollectionText')}
                </p>
              </div>

              {/* How We Use Your Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('privacy.infoUse')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy.infoUseText')}
                </p>
              </div>

              {/* Information Sharing */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('privacy.infoSharing')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy.infoSharingText')}
                </p>
              </div>

              {/* Data Security */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('privacy.dataSecurity')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy.dataSecurityText')}
                </p>
              </div>

              {/* Contact Us */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('privacy.contactUs')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy.contactUsText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
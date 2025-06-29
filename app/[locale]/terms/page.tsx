"use client";
import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-primary-bg py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('terms.pageTitle')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('terms.lastUpdated')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed">
                  {t('terms.introduction')}
                </p>
              </div>

              {/* Acceptance of Terms */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('terms.acceptance')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('terms.acceptanceText')}
                </p>
              </div>

              {/* User Accounts */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('terms.userAccounts')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('terms.userAccountsText')}
                </p>
              </div>

              {/* Posting Ads */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('terms.posting')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('terms.postingText')}
                </p>
              </div>

              {/* Prohibited Uses */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('terms.prohibited')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('terms.prohibitedText')}
                </p>
              </div>

              {/* Termination */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('terms.termination')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('terms.terminationText')}
                </p>
              </div>

              {/* Contact Us */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('terms.contactUs')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('terms.contactUsText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
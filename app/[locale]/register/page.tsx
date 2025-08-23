"use client";
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { registerUser } from '@/lib/api';

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      phoneNumber: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.phoneNumber.trim() && formData.firstName.trim() && formData.lastName.trim()) {
      setIsLoading(true);
      try {
        const response = await registerUser(
          formData.firstName + " " + formData.lastName, 
          formData.phoneNumber,
          locale
        );

        if (response.success && response.data) {
          const userId = response.data.id;
          router.push(`/otp?phone=${encodeURIComponent(formData.phoneNumber)}&type=register&userId=${userId}`);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t('auth.unknownError') || 'An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-color to-primary-accent rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {t('auth.signUpTitle')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link href="/login" className="font-semibold text-primary-accent hover:text-primary-dark transition-colors duration-200">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 backdrop-blur-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.firstName')}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent transition-all duration-200"
                  placeholder={t('auth.firstNamePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.lastName')}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent transition-all duration-200"
                  placeholder={t('auth.lastNamePlaceholder')}
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-3">
                {t('auth.phoneNumber')}
              </label>
              <div className="relative">
                {/* Phone Number Input */}
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent transition-all duration-200 text-lg"
                  placeholder="12345678"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !formData.phoneNumber.trim() || !formData.firstName.trim() || !formData.lastName.trim()}
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-primary-color to-primary-accent hover:from-primary-accent hover:to-primary-color focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('common.loading')}
                  </div>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                      <svg className="h-6 w-6 text-white group-hover:text-gray-200 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </span>
                    {t('auth.createAccount')}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-medium">Free Account</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-medium">Secure</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-medium">Instant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
} 
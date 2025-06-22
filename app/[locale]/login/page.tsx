import Link from 'next/link';

interface LoginPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {locale === 'ar' ? 'أو' : 'Or'}{' '}
            <Link href={`/${locale}/register`} className="font-medium text-primary-accent hover:text-primary-dark">
              {locale === 'ar' ? 'إنشاء حساب جديد' : 'create a new account'}
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {locale === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent focus:z-10 sm:text-sm"
                  placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {locale === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent focus:z-10 sm:text-sm"
                  placeholder={locale === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-accent focus:ring-primary-accent border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {locale === 'ar' ? 'تذكرني' : 'Remember me'}
                </label>
              </div>

              <div className="text-sm">
                <Link href={`/${locale}/forgot-password`} className="font-medium text-primary-accent hover:text-primary-dark">
                  {locale === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot your password?'}
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-accent hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent transition-colors"
              >
                {locale === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

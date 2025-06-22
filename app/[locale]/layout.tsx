import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Mulish } from "next/font/google";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/Footer";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mzad Qatar - اكبر سوق في قطر",
  description: "Biggest marketplace in Qatar. Post free ads. Buy and sell used cars, apartment for rent, search jobs and more",
};
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  // Providing all messages to the client side
  const messages = await getMessages({locale});

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className={`${mulish.variable} min-h-screen flex flex-col font-sans`}>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer/>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import CookieBanner from "./components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Новини України - Актуальні новини та події",
    template: "%s | Новини України"
  },
  description: "Актуальні новини України з найкращих джерел: УНІАН, Українська правда, BBC Україна, РБК-Україна. Читайте останні новини, аналітику та коментарі. Обговорюйте події в чаті з іншими користувачами.",
  keywords: [
    "новини України",
    "актуальні новини",
    "УНІАН",
    "Українська правда",
    "BBC Україна",
    "РБК-Україна",
    "новини сьогодні",
    "політика України",
    "економіка України",
    "суспільство України",
    "війна в Україні",
    "новини онлайн"
  ],
  authors: [{ name: "Новини України" }],
  creator: "Новини України",
  publisher: "Новини України",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: '/',
    title: 'Новини України - Актуальні новини та події',
    description: 'Актуальні новини України з найкращих джерел. Читайте останні новини, аналітику та коментарі. Обговорюйте події в чаті.',
    siteName: 'Новини України',
    images: [
      {
        url: '/news-publishing-svgrepo-com.svg',
        width: 800,
        height: 800,
        alt: 'Новини України',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Новини України - Актуальні новини та події',
    description: 'Актуальні новини України з найкращих джерел. Читайте останні новини та обговорюйте події в чаті.',
    images: ['/news-publishing-svgrepo-com.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/news-publishing-svgrepo-com.svg',
    shortcut: '/news-publishing-svgrepo-com.svg',
    apple: '/news-publishing-svgrepo-com.svg',
  },
  verification: {
    // Додайте ваші ключі верифікації, якщо потрібно
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  category: 'news',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Новини України',
    description: 'Актуальні новини України з найкращих джерел',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/news-publishing-svgrepo-com.svg`,
    sameAs: [],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="uk">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}

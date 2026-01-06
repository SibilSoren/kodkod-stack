import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodkodstack.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'kodkod | Small CLI. Big backends.',
    template: '%s | kodkod',
  },
  description: 'Production-ready backend boilerplate generator. Choose Express, Hono, or Fastify with Prisma, Drizzle, or Mongoose. Own every line of code.',
  keywords: [
    'backend boilerplate',
    'Node.js scaffolding',
    'Express generator',
    'Hono framework',
    'Fastify boilerplate',
    'Prisma setup',
    'Drizzle ORM',
    'Mongoose MongoDB',
    'TypeScript backend',
    'API generator',
    'CLI tool',
    'kodkod',
  ],
  authors: [{ name: 'kodkod' }],
  creator: 'kodkod',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'kodkod',
    title: 'kodkod | Small CLI. Big backends.',
    description: 'Production-ready backend boilerplate generator. Choose your framework, ORM, and database. Own every line of code.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'kodkod - Small CLI. Big backends.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kodkod | Small CLI. Big backends.',
    description: 'Production-ready backend boilerplate generator. Choose your framework, ORM, and database.',
    images: ['/og-image.png'],
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
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import TanstackQueryProvider from '@/providers/TanstackQueryProvider';
import { Toaster } from '@/components/ui/sonner';
import { StructuredData } from '@/components/SEO/StructuredData';
import { generateLocalBusinessSchema, generateWebsiteSchema, generateOrganizationSchema } from '@/lib/seo/structured-data';
import GoogleAnalytics from '@/components/SEO/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'Dezinfect MD - Dezinfectanți și Echipamente Medicale Moldova',
  description: 'Magazin online cu dezinfectanți profesionali și echipamente medicale în Moldova. Calitate superioară pentru medicina generală și stomatologie.',
  keywords: ['dezinfectanți Moldova', 'echipamente medicale', 'consumabile medicale', 'dezinfectanți profesionali', 'stomatologie', 'medicina generală', 'magazin medical Moldova'],
  authors: [{ name: 'Dezinfect MD', url: 'https://dezinfect.md' }],
  creator: 'Dezinfect MD',
  publisher: 'Dezinfect MD',
  metadataBase: new URL('https://dezinfect.md'),
  alternates: {
    canonical: 'https://dezinfect.md',
  },
  openGraph: {
    title: 'Dezinfect MD - Dezinfectanți și Echipamente Medicale',
    description: 'Magazin online cu dezinfectanți profesionali și echipamente medicale în Moldova.',
    url: 'https://dezinfect.md',
    siteName: 'Dezinfect MD',
    locale: 'ro_MD',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ro" suppressHydrationWarning>
            <head>
                <StructuredData data={generateLocalBusinessSchema()} />
                <StructuredData data={generateWebsiteSchema()} />
                <StructuredData data={generateOrganizationSchema()} />
                <GoogleAnalytics GA_MEASUREMENT_ID="G-H8BQVBM821" />
            </head>
            <body className={`${inter.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TanstackQueryProvider>
                        {children}
                        <Toaster closeButton richColors position="top-center"/>
                    </TanstackQueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

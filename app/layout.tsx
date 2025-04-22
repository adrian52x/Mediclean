import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { supabaseServer } from '@/lib/supabase/server';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mediclean',
  description: 'Medical products and services',
  keywords: ['E-Commerce', 'Store', 'Shop', 'Medical', 'Products'],
  authors: [{ name: 'adrian52x', url: 'https://github.com/adrian52x' }],
  creator: 'adrian52x',
  publisher: 'adrian52x',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await supabaseServer();
  const { data: session, error: authError } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar session={session} />
          <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

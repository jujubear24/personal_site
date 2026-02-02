/**
 * Sentient UI Root Layout
 * 
 * Minimal layout for the Sentient experience.
 * No NavBar/Footer - navigation is handled by SentientNav component.
 */

import type { Metadata } from 'next';
import { Playfair_Display, Space_Mono } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jules | Senior Systems Engineer',
  description: 'Personal portfolio and AI assistant - Building digital systems at the intersection of engineering precision and creative vision.',
  keywords: ['software engineer', 'AI', 'portfolio', 'web development', 'systems engineering'],
  authors: [{ name: 'Jules' }],
  openGraph: {
    title: 'Jules | Senior Systems Engineer',
    description: 'Personal portfolio and AI assistant',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${spaceMono.variable} font-mono antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

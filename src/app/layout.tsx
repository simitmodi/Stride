
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ScrollAwareFooter } from '@/components/scroll-aware-footer';
import { ThemeProvider } from "@/components/theme-provider";

import { FirebaseClientProvider } from '@/firebase/client-provider';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';
import RootHeader from '@/components/root-header';
import SessionTimeoutHandler from '@/components/SessionTimeoutHandler';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

// Metadata is defined as a static object, not a function returning one.
export const metadata: Metadata = {
  title: 'Stride',
  description: 'Stride: Connecting customers and banks seamlessly.',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />

      </head>
      <body className="font-body antialiased h-full flex flex-col">
        <ThemeProvider>
          <FirebaseClientProvider>
            <SessionTimeoutHandler>
              <FirebaseErrorListener />
              <RootHeader />
              <div className="flex-grow">
                {children}
              </div>
              <ScrollAwareFooter />
              <Toaster />
              <Analytics />
              <SpeedInsights />
            </SessionTimeoutHandler>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

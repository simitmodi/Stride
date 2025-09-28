import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ScrollAwareFooter } from '@/components/scroll-aware-footer';
import Script from 'next/script';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';

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
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <Script src="https://www.google.com/recaptcha/enterprise.js?render=6Lfqw9IrAAAAAATsZvi3VG5KnxYHZWZA7eap6url" strategy="lazyOnload" />
      </head>
      <body className="font-body antialiased h-full flex flex-col">
        <FirebaseClientProvider>
          <FirebaseErrorListener />
          <div className="flex-grow">
            {children}
          </div>
          <ScrollAwareFooter />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

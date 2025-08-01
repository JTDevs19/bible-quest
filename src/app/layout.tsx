import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Bible Quest',
  description: 'A journey of faith, fun, and discovery. Powered by God through AI.',
  manifest: '/manifest.webmanifest',
  icons: {
    apple: '/icon-512x512.png',
    icon: '/icon.svg',
    other: [
      {
        rel: 'mask-icon',
        url: '/icon.svg',
        color: '#673AB7'
      },
      {
        rel: 'icon',
        url: '/icon_monochrome.svg',
        media: '(prefers-color-scheme: dark)',
      },
       {
        rel: 'icon',
        url: '/icon_monochrome.svg',
        media: '(prefers-color-scheme: light)',
      },
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#673AB7" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

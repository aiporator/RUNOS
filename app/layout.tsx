import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://run.aiporate.com'),
  title: {
    default: 'RunOS — The Operating System for Running Communities',
    template: '%s · RunOS',
  },
  description:
    'RunOS replaces the spreadsheet, the group chat sprawl, and the ticketing tax with one platform: members, events, money, sponsors, and an AI that plans your month.',
  applicationName: 'RunOS',
  authors: [{ name: 'Aiporate' }],
  openGraph: {
    type: 'website',
    siteName: 'RunOS',
    title: 'RunOS — Run the club. Not the chaos.',
    description:
      'One login. One database. Your whole club. Members, events, money, sponsors, and an AI that plans your month.',
    url: 'https://run.aiporate.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RunOS — Run the club. Not the chaos.',
    description: 'The operating system for communities that move. Free under 50 members.',
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

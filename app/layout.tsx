import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Digital Restaurant Menu',
  description: 'Mobile digital restaurant menu for instant NFC and QR code access.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-stone-100">
      <body className="h-full antialiased selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

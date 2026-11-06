import type { Metadata } from 'next';
import Providers from '@/src/components/Providers';
import Header from '@/src/components/Header';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'RentalCar — Find your perfect rental car', template: '%s | RentalCar' },
  description:
    'Find your perfect rental car in Ukraine. Compare cars, filter by brand, price and mileage, and book your next journey with RentalCar.',
  applicationName: 'RentalCar',
  openGraph: {
    title: 'RentalCar',
    description: 'Reliable and budget-friendly car rentals for any journey.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

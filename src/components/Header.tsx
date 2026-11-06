'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function Header() {
  const path = usePathname();
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo" aria-label="RentalCar home">
          Rental<span>Car</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/" aria-current={path === '/' ? 'page' : undefined}>
            Home
          </Link>
          <Link href="/catalog" aria-current={path.startsWith('/catalog') ? 'page' : undefined}>
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}

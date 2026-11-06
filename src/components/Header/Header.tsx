'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const path = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo} aria-label="RentalCar home">
          Rental<span>Car</span>
        </Link>

        <nav className={styles.navigation} aria-label="Main navigation">
          <Link href="/" aria-current={path === '/' ? 'page' : undefined}>
            Home
          </Link>

          <Link
            href="/catalog"
            aria-current={path.startsWith('/catalog') ? 'page' : undefined}
          >
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
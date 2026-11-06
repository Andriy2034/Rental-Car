import Link from 'next/link';
import styles from './Home.module.css';
import common from './Common.module.css';

export default function Home() {
  return (
    <main id="main" className={styles.hero}>
      <div>
        <h1>Find your perfect rental car</h1>
        <p>Reliable and budget-friendly rentals for any journey</p>

        <Link
          className={`${common.button} ${styles.heroButton}`}
          href="/catalog"
        >
          View Catalog
        </Link>
      </div>
    </main>
  );
}
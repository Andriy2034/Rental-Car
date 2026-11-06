import Link from 'next/link';
export default function Home() {
  return (
    <main id="main" className="hero">
      <div className="hero-content">
        <h1>Find your perfect rental car</h1>
        <p>Reliable and budget-friendly rentals for any journey</p>
        <Link className="button hero-button" href="/catalog">
          View Catalog
        </Link>
      </div>
    </main>
  );
}

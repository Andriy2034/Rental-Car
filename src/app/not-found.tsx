import Link from "next/link";
import common from "./Common.module.css";

export default function NotFound() {
  return (
    <main id="main" className={common.emptyState}>
      <h1>Page not found</h1>
      <p>The page or car you are looking for is unavailable.</p>
      <Link href="/catalog" className={common.button}>
        View Catalog
      </Link>
    </main>
  );
}

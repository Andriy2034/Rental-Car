'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="empty-state">
      <h1>Unable to load this page</h1>
      <p>Please check your connection and try again.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}

"use client";
import common from "./Common.module.css";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className={common.emptyState}>
      <h1>Unable to load this page</h1>
      <p>Please check your connection and try again.</p>
      <button className={common.button} onClick={reset}>
        Try again
      </button>
    </main>
  );
}

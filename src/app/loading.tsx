import styles from './Loading.module.css';

export default function Loading() {
  return (
    <main id="main" className={styles.pageLoading} role="status">
      <span className={styles.spinner} />
      Loading…
    </main>
  );
}

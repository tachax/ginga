import styles from './Logo.module.css';

export function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.bars} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className={`display ${styles.text}`}>ginga</span>
    </span>
  );
}

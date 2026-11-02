import styles from './HeroHeader.module.css';

const EQ_BARS = 12;

export function HeroHeader() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className={styles.hero}>
      <div>
        <p className={styles.date}>{today}</p>
        <h1 className={`display ${styles.title}`}>How the world dances</h1>
        <p className={styles.subtitle}>
          Danceability, energy and mood of 90k tracks across 114 genres.
        </p>
      </div>

      <div className={styles.equalizer} aria-hidden="true">
        {Array.from({ length: EQ_BARS }, (_, i) => (
          <span key={i} style={{ animationDelay: `${i * -0.15}s` }} />
        ))}
      </div>
    </header>
  );
}

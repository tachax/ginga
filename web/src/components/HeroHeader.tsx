import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './HeroHeader.module.css';

const genreOptions = [
  { value: 'all', label: 'All genres' },
  { value: 'samba', label: 'samba' },
  { value: 'tango', label: 'tango' },
];

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

        <div className={styles.controls}>
          <div className={styles.search}>
            <Input
              size="large"
              placeholder="Search a song or artist"
              prefix={<SearchOutlined />}
            />
          </div>
          <div className={styles.genre}>
            <Select
              size="large"
              defaultValue="all"
              options={genreOptions}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div className={styles.equalizer} aria-hidden="true">
        {Array.from({ length: EQ_BARS }, (_, i) => (
          <span key={i} style={{ animationDelay: `${i * -0.15}s` }} />
        ))}
      </div>
    </header>
  );
}

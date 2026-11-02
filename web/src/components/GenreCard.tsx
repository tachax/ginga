import { Card } from 'antd';
import { FeatureBars } from './FeatureBars';
import type { GenreStat } from '../types';
import styles from './GenreCard.module.css';

type GenreCardProps = {
  rank: number;
  stat: GenreStat;
  metricLabel: string;
  formattedValue: string;
  selected: boolean;
  onSelect: () => void;
};

export function GenreCard({
  rank,
  stat,
  metricLabel,
  formattedValue,
  selected,
  onSelect,
}: GenreCardProps) {
  return (
    <Card
      hoverable
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      style={{
        height: '100%',
        ...(selected && { borderColor: '#2E7D4F', background: '#EEF7F0' }),
      }}
      styles={{ body: { padding: 18 } }}
    >
      <div className={styles.meta}>
        <span>#{rank}</span>
        <span>{stat.tracks.toLocaleString('en-US')} tracks</span>
      </div>
      <div className={`display ${styles.name}`}>{stat.genre}</div>
      <div className={styles.value}>
        <span className={`display ${styles.number}`}>{formattedValue}</span>
        <span className={styles.metric}>{metricLabel}</span>
      </div>
      <FeatureBars features={stat} keys={['danceability', 'energy', 'valence']} compact />
    </Card>
  );
}

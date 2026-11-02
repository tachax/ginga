import { Progress } from 'antd';
import type { GenreStat } from '../types';
import styles from './GenreRow.module.css';

type GenreRowProps = {
  rank: number;
  stat: GenreStat;
  percent: number;
  formattedValue: string;
  selected: boolean;
  onSelect: () => void;
};

export function GenreRow({ rank, stat, percent, formattedValue, selected, onSelect }: GenreRowProps) {
  return (
    <button
      type="button"
      className={`${styles.row} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className={styles.rank}>#{rank}</span>
      <span className={styles.body}>
        <span className={`display ${styles.name}`}>{stat.genre}</span>
        <Progress
          percent={percent}
          showInfo={false}
          size="small"
          strokeColor="#2E7D4F"
          style={{ margin: 0 }}
        />
      </span>
      <span className={`display ${styles.value}`}>{formattedValue}</span>
    </button>
  );
}

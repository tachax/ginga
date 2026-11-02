import { Progress } from 'antd';
import type { AudioFeatures } from '../types';
import styles from './FeatureBars.module.css';

type FeatureKey = keyof AudioFeatures;

const FEATURE_META: Record<FeatureKey, { label: string; short: string; color: string }> = {
  danceability: { label: 'Dance', short: 'Dance', color: '#2E7D4F' },
  energy: { label: 'Energy', short: 'Energy', color: '#3A8A5B' },
  valence: { label: 'Happiness', short: 'Happy', color: '#5DA677' },
  acousticness: { label: 'Acoustic', short: 'Acoustic', color: '#E8955A' },
  speechiness: { label: 'Speech', short: 'Speech', color: '#7FB8C9' },
  liveness: { label: 'Live', short: 'Live', color: '#7FB8C9' },
};

const ALL_FEATURES: FeatureKey[] = [
  'danceability',
  'energy',
  'valence',
  'acousticness',
  'speechiness',
  'liveness',
];

type FeatureBarsProps = {
  features: Partial<AudioFeatures>;
  keys?: FeatureKey[];
  compact?: boolean;
};

export function FeatureBars({ features, keys = ALL_FEATURES, compact = false }: FeatureBarsProps) {
  return (
    <div className={compact ? styles.compact : undefined}>
      {keys.map((key) => {
        const meta = FEATURE_META[key];
        const value = features[key] ?? 0;
        return (
          <div key={key} className={styles.row}>
            <span className={styles.label}>{compact ? meta.short : meta.label}</span>
            <Progress
              percent={value * 100}
              showInfo={false}
              size="small"
              strokeColor={meta.color}
              style={{ margin: 0 }}
            />
            {!compact && <span className={styles.value}>{value.toFixed(2)}</span>}
          </div>
        );
      })}
    </div>
  );
}

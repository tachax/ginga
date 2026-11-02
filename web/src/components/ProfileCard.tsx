import type { ReactNode } from 'react';
import { Card } from 'antd';
import { FeatureBars } from './FeatureBars';
import type { AudioFeatures } from '../types';
import styles from './ProfileCard.module.css';

type ProfileStat = {
  label: string;
  value: ReactNode;
};

type ProfileCardProps = {
  eyebrow?: ReactNode;
  title: string;
  subtitle?: string;
  stats: ProfileStat[];
  features: AudioFeatures;
  children?: ReactNode;
};

/** Shared layout for the track panel and the genre panel. */
export function ProfileCard({ eyebrow, title, subtitle, stats, features, children }: ProfileCardProps) {
  return (
    <Card>
      {eyebrow}
      <h2 className={`display ${styles.title}`}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <div className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={`display ${styles.statValue}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>Sound profile</h3>
      <FeatureBars features={features} />

      {children}
    </Card>
  );
}

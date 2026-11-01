import type { ReactNode } from 'react';
import { Card, Progress } from 'antd';
import styles from './StatCard.module.css';

type StatCardProps = {
  label: string;
  value: ReactNode;
  suffix?: string;
  hint?: string;
  progress?: { percent: number; color: string };
  loading?: boolean;
};

export function StatCard({
  label,
  value,
  suffix,
  hint,
  progress,
  loading = false,
}: StatCardProps) {
  return (
    <Card loading={loading} className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={`display ${styles.value}`}>
        {value}
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {hint && <div className={styles.hint}>{hint}</div>}
      {progress && (
        <Progress
          percent={progress.percent}
          strokeColor={progress.color}
          showInfo={false}
        />
      )}
    </Card>
  );
}

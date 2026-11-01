import type { ReactNode } from 'react';
import { Alert, Card } from 'antd';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  children: ReactNode;
};

export function ChartCard({
  title,
  subtitle,
  loading = false,
  error,
  children,
}: ChartCardProps) {
  return (
    <Card
      title={<span className='display'>{title}</span>}
      extra={subtitle && <span style={{ color: '#557063', fontSize: 13}}>{subtitle}</span>}
      loading={loading}
      style={{ height: '100%' }}
      styles={{ header: { borderBottom: 'none' } }}
    >
      {error ? <Alert type="error" showIcon message={error} /> : children}
    </Card>
  )
}
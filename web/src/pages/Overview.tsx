import { Alert, Col, Row } from 'antd';
import { HeroHeader } from '../components/HeroHeader';
import { StatCard } from '../components/StatCard';
import { useApi } from '../hooks/useApi';
import type { Summary } from '../types';

export function Overview() {
  const { data, loading, error } = useApi<Summary>('/api/stats/summary');

  return (
    <>
      <HeroHeader />

      {error && (
        <Alert
          type="error"
          showIcon
          message="Could not load stats"
          description={error}
          style={{ marginTop: 24 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="Tracks"
            value={data?.tracks.toLocaleString('en-US')}
            hint="unique, deduplicated from 114k rows"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="Genres"
            value={data?.genres}
            hint="from acoustic to world-music"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="Avg. danceability"
            value={data?.avgDanceability.toFixed(2)}
            progress={{ percent: (data?.avgDanceability ?? 0) * 100, color: '#2E7D4F' }}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="Avg. popularity"
            value={data && Math.round(data.avgPopularity)}
            suffix="/100"
            progress={{ percent: data?.avgPopularity ?? 0, color: '#E8955A' }}
            loading={loading}
          />
        </Col>
      </Row>
    </>
  );
}

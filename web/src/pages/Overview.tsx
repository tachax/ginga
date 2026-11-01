import { Alert, Col, Row } from 'antd';
import { HeroHeader } from '../components/HeroHeader';
import { StatCard } from '../components/StatCard';
import { useApi } from '../hooks/useApi';
import { ChartCard } from '../components/ChartCard';
import type { GenreStat, Summary, MoodPoint, TempoBin } from '../types';
import { TopGenresChart } from '../components/charts/TopGenresChart';
import { MoodMapChart } from '../components/charts/MoodMapChart';
import { TempoChart } from '../components/charts/TempoChart';

export function Overview() {
  const { data, loading, error } = useApi<Summary>('/api/stats/summary');
  const topGenres = useApi<GenreStat[]>('/api/genres/top?metric=danceability&limit=8');
  const mood = useApi<MoodPoint[]>('/api/stats/mood?sample=300');
  const tempo = useApi<TempoBin[]>('/api/stats/tempo');

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

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <ChartCard
            title="Most danceable genres"
            subtitle="mean danceability"
            loading={topGenres.loading}
            error={topGenres.error}
          >
            <TopGenresChart data={topGenres.data ?? []} />
          </ChartCard>
        </Col>

        <Col xs={24} lg={8}>
          <ChartCard
            title="Mood map"
            subtitle="energy × happiness (valence)"
            loading={mood.loading}
            error={mood.error}
          >
            <MoodMapChart data={mood.data ?? []} />
          </ChartCard>
        </Col>
        
        <Col xs={24} lg={8}>
          <ChartCard
            title="Tempo (BPM)"
            subtitle="tracks per tempo range"
            loading={tempo.loading}
            error={tempo.error}
          >
            <TempoChart data={tempo.data ?? []} />
          </ChartCard>
        </Col>
      </Row>

    </>
  );
}

import { useState } from 'react';
import { Alert, Card, Col, Drawer, Flex, Grid, Row, Segmented } from 'antd';
import { ChartCard } from '../components/ChartCard';
import { GenreCard } from '../components/GenreCard';
import { GenrePanel } from '../components/GenrePanel';
import { GenreRow } from '../components/GenreRow';
import { GenreMapChart } from '../components/charts/GenreMapChart';
import { useApi } from '../hooks/useApi';
import type { GenreMetric, GenreStat } from '../types';
import styles from './Genres.module.css';

const METRICS: { value: GenreMetric; label: string }[] = [
  { value: 'danceability', label: 'Danceability' },
  { value: 'energy', label: 'Energy' },
  { value: 'valence', label: 'Happiness' },
  { value: 'popularity', label: 'Popularity' },
];

const TOP_N = 20;

// Popularity is 0–100; the audio features are 0–1.
function formatMetric(metric: GenreMetric, value: number) {
  return metric === 'popularity' ? String(Math.round(value)) : value.toFixed(2);
}

function toPercent(metric: GenreMetric, value: number) {
  return metric === 'popularity' ? value : value * 100;
}

type GenresProps = {
  onExploreGenre: (genre: string) => void;
};

export function Genres({ onExploreGenre }: GenresProps) {
  const [metric, setMetric] = useState<GenreMetric>('danceability');
  const [selected, setSelected] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const ranking = useApi<GenreStat[]>(`/api/genres/top?metric=${metric}&limit=${TOP_N}`);
  const genres = ranking.data ?? [];
  const activeGenre = selected ?? genres[0]?.genre ?? null;

  const screens = Grid.useBreakpoint();
  const isPhone = !screens.md;
  const useDrawer = !screens.lg;

  const metricLabel = METRICS.find((m) => m.value === metric)?.label.toLowerCase() ?? metric;

  function handleSelect(genre: string) {
    setSelected(genre);
    if (useDrawer) setDrawerOpen(true);
  }

  function isHighlighted(genre: string) {
    return useDrawer ? genre === selected : genre === activeGenre;
  }

  const panel = <GenrePanel genre={activeGenre} onExplore={onExploreGenre} />;

  return (
    <>
      <Flex justify="space-between" align="flex-end" gap={16} wrap className={styles.header}>
        <div>
          <h1 className={`display ${styles.title}`}>Genres</h1>
          <p className={styles.subtitle}>
            The top {TOP_N} of 114 genres by how they move. Pick one to see its full profile.
          </p>
        </div>
        <div className={styles.metrics}>
          <Segmented
            options={METRICS}
            value={metric}
            onChange={(value) => setMetric(value as GenreMetric)}
            style={{ border: '1px solid #E1EADC' }}
          />
        </div>
      </Flex>

      {ranking.error && (
        <Alert
          type="error"
          showIcon
          message="Could not load genres"
          description={ranking.error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          {ranking.loading && !ranking.data && <Card loading />}

          {isPhone ? (
            <Flex vertical gap={10}>
              {genres.map((stat, i) => (
                <GenreRow
                  key={stat.genre}
                  rank={i + 1}
                  stat={stat}
                  percent={toPercent(metric, stat.value)}
                  formattedValue={formatMetric(metric, stat.value)}
                  selected={isHighlighted(stat.genre)}
                  onSelect={() => handleSelect(stat.genre)}
                />
              ))}
            </Flex>
          ) : (
            <Row gutter={[16, 16]}>
              {genres.map((stat, i) => (
                <Col key={stat.genre} xs={12} xl={8} xxl={6}>
                  <GenreCard
                    rank={i + 1}
                    stat={stat}
                    metricLabel={metricLabel}
                    formattedValue={formatMetric(metric, stat.value)}
                    selected={isHighlighted(stat.genre)}
                    onSelect={() => handleSelect(stat.genre)}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Col>

        {!useDrawer && (
          <Col lg={8}>
            <Flex vertical gap={16}>
              {panel}
              <ChartCard title="Genre map" subtitle="energy × danceability">
                <GenreMapChart data={genres} selected={activeGenre} onSelect={handleSelect} />
              </ChartCard>
            </Flex>
          </Col>
        )}
      </Row>

      {useDrawer && (
        <Drawer
          title="Genre profile"
          placement="bottom"
          size="85%"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          styles={{ body: { padding: 12, background: '#F3F7EF' } }}
        >
          {panel}
        </Drawer>
      )}
    </>
  );
}

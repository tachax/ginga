import { Button, Card, Flex, Progress, Tag } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useApi } from '../hooks/useApi';
import type { TrackDetails } from '../types';
import styles from './TrackPanel.module.css';

function formatDuration(ms: number) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

type TrackPanelProps = {
  trackId: string | null;
};

export function TrackPanel({ trackId }: TrackPanelProps) {
  const details = useApi<TrackDetails>(
    trackId ? `/api/tracks/${encodeURIComponent(trackId)}` : null,
  );

  if (!trackId) {
    return <Card>Click a track to see its profile.</Card>;
  }

  const track = details.data;

  if (!track) {
    return <Card loading={details.loading} />;
  }

  const stats = [
    { label: 'BPM', value: Math.round(track.tempo) },
    { label: 'Duration', value: formatDuration(track.durationMs) },
    { label: 'Popularity', value: track.popularity },
  ];

  const features = [
    { label: 'Dance', value: track.danceability, color: '#2E7D4F' },
    { label: 'Energy', value: track.energy, color: '#3A8A5B' },
    { label: 'Happiness', value: track.valence, color: '#5DA677' },
    { label: 'Acoustic', value: track.acousticness, color: '#E8955A' },
    { label: 'Speech', value: track.speechiness, color: '#7FB8C9' },
    { label: 'Live', value: track.liveness, color: '#7FB8C9' },
  ];

  return (
    <Card>
      <Flex gap={4} wrap>
        {track.genres.map((genre) => (
          <Tag
            key={genre}
            style={{ background: '#DDF0E1', color: '#2E7D4F', border: 'none' }}
          >
            {genre}
          </Tag>
        ))}
      </Flex>
      <h2 className={`display ${styles.name}`}>{track.name}</h2>
      <p className={styles.artists}>{track.artists}</p>

      <div className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={`display ${styles.statValue}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>Sound profile</h3>
      {features.map((feature) => (
        <div key={feature.label} className={styles.feature}>
          <span>{feature.label}</span>
          <Progress
            percent={feature.value * 100}
            showInfo={false}
            size="small"
            strokeColor={feature.color}
            style={{ margin: 0 }}
          />
          <span className={styles.featureValue}>{feature.value.toFixed(2)}</span>
        </div>
      ))}

      <Button
        type="primary"
        size="large"
        shape="round"
        block
        icon={<CaretRightOutlined />}
        href={`https://open.spotify.com/track/${encodeURIComponent(track.id)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginTop: 20 }}
      >
        Listen on Spotify
      </Button>
    </Card>
  );
}

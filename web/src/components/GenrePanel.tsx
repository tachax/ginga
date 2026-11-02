import { Alert, Button, Card } from 'antd';
import { CustomerServiceOutlined } from '@ant-design/icons';
import { ProfileCard } from './ProfileCard';
import { useApi } from '../hooks/useApi';
import type { GenreProfile } from '../types';
import styles from './GenrePanel.module.css';

type GenrePanelProps = {
  genre: string | null;
  onExplore: (genre: string) => void;
};

export function GenrePanel({ genre, onExplore }: GenrePanelProps) {
  const profile = useApi<GenreProfile>(
    genre ? `/api/genres/${encodeURIComponent(genre)}` : null,
  );

  if (!genre) {
    return <Card>Pick a genre to see its profile.</Card>;
  }

  const data = profile.data;

  if (!data) {
    return (
      <Card loading={profile.loading}>
        {profile.error && <Alert type="error" showIcon message={profile.error} />}
      </Card>
    );
  }

  return (
    <ProfileCard
      eyebrow={<span className={styles.eyebrow}>Genre profile</span>}
      title={data.genre}
      stats={[
        { label: 'Tracks', value: data.tracks.toLocaleString('en-US') },
        { label: 'Avg BPM', value: Math.round(data.tempo) },
        { label: 'Popularity', value: Math.round(data.popularity) },
      ]}
      features={data}
    >
      {data.topTrack && (
        <div className={styles.topTrack}>
          <span className={styles.icon} aria-hidden="true">
            <CustomerServiceOutlined />
          </span>
          <div>
            <div className={styles.topLabel}>Most danceable track</div>
            <div className={styles.topName}>{data.topTrack.name}</div>
            <div className={styles.topArtists}>{data.topTrack.artists}</div>
          </div>
        </div>
      )}

      <Button
        type="primary"
        size="large"
        shape="round"
        block
        style={{ marginTop: 16 }}
        onClick={() => onExplore(data.genre)}
      >
        Explore {data.genre} tracks →
      </Button>
    </ProfileCard>
  );
}

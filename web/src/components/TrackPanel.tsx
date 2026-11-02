import { Button, Card, Flex } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { GenreTag } from './GenreTag';
import { ProfileCard } from './ProfileCard';
import { useApi } from '../hooks/useApi';
import type { TrackDetails } from '../types';

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

  return (
    <ProfileCard
      eyebrow={
        <Flex gap={4} wrap>
          {track.genres.map((genre) => (
            <GenreTag key={genre} genre={genre} />
          ))}
        </Flex>
      }
      title={track.name}
      subtitle={track.artists}
      stats={[
        { label: 'BPM', value: Math.round(track.tempo) },
        { label: 'Duration', value: formatDuration(track.durationMs) },
        { label: 'Popularity', value: track.popularity },
      ]}
      features={track}
    >
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
    </ProfileCard>
  );
}

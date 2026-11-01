import { Flex, Progress, Table, Tag, type TableProps } from 'antd';
import type { Track } from '../types';

const columns: TableProps<Track>['columns'] = [
  {
    title: 'Track',
    key: 'track',
    render: (_, track) => (
      <div>
        <div style={{ fontWeight: 600 }}>{track.name}</div>
        <div style={{ color: '#557063', fontSize: 13 }}>{track.artists}</div>
      </div>
    ),
  },
  {
    title: 'Genre',
    dataIndex: 'genres',
    render: (genres: string[]) =>
      genres.map((genre) => (
        <Tag key={genre} style={{ background: '#DDF0E1', color: '#2E7D4F', border: 'none' }}>
          {genre}
        </Tag>
      )),
  },
  {
    title: 'Danceability',
    dataIndex: 'danceability',
    width: 200,
    render: (value: number) => (
      <Flex align="center" gap={8}>
        <Progress
          percent={value * 100}
          showInfo={false}
          size="small"
          strokeColor="#2E7D4F"
          style={{ width: 90, margin: 0 }}
        />
        <span>{value.toFixed(2)}</span>
      </Flex>
    ),
  },
  { title: 'Energy', dataIndex: 'energy', render: (value: number) => value.toFixed(2) },
  { title: 'BPM', dataIndex: 'tempo', render: (value: number) => Math.round(value) },
  { title: 'Popularity', dataIndex: 'popularity' },
];

type TracksTableProps = {
  tracks: Track[];
  loading?: boolean;
};

export function TracksTable({ tracks, loading = false }: TracksTableProps) {
  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tracks}
      loading={loading}
      pagination={false}
    />
  );
}

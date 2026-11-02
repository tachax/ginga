import { Flex, Progress, Table, Tag, type TableProps } from 'antd';
import type { Track } from '../types';

const SORTABLE = ['name', 'danceability', 'energy', 'tempo', 'popularity'];

const columns: NonNullable<TableProps<Track>['columns']> = [
  {
    title: 'Track',
    key: 'name',
    render: (_, track) => (
      <div>
        <div style={{ fontWeight: 600 }}>{track.name}</div>
        <div style={{ color: '#557063', fontSize: 13 }}>{track.artists}</div>
      </div>
    ),
  },
  {
    title: 'Genre',
    key: 'genres',
    dataIndex: 'genres',
    responsive: ['md'],
    render: (genres: string[]) =>
      genres.map((genre) => (
        <Tag key={genre} style={{ background: '#DDF0E1', color: '#2E7D4F', border: 'none' }}>
          {genre}
        </Tag>
      )),
  },
  {
    title: 'Danceability',
    key: 'danceability',
    dataIndex: 'danceability',
    width: 170,
    render: (value: number) => (
      <Flex align="center" gap={8}>
        <Progress
          percent={value * 100}
          showInfo={false}
          size="small"
          strokeColor="#2E7D4F"
          style={{ width: 80, margin: 0 }}
        />
        <span>{value.toFixed(2)}</span>
      </Flex>
    ),
  },
  {
    title: 'Energy',
    key: 'energy',
    dataIndex: 'energy',
    responsive: ['md'],
    render: (value: number) => value.toFixed(2),
  },
  {
    title: 'BPM',
    key: 'tempo',
    dataIndex: 'tempo',
    responsive: ['md'],
    render: (value: number) => Math.round(value),
  },
  {
    title: 'Popularity',
    key: 'popularity',
    dataIndex: 'popularity',
    responsive: ['md'],
  },
];

type TracksTableProps = {
  tracks: Track[];
  loading?: boolean;
  pagination?: TableProps<Track>['pagination'];
  sort?: string;
  onSortChange?: (sort: string) => void;
  selectedId?: string;
  onSelect?: (track: Track) => void;
};

export function TracksTable({
  tracks,
  loading = false,
  pagination = false,
  sort,
  onSortChange,
  selectedId,
  onSelect,
}: TracksTableProps) {
  const sortField = sort?.replace(/^-/, '');
  const sortDesc = sort?.startsWith('-');

  const tableColumns = columns.map((column) => {
    const key = String(column.key);
    if (!onSortChange || !SORTABLE.includes(key)) return column;

    return {
      ...column,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortField === key ? (sortDesc ? ('descend' as const) : ('ascend' as const)) : null,
    };
  });

  return (
    <Table
      rowKey="id"
      columns={tableColumns}
      dataSource={tracks}
      loading={loading}
      pagination={pagination}
      onRow={(track) => ({
        onClick: onSelect ? () => onSelect(track) : undefined,
        style: {
          cursor: onSelect ? 'pointer' : undefined,
          background: track.id === selectedId ? '#DDF0E1' : undefined,
        },
      })}
      onChange={(_pagination, _filters, sorter, extra) => {
        if (extra.action !== 'sort' || !onSortChange) return;

        const current = Array.isArray(sorter) ? sorter[0] : sorter;
        if (!current.order) {
          onSortChange('-danceability');
          return;
        }
        onSortChange(`${current.order === 'descend' ? '-' : ''}${String(current.columnKey)}`);
      }}
    />
  );
}

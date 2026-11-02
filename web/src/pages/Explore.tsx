import { useState } from 'react';
import { Card } from 'antd';
import { Filters } from '../components/Filters';
import { TracksTable } from '../components/TracksTable';
import { useApi } from '../hooks/useApi';
import type { TrackFilters, TrackPage } from '../types';

const DEFAULT_FILTERS: TrackFilters = {
  q: '',
  minDance: 0,
  hideExplicit: false,
  genre: null,
};

const PAGE_SIZE = 10;

function buildTracksPath(filters: TrackFilters, page: number, sort: string) {
  const params = new URLSearchParams({
    sort,
    page: String(page),
    pageSize: String(PAGE_SIZE),
  });

  if (filters.q) params.set('q', filters.q);
  if (filters.minDance > 0) params.set('minDance', String(filters.minDance));
  if (filters.hideExplicit) params.set('explicit', 'false');
  if (filters.genre) params.set('genre', filters.genre);

  return `/api/tracks?${params}`;
}

export function Explore() {
  const [filters, setFilters] = useState<TrackFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-danceability');
  const path = buildTracksPath(filters, page, sort);
  const tracks = useApi<TrackPage>(path);

  function handleFiltersChange(next: TrackFilters) {
    setFilters(next);
    setPage(1);
  }

  function handleSortChange(next: string) {
    setSort(next);
    setPage(1);
  }

  return (
    <>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 40 }}>
        Explore tracks
      </h1>
      <p style={{ margin: '0 0 24px', color: '#557063' }}>
        Filter by genre and click a track to see its profile.
      </p>

      <Filters value={filters} onChange={handleFiltersChange} />

      <Card style={{ marginTop: 16 }}>
        <TracksTable
          tracks={tracks.data?.items ?? []}
          loading={tracks.loading}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: tracks.data?.total ?? 0,
            onChange: setPage,
            showSizeChanger: false,
            showTotal: (total, range) =>
              `Showing ${range[0]}–${range[1]} of ${total.toLocaleString('en-US')}`,
          }}
          sort={sort}
          onSortChange={handleSortChange}
        />
      </Card>
    </>
  );
}

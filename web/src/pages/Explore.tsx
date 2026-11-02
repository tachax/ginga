import { useState } from 'react';
import { Card, Col, Drawer, Grid, Row } from 'antd';
import { TrackPanel } from '../components/TrackPanel';
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

type ExploreProps = {
  initialGenre?: string | null;
};

export function Explore({ initialGenre = null }: ExploreProps) {
  const [filters, setFilters] = useState<TrackFilters>({
    ...DEFAULT_FILTERS,
    genre: initialGenre,
  });
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-danceability');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const path = buildTracksPath(filters, page, sort);
  const tracks = useApi<TrackPage>(path);
  const activeId = selectedId ?? tracks.data?.items[0]?.id ?? null;

  const screens = Grid.useBreakpoint();
  const isPhone = !screens.md;
  const useDrawer = !screens.lg;

  function handleFiltersChange(next: TrackFilters) {
    setFilters(next);
    setPage(1);
    setSelectedId(null);
  }

  function handleSortChange(next: string) {
    setSort(next);
    setPage(1);
    setSelectedId(null);
  }

  return (
    <>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: isPhone ? 32 : 40 }}>
        Explore tracks
      </h1>
      <p style={{ margin: '0 0 24px', color: '#557063' }}>
        Filter by genre and click a track to see its profile.
      </p>

      <Filters value={filters} onChange={handleFiltersChange} />

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card>
            <TracksTable
              tracks={tracks.data?.items ?? []}
              loading={tracks.loading}
              pagination={{
                current: page,
                pageSize: PAGE_SIZE,
                total: tracks.data?.total ?? 0,
                onChange: setPage,
                showSizeChanger: false,
                simple: isPhone,
                showTotal: isPhone
                  ? undefined
                  : (total, range) =>
                      `Showing ${range[0]}–${range[1]} of ${total.toLocaleString('en-US')}`,
              }}
              sort={sort}
              onSortChange={handleSortChange}
              selectedId={(useDrawer ? selectedId : activeId) ?? undefined}
              onSelect={(track) => {
                setSelectedId(track.id);
                if (useDrawer) setDrawerOpen(true);
              }}
            />
          </Card>
        </Col>
        {!useDrawer && (
          <Col lg={8}>
            <TrackPanel trackId={activeId} />
          </Col>
        )}
      </Row>

      {useDrawer && (
        <Drawer
          title="Track profile"
          placement="bottom"
          size="85%"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          styles={{ body: { padding: 12, background: '#F3F7EF' } }}
        >
          <TrackPanel trackId={activeId} />
        </Drawer>
      )}
    </>
  );
}

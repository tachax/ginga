import { useState } from 'react';
import { Filters } from '../components/Filters';
import type { TrackFilters } from '../types';

const DEFAULT_FILTERS: TrackFilters = {
  q: '',
  minDance: 0,
  hideExplicit: false,
  genre: null,
};

export function Explore() {
  const [filters, setFilters] = useState<TrackFilters>(DEFAULT_FILTERS);

  return (
    <>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 40 }}>
        Explore tracks
      </h1>
      <p style={{ margin: '0 0 24px', color: '#557063' }}>
        Filter by genre and click a track to see its profile.
      </p>

      <Filters value={filters} onChange={setFilters} />

      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </>
  );
}

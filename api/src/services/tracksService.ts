import { pool } from '../db.js';

const ARTISTS_SQL = `(SELECT string_agg(a.name, ', ' ORDER BY a.name)
   FROM track_artists ta JOIN artists a ON a.id = ta.artist_id
  WHERE ta.track_id = t.track_id)`;

const GENRES_SQL = `(SELECT array_agg(g.name ORDER BY g.name)
   FROM track_genres tg JOIN genres g ON g.id = tg.genre_id
  WHERE tg.track_id = t.track_id)`;

export const SORT_COLUMNS = ['danceability', 'energy', 'tempo', 'popularity', 'name'] as const;
export type SortColumn = (typeof SORT_COLUMNS)[number];

export type Track = {
  id: string;
  name: string;
  artists: string;
  genres: string[];
  danceability: number;
  energy: number;
  tempo: number;
  popularity: number;
};

export type TrackPage = {
  items: Track[];
  total: number;
  page: number;
  pageSize: number;
};
type TrackQuery = {
  sort: SortColumn;
  desc: boolean;
  page: number;
  pageSize: number;
  genre?: string;
  minDance?: number;
  explicit?: boolean;
  q?: string;
};

export async function listTracks(query: TrackQuery): Promise<TrackPage> {
  const { sort, desc, page, pageSize, genre, minDance, explicit, q } = query;
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (genre) {
    params.push(genre);
    conditions.push(`EXISTS (
      SELECT 1 FROM track_genres tg JOIN genres g ON g.id = tg.genre_id
      WHERE tg.track_id = t.track_id AND g.name = $${params.length})`);
  }
  if (minDance !== undefined) {
    params.push(minDance);
    conditions.push(`t.danceability >= $${params.length}`);
  }
  if (explicit !== undefined) {
    params.push(explicit);
    conditions.push(`t.explicit = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    const p = `$${params.length}`;
    conditions.push(`(t.name ILIKE ${p} OR EXISTS (
      SELECT 1 FROM track_artists ta JOIN artists a ON a.id = ta.artist_id
      WHERE ta.track_id = t.track_id AND a.name ILIKE ${p}))`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;

  const [itemsResult, countResult] = await Promise.all([
    pool.query<Track>(
      `SELECT
         t.track_id AS id, t.name, t.danceability, t.energy, t.tempo, t.popularity,
         ${ARTISTS_SQL} AS artists,
         ${GENRES_SQL} AS genres
       FROM tracks t
       ${where}
       ORDER BY t.${sort} ${desc ? 'DESC' : 'ASC'}, t.track_id
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pageSize, offset],
    ),
    pool.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM tracks t ${where}`,
      params,
    ),
  ]);

  return {
    items: itemsResult.rows,
    total: countResult.rows[0].total,
    page,
    pageSize,
  };
}

export type TrackDetails = Track & {
  album: string | null;
  durationMs: number;
  explicit: boolean;
  valence: number;
  acousticness: number;
  speechiness: number;
  liveness: number;
};

export async function getTrack(id: string): Promise<TrackDetails | null> {
  const { rows } = await pool.query<TrackDetails>(
    `SELECT
       t.track_id AS id, t.name, t.album, t.duration_ms AS "durationMs", t.explicit,
       t.popularity, t.tempo, t.danceability, t.energy, t.valence,
       t.acousticness, t.speechiness, t.liveness,
       ${ARTISTS_SQL} AS artists,
       ${GENRES_SQL} AS genres
     FROM tracks t
     WHERE t.track_id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

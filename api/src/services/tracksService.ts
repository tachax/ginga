import { pool } from '../db.js';

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
};

export async function listTracks({ sort, desc, page, pageSize }: TrackQuery): Promise<TrackPage> {
  const offset = (page - 1) * pageSize;

  const [itemsResult, countResult] = await Promise.all([
    pool.query<Track>(
      `SELECT
         t.track_id AS id, t.name, t.danceability, t.energy, t.tempo, t.popularity,
         (SELECT string_agg(a.name, ', ' ORDER BY a.name)
            FROM track_artists ta JOIN artists a ON a.id = ta.artist_id
           WHERE ta.track_id = t.track_id) AS artists,
         (SELECT array_agg(g.name ORDER BY g.name)
            FROM track_genres tg JOIN genres g ON g.id = tg.genre_id
           WHERE tg.track_id = t.track_id) AS genres
       FROM tracks t
       ORDER BY t.${sort} ${desc ? 'DESC' : 'ASC'}, t.track_id
       LIMIT $1 OFFSET $2`,
      [pageSize, offset],
    ),
    pool.query<{ total: number }>('SELECT COUNT(*)::int AS total FROM tracks'),
  ]);

  return {
    items: itemsResult.rows,
    total: countResult.rows[0].total,
    page,
    pageSize,
  };
}

import { pool } from '../db.js';

export const METRICS = [
  'danceability', 'energy', 'valence', 'acousticness', 'speechiness',
  'liveness', 'instrumentalness', 'tempo', 'popularity',
] as const;

export type Metric = (typeof METRICS)[number];

export type GenreStat = {
  genre: string;
  value: number;
};

export async function getTopGenres(metric: Metric, limit: number): Promise<GenreStat[]> {
  const { rows } = await pool.query<GenreStat>(
    `SELECT g.name AS genre, AVG(t.${metric})::float AS value
     FROM genres g
     JOIN track_genres tg ON tg.genre_id = g.id
     JOIN tracks t        ON t.track_id = tg.track_id
     GROUP BY g.name
     ORDER BY value DESC
     LIMIT $1`,
    [limit],
  );
  return rows;
}

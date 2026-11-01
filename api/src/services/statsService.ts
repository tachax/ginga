import { pool } from '../db.js';

export type Summary = {
  tracks: number;
  genres: number;
  avgDanceability: number;
  avgPopularity: number;
};

export async function getSummary(): Promise<Summary> {
  const { rows } = await pool.query<Summary>(`
    SELECT
      COUNT(*)::int                       AS tracks,
      (SELECT COUNT(*)::int FROM genres)  AS genres,
      AVG(danceability)                   AS "avgDanceability",
      AVG(popularity)::float              AS "avgPopularity"
    FROM tracks
  `);
  return rows[0];
}

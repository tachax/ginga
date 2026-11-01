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

export type MoodPoint = {
  id: string;
  name: string;
  energy: number;
  valence: number;
  popularity: number;
  group: string;
};

export async function getMoodSample(perGroup: number): Promise<MoodPoint[]> {
  const { rows } = await pool.query<MoodPoint>(
    `WITH labeled AS (
       SELECT
         t.track_id, t.name, t.energy, t.valence, t.popularity,
         CASE
           WHEN g.name IN ('samba', 'forro', 'salsa') THEN 'samba, forró, salsa'
           WHEN g.name IN ('tango', 'mpb')            THEN 'tango, mpb'
           ELSE 'others'
         END AS grp
       FROM tracks t
       JOIN track_genres tg ON tg.track_id = t.track_id
       JOIN genres g        ON g.id = tg.genre_id
     ),
     ranked AS (
       SELECT *, ROW_NUMBER() OVER (PARTITION BY grp ORDER BY random()) AS rn
       FROM labeled
     )
     SELECT track_id AS id, name, energy, valence, popularity, grp AS "group"
     FROM ranked
     WHERE rn <= $1`,
    [perGroup],
  );
  return rows;
}

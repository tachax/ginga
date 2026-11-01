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

export type SoundProfile = {
  genre: string;
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  liveness: number;
  speechiness: number;
};

export async function compareGenres(a: string, b: string): Promise<SoundProfile[]> {
  const { rows } = await pool.query<SoundProfile>(
    `SELECT
       g.name              AS genre,
       AVG(t.danceability) AS danceability,
       AVG(t.energy)       AS energy,
       AVG(t.valence)      AS valence,
       AVG(t.acousticness) AS acousticness,
       AVG(t.liveness)     AS liveness,
       AVG(t.speechiness)  AS speechiness
     FROM genres g
     JOIN track_genres tg ON tg.genre_id = g.id
     JOIN tracks t        ON t.track_id = tg.track_id
     WHERE g.name IN ($1, $2)
     GROUP BY g.name`,
    [a, b],
  );
  return rows;
}

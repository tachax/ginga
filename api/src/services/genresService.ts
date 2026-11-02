import { pool } from '../db.js';
import { listTracks, type Track } from './tracksService.js';

export const METRICS = [
  'danceability', 'energy', 'valence', 'acousticness', 'speechiness',
  'liveness', 'instrumentalness', 'tempo', 'popularity',
] as const;

export type Metric = (typeof METRICS)[number];

export type GenreStat = {
  genre: string;
  value: number;
  tracks: number;
  danceability: number;
  energy: number;
  valence: number;
};

export async function getTopGenres(metric: Metric, limit: number): Promise<GenreStat[]> {
  const { rows } = await pool.query<GenreStat>(
    `SELECT
       g.name                     AS genre,
       AVG(t.${metric})::float    AS value,
       COUNT(*)::int              AS tracks,
       AVG(t.danceability)::float AS danceability,
       AVG(t.energy)::float       AS energy,
       AVG(t.valence)::float      AS valence
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

export type GenreProfile = SoundProfile & {
  tracks: number;
  tempo: number;
  popularity: number;
  topTrack: Track | null;
};

export async function getGenreProfile(name: string): Promise<GenreProfile | null> {
  const [profileResult, topTracks] = await Promise.all([
    pool.query<Omit<GenreProfile, 'topTrack'>>(
      `SELECT
         g.name                   AS genre,
         COUNT(*)::int            AS tracks,
         AVG(t.tempo)::float      AS tempo,
         AVG(t.popularity)::float AS popularity,
         AVG(t.danceability)      AS danceability,
         AVG(t.energy)            AS energy,
         AVG(t.valence)           AS valence,
         AVG(t.acousticness)      AS acousticness,
         AVG(t.liveness)          AS liveness,
         AVG(t.speechiness)       AS speechiness
       FROM genres g
       JOIN track_genres tg ON tg.genre_id = g.id
       JOIN tracks t        ON t.track_id = tg.track_id
       WHERE g.name = $1
       GROUP BY g.name`,
      [name],
    ),
    listTracks({ genre: name, sort: 'danceability', desc: true, page: 1, pageSize: 1 }),
  ]);

  const profile = profileResult.rows[0];
  if (!profile) return null;

  return { ...profile, topTrack: topTracks.items[0] ?? null };
}

export async function listGenres(): Promise<string[]> {
  const { rows } = await pool.query<{ name: string }>(
    'SELECT name FROM genres ORDER BY name',
  );
  return rows.map((r) => r.name);
}

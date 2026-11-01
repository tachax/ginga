import { readFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import pg from 'pg';

type CsvRow = Record<string, string>;

const csvPath = new URL('./data/dataset.csv', import.meta.url);
const csv = readFileSync(csvPath, 'utf8');
const rows: CsvRow[] = parse(csv, { columns: true, skip_empty_lines: true });

const tracks = new Map<string, CsvRow>();             // track_id -> first row seen
const trackGenres = new Map<string, Set<string>>();   // track_id -> genre names
const trackArtists = new Map<string, Set<string>>();  // track_id -> artist names
const genres = new Set<string>();
const artists = new Set<string>();
let skipped = 0;

for (const row of rows) {
  if (!row.track_name || !row.artists) {
    skipped++;
    continue;
  }

  const id = row.track_id;

  if (!tracks.has(id)) {
    tracks.set(id, row);
    trackGenres.set(id, new Set());
    trackArtists.set(id, new Set());
  }

  trackGenres.get(id)!.add(row.track_genre);
  genres.add(row.track_genre);

  for (const name of row.artists.split(';')) {
    const artist = name.trim();
    if (!artist) continue;
    trackArtists.get(id)!.add(artist);
    artists.add(artist);
  }
}

const countPairs = (map: Map<string, Set<string>>) =>
  [...map.values()].reduce((sum, set) => sum + set.size, 0);

console.log({
  csvRows: rows.length,
  skipped,
  tracks: tracks.size,
  genres: genres.size,
  artists: artists.size,
  trackGenres: countPairs(trackGenres),
  trackArtists: countPairs(trackArtists),
});

const CHUNK_SIZE = 5000;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function insertTracks(list: CsvRow[]) {
  let inserted = 0;

  for (const batch of chunk(list, CHUNK_SIZE)) {
    const text = (key: string) => batch.map((r) => r[key] || null);
    const num = (key: string) => batch.map((r) => Number(r[key]));

    await client.query(
      `INSERT INTO tracks (track_id, name, album, popularity, duration_ms, explicit,
         danceability, energy, valence, acousticness, speechiness, liveness,
         instrumentalness, tempo, loudness, key, mode)
       SELECT * FROM unnest(
         $1::text[], $2::text[], $3::text[], $4::int[], $5::int[], $6::boolean[],
         $7::real[], $8::real[], $9::real[], $10::real[], $11::real[], $12::real[],
         $13::real[], $14::real[], $15::real[], $16::int[], $17::int[])`,
      [
        text('track_id'), text('track_name'), text('album_name'),
        num('popularity'), num('duration_ms'),
        batch.map((r) => r.explicit === 'True'),
        num('danceability'), num('energy'), num('valence'), num('acousticness'),
        num('speechiness'), num('liveness'), num('instrumentalness'),
        num('tempo'), num('loudness'), num('key'), num('mode'),
      ],
    );

    inserted += batch.length;
    console.log(`tracks: ${inserted}/${list.length}`);
  }
}

async function insertNames(table: 'genres' | 'artists', names: string[]) {
  const { rows } = await client.query<{ id: number; name: string }>(
    `INSERT INTO ${table} (name) SELECT * FROM unnest($1::text[]) RETURNING id, name`,
    [names],
  );
  console.log(`${table}: ${rows.length}`);
  return new Map(rows.map((r) => [r.name, r.id]));
}

async function insertPairs(
  table: 'track_genres' | 'track_artists',
  column: 'genre_id' | 'artist_id',
  links: Map<string, Set<string>>,
  ids: Map<string, number>,
) {
  const trackIds: string[] = [];
  const otherIds: number[] = [];

  for (const [trackId, names] of links) {
    for (const name of names) {
      trackIds.push(trackId);
      otherIds.push(ids.get(name)!);
    }
  }

  for (let i = 0; i < trackIds.length; i += CHUNK_SIZE) {
    await client.query(
      `INSERT INTO ${table} (track_id, ${column})
       SELECT * FROM unnest($1::text[], $2::int[])`,
      [trackIds.slice(i, i + CHUNK_SIZE), otherIds.slice(i, i + CHUNK_SIZE)],
    );
  }
  console.log(`${table}: ${trackIds.length}`);
}


const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  await client.query('BEGIN');
  await client.query(
    'TRUNCATE tracks, genres, artists, track_genres, track_artists RESTART IDENTITY',
  );
  await insertTracks([...tracks.values()]);
  const genreIds = await insertNames('genres', [...genres]);
  const artistIds = await insertNames('artists', [...artists]);
  await insertPairs('track_genres', 'genre_id', trackGenres, genreIds);
  await insertPairs('track_artists', 'artist_id', trackArtists, artistIds);

  await client.query('COMMIT');
  console.log('Seed done');
} catch (err) {
  await client.query('ROLLBACK');
  console.error('Seed failed, rolled back:', err);
  process.exitCode = 1;
} finally {
  await client.end();
}


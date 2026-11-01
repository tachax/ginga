-- Drop in reverse dependency order so the script can be re-run
DROP TABLE IF EXISTS track_artists, track_genres, artists, genres, tracks;

CREATE TABLE tracks (
  track_id         TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  album            TEXT,
  popularity       INT,
  duration_ms      INT,
  explicit         BOOLEAN,
  danceability     REAL,
  energy           REAL,
  valence          REAL,
  acousticness     REAL,
  speechiness      REAL,
  liveness         REAL,
  instrumentalness REAL,
  tempo            REAL,
  loudness         REAL,
  key              INT,
  mode             INT
);

CREATE TABLE genres (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE track_genres (
  track_id TEXT REFERENCES tracks(track_id) ON DELETE CASCADE,
  genre_id INT  REFERENCES genres(id)       ON DELETE CASCADE,
  PRIMARY KEY (track_id, genre_id)
);

CREATE TABLE artists (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE track_artists (
  track_id  TEXT REFERENCES tracks(track_id) ON DELETE CASCADE,
  artist_id INT  REFERENCES artists(id)      ON DELETE CASCADE,
  PRIMARY KEY (track_id, artist_id)
);

-- The composite PKs already index by track_id first.
-- These cover the other direction ("all tracks of a genre / artist").
CREATE INDEX idx_track_genres_genre   ON track_genres (genre_id);
CREATE INDEX idx_track_artists_artist ON track_artists (artist_id);

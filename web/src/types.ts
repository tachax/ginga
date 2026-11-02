export type Summary = {
  tracks: number;
  genres: number;
  avgDanceability: number;
  avgPopularity: number;
};

export type AudioFeatures = {
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  speechiness: number;
  liveness: number;
};

export type GenreMetric = 'danceability' | 'energy' | 'valence' | 'popularity';

export type GenreStat = {
  genre: string;
  value: number;
  tracks: number;
  danceability: number;
  energy: number;
  valence: number;
};

export type MoodPoint = {
  id: string;
  name: string;
  energy: number;
  valence: number;
  popularity: number;
  group: string;
};

export type TempoBin = {
  bpm: number;
  tracks: number;
};

export type SoundProfile = AudioFeatures & {
  genre: string;
};

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

export type TrackFilters = {
  q: string;
  minDance: number;
  hideExplicit: boolean;
  genre: string | null;
};

export type TrackDetails = Track & AudioFeatures & {
  album: string | null;
  durationMs: number;
  explicit: boolean;
};

export type GenreProfile = SoundProfile & {
  tracks: number;
  tempo: number;
  popularity: number;
  topTrack: Track | null;
};

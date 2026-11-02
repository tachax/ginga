export type Summary = {
  tracks: number;
  genres: number;
  avgDanceability: number;
  avgPopularity: number;
};

export type GenreStat = {
  genre: string;
  value: number;
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

export type SoundProfile = {
  genre: string;
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  liveness: number;
  speechiness: number;
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

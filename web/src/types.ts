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

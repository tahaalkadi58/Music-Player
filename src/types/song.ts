export type SongCategory = "playlist" | "albums" | "artists";

export type Song = {
  id: number;
  title: string;
  artist: string;
  composer?: string;
  year?: number;
  genre?: string;
  duration: string;
  src: string;
  cover: string;
  categories: SongCategory[];
  album: string;
};

import type { SongCategory } from "@/types/song";

class SectionTitlesClass {
  static #lastId = -1;
  id: number;
  text: string;
  slug: SongCategory;

  constructor(text: string, slug: SongCategory) {
    this.text = text;
    this.slug = slug;
    this.id = ++SectionTitlesClass.#lastId;
  }
}

export const sectionsTitlesData = [
  new SectionTitlesClass("Playlist", "playlist"),
  new SectionTitlesClass("Albums", "albums"),
  new SectionTitlesClass("Artists", "artists"),
];

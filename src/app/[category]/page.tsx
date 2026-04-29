import { notFound } from "next/navigation";
import MusicApp from "@/components/music-app";
import { allSongs } from "@/data/song-data";
import type { SongCategory } from "@/types/song";

const validCategories: SongCategory[] = ["playlist", "albums", "artists"];

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const normalized = category.toLowerCase() as SongCategory;

  if (!validCategories.includes(normalized)) {
    notFound();
  }

  const songs = allSongs.filter((song) => song.categories.includes(normalized));

  return <MusicApp songs={songs} category={normalized} />;
}

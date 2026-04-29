import MusicApp from "@/components/music-app";
import { allSongs } from "@/data/song-data";

export default function FavoritesPage() {
  return (
    <MusicApp
      songs={allSongs}
      category="playlist"
      songsOnly
      playlistTitle="Favorites"
      playlistMode="favorites"
    />
  );
}

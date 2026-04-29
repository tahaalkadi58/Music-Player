import MusicApp from "@/components/music-app";
import { allSongs } from "@/data/song-data";

export default function HistoryPage() {
  return (
    <MusicApp
      songs={allSongs}
      category="playlist"
      songsOnly
      playlistTitle="History"
      playlistMode="history"
    />
  );
}

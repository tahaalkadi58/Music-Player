import MusicApp from "@/components/music-app";
import { allSongs } from "@/data/song-data";

export default function Page() {
  return <MusicApp songs={allSongs} category="playlist" />;
}

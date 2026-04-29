import MusicApp from "@/components/music-app";
import { allSongs } from "@/data/song-data";

export default async function CustomPlaylistPage({
  params,
}: {
  params: Promise<{ playlist: string }>;
}) {
  const { playlist } = await params;

  return (
    <MusicApp
      songs={allSongs}
      category="playlist"
      songsOnly
      playlistTitle={decodeURIComponent(playlist)}
    />
  );
}

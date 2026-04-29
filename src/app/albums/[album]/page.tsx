import MusicApp from "@/components/music-app";
import { allSongs } from "@/data/song-data";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ album: string }>;
}) {
  const { album } = await params;

  return (
    <MusicApp
      songs={allSongs}
      category="playlist"
      songsOnly
      playlistTitle={decodeURIComponent(album)}
    />
  );
}

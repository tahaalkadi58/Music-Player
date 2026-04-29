import MusicApp from "@/components/music-app";
import { allSongs } from "@/data/song-data";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist } = await params;

  return (
    <MusicApp
      songs={allSongs}
      category="playlist"
      songsOnly
      playlistTitle={decodeURIComponent(artist)}
    />
  );
}

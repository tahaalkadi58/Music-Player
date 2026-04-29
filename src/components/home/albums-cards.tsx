"use client";

import Link from "next/link";
import { usePlayer } from "@/hooks/use-player";
import { toAlbumSlug } from "@/lib/album-slug";

export default function AlbumsCards() {
  const { userSongs } = usePlayer();

  const albumsMap = userSongs.reduce<Record<string, number>>((acc, song) => {
    const bucket = acc[song.album] ?? 0;
    acc[song.album] = bucket + 1;
    return acc;
  }, {});

  const albums = Object.entries(albumsMap);

  return (
    <section className="px-6 pb-20 text-white">
      <div className="grid gap-4">
        {albums.map(([albumName, tracks]) => (
          <Link
            key={albumName}
            href={`/albums/${toAlbumSlug(albumName)}`}
            className="block rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10"
          >
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{albumName}</h3>
              <span className="text-sm text-white/70">{tracks} songs</span>
            </header>
          </Link>
        ))}
      </div>
    </section>
  );
}

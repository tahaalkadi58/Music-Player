"use client";

import Link from "next/link";
import { usePlayer } from "@/hooks/use-player";
import { toArtistSlug } from "@/lib/artist-slug";

export default function ArtistsCards() {
  const { userSongs } = usePlayer();

  const artistsMap = userSongs.reduce<Record<string, number>>((acc, song) => {
    const bucket = acc[song.artist] ?? 0;
    acc[song.artist] = bucket + 1;
    return acc;
  }, {});

  const artists = Object.entries(artistsMap);

  return (
    <section className="px-6 pb-20 text-white">
      <div className="grid gap-4">
        {artists.map(([artistName, tracks]) => (
          <Link
            key={artistName}
            href={`/artists/${toArtistSlug(artistName)}`}
            className="block rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10"
          >
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{artistName}</h3>
              <span className="text-sm text-white/70">{tracks} songs</span>
            </header>
          </Link>
        ))}
      </div>
    </section>
  );
}

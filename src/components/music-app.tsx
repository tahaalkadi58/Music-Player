"use client";

import HomePage from "@/components/home/home-page";
import NowPlaying from "@/components/player/now-playing";
import { PlayerProvider } from "@/context/player-context";
import type { Song, SongCategory } from "@/types/song";

export default function MusicApp({
  songs,
  category = "playlist",
  songsOnly = false,
  playlistTitle,
  playlistMode = "all",
}: {
  songs: Song[];
  category?: SongCategory;
  songsOnly?: boolean;
  playlistTitle?: string;
  playlistMode?: "all" | "favorites" | "history";
}) {
  return (
    <PlayerProvider songs={songs}>
      <HomePage
        category={category}
        songsOnly={songsOnly}
        playlistTitle={playlistTitle}
        playlistMode={playlistMode}
      />
      <NowPlaying />
    </PlayerProvider>
  );
}

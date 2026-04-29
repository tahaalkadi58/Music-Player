"use client";

import { usePlayer } from "@/hooks/use-player";

export default function SongInfo() {
  const { userSongs, currentSongIndex } = usePlayer();
  const currentSong = userSongs[currentSongIndex];

  return (
    <div className="song-info z-[3] flex flex-col items-center justify-center">
      <div className="song-name">{currentSong?.title}</div>
      {currentSong?.artist ? <div className="artist-name">{currentSong.artist}</div> : null}
    </div>
  );
}

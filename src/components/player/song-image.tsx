"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "@/hooks/use-player";

const DEFAULT_COVER_URL = "https://wallpapercave.com/wp/wp6272587.jpg";

export default function SongImage() {
  const { userSongs, currentSongIndex, playing } = usePlayer();
  const currentSong = userSongs[currentSongIndex];
  const cover = currentSong?.cover || DEFAULT_COVER_URL;
  const [coverSrc, setCoverSrc] = useState(cover);

  useEffect(() => {
    setCoverSrc(cover);
  }, [cover, currentSong?.id]);

  return (
    <div className="song-image-container z-[3] flex items-center justify-center">
      <img
        key={currentSong?.id ?? "fallback-cover"}
        src={coverSrc}
        alt={currentSong?.title || "Current song cover"}
        className="song-image h-[300px] w-[300px] rounded-full object-cover"
        onError={() => setCoverSrc(DEFAULT_COVER_URL)}
        style={{
          animation: "rotateIt 8s linear infinite",
          animationPlayState: playing ? "running" : "paused",
        }}
      />
    </div>
  );
}

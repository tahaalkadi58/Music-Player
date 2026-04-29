"use client";

import ControlPanel from "@/components/player/control-panel";
import MiniPlayer from "@/components/player/mini-player";
import SongImage from "@/components/player/song-image";
import UpperBlock from "@/components/player/upper-block";
import { usePlayer } from "@/hooks/use-player";

export default function NowPlaying() {
  const { isPlayerShow } = usePlayer();
  const isFullScreen = isPlayerShow === "full-screen";

  return (
    <>
      <section
        className={`fixed inset-0 z-[700] grid h-dvh w-screen grid-cols-1 grid-rows-[60px_1fr_60px_20px_60px_60px_60px] p-5 text-white ${isFullScreen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`.trim()}
      >
        <div
          className="absolute left-0 top-0 z-0 h-full w-full bg-cover bg-center blur-[9px]"
          style={{
            backgroundImage: "url(https://wallpapercave.com/wp/wp6272587.jpg)",
            backgroundSize: "200%",
          }}
        />
        <UpperBlock />
        <SongImage />
        <ControlPanel />
        <div className="absolute inset-0 w-full z-[1] bg-black opacity-60" />
      </section>
      <MiniPlayer />
      
    </>
  );
}

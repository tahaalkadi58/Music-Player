"use client";

import { usePlayer } from "@/hooks/use-player";

const DEFAULT_COVER_URL = "https://picsum.photos/seed/local-track/600";

export default function MiniPlayer() {
  const {
    isPlayerShow,
    setIsPlayerShow,
    userSongs,
    currentSongIndex,
    playing,
    setPlaying,
    goToNextSong,
    goToPreviousSong,
  } = usePlayer();

  if (isPlayerShow !== "mini") {
    return null;
  }

  const currentSong = userSongs[currentSongIndex];
  if (!currentSong) {
    return null;
  }

  return (
    <section className="fixed bottom-[20px] left-3 right-3 z-[550] rounded-2xl border border-white/15 bg-black/70 px-3 py-2 text-white backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border-0"
          onClick={() => setIsPlayerShow("full-screen")}
          aria-label="Open now playing"
        >
          <img
            src={currentSong.cover || DEFAULT_COVER_URL}
            alt={currentSong.title || "Current song cover"}
            className="block h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = DEFAULT_COVER_URL;
            }}
          />
        </button>

        <button
          type="button"
          className="grid flex-grow grid-cols-1 text-left"
          onClick={() => setIsPlayerShow("full-screen")}
        >
          <span className="truncate text-sm font-semibold">{currentSong.title}</span>
          {currentSong.artist ? (
            <span className="truncate text-xs text-white/70">{currentSong.artist}</span>
          ) : null}
        </button>

        <button
          type="button"
          className="h-9 w-9 rounded-full border-0 bg-transparent text-white/80"
          onClick={goToPreviousSong}
          aria-label="Previous track"
        >
          <i className="fas fa-step-backward" />
        </button>

        <button
          type="button"
          className="h-9 w-9 rounded-full border-0 bg-white/10 text-white"
          onClick={() => setPlaying((prev) => !prev)}
          aria-label={playing ? "Pause" : "Play"}
        >
          <i className={playing ? "fas fa-pause" : "fas fa-play"} />
        </button>

        <button
          type="button"
          className="h-9 w-9 rounded-full border-0 bg-transparent text-white/80"
          onClick={goToNextSong}
          aria-label="Next track"
        >
          <i className="fas fa-step-forward" />
        </button>
      </div>
    </section>
  );
}

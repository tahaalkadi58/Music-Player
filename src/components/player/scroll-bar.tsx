"use client";

import PlayerButton from "@/components/player/button";
import { usePlayer } from "@/hooks/use-player";
import { useState } from "react";

export default function ScrollBar() {
  const {
    playing,
    setPlaying,
    playMode,
    cyclePlayMode,
    goToNextSong,
    goToPreviousSong,
    userSongs,
    currentSongIndex,
    setCurrentSongIndex,
    setSongCurrentTime,
    moveSongInQueue,
  } = usePlayer();
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const modeIcon = playMode === "shuffle" ? "fas fa-random" : "fas fa-redo-alt";

  const modeLabel =
    playMode === "shuffle"
      ? "Shuffle"
      : playMode === "repeat-all"
        ? "Repeat All"
        : "Repeat One";

  return (
    <>
      <div className="scroll-bar z-[6] row-[6/7] flex items-center justify-center">
        <PlayerButton
          icon="fad fa-list-music"
          className="list-music mx-2.5 bg-transparent"
          onClick={() => setIsQueueOpen(true)}
        />
        <PlayerButton
          icon="fad fa-step-backward"
          className="step-backward mx-2.5 bg-transparent"
          onClick={goToPreviousSong}
        />
        {playing ? (
          <PlayerButton
            icon="fas fa-pause-circle"
            className="pause mx-2.5 flex h-[65px] w-[65px] items-center justify-center bg-transparent text-[65px] hover:text-[rgb(201,201,201)] hover:before:bg-transparent"
            onClick={() => setPlaying(false)}
          />
        ) : (
          <PlayerButton
            icon="fas fa-play-circle"
            className="play mx-2.5 flex h-[65px] w-[65px] items-center justify-center bg-transparent text-[65px] hover:text-[rgb(201,201,201)] hover:before:bg-transparent"
            onClick={() => setPlaying(true)}
          />
        )}
        <PlayerButton
          icon="fad fa-step-forward"
          className="step-forward mx-2.5 bg-transparent"
          onClick={goToNextSong}
        />
        <PlayerButton
          icon={modeIcon}
          className="shuffle mx-2.5 bg-transparent"
          onClick={cyclePlayMode}
          title={modeLabel}
        >
          {playMode === "repeat-one" ? (
            <span className="absolute bottom-1 right-1 z-[4] inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/65 text-[10px] font-bold leading-none text-white">
              1
            </span>
          ) : null}
        </PlayerButton>
      </div>

      {isQueueOpen ? (
        <div
          className="fixed inset-0 z-[960] grid place-items-center bg-black/60 px-4"
          onClick={() => {
            setIsQueueOpen(false);
            setDraggedIndex(null);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/15 bg-[#1c2f4f] p-4 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Play Queue</h3>
              <button
                type="button"
                className="rounded-lg bg-white/10 px-2 py-1 text-sm hover:bg-white/20"
                onClick={() => setIsQueueOpen(false)}
              >
                Close
              </button>
            </div>
            <p className="mb-3 text-xs text-white/70">
              Drag songs up or down. The top songs play first.
            </p>
            <ul className="max-h-[55vh] space-y-2 overflow-auto pr-1">
              {userSongs.map((song, index) => (
                <li
                  key={song.id}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedIndex === null) return;
                    moveSongInQueue(draggedIndex, index);
                    setDraggedIndex(index);
                  }}
                  className={`cursor-move rounded-xl border border-white/15 p-3 transition ${
                    index === currentSongIndex
                      ? "bg-white/15"
                      : "bg-white/5 hover:bg-white/10"
                  }`.trim()}
                >
                  <button
                    type="button"
                    className="grid w-full grid-cols-[24px_1fr_auto] items-center gap-3 text-left"
                    onClick={() => {
                      setCurrentSongIndex(index);
                      setSongCurrentTime(0);
                      setPlaying(true);
                    }}
                  >
                    <span className="text-xs text-white/60">{index + 1}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {song.title}
                      </span>
                      <span className="block truncate text-xs text-white/70">
                        {song.artist || "Unknown Artist"}
                      </span>
                    </span>
                    <span className="text-xs text-white/70">
                      {song.duration}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}

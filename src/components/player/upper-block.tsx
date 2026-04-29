"use client";

import PlayerButton from "@/components/player/button";
import SongInfo from "@/components/player/song-info";
import { usePlayer } from "@/hooks/use-player";
import { useState } from "react";

type SongActionModal = "view" | "edit" | "delete" | null;

export default function UpperBlock() {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [modalType, setModalType] = useState<SongActionModal>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editArtist, setEditArtist] = useState("");
  const [editAlbum, setEditAlbum] = useState("");
  const {
    setIsPlayerShow,
    userSongs,
    currentSongIndex,
    updateSongInfo,
    removeSong,
    setPlaying,
    setSongCurrentTime,
  } = usePlayer();

  const currentSong = userSongs[currentSongIndex] ?? null;

  return (
    <>
      <div className="upper-block z-[3] flex items-center justify-between">
        <PlayerButton
          icon="fas fa-chevron-down"
          className="back"
          onClick={() => setIsPlayerShow("mini")}
        />
        <SongInfo />
        <div className="relative">
          <PlayerButton
            icon="fas fa-ellipsis-v"
            className="options"
            onClick={() => setIsOptionsOpen((prev) => !prev)}
          />
          {isOptionsOpen && currentSong ? (
            <div className="absolute right-0 top-[52px] z-20 grid min-w-[180px] gap-1 rounded-xl border border-white/15 bg-[#1c2f4f] p-2 shadow-xl">
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                onClick={() => {
                  setEditTitle(currentSong.title);
                  setEditArtist(currentSong.artist ?? "");
                  setEditAlbum(currentSong.album);
                  setModalType("edit");
                  setIsOptionsOpen(false);
                }}
              >
                Edit Info
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                onClick={() => {
                  setModalType("view");
                  setIsOptionsOpen(false);
                }}
              >
                View Info
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-left text-sm text-rose-300 hover:bg-white/10"
                onClick={() => {
                  setModalType("delete");
                  setIsOptionsOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {modalType && currentSong ? (
        <div
          className="fixed inset-0 z-[900] grid place-items-center bg-black/60 px-4"
          onClick={() => setModalType(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#1c2f4f] p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {modalType === "view" ? (
              <>
                <h3 className="mb-3 text-lg font-semibold">Song Info</h3>
                <div className="grid gap-2 text-sm text-white/85">
                  <p><span className="text-white/60">Title:</span> {currentSong.title}</p>
                  <p><span className="text-white/60">Author:</span> {currentSong.artist || "N/A"}</p>
                  {currentSong.composer ? (
                    <p><span className="text-white/60">Composer:</span> {currentSong.composer}</p>
                  ) : null}
                  <p><span className="text-white/60">Album:</span> {currentSong.album}</p>
                  {currentSong.genre ? (
                    <p><span className="text-white/60">Genre:</span> {currentSong.genre}</p>
                  ) : null}
                  {currentSong.year ? (
                    <p><span className="text-white/60">Year:</span> {currentSong.year}</p>
                  ) : null}
                  <p><span className="text-white/60">Duration:</span> {currentSong.duration}</p>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                  onClick={() => setModalType(null)}
                >
                  Close
                </button>
              </>
            ) : null}

            {modalType === "edit" ? (
              <>
                <h3 className="mb-3 text-lg font-semibold">Edit Song</h3>
                <div className="grid gap-2">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/40"
                    placeholder="Title"
                  />
                  <input
                    value={editArtist}
                    onChange={(e) => setEditArtist(e.target.value)}
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/40"
                    placeholder="Author/Artist"
                  />
                  <input
                    value={editAlbum}
                    onChange={(e) => setEditAlbum(e.target.value)}
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/40"
                    placeholder="Album"
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                    onClick={() => setModalType(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-500/70 px-3 py-2 text-sm hover:bg-emerald-500/90"
                    onClick={() => {
                      updateSongInfo(currentSong.id, {
                        title: editTitle.trim() || currentSong.title,
                        artist: editArtist.trim(),
                        album: editAlbum.trim() || currentSong.album,
                      });
                      setModalType(null);
                    }}
                  >
                    Save
                  </button>
                </div>
              </>
            ) : null}

            {modalType === "delete" ? (
              <>
                <h3 className="mb-2 text-lg font-semibold">Delete Song</h3>
                <p className="text-sm text-white/75">Are you sure you want to delete &quot;{currentSong.title}&quot;?</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                    onClick={() => setModalType(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-rose-500/70 px-3 py-2 text-sm hover:bg-rose-500/90"
                    onClick={() => {
                      removeSong(currentSong.id);
                      setPlaying(false);
                      setSongCurrentTime(0);
                      setIsPlayerShow("mini");
                      setModalType(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import PlayerButton from "@/components/player/button";
import { usePlayer } from "@/hooks/use-player";
import { useMemo, useState } from "react";

export default function SongActions() {
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [playlistNameInput, setPlaylistNameInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const {
    userSongs,
    currentSongIndex,
    toggleFavorite,
    isFavorite,
    customPlaylists,
    addSongToPlaylist,
  } = usePlayer();
  const currentSong = userSongs[currentSongIndex];
  const favorite = currentSong ? isFavorite(currentSong.id) : false;
  const playlistNames = useMemo(() => Object.keys(customPlaylists), [customPlaylists]);

  const submitPlaylist = () => {
    if (!currentSong) return;
    const result = addSongToPlaylist(currentSong.id, playlistNameInput);

    if (!result.ok) {
      if (result.reason === "invalid_name") {
        setFeedback("Please enter a valid playlist name.");
      } else {
        setFeedback("This song already exists in that playlist.");
      }
      return;
    }

    setFeedback(`Added to "${playlistNameInput.trim()}".`);
    setTimeout(() => {
      setIsPlaylistModalOpen(false);
      setFeedback("");
      setPlaylistNameInput("");
    }, 600);
  };

  return (
    <>
      <div className="song-react z-[6] flex items-center justify-center">
        <PlayerButton
          icon={favorite ? "fas fa-heart" : "fal fa-heart"}
          className={`mx-[15px] bg-transparent ${favorite ? "text-rose-300" : ""}`.trim()}
          onClick={() => {
            if (!currentSong) return;
            if (!favorite) {
              toggleFavorite(currentSong.id);
            }
          }}
        />
        <PlayerButton
          icon="fal fa-plus"
          className="mx-[15px] bg-transparent"
          onClick={() => {
            setFeedback("");
            setPlaylistNameInput("");
            setIsPlaylistModalOpen(true);
          }}
        />
      </div>

      {isPlaylistModalOpen ? (
        <div
          className="fixed inset-0 z-[950] grid place-items-center bg-black/60 px-4"
          onClick={() => setIsPlaylistModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#1c2f4f] p-4 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-semibold">Add To Playlist</h3>
            <p className="mb-3 text-sm text-white/70">Create a new playlist name or pick an existing one.</p>

            {playlistNames.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {playlistNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                    onClick={() => setPlaylistNameInput(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ) : null}

            <input
              value={playlistNameInput}
              onChange={(e) => setPlaylistNameInput(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/40"
              placeholder="Playlist name"
            />

            {feedback ? <p className="mt-2 text-sm text-white/80">{feedback}</p> : null}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                onClick={() => setIsPlaylistModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-emerald-500/70 px-3 py-2 text-sm hover:bg-emerald-500/90"
                onClick={submitPlaylist}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

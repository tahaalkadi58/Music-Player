"use client";

import PlayerButton from "@/components/player/button";
import { usePlayer } from "@/hooks/use-player";
import { toAlbumSlug } from "@/lib/album-slug";
import { toArtistSlug } from "@/lib/artist-slug";
import { songFullTimeInSecond } from "@/lib/duration";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type PlaylistMode = "all" | "favorites" | "history";
type SongActionModal = "view" | "edit" | "delete" | null;
type SortBy = "name" | "date" | "time" | "album" | "composer";
type SortDirection = "asc" | "desc";

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: "name", label: "Name" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "album", label: "Album" },
  { value: "composer", label: "Composer" },
];

export default function Playlist({
  title,
  mode = "all",
}: {
  title?: string;
  mode?: PlaylistMode;
}) {
  const [openMenuSongId, setOpenMenuSongId] = useState<number | null>(null);
  const [modalType, setModalType] = useState<SongActionModal>(null);
  const [modalSongId, setModalSongId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editArtist, setEditArtist] = useState("");
  const [editAlbum, setEditAlbum] = useState("");
  const sortRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const isAlbumDetailsPage =
    pathSegments[0] === "albums" && Boolean(pathSegments[1]);
  const isArtistDetailsPage =
    pathSegments[0] === "artists" && Boolean(pathSegments[1]);
  const isCustomPlaylistPage =
    pathSegments[0] === "playlists" && Boolean(pathSegments[1]);
  const albumSlug = isAlbumDetailsPage
    ? decodeURIComponent(pathSegments[1])
    : "";
  const artistSlug = isArtistDetailsPage
    ? decodeURIComponent(pathSegments[1])
    : "";
  const customPlaylistName = isCustomPlaylistPage
    ? decodeURIComponent(pathSegments[1])
    : "";
  const routeFirstSegment =
    pathname.split("/").filter(Boolean)[0] ?? "playlist";
  const heading =
    title ??
    routeFirstSegment.charAt(0).toUpperCase() + routeFirstSegment.slice(1);
  const {
    setIsPlayerShow,
    setCurrentSongIndex,
    setPlaying,
    userSongs,
    currentSongIndex,
    setSongCurrentTime,
    playing,
    favoriteSongIds,
    historySongIds,
    customPlaylists,
    updateSongInfo,
    removeSong,
  } = usePlayer();
  const modalSong =
    modalSongId === null
      ? null
      : (userSongs.find((song) => song.id === modalSongId) ?? null);

  const playlistEntries =
    mode === "all"
      ? userSongs.map((song, index) => ({ song, index }))
      : mode === "favorites"
        ? userSongs
            .map((song, index) => ({ song, index }))
            .filter(({ song }) => favoriteSongIds.includes(song.id))
        : historySongIds
            .map((id) => {
              const index = userSongs.findIndex((song) => song.id === id);
              if (index === -1) return null;
              return { song: userSongs[index], index };
            })
            .filter(
              (
                entry,
              ): entry is { song: (typeof userSongs)[number]; index: number } =>
                entry !== null,
            );
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const scopedEntries = playlistEntries.filter(({ song }) => {
    if (isAlbumDetailsPage) {
      return toAlbumSlug(song.album) === albumSlug;
    }
    if (isArtistDetailsPage) {
      return toArtistSlug(song.artist) === artistSlug;
    }
    if (isCustomPlaylistPage) {
      const playlistSongIds = customPlaylists[customPlaylistName] ?? [];
      return playlistSongIds.includes(song.id);
    }
    return true;
  });
  const filteredEntries =
    normalizedQuery.length === 0
      ? scopedEntries
      : scopedEntries.filter(({ song }) => {
          const haystack =
            `${song.title} ${song.artist ?? ""} ${song.album ?? ""}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const aSong = a.song;
    const bSong = b.song;

    const compareText = (v1: string, v2: string) =>
      v1.localeCompare(v2, undefined, { sensitivity: "base", numeric: true });

    let result = 0;

    if (sortBy === "name") {
      result = compareText(aSong.title, bSong.title);
    } else if (sortBy === "date") {
      const yearDiff = (aSong.year ?? 0) - (bSong.year ?? 0);
      result = yearDiff !== 0 ? yearDiff : aSong.id - bSong.id;
    } else if (sortBy === "time") {
      result =
        songFullTimeInSecond(aSong.duration) -
        songFullTimeInSecond(bSong.duration);
    } else if (sortBy === "album") {
      result = compareText(aSong.album ?? "", bSong.album ?? "");
    } else {
      result = compareText(aSong.composer ?? "", bSong.composer ?? "");
    }

    return sortDirection === "asc" ? result : -result;
  });
  const isSearching = normalizedQuery.length > 0;
  const selectedSortLabel = useMemo(
    () =>
      SORT_OPTIONS.find((option) => option.value === sortBy)?.label ?? "Sort",
    [sortBy],
  );

  useEffect(() => {
    const onWindowClick = (event: MouseEvent) => {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    };

    window.addEventListener("mousedown", onWindowClick);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onWindowClick);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <section className="playlist px-6 text-white">
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative flex-grow">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
            <i className="fas fa-search" />
          </span>
          <label htmlFor="playlist-search" className="sr-only">
            Search songs
          </label>
          <input
            id="playlist-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs by title, artist, or album..."
            className="w-full rounded-xl border border-white/20 bg-white/10 py-2 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/60 focus:border-white/40"
          />
        </div>
        <div className="relative" ref={sortRef}>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
            <i className="fas fa-sort" />
          </span>
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="inline-flex items-center justify-between rounded-xl border border-white/20 bg-white/10 py-2 pl-10 pr-3 text-sm text-white outline-none hover:bg-white/20"
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
            aria-label="Sort songs"
          >
            <span>{selectedSortLabel}</span>
            <span className="px-2">
              <i
                className={`fas ${isSortOpen ? "fa-chevron-up" : "fa-chevron-down"} text-xs`}
              />
            </span>
          </button>
          {isSortOpen ? (
            <ul
              className="absolute left-0 top-[calc(100%+6px)] z-30 min-w-[180px] rounded-xl border border-white/15 bg-[#1c2f4f] p-1 shadow-xl"
              role="listbox"
              aria-label="Sort songs options"
            >
              {SORT_OPTIONS.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10 ${sortBy === option.value ? "bg-white/10 text-white" : "text-white/85"}`.trim()}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortOpen(false);
                    }}
                    role="option"
                    aria-selected={sortBy === option.value}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() =>
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
          aria-label={
            sortDirection === "asc" ? "Sort descending" : "Sort ascending"
          }
        >
          <span className="inline-flex items-center gap-2">
            <i
              className={
                sortDirection === "asc"
                  ? "fas fa-arrow-up"
                  : "fas fa-arrow-down"
              }
            />
            {/* {sortDirection === "asc" ? "Asc" : "Desc"} */}
          </span>
        </button>
      </div>
      <ul className="grid list-none gap-[15px] [grid-template-columns:1fr] [grid-template-rows:repeat(auto-fit,60px)]">
        {sortedEntries.length === 0 ? (
          <li className="rounded-xl bg-white/5 p-4 text-sm text-white/70">
            {isSearching
              ? "No songs matched your search."
              : mode === "favorites"
                ? "No favorite songs yet."
                : mode === "history"
                  ? "No listening history yet."
                  : "No songs loaded yet. Import local music to start playing."}
          </li>
        ) : null}
        {sortedEntries.map(({ song, index }, visibleIndex) => (
          <li
            id={`song-${song.id}`}
            className={`playlist-song relative flex h-[60px] items-center justify-between rounded-xl px-2 py-1 ${currentSongIndex === index ? "bg-white/10" : ""}`.trim()}
            key={song.id}
            onClick={() => {
              setCurrentSongIndex(index);
              setPlaying(true);
              setIsPlayerShow("full-screen");
              if (currentSongIndex !== index) {
                setSongCurrentTime(0.1);
              }
            }}
          >
            <PlayerButton className="song-number h-10 w-10 bg-white/30 text-xl font-bold">
              {currentSongIndex === index ? (
                <i className={playing ? "fas fa-pause" : "fas fa-play"} />
              ) : (
                visibleIndex + 1
              )}
            </PlayerButton>
            <button
              type="button"
              className="playlist-song-info grid flex-grow cursor-pointer appearance-none grid-cols-[min-content_max-content] grid-rows-[auto_auto] items-center justify-items-start gap-0 border-0 bg-transparent px-5 text-justify text-white outline-none"
            >
              <span className="playlist-song-title col-[1/3] row-[1/2] text-base font-bold">
                {song.title}
              </span>
              {song.artist ? (
                <span className="playlist-song-artist whitespace-nowrap text-sm text-white/75">
                  {song.artist}
                </span>
              ) : null}
              <span className="playlist-song-duration ml-2.5 text-sm text-white/75">
                {song.duration}
              </span>
            </button>
            <PlayerButton
              className="playlist-song-delete bg-transparent px-5 text-[25px]"
              icon="fal fa-ellipsis-v"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuSongId((prev) =>
                  prev === song.id ? null : song.id,
                );
              }}
            />
            {openMenuSongId === song.id ? (
              <div
                className="absolute right-12 top-[58px] z-20 grid min-w-[180px] gap-1 rounded-xl border border-white/15 bg-[#1c2f4f] p-2 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                  onClick={() => {
                    setModalType("edit");
                    setModalSongId(song.id);
                    setEditTitle(song.title);
                    setEditArtist(song.artist ?? "");
                    setEditAlbum(song.album);
                    setOpenMenuSongId(null);
                  }}
                >
                  Edit Info
                </button>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                  onClick={() => {
                    setModalType("view");
                    setModalSongId(song.id);
                    setOpenMenuSongId(null);
                  }}
                >
                  View Info
                </button>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-left text-sm text-rose-300 hover:bg-white/10"
                  onClick={() => {
                    setModalType("delete");
                    setModalSongId(song.id);
                    setOpenMenuSongId(null);
                  }}
                >
                  Delete
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
      {modalType && modalSong ? (
        <div
          className="fixed inset-0 z-[800] grid place-items-center bg-black/60 px-4"
          onClick={() => {
            setModalType(null);
            setModalSongId(null);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#1c2f4f] p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {modalType === "view" ? (
              <>
                <h3 className="mb-3 text-lg font-semibold">Song Info</h3>
                <div className="grid gap-2 text-sm text-white/85">
                  <p>
                    <span className="text-white/60">Title:</span>{" "}
                    {modalSong.title}
                  </p>
                  <p>
                    <span className="text-white/60">Author:</span>{" "}
                    {modalSong.artist || "N/A"}
                  </p>
                  {modalSong.composer ? (
                    <p>
                      <span className="text-white/60">Composer:</span>{" "}
                      {modalSong.composer}
                    </p>
                  ) : null}
                  <p>
                    <span className="text-white/60">Album:</span>{" "}
                    {modalSong.album}
                  </p>
                  {modalSong.genre ? (
                    <p>
                      <span className="text-white/60">Genre:</span>{" "}
                      {modalSong.genre}
                    </p>
                  ) : null}
                  {modalSong.year ? (
                    <p>
                      <span className="text-white/60">Year:</span>{" "}
                      {modalSong.year}
                    </p>
                  ) : null}
                  <p>
                    <span className="text-white/60">Duration:</span>{" "}
                    {modalSong.duration}
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                  onClick={() => {
                    setModalType(null);
                    setModalSongId(null);
                  }}
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
                    onClick={() => {
                      setModalType(null);
                      setModalSongId(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-500/70 px-3 py-2 text-sm hover:bg-emerald-500/90"
                    onClick={() => {
                      updateSongInfo(modalSong.id, {
                        title: editTitle.trim() || modalSong.title,
                        artist: editArtist.trim(),
                        album: editAlbum.trim() || modalSong.album,
                      });
                      setModalType(null);
                      setModalSongId(null);
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
                <p className="text-sm text-white/75">
                  Are you sure you want to delete &quot;{modalSong.title}&quot;?
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                    onClick={() => {
                      setModalType(null);
                      setModalSongId(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-rose-500/70 px-3 py-2 text-sm hover:bg-rose-500/90"
                    onClick={() => {
                      removeSong(modalSong.id);
                      setModalType(null);
                      setModalSongId(null);
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
    </section>
  );
}

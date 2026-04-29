"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useAudio } from "@/hooks/use-audio";
import { songTimeInMinutes } from "@/lib/duration";
import type { Song } from "@/types/song";

declare global {
  interface Window {
    __localLibrarySongs?: Song[];
  }
}

export type PlayerDisplayMode = "" | "mini" | "full-screen";
export type PlayMode = "shuffle" | "repeat-all" | "repeat-one";

export type PlayerContextValue = {
  isPlayerShow: PlayerDisplayMode;
  setIsPlayerShow: Dispatch<SetStateAction<PlayerDisplayMode>>;
  setSongCurrentTime: Dispatch<SetStateAction<number>>;
  setCurrentSongIndex: Dispatch<SetStateAction<number>>;
  playing: boolean;
  toggle: () => void;
  userSongs: Song[];
  currentSongIndex: number;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  songCurrentTime: number;
  favoriteSongIds: number[];
  historySongIds: number[];
  toggleFavorite: (songId: number) => void;
  isFavorite: (songId: number) => boolean;
  importLocalSongs: (files: FileList | File[]) => Promise<void>;
  updateSongInfo: (
    songId: number,
    updates: Partial<Pick<Song, "title" | "artist" | "album">>,
  ) => void;
  removeSong: (songId: number) => void;
  goToNextSong: () => void;
  goToPreviousSong: () => void;
  playMode: PlayMode;
  cyclePlayMode: () => void;
  customPlaylists: Record<string, number[]>;
  addSongToPlaylist: (songId: number, playlistName: string) => {
    ok: boolean;
    reason?: "invalid_name" | "already_exists";
  };
  moveSongInQueue: (fromIndex: number, toIndex: number) => void;
};

export const PlayerContext = createContext<PlayerContextValue | null>(null);

type LocalTagMetadata = {
  title?: string;
  artist?: string;
  album?: string;
  composer?: string;
  year?: number;
  genre?: string;
  cover?: string;
};

const DEFAULT_COVER_URL = "https://wallpapercave.com/wp/wp6272587.jpg";
const FAVORITES_STORAGE_KEY = "music-player-favorites";
const HISTORY_STORAGE_KEY = "music-player-history";
const CUSTOM_PLAYLISTS_STORAGE_KEY = "music-player-custom-playlists";

type PictureCandidate = {
  data?: number[];
  format?: string;
};

const toByteArray = (value: unknown): number[] | undefined => {
  if (!value) return undefined;
  if (Array.isArray(value) && value.every((item) => typeof item === "number")) {
    return value as number[];
  }
  if (value instanceof Uint8Array) {
    return Array.from(value);
  }
  if (value instanceof ArrayBuffer) {
    return Array.from(new Uint8Array(value));
  }
  if (typeof value === "object" && value !== null) {
    const nested = (value as { data?: unknown }).data;
    return toByteArray(nested);
  }
  return undefined;
};

const extractPictureCandidate = (value: unknown): PictureCandidate | undefined => {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    for (const item of value) {
      const candidate = extractPictureCandidate(item);
      if ((candidate?.data?.length ?? 0) > 0) return candidate;
    }
    return undefined;
  }

  if (typeof value === "object") {
    const obj = value as { data?: unknown; format?: unknown };
    const bytes = toByteArray(obj.data);
    if ((bytes?.length ?? 0) > 0) {
      return {
        data: bytes,
        format: typeof obj.format === "string" ? obj.format : undefined,
      };
    }
    return extractPictureCandidate(obj.data);
  }

  return undefined;
};

const normalizeNameForMatch = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export function PlayerProvider({
  children,
  songs,
}: {
  children: ReactNode;
  songs: Song[];
}) {
  const [userSongs, setUserSongs] = useState<Song[]>(songs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songCurrentTime, setSongCurrentTime] = useState(0.1);
  const [isPlayerShow, setIsPlayerShow] = useState<PlayerDisplayMode>("");
  const [favoriteSongIds, setFavoriteSongIds] = useState<number[]>([]);
  const [historySongIds, setHistorySongIds] = useState<number[]>([]);
  const [customPlaylists, setCustomPlaylists] = useState<Record<string, number[]>>({});
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>("repeat-all");
  const [repeatOneToken, setRepeatOneToken] = useState(0);
  const playModeRef = useRef<PlayMode>("repeat-all");
  const goToNextSongRef = useRef<() => void>(() => {});

  useEffect(() => {
    playModeRef.current = playMode;
  }, [playMode]);

  const handleTrackEnd = useCallback(() => {
    if (playModeRef.current === "repeat-one") {
      setSongCurrentTime(0);
      setRepeatOneToken((prev) => prev + 1);
      return true;
    }

    goToNextSongRef.current();
    return true;
  }, []);

  const [playing, toggle, setPlaying] = useAudio(
    userSongs[currentSongIndex],
    songCurrentTime,
    currentSongIndex + repeatOneToken,
    handleTrackEnd,
  );

  useEffect(() => {
    if (currentSongIndex >= userSongs.length) {
      setCurrentSongIndex(0);
      setSongCurrentTime(0);
    }
  }, [currentSongIndex, userSongs.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const favoritesRaw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const historyRaw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    const playlistsRaw = window.localStorage.getItem(CUSTOM_PLAYLISTS_STORAGE_KEY);
    setFavoriteSongIds(favoritesRaw ? (JSON.parse(favoritesRaw) as number[]) : []);
    setHistorySongIds(historyRaw ? (JSON.parse(historyRaw) as number[]) : []);
    setCustomPlaylists(
      playlistsRaw ? (JSON.parse(playlistsRaw) as Record<string, number[]>) : {},
    );
    if (window.__localLibrarySongs && window.__localLibrarySongs.length > 0) {
      setUserSongs(window.__localLibrarySongs);
    }
    setIsStorageHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isStorageHydrated) return;
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteSongIds));
  }, [favoriteSongIds, isStorageHydrated]);

  useEffect(() => {
    if (typeof window === "undefined" || !isStorageHydrated) return;
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historySongIds));
  }, [historySongIds, isStorageHydrated]);

  useEffect(() => {
    if (typeof window === "undefined" || !isStorageHydrated) return;
    window.localStorage.setItem(CUSTOM_PLAYLISTS_STORAGE_KEY, JSON.stringify(customPlaylists));
  }, [customPlaylists, isStorageHydrated]);

  useEffect(() => {
    const currentSong = userSongs[currentSongIndex];
    if (!currentSong) return;
    setHistorySongIds((prev) => [currentSong.id, ...prev.filter((id) => id !== currentSong.id)].slice(0, 50));
  }, [currentSongIndex, userSongs]);

  const loadJsMediaTags = useCallback(async () => {
    const mod = await import("jsmediatags");
    return mod.default;
  }, []);

  const readMetadata = useCallback(async (file: File): Promise<LocalTagMetadata> => {
    try {
      const jsmediatags = await loadJsMediaTags();

      return await new Promise<LocalTagMetadata>((resolve) => {
        new jsmediatags.Reader(file)
          .setTagsToRead([
            "title",
            "artist",
            "album",
            "year",
            "genre",
            "picture",
            "TCOM",
          ])
          .read({
          onSuccess: (result: {
            tags: {
              title?: string;
              artist?: string;
              album?: string;
              TCOM?: { data?: string | string[] };
              year?: string | number;
              genre?: string | string[];
              picture?: PictureCandidate;
              APIC?: { data?: PictureCandidate };
              PIC?: { data?: PictureCandidate };
              covr?: { data?: PictureCandidate | PictureCandidate[] };
              [key: string]: unknown;
            };
          }) => {
            const tags = result.tags ?? {};
            const yearNum =
              typeof tags.year === "number"
                ? tags.year
                : Number.parseInt(String(tags.year ?? ""), 10);
            const genre = Array.isArray(tags.genre) ? tags.genre.join(", ") : tags.genre;
            const composerRaw = tags.TCOM?.data;
            const composer = Array.isArray(composerRaw) ? composerRaw[0] : composerRaw;
            const pictureFromShortcut = extractPictureCandidate(tags.picture);
            const pictureFromAPIC = extractPictureCandidate(tags.APIC?.data);
            const pictureFromPIC = extractPictureCandidate(tags.PIC?.data);
            const pictureFromCOVR = extractPictureCandidate(tags.covr?.data);
            const picture = [
              pictureFromShortcut,
              pictureFromAPIC,
              pictureFromPIC,
              pictureFromCOVR,
            ].find((candidate) => (candidate?.data?.length ?? 0) > 0);
            let cover: string | undefined;

            if (picture?.data?.length) {
              try {
                let base64String = "";
                for (let i = 0; i < picture.data.length; i += 1) {
                  base64String += String.fromCharCode(picture.data[i]!);
                }
                const mime = picture.format?.startsWith("image/")
                  ? picture.format
                  : `image/${picture.format || "jpeg"}`;
                cover = `data:${mime};base64,${window.btoa(base64String)}`;
              } catch {
                try {
                  const mime = picture.format?.startsWith("image/")
                    ? picture.format
                    : `image/${picture.format || "jpeg"}`;
                  const blob = new Blob([new Uint8Array(picture.data)], { type: mime });
                  cover = URL.createObjectURL(blob);
                } catch {
                  cover = undefined;
                }
              }
            }
            console.log("[cover-debug:metadata]", {
              file: file.name,
              cover,
              hasPicture: Boolean(picture),
              pictureBytes: picture?.data?.length ?? 0,
              pictureFormat: picture?.format,
              shortcutBytes: pictureFromShortcut?.data?.length ?? 0,
              apicBytes: pictureFromAPIC?.data?.length ?? 0,
              picBytes: pictureFromPIC?.data?.length ?? 0,
              covrBytes: pictureFromCOVR?.data?.length ?? 0,
              hasCoverAfterConvert: Boolean(cover),
            });

            resolve({
              title: tags.title,
              artist: tags.artist,
              album: tags.album,
              composer,
              year: Number.isFinite(yearNum) ? yearNum : undefined,
              genre,
              cover,
            });
          },
          onError: () => resolve({}),
        });
      });
    } catch {
      return {};
    }
  }, [loadJsMediaTags]);

  const importLocalSongs = useCallback(async (filesInput: FileList | File[]) => {
    const allFiles = Array.from(filesInput);
    const audioExt = new Set(["mp3", "wav", "flac", "m4a", "aac", "ogg", "opus", "wma"]);
    const imageExt = new Set(["jpg", "jpeg", "png", "webp", "gif", "bmp"]);
    const getExt = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";
    const audioFiles = allFiles.filter((file) => {
      const ext = getExt(file.name);
      return file.type.startsWith("audio/") || audioExt.has(ext);
    });
    const imageFiles = allFiles.filter((file) => {
      const ext = getExt(file.name);
      return file.type.startsWith("image/") || imageExt.has(ext);
    });
    if (audioFiles.length === 0) return;

    const getFolderPath = (file: File) => {
      const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath ?? "";
      const parts = relativePath.split("/").filter(Boolean);
      if (parts.length <= 1) return "root";
      return parts.slice(0, -1).join("/");
    };

    const findBestTrackImage = (audioFile: File) => {
      const folder = getFolderPath(audioFile);
      const audioName = normalizeNameForMatch(audioFile.name);
      const candidates = imageFiles.filter((img) => getFolderPath(img) === folder);

      if (candidates.length === 0) return undefined;

      let best: { file: File; score: number } | undefined;

      for (const image of candidates) {
        const imageName = normalizeNameForMatch(image.name);
        let score = 0;

        if (imageName === audioName) score += 100;
        if (imageName.includes(audioName) || audioName.includes(imageName)) score += 60;

        const audioTokens = new Set(audioName.split(" ").filter(Boolean));
        const imageTokens = imageName.split(" ").filter(Boolean);
        const commonTokens = imageTokens.filter((token) => audioTokens.has(token)).length;
        score += commonTokens * 8;
        score += scoreImageName(image.name);

        if (!best || score > best.score) {
          best = { file: image, score };
        }
      }

      return best && best.score >= 30 ? best.file : undefined;
    };

    const scoreImageName = (name: string) => {
      const n = name.toLowerCase();
      if (n.startsWith("cover")) return 100;
      if (n.startsWith("folder")) return 90;
      if (n.startsWith("front")) return 80;
      if (n.startsWith("album")) return 70;
      return 10;
    };

    const folderCoverMap = imageFiles.reduce<Map<string, { url: string; score: number; name: string }>>((acc, imageFile) => {
      const folder = getFolderPath(imageFile);
      const nextScore = scoreImageName(imageFile.name);
      const current = acc.get(folder);
      if (!current) {
        acc.set(folder, { url: URL.createObjectURL(imageFile), score: nextScore, name: imageFile.name });
        return acc;
      }
      if (nextScore > current.score) {
        acc.set(folder, { url: URL.createObjectURL(imageFile), score: nextScore, name: imageFile.name });
      }
      return acc;
    }, new Map<string, { url: string; score: number; name: string }>());

    const getDurationSeconds = (src: string) =>
      new Promise<number>((resolve) => {
        const audio = new Audio();
        audio.preload = "metadata";
        audio.onloadedmetadata = () => resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
        audio.onerror = () => resolve(0);
        audio.src = src;
      });

    const importedSongs = await Promise.all(
      audioFiles.map(async (file, index) => {
        const src = URL.createObjectURL(file);
        const metadata = await readMetadata(file);

        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        const split = cleanName.split(" - ");
        const parsedArtist = split.length > 1 ? split[0].trim() : "";
        const parsedTitle = split.length > 1 ? split.slice(1).join(" - ").trim() : cleanName;
        const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath ?? "";
        const parts = relativePath.split("/").filter(Boolean);
        const folderAlbum = parts.length > 1 ? parts[parts.length - 2] : "Local Library";

        const mmTitle = metadata.title?.trim();
        const mmArtist = metadata.artist?.trim();
        const mmComposer = metadata.composer?.trim();
        const mmAlbum = metadata.album?.trim();
        const mmYear = metadata.year;
        const mmGenre = metadata.genre?.trim();
        const mmDuration = await getDurationSeconds(src);
        const folder = getFolderPath(file);
        const folderCoverEntry = folderCoverMap.get(folder);
        const directTrackImage = findBestTrackImage(file);
        const directTrackImageUrl = directTrackImage ? URL.createObjectURL(directTrackImage) : undefined;
        const cover = metadata.cover || directTrackImageUrl || folderCoverEntry?.url || DEFAULT_COVER_URL;
        const coverSource = metadata.cover
          ? "embedded"
          : directTrackImageUrl
            ? "direct-track-image"
            : folderCoverEntry?.url
              ? "folder-cover"
              : "default";

        console.log("[cover-debug:final]", {
          file: file.name,
          coverSource,
          coverPreview: cover.slice(0, 80),
        });

        return {
          id: Date.now() + index,
          title: mmTitle || parsedTitle || `Track ${index + 1}`,
          artist: mmArtist || parsedArtist,
          composer: mmComposer || undefined,
          year: typeof mmYear === "number" ? mmYear : undefined,
          genre: mmGenre || undefined,
          duration: songTimeInMinutes(Math.floor(mmDuration)),
          src,
          cover,
          categories: ["playlist", "albums", "artists"],
          album: mmAlbum || folderAlbum,
        } satisfies Song;
      }),
    );

    setPlaying(false);
    setSongCurrentTime(0);
    setCurrentSongIndex(0);
    setUserSongs(importedSongs);
    if (typeof window !== "undefined") {
      window.__localLibrarySongs = importedSongs;
    }
  }, [readMetadata, setPlaying]);

  const toggleFavorite = useCallback((songId: number) => {
    setFavoriteSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [songId, ...prev],
    );
  }, []);

  const isFavorite = useCallback((songId: number) => favoriteSongIds.includes(songId), [favoriteSongIds]);

  const updateSongInfo = useCallback(
    (songId: number, updates: Partial<Pick<Song, "title" | "artist" | "album">>) => {
      setUserSongs((prev) =>
        prev.map((song) =>
          song.id === songId
            ? {
                ...song,
                title: updates.title ?? song.title,
                artist: updates.artist ?? song.artist,
                album: updates.album ?? song.album,
              }
            : song,
        ),
      );
    },
    [],
  );

  const removeSong = useCallback((songId: number) => {
    setUserSongs((prev) => prev.filter((song) => song.id !== songId));
    setFavoriteSongIds((prev) => prev.filter((id) => id !== songId));
    setHistorySongIds((prev) => prev.filter((id) => id !== songId));
  }, []);

  const pickRandomIndexExcludingCurrent = useCallback((currentIndex: number) => {
    const songsLength = userSongs.length;
    if (songsLength <= 1) return 0;

    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * songsLength);
    }
    return nextIndex;
  }, [userSongs.length]);

  const goToNextSong = useCallback(() => {
    const songsLength = userSongs.length;
    if (songsLength === 0) return;

    setSongCurrentTime(0);
    setCurrentSongIndex((index) =>
      playMode === "shuffle"
        ? pickRandomIndexExcludingCurrent(index)
        : (index + 1) % songsLength,
    );
  }, [pickRandomIndexExcludingCurrent, playMode, userSongs.length]);

  const goToPreviousSong = useCallback(() => {
    const songsLength = userSongs.length;
    if (songsLength === 0) return;

    setSongCurrentTime(0);
    setCurrentSongIndex((index) =>
      playMode === "shuffle"
        ? pickRandomIndexExcludingCurrent(index)
        : (index - 1 + songsLength) % songsLength,
    );
  }, [pickRandomIndexExcludingCurrent, playMode, userSongs.length]);

  const cyclePlayMode = useCallback(() => {
    setPlayMode((prev) => {
      if (prev === "repeat-all") return "repeat-one";
      if (prev === "repeat-one") return "shuffle";
      return "repeat-all";
    });
  }, []);

  useEffect(() => {
    goToNextSongRef.current = goToNextSong;
  }, [goToNextSong]);

  const addSongToPlaylist = useCallback((songId: number, playlistName: string) => {
    const normalizedName = playlistName.trim();
    if (!normalizedName) {
      return { ok: false, reason: "invalid_name" as const };
    }

    const currentSongs = customPlaylists[normalizedName] ?? [];
    if (currentSongs.includes(songId)) {
      return { ok: false, reason: "already_exists" as const };
    }

    setCustomPlaylists((prev) => ({
      ...prev,
      [normalizedName]: [...(prev[normalizedName] ?? []), songId],
    }));
    return { ok: true };
  }, [customPlaylists]);

  const moveSongInQueue = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= userSongs.length || toIndex >= userSongs.length) return;

    setUserSongs((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return prev;
      next.splice(toIndex, 0, moved);
      return next;
    });

    setCurrentSongIndex((prevIndex) => {
      if (prevIndex === fromIndex) return toIndex;
      if (fromIndex < prevIndex && prevIndex <= toIndex) return prevIndex - 1;
      if (toIndex <= prevIndex && prevIndex < fromIndex) return prevIndex + 1;
      return prevIndex;
    });
  }, [userSongs.length]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      isPlayerShow,
      setIsPlayerShow,
      setSongCurrentTime,
      setCurrentSongIndex,
      playing,
      toggle,
      userSongs,
      currentSongIndex,
      setPlaying,
      songCurrentTime,
      favoriteSongIds,
      historySongIds,
      toggleFavorite,
      isFavorite,
      importLocalSongs,
      updateSongInfo,
      removeSong,
      playMode,
      cyclePlayMode,
      goToNextSong,
      goToPreviousSong,
      customPlaylists,
      addSongToPlaylist,
      moveSongInQueue,
    }),
    [
      isPlayerShow,
      setIsPlayerShow,
      setSongCurrentTime,
      setCurrentSongIndex,
      playing,
      toggle,
      userSongs,
      currentSongIndex,
      setPlaying,
      songCurrentTime,
      favoriteSongIds,
      historySongIds,
      toggleFavorite,
      isFavorite,
      importLocalSongs,
      updateSongInfo,
      removeSong,
      playMode,
      cyclePlayMode,
      goToNextSong,
      goToPreviousSong,
      customPlaylists,
      addSongToPlaylist,
      moveSongInQueue,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

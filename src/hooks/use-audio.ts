import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Song } from "@/types/song";

export function useAudio(
  currentSong: Song | undefined,
  currentTime: number,
  currentIndex: number,
  onTrackEnd?: () => boolean,
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const onTrackEndRef = useRef(onTrackEnd);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    onTrackEndRef.current = onTrackEnd;
  }, [onTrackEnd]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onEnded = () => {
      const handled = onTrackEndRef.current?.();
      if (!handled) {
        setPlaying(false);
      }
    };
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Change track and continue playback immediately if we were already playing.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.pause();
    audio.src = currentSong.src;
    audio.title = currentSong.title;
    audio.load();
    audio.currentTime = 0;

    if (playingRef.current) {
      audio.play().catch(() => {
        setPlaying(false);
      });
    }
  }, [currentSong?.src, currentSong?.title, currentIndex, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = currentTime;
  }, [currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.play().catch(() => {
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [playing]);

  return [playing, toggle, setPlaying];
}

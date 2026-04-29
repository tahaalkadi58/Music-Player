"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/hooks/use-player";
import { songFullTimeInSecond, songTimeInMinutes } from "@/lib/duration";

export default function RangeSlider() {
  const {
    userSongs,
    currentSongIndex,
    songCurrentTime,
    setSongCurrentTime,
    playing,
  } = usePlayer();
  const sliderRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(1);
  const currentSong = userSongs[currentSongIndex];
  const songFullTime = songFullTimeInSecond(currentSong?.duration ?? "0:00");

  useEffect(() => {
    if (!playing || songFullTime <= 0) return;
    const interval = window.setInterval(() => {
      setSongCurrentTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [playing, songFullTime, setSongCurrentTime]);

  useEffect(() => {
    if (songFullTime <= 0) return;
    const v = Math.min(100, Math.max(0, (songCurrentTime * 100) / songFullTime));
    setValue(v);
  }, [songCurrentTime, songFullTime, currentSongIndex]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    document.documentElement.style.setProperty(
      "--value-width",
      `${(Number(value) / 100) * el.offsetWidth}px`,
    );
  }, [value]);

  return (
    <div className="slide-container z-[3] row-[5/6] grid w-full grid-cols-[auto_auto_auto] justify-between">
      <input
        ref={sliderRef}
        type="range"
        onChange={(e) => {
          const v = Number(e.target.value);
          setValue(v);
          setSongCurrentTime((v * songFullTime) / 100);
        }}
        value={Number.isFinite(value) ? value : 0}
        min={0}
        max={100}
        className="slider relative col-[1/4] row-[1/2] h-[2.5px] w-full appearance-none bg-[#d3d3d383] outline-none transition-opacity after:absolute after:left-0 after:top-0 after:h-full after:w-[var(--value-width)] after:bg-white after:content-[''] [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-[15px] [&::-moz-range-thumb]:w-[15px] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
        id="myRange"
      />
      <span className="current-time">
        {songTimeInMinutes(songCurrentTime)}
      </span>
      <span className="song-time col-[3/4] row-[2/3]">{currentSong?.duration}</span>
    </div>
  );
}

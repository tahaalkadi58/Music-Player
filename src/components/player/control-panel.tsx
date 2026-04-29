"use client";

import RangeSlider from "@/components/player/range-slider";
import ScrollBar from "@/components/player/scroll-bar";
import SongActions from "@/components/player/song-actions";

export default function ControlPanel() {
  return (
    <>
      <SongActions />
      <RangeSlider />
      <ScrollBar />
    </>
  );
}

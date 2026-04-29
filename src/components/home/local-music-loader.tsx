"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/hooks/use-player";

export default function LocalMusicLoader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { importLocalSongs } = usePlayer();

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.setAttribute("webkitdirectory", "");
    inputRef.current.setAttribute("directory", "");
  }, []);

  return (
    <div className="w-full mt-6 flex justify-center px-6 pb-8">
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={async (e) => {
          if (!e.target.files || e.target.files.length === 0) return;
          await importLocalSongs(e.target.files);
          e.currentTarget.value = "";
        }}
      />
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
        <p className="mb-3 text-sm text-white/80">Need more songs?</p>
        <button
          type="button"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          onClick={() => inputRef.current?.click()}
        >
          Scan Music Folder
        </button>
      </div>
    </div>
  );
}

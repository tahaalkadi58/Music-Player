"use client";

import Link from "next/link";
import { cardsData } from "@/data/cards-data";
import { usePlayer } from "@/hooks/use-player";

export default function CardsText() {
  const { customPlaylists, userSongs } = usePlayer();

  const customPlaylistCards = Object.entries(customPlaylists).map(([name, songIds]) => {
    const firstSong = songIds
      .map((songId) => userSongs.find((song) => song.id === songId))
      .find((song) => Boolean(song));

    return {
      id: `custom-${name}`,
      text: name,
      href: `/playlists/${encodeURIComponent(name)}`,
      cover: firstSong?.cover,
    };
  });

  return (
    <section className="cards-text px-6 py-5">
      <ul className="grid list-none gap-x-5 [grid-template-columns:repeat(auto-fit,100px)] [grid-template-rows:1fr]">
        {cardsData.map(({ text, icon, id, href }) => (
          <li className="card-container" key={id} id={String(id)}>
            <Link href={href} className="block cursor-pointer">
              <div className="card relative flex h-[100px] w-[100px] items-center justify-center rounded-[15px] bg-[tomato] text-[40px] text-white after:absolute after:left-0 after:top-0 after:z-0 after:h-full after:w-full after:rounded-[inherit] after:bg-black/0 after:transition-colors after:content-[''] hover:after:bg-black/30">
                <i className={`fas fa-${icon} relative z-[1]`} />
              </div>
              <div className="text py-1.5 text-white">{text}</div>
            </Link>
          </li>
        ))}
        {customPlaylistCards.map(({ id, text, href, cover }) => (
          <li className="card-container" key={id} id={id}>
            <Link href={href} className="block cursor-pointer">
              <div
                className="card relative flex h-[100px] w-[100px] items-center justify-center rounded-[15px] bg-[tomato] text-[40px] text-white after:absolute after:left-0 after:top-0 after:z-0 after:h-full after:w-full after:rounded-[inherit] after:bg-black/20 after:transition-colors after:content-[''] hover:after:bg-black/40"
                style={cover ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
              >
                {!cover ? <i className="fas fa-music relative z-[1]" /> : null}
              </div>
              <div className="text truncate py-1.5 text-white">{text}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

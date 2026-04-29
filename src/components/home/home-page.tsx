import AlbumsCards from "@/components/home/albums-cards";
import ArtistsCards from "@/components/home/artists-cards";
import CardsText from "@/components/home/cards-text";
import LocalMusicLoader from "@/components/home/local-music-loader";
import Logo from "@/components/home/logo";
import Playlist from "@/components/home/playlist";
import SectionsTitles from "@/components/home/sections-titles";
import type { SongCategory } from "@/types/song";
import Breadcrumb from "./breadcrumbs";

export default function HomePage({
  category,
  songsOnly = false,
  playlistTitle,
  playlistMode = "all",
}: {
  category: SongCategory;
  songsOnly?: boolean;
  playlistTitle?: string;
  playlistMode?: "all" | "favorites" | "history";
}) {
  if (songsOnly) {
    return (
      <section className="home-page relative z-[1] grid min-h-screen grid-cols-1 grid-rows-[70px_80px_80px_1fr_auto] bg-app-bg pb-16">
        <Logo />
        <SectionsTitles />
        <Breadcrumb />
        <Playlist title={playlistTitle} mode={playlistMode} />
        <LocalMusicLoader />
      </section>
    );
  }

  return (
    <section className="home-page relative z-[1] grid min-h-screen grid-cols-1 grid-rows-[70px_auto_1fr_auto] bg-app-bg pb-16">
      <Logo />
      <SectionsTitles />
      <CardsText />
      <Breadcrumb />
      {category === "albums" ? <AlbumsCards /> : null}
      {category === "artists" ? <ArtistsCards /> : null}
      {category !== "albums" && category !== "artists" ? (
        <Playlist mode={playlistMode} />
      ) : null}
      <LocalMusicLoader />
    </section>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { sectionsTitlesData } from "@/data/sections-titles-data";
import Link from "next/link";

export default function SectionsTitles() {
  const pathname = usePathname();
  const currentCategory = pathname === "/" ? "playlist" : pathname.slice(1).toLowerCase();

  return (
    <nav className="sections-titles-container px-6">
      <ul className="sections-titles flex h-10 list-none items-center justify-between">
        {sectionsTitlesData.map(({ text, id, slug }) => (
          <li
            id={String(id)}
            key={id}
            className={`section-title cursor-pointer text-center ${currentCategory === slug ? "text-white" : "text-white/65"}`.trim()}
          >
            <Link href={slug === "playlist" ? "/" : `/${slug}`}>{text}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

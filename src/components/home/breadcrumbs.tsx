"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  let path = "";

  return (
    <nav aria-label="breadcrumb py-4">
      <ol className="flex gap-2 px-6 text-sm text-white">
        <li>
          <h2 className="mb-4 text-xl font-semibold">
            <Link href="/">
              <i className="fad fa-home"></i>
              <span className="px-2">Home</span>
            </Link>
          </h2>
        </li>

        {segments.map((seg, index) => {
          path += `/${seg}`;
          const isLast = index === segments.length - 1;

          const name = decodeURIComponent(seg)
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <li
              key={path}
              className="mb-4 flex gap-2 text-xl font-semibold text-white"
            >
              <h2 className="">
                <span className="text-sm">
                  <i className="fas fa-chevron-right" />
                </span>
                <span className="px-2">
                  {isLast ? (
                    <span>{name}</span>
                  ) : (
                    <Link href={path}>{name}</Link>
                  )}
                </span>
              </h2>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

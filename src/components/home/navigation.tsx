"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navigationData } from "@/data/navigation-data";

export default function Navigation() {
  const [active, setActive] = useState(0);
  const indicator = useRef<HTMLDivElement>(null);
  const width = useRef<HTMLElement>(null);

  const handleChange = useCallback((id: number) => {
    const ind = indicator.current;
    const nav = width.current;
    if (!ind || !nav) return;
    const cellWidth = nav.offsetWidth / 5;
    document.documentElement.style.setProperty(
      "--right",
      `${cellWidth * id + cellWidth / 2 - ind.offsetWidth / 2}px`,
    );
  }, []);

  useEffect(() => {
    const onResize = () => {
      const activeEl = document.querySelector(".navigation .list.active");
      if (activeEl?.id !== undefined && activeEl.id !== "") {
        handleChange(Number(activeEl.id));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [handleChange]);

  useEffect(() => {
    handleChange(active);
  }, [active, handleChange]);

  return (
    <nav
      className="navigation fixed bottom-0 z-[600] grid h-[60px] w-full grid-cols-5 grid-rows-1 rounded-tl-[10px] rounded-tr-[10px] bg-white shadow-[1px_1px_50px_rgba(0,0,0,0.479)]"
      ref={width}
      dir="rtl"
    >
      {navigationData.map(({ text, icon, id }, i) => (
        <div
          className={`${text} list z-[1] flex flex-col items-center justify-between ${id === active ? "active" : ""}`.trim()}
          id={String(id)}
          key={id}
          onClick={() => {
            handleChange(id);
            setActive(id);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleChange(id);
              setActive(id);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <a
            href={i === 0 ? "/" : `#${text}`}
            className="relative flex cursor-default flex-col items-center justify-center font-medium text-app-main no-underline pointer-events-none"
          >
            <span
              className={`icon relative block text-center text-xl leading-[60px] transition-[color,transform] duration-500 ${id === active ? "-translate-y-[32.5px] text-white" : "text-app-main"}`.trim()}
            >
              <i className={`fas fa-${icon}`} />
            </span>
            <span
              className={`text absolute text-center text-sm font-medium capitalize transition-[opacity,transform] duration-500 ${id === active ? "translate-y-[15px] opacity-100" : "translate-y-0 opacity-0"}`.trim()}
            >
              {text}
            </span>
          </a>
        </div>
      ))}
      <div
        className="indicator absolute -top-[35px] z-[-1] h-[55px] w-[55px] rounded-full border-4 border-app-main bg-app-main transition-[right] duration-500"
        ref={indicator}
        style={{ right: "var(--right)" }}
      >
        <span />
      </div>
    </nav>
  );
}

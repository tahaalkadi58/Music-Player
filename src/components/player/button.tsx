"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  className?: string;
  children?: ReactNode;
  id?: string;
  icon?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export default function PlayerButton({
  className = "",
  children,
  id,
  onClick,
  icon,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`relative h-[50px] w-[50px] cursor-pointer appearance-none rounded-full border-0 text-[1.3em] text-white outline-none before:absolute before:left-0 before:top-0 before:z-[3] before:h-full before:w-full before:rounded-[inherit] before:content-[''] hover:before:bg-white/10 ${className}`.trim()}
      id={id}
      {...rest}
      onClick={onClick}
    >
      <span>{children ?? ""}</span>
      {icon ? <i className={icon} /> : null}
    </button>
  );
}

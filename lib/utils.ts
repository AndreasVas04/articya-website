import type { CSSProperties } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// next/image does not apply basePath to srcs when images are unoptimized,
// so every image src (and CSS background url) goes through this helper.
// NEXT_PUBLIC_BASE_PATH is set from the GITHUB_PAGES flag in next.config.ts.
export function withBasePath(src: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`;
}

export interface Framing {
  /** Vertical framing on desktop, in percent. */
  y: number;
  /** Vertical framing below `md`, where the box is far taller than it is wide. */
  ySm?: number;
}

// A ground's framing is per viewport: the same photograph in a wide box and in
// a tall one lands different bands of itself under the same block of type, and
// under a capped reading pool it is that band which decides legibility. The two
// values ride custom properties so one <img> serves both breakpoints — see
// `.photo-frame` in globals.css.
export function framingVars(f?: Framing): CSSProperties | undefined {
  if (!f) return undefined;
  return {
    "--frame-y": `${f.y}%`,
    "--frame-y-sm": `${f.ySm ?? f.y}%`,
  } as CSSProperties;
}

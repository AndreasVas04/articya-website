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

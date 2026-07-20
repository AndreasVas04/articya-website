import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "gold";
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-block rounded-md px-6 py-3 text-sm font-semibold transition-colors",
        variant === "primary" &&
          "bg-resin-deep text-plaster-bright hover:bg-resin hover:text-pine-950",
        variant === "outline" &&
          "border border-pine-950 text-pine-950 hover:bg-plaster-muted",
        // The warm ground's button: the accent as a fill with ink on top,
        // the one pairing that lets amber carry a control without ever
        // becoming text. Both fills clear AA against ink (4.95 / 5.75).
        variant === "gold" &&
          "rounded-[9px] border border-amber-edge bg-amber-fill tracking-[0.02em] text-ink shadow-[0_6px_16px_-8px_rgba(60,35,5,0.45)] transition-[color,background-color,box-shadow] duration-200 hover:bg-amber-lit hover:text-ink hover:shadow-[0_8px_20px_-8px_rgba(60,35,5,0.5)]",
        className
      )}
    >
      {children}
    </Link>
  );
}

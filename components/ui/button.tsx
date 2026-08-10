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
        // The accent as a fill, the one pairing that lets amber carry a
        // control without ever becoming text. The fill is a light object
        // whatever the ground behind it is, so its label stays dark rather
        // than following the page's cream ink: both fills clear AA against
        // `button-ink` (6.50 / 7.55), where cream would measure 2.06.
        variant === "gold" &&
          "rounded-[9px] border border-amber-edge bg-amber-fill tracking-[0.02em] text-button-ink shadow-[0_6px_16px_-8px_rgba(4,8,5,0.5)] transition-[color,background-color,box-shadow] duration-200 hover:bg-amber-lit hover:text-button-ink hover:shadow-[0_8px_20px_-8px_rgba(4,8,5,0.55)]",
        className
      )}
    >
      {children}
    </Link>
  );
}

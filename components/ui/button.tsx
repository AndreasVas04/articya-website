import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
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
        className
      )}
    >
      {children}
    </Link>
  );
}

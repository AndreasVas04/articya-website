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
          "bg-ochre-deep text-cream hover:bg-ochre hover:text-ink",
        variant === "outline" &&
          "border border-ink text-ink hover:bg-sage-soft",
        className
      )}
    >
      {children}
    </Link>
  );
}

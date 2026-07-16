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
          "bg-neutral-900 text-white hover:bg-neutral-700",
        variant === "outline" &&
          "border border-neutral-900 text-neutral-900 hover:bg-neutral-100",
        className
      )}
    >
      {children}
    </Link>
  );
}

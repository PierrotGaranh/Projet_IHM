"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ActiveLinkProps extends React.ComponentProps<typeof Link> {
  activeClassName?: string;
  inactiveClassName?: string;
}

export function ActiveLink({
  href,
  className,
  activeClassName,
  inactiveClassName,
  ...props
}: ActiveLinkProps) {
  const pathname = usePathname();

  const hrefString = href.toString();

  let isActive = false;

  // Routes principales qui doivent matcher EXACTEMENT
  if (hrefString === "/dashboard" || hrefString === "/admin") {
    isActive = pathname === hrefString;
  }
  // Route racine
  else if (hrefString === "/") {
    isActive = pathname === "/";
  }
  // Sous-routes normales
  else {
    isActive =
      pathname === hrefString ||
      pathname.startsWith(hrefString + "/");
  }

  return (
    <Link
      href={href}
      className={cn(
        className,
        isActive ? activeClassName : inactiveClassName
      )}
      {...props}
    />
  );
}
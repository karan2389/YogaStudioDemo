"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { isNavItemActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export interface DashboardNavLinkProps {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  currentPathname: string;
  exact?: boolean;
  aliases?: string[];
  variant?: "customer" | "instructor" | "admin";
  className?: string;
  badge?: string | number;
}

export function DashboardNavLink({
  href,
  label,
  icon: Icon,
  currentPathname,
  exact = false,
  aliases,
  variant = "customer",
  className,
  badge,
}: DashboardNavLinkProps) {
  const active = isNavItemActive(currentPathname, href, { exact, aliases });

  // Styles tailored to each dashboard's sidebar aesthetic
  const activeBg =
    variant === "admin"
      ? "bg-[#f5f7f5] text-[#17362d]"
      : "bg-[#f8f1e7] text-[#17362d]";

  const inactiveText =
    variant === "admin"
      ? "text-[#c6d4d7] hover:bg-white/10 hover:text-white"
      : "text-[#c5d2cb] hover:bg-white/10 hover:text-white";

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150",
        "border-l-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb77e]",
        active
          ? cn(
              activeBg,
              "font-bold shadow-xs border-[#a65f3d]"
            )
          : cn(
              inactiveText,
              "border-transparent"
            ),
        className
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors duration-150",
          active ? "text-[#a65f3d]" : "text-current group-hover:text-white"
        )}
      />
      <span className="truncate">{label}</span>
      {active && <span className="sr-only"> (current section)</span>}

      {badge !== undefined && (
        <span
          className={cn(
            "ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold",
            active
              ? "bg-[#a65f3d]/15 text-[#a65f3d]"
              : "bg-white/12 text-[#c6d4d7]"
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  green: "bg-[#e3ece5] text-[#315744]",
  terracotta: "bg-[#f5e5dc] text-[#8a4d31]",
  neutral: "bg-[#eeeee9] text-[#58665f]",
} as const;

export function StatusBadge({ children, tone = "green", className }: { children: ReactNode; tone?: keyof typeof tones; className?: string }) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", tones[tone], className)}>{children}</span>;
}

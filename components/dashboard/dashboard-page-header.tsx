import type { ReactNode } from "react";

export function DashboardPageHeader({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#a65f3d]">{eyebrow}</p><h1 className="mt-2 font-display text-4xl tracking-[-0.035em] sm:text-5xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#65756e]">{copy}</p></div>{action}</div>;
}

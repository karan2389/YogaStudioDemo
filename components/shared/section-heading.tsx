import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, copy, align = "left", className }: { eyebrow: string; title: string; copy?: string; align?: "left" | "center"; className?: string }) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#a65f3d]">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-[1.04] tracking-[-0.035em] text-[#17362d] sm:text-5xl">{title}</h2>
      {copy && <p className="mt-5 text-base leading-7 text-[#5b6d65] sm:text-lg">{copy}</p>}
    </div>
  );
}

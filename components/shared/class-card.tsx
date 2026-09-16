import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { YogaClass } from "@/types/domain";
import type { Instructor } from "@/types/domain";
import { StatusBadge } from "@/components/shared/status-badge";

export function ClassCard({ item, instructor, image }: { item: YogaClass; instructor?: Instructor; image: string }) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-[#17362d]/10 bg-white shadow-[0_12px_35px_rgba(36,57,47,0.06)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#d8dfd6]">
        <img src={image} alt={`${item.name} yoga practice`} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <StatusBadge className="absolute left-4 top-4 bg-[#fffaf1]/90 text-[#254d3f] backdrop-blur-sm">{item.difficulty}</StatusBadge>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-[#17362d]">{item.name}</h3>
            <p className="mt-1 text-sm text-[#738078]">with {instructor?.name}</p>
          </div>
          <p className="font-semibold text-[#254d3f]">₹{item.price}</p>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#5b6d65]">{item.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-[#17362d]/10 pt-4">
          <span className="flex items-center gap-1.5 text-sm text-[#65756e]"><Clock3 className="size-4" /> {item.durationMinutes} min</span>
          <Link href={`/classes/${item.slug}`} className="flex items-center gap-1 text-sm font-bold text-[#a65f3d] hover:text-[#75412a]">View class <ArrowUpRight className="size-4" /></Link>
        </div>
      </div>
    </article>
  );
}

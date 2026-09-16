import Link from "next/link";
import { Leaf } from "lucide-react";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" aria-label="Ananda Yoga home" className="group flex items-center gap-2.5">
      <span className={`grid size-9 place-items-center rounded-full transition-transform group-hover:-rotate-6 ${inverse ? "bg-[#f8f1e7] text-[#254d3f]" : "bg-[#254d3f] text-[#f8f1e7]"}`}>
        <Leaf className="size-4" strokeWidth={1.8} />
      </span>
      <span className={`font-display text-[1.35rem] leading-none tracking-[-0.03em] ${inverse ? "text-[#f8f1e7]" : "text-[#17362d]"}`}>Ananda Yoga</span>
    </Link>
  );
}

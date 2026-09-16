import type { ReactNode } from "react";
import { Container } from "@/components/shared/container";

export function PageHero({ eyebrow, title, copy, aside }: { eyebrow: string; title: string; copy: string; aside?: ReactNode }) {
  return (
    <section className="border-b border-[#17362d]/10 bg-[#f3eee5] py-16 sm:py-20 lg:py-24">
      <Container className={aside ? "grid items-end gap-10 lg:grid-cols-[1fr_auto]" : undefined}>
        <div className="max-w-4xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#a65f3d]">{eyebrow}</p>
          <h1 className="font-display text-[clamp(3.2rem,7vw,6.4rem)] leading-[0.92] tracking-[-0.05em] text-[#17362d]">{title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5b6d65]">{copy}</p>
        </div>
        {aside}
      </Container>
    </section>
  );
}

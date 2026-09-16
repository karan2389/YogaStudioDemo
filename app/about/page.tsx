import type { Metadata } from "next";
import { Award, Heart, Leaf, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { PublicPage } from "@/components/shared/public-page";
import { SectionHeading } from "@/components/shared/section-heading";
import { instructors } from "@/data/mock-data";

export const metadata: Metadata = {
  title: "About the Studio | Ananda Yoga",
  description: "Meet the philosophy and teachers behind Ananda Yoga Studio in Bengaluru.",
};

const values = [
  { icon: Heart, title: "Care before complexity", copy: "Clear, attentive teaching matters more to us than impressive shapes." },
  { icon: Users, title: "Small groups, real guidance", copy: "Limited class sizes give every student room to learn safely and confidently." },
  { icon: Leaf, title: "Progress without pressure", copy: "We encourage consistency, curiosity and respect for what your body needs today." },
];

export default function AboutPage() {
  return (
    <PublicPage>
      <PageHero eyebrow="Our studio" title="Yoga that feels human." copy="Ananda is a neighbourhood studio for people who want thoughtful movement, steadier energy and a practice that fits real life." />

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Why we’re here" title="A quieter way to grow stronger." copy="We created Ananda to make excellent yoga feel less intimidating and more personal. Our classes pair traditional foundations with practical guidance, so newcomers feel supported and experienced students keep discovering more." />
            <p className="mt-6 text-base leading-7 text-[#5b6d65]">There is no competition in the room. Teachers offer options, explain the purpose behind each movement and leave space for breath. You decide what progress looks like.</p>
            <div className="mt-9 inline-flex items-center gap-3 rounded-full border border-[#17362d]/12 bg-white px-5 py-3 text-sm font-semibold shadow-sm"><Award className="size-5 text-[#a65f3d]" /> Experienced teachers · Small class sizes · All levels welcome</div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[8rem] rounded-b-[1.75rem] bg-[#d9e1d8]">
            <img src="/hero.jpg" alt="The bright and peaceful Ananda yoga studio" className="h-full w-full object-cover" />
            <div className="absolute bottom-5 left-5 rounded-2xl bg-[#fbf8f1]/92 p-5 backdrop-blur-xl"><p className="font-display text-3xl">A space to exhale.</p><p className="mt-1 text-sm text-[#65756e]">Indiranagar, Bengaluru</p></div>
          </div>
        </Container>
      </section>

      <section className="bg-[#17362d] py-20 text-white sm:py-24">
        <Container>
          <SectionHeading eyebrow="What guides us" title="Simple principles, felt in every class." className="[&_h2]:text-white [&_p]:text-[#c5d2cb]" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] bg-white/15 md:grid-cols-3">
            {values.map(({ icon: Icon, title, copy }) => <article key={title} className="bg-[#17362d] p-7 sm:p-9"><Icon className="size-6 text-[#dfb77e]" /><h3 className="mt-8 font-display text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-[#b8c8bf]">{copy}</p></article>)}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Our teachers" title="Different strengths. One shared standard of care." copy="Every instructor brings a distinct practice and the same commitment to clear, inclusive teaching." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {instructors.map((instructor, index) => (
              <article key={instructor.id} className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-7 shadow-[0_12px_35px_rgba(36,57,47,0.05)]">
                <div className="flex items-center gap-4"><span className={`grid size-14 place-items-center rounded-full font-display text-xl text-white ${index === 0 ? "bg-[#254d3f]" : index === 1 ? "bg-[#a65f3d]" : "bg-[#3e5a62]"}`}>{instructor.name.split(" ").map((part) => part[0]).join("")}</span><div><h3 className="font-display text-2xl">{instructor.name}</h3><p className="text-sm text-[#a65f3d]">{instructor.experienceYears} years teaching</p></div></div>
                <p className="mt-6 text-sm leading-6 text-[#65756e]">{instructor.bio}</p>
                <p className="mt-5 border-t border-[#17362d]/10 pt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#4b6258]">{instructor.specialties.join(" · ")}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </PublicPage>
  );
}

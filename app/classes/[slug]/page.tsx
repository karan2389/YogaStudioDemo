import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock3, IndianRupee, Signal, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PublicPage } from "@/components/shared/public-page";
import { SessionCard } from "@/components/shared/session-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ClassUpcomingSessions } from "@/components/classes/class-upcoming-sessions";
import { getClass, getInstructor, sessions, yogaClasses } from "@/data/mock-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return yogaClasses.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = yogaClasses.find((entry) => entry.slug === slug);
  return item ? { title: `${item.name} | Ananda Yoga`, description: item.description } : {};
}

const outcomes = ["Clear alignment and breath cues", "Options for different bodies and experience levels", "A calm closing practice", "Time to ask your instructor questions"];

export default async function ClassDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const item = yogaClasses.find((entry) => entry.slug === slug);
  if (!item) notFound();
  const instructor = getInstructor(item.instructorId);
  const upcoming = sessions.filter((session) => session.classId === item.id).slice(0, 3);

  return (
    <PublicPage>
      <section className="bg-[#17362d] py-8 text-white sm:py-12">
        <Container>
          <Link href="/classes" className="inline-flex items-center gap-2 text-sm text-[#c5d2cb] hover:text-white"><ArrowLeft className="size-4" /> All classes</Link>
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1fr_0.78fr]">
            <div>
              <StatusBadge tone="terracotta">{item.difficulty}</StatusBadge>
              <h1 className="mt-5 font-display text-[clamp(3.6rem,8vw,7rem)] leading-[0.9] tracking-[-0.055em]">{item.name}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c3d0c9]">{item.description}</p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm text-[#e0e8e3]">
                <span className="flex items-center gap-2"><Clock3 className="size-4 text-[#dfb77e]" />{item.durationMinutes} minutes</span>
                <span className="flex items-center gap-2"><Signal className="size-4 text-[#dfb77e]" />{item.difficulty}</span>
                <span className="flex items-center gap-2"><Users className="size-4 text-[#dfb77e]" />Up to {item.capacity} students</span>
                <span className="flex items-center gap-1"><IndianRupee className="size-4 text-[#dfb77e]" />{item.price} per class</span>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#cbd7cd]"><img src={item.image} alt={`${item.name} group practice`} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#17362d]/30 to-transparent" /></div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a65f3d]">What to expect</p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.035em] sm:text-5xl">A well-paced, thoughtfully guided class.</h2>
            <p className="mt-6 text-base leading-7 text-[#5b6d65]">Your teacher will introduce the focus of the session, guide you through a complete sequence and offer practical modifications along the way. Comfortable movement matters more than keeping up.</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">{outcomes.map((outcome) => <li key={outcome} className="flex gap-3 rounded-xl bg-[#edf0e9] p-4 text-sm font-medium"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#254d3f] text-white"><Check className="size-3.5" /></span>{outcome}</li>)}</ul>
          </div>
          <aside className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-7 shadow-[0_12px_35px_rgba(36,57,47,0.05)]">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#a65f3d]">Your instructor</p>
            <div className="mt-5 flex items-center gap-4"><span className="grid size-14 place-items-center rounded-full bg-[#254d3f] font-display text-xl text-white">{instructor?.name.split(" ").map((part) => part[0]).join("")}</span><div><h3 className="font-display text-2xl">{instructor?.name}</h3><p className="text-sm text-[#65756e]">{instructor?.experienceYears} years teaching</p></div></div>
            <p className="mt-5 text-sm leading-6 text-[#65756e]">{instructor?.bio}</p>
            <p className="mt-5 border-t border-[#17362d]/10 pt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#4b6258]">{instructor?.specialties.join(" · ")}</p>
          </aside>
        </Container>
      </section>

      <section className="bg-[#edf0e9] py-16 sm:py-20">
        <Container>
          <div className="flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a65f3d]">Upcoming sessions</p><h2 className="mt-3 font-display text-4xl">Choose a time that works.</h2></div><Link href="/schedule" className="hidden items-center gap-2 text-sm font-bold text-[#a65f3d] sm:flex">Full schedule <ArrowRight className="size-4" /></Link></div>
          <div className="mt-8 rounded-[1.5rem] bg-white px-5 py-2 sm:px-7">
            <ClassUpcomingSessions classId={item.id} initialSessions={upcoming} />
          </div>
        </Container>
      </section>
      <CtaBanner title={`Ready for ${item.name}?`} copy="Reserve your place now. Payment and booking are simulated in this client demo." />
    </PublicPage>
  );
}

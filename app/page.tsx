import Link from "next/link";
import { ArrowRight, Award, CalendarDays, Flower2, HeartHandshake, Play, Quote, Sparkles } from "lucide-react";
import { ClassCard } from "@/components/shared/class-card";
import { Container } from "@/components/shared/container";
import { DemoIndicator } from "@/components/shared/demo-indicator";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { FeaturedPlanCard } from "@/components/shared/featured-plan-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { SessionCard } from "@/components/shared/session-card";
import { Button } from "@/components/ui/button";
import { getClass, getInstructor, instructors, sessions, yogaClasses } from "@/data/mock-data";

const heroImage = "/hero.jpg";
const classImage = "/class.jpg";
const instructorImage = "/instructor.jpg";

const benefits = [
  { icon: Award, title: "Experienced instructors", copy: "Patient guidance from teachers who understand both tradition and modern lives." },
  { icon: HeartHandshake, title: "Beginner-friendly", copy: "Clear cues, thoughtful modifications and a welcoming pace from day one." },
  { icon: CalendarDays, title: "Flexible booking", copy: "Choose sessions around your week, with simple, transparent scheduling." },
  { icon: Flower2, title: "Wellness-focused", copy: "A calm environment made for sustainable progress—not comparison." },
];

export default function Home() {
  const featuredClasses = yogaClasses.slice(0, 3);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf8f1] text-[#17362d]">
      <DemoIndicator />
      <Header />

      <section className="relative border-b border-[#17362d]/10">
        <Container className="grid min-h-[650px] items-stretch gap-8 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:py-10">
          <div className="flex flex-col justify-center py-10 lg:py-16">
            <div className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#a65f3d]">
              <span className="h-px w-9 bg-[#a65f3d]" /> Mindful movement in Bengaluru
            </div>
            <h1 className="font-display text-[clamp(3.4rem,7vw,6.7rem)] leading-[0.88] tracking-[-0.055em] text-[#17362d]">
              Find your balance.<br /><em className="font-normal text-[#a65f3d]">Build your practice.</em>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#5b6d65]">
              Thoughtful yoga for real life. Move with skilled teachers, breathe in a beautiful space, and build a practice that feels like your own.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-[#254d3f] px-6 text-[#fffaf1] hover:bg-[#17362d]">
                <Link href="/classes">Explore Classes <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-[#254d3f]/25 bg-transparent px-6 text-[#254d3f] hover:bg-[#e8ede6]">
                <Link href="/plans">View Monthly Plans</Link>
              </Button>
            </div>
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-[#17362d]/12 pt-6">
              {[["6", "class styles"], ["3", "expert teachers"], ["₹500", "trial session"]].map(([number, label]) => (
                <div key={label}><p className="font-display text-2xl text-[#17362d]">{number}</p><p className="mt-1 text-xs uppercase tracking-[0.1em] text-[#738078]">{label}</p></div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[500px] overflow-hidden rounded-[2rem] bg-[#dce3da] lg:min-h-full">
            <img src={heroImage} alt="Sunlit yoga studio prepared for a class" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102e26]/55 via-transparent to-transparent" />
            <a href="https://unsplash.com/photos/a-large-room-with-a-lot-of-yoga-mats-on-the-floor-dwka5DDrnY0" target="_blank" rel="noreferrer" className="absolute right-4 top-4 rounded-full bg-black/20 px-3 py-1.5 text-[0.65rem] text-white/80 backdrop-blur-md">Photo: Olga Pukhalskaya</a>
            <div className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-white/25 bg-[#fbf8f1]/92 p-4 shadow-xl backdrop-blur-xl sm:left-7 sm:right-auto sm:max-w-sm sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#a65f3d]">Next session</p><p className="mt-1 font-display text-2xl text-[#17362d]">Vinyasa Flow</p></div>
                <span className="rounded-full bg-[#e3ece5] px-3 py-1 text-xs font-bold text-[#315744]">5 seats left</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-[#5b6d65]"><span>Today · 6:30 PM</span><span>with Ananya</span></div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-t-[8rem] rounded-b-[1.5rem] bg-[#d8ded4] lg:block">
            <img src={classImage} alt="A small group practising yoga together" className="h-full w-full object-cover" />
            <a href="https://unsplash.com/photos/people-practicing-yoga-in-studio-Y_xgMuVYrJs" target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 text-[0.65rem] text-white/75">Vitaly Gariev · Unsplash</a>
          </div>
          <div>
            <SectionHeading eyebrow="A studio with intention" title="Practice that meets you where you are." copy="Ananda is a quiet, welcoming studio built around personal attention. Our classes bring together skilled teaching, small groups and enough space to move without pressure." />
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              <div className="border-l-2 border-[#c27a52] pl-5"><p className="font-display text-2xl">Move with purpose</p><p className="mt-2 text-sm leading-6 text-[#65756e]">Build strength, mobility and body awareness at a pace that supports you.</p></div>
              <div className="border-l-2 border-[#c27a52] pl-5"><p className="font-display text-2xl">Return to calm</p><p className="mt-2 text-sm leading-6 text-[#65756e]">Use breath and focused movement to make more room in busy days.</p></div>
            </div>
            <blockquote className="mt-10 rounded-[1.5rem] bg-[#e8ede6] p-6 sm:p-7">
              <Quote className="size-6 text-[#a65f3d]" />
              <p className="mt-3 font-display text-2xl leading-snug text-[#27463c]">“The goal isn’t a perfect pose. It’s leaving the room feeling more like yourself.”</p>
              <p className="mt-3 text-sm font-semibold text-[#65756e]">— Nikita Verma, Lead Instructor</p>
            </blockquote>
          </div>
        </Container>
      </section>

      <section className="bg-[#edf0e9] py-20 sm:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Find your flow" title="Classes for every kind of day." copy="From steady foundations to energetic flows, choose what your body and mind need now." />
            <Link href="/classes" className="flex shrink-0 items-center gap-2 pb-1 text-sm font-bold text-[#a65f3d]">View all classes <ArrowRight className="size-4" /></Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredClasses.map((item) => <ClassCard key={item.id} item={item} instructor={getInstructor(item.instructorId)} image={classImage} />)}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="This week" title="Your next session is closer than you think." copy="Reserve a place in a small-group class. Clear timings, live seat visibility, no surprises." />
            <div className="mt-8 rounded-[1.5rem] bg-[#a65f3d] p-6 text-[#fff8ee]">
              <Sparkles className="size-5" />
              <p className="mt-5 font-display text-2xl">New to the studio?</p>
              <p className="mt-2 text-sm leading-6 text-[#f5d9c8]">Try any eligible session for ₹500 and find the teaching style that works for you.</p>
              <Link href="/schedule" className="mt-5 inline-flex items-center gap-2 text-sm font-bold">See trial sessions <ArrowRight className="size-4" /></Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-[#17362d]/10 bg-white px-5 py-2 shadow-[0_14px_45px_rgba(36,57,47,0.06)] sm:px-7">
            {sessions.slice(0, 4).map((session) => <SessionCard key={session.id} session={session} yogaClass={getClass(session.classId)} instructor={getInstructor(session.instructorId)} />)}
          </div>
        </Container>
      </section>

      <section className="bg-[#17362d] py-20 text-white sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#dfb77e]">Monthly memberships</p>
            <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[0.98] tracking-[-0.04em] sm:text-6xl">A steadier practice changes more than your flexibility.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#bccdc4]">Choose a flexible monthly rhythm from ₹2,400. Book easily, explore different class styles and make time for yourself more often.</p>
            <Button asChild size="lg" className="mt-8 h-12 rounded-full bg-[#f8f1e7] px-6 text-[#17362d] hover:bg-white"><Link href="/plans">View Monthly Plans <ArrowRight /></Link></Button>
          </div>
          <FeaturedPlanCard />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Why Ananda" title="Everything you need to begin—and keep going." align="center" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-[#17362d]/10 bg-[#17362d]/10 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="bg-[#fbf8f1] p-7 sm:p-8">
                <span className="grid size-11 place-items-center rounded-full bg-[#e8ede6] text-[#a65f3d]"><Icon className="size-5" /></span>
                <h3 className="mt-6 font-display text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#65756e]">{copy}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="overflow-hidden rounded-[2rem] bg-[#dfe5db]">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="relative min-h-[440px] bg-[#becbbf]">
                <img src={instructorImage} alt="Yoga instructor seated calmly on a mat" className="absolute inset-0 h-full w-full object-cover object-center" />
                <a href="https://unsplash.com/photos/a-woman-sitting-on-a-mat-in-a-yoga-pose-IFC3fD0ZaoA" target="_blank" rel="noreferrer" className="absolute bottom-3 left-4 text-[0.65rem] text-white/80">Aparna Johri · Unsplash</a>
              </div>
              <div className="p-7 sm:p-10 lg:p-14">
                <SectionHeading eyebrow="Meet your teachers" title="Guidance that feels personal." copy="Our instructors bring distinct styles, years of practice and one shared priority: helping you move with confidence." />
                <div className="mt-8 divide-y divide-[#17362d]/12">
                  {instructors.map((instructor) => (
                    <div key={instructor.id} className="group flex items-center gap-4 py-5">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#17362d] font-display text-lg text-white">{instructor.name.split(" ").map((part) => part[0]).join("")}</span>
                      <div className="min-w-0 flex-1"><p className="font-semibold">{instructor.name}</p><p className="truncate text-sm text-[#65756e]">{instructor.specialties.join(" · ")} · {instructor.experienceYears} years</p></div>
                      <Link href={`/instructors/${instructor.id}`} aria-label={`View ${instructor.name}'s profile`} className="grid size-9 place-items-center rounded-full border border-[#17362d]/20 transition group-hover:bg-[#17362d] group-hover:text-white"><ArrowRight className="size-4" /></Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-[#17362d]/10 bg-[#f3eee5] py-16 text-center sm:py-20">
        <Container>
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#e2d4be] text-[#a65f3d]"><Play className="ml-0.5 size-5" fill="currentColor" /></span>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">Begin with one breath. We’ll meet you there.</h2>
          <p className="mx-auto mt-5 max-w-xl text-[#65756e]">Book your first session, arrive as you are, and discover a practice you’ll look forward to.</p>
          <Button asChild size="lg" className="mt-7 h-12 rounded-full bg-[#254d3f] px-7 text-white"><Link href="/schedule">Book a Session <ArrowRight /></Link></Button>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

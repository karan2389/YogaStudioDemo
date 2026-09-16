import type { Metadata } from "next";
import { CalendarDays, Info } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { PublicPage } from "@/components/shared/public-page";
import { SessionCard } from "@/components/shared/session-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClass, getInstructor, sessions } from "@/data/mock-data";

export const metadata: Metadata = {
  title: "Class Schedule | Ananda Yoga",
  description: "Browse upcoming Ananda Yoga sessions, instructors, availability and pricing.",
};

function isMorning(startsAt: string) {
  const hour = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date(startsAt)));
  return hour < 12;
}

function SessionList({ items }: { items: typeof sessions }) {
  return <div className="rounded-[1.5rem] border border-[#17362d]/10 bg-white px-5 py-2 shadow-[0_12px_38px_rgba(36,57,47,0.05)] sm:px-7">{items.map((session) => <SessionCard key={session.id} session={session} yogaClass={getClass(session.classId)} instructor={getInstructor(session.instructorId)} />)}</div>;
}

export default function SchedulePage() {
  const morning = sessions.filter((session) => isMorning(session.startsAt));
  const evening = sessions.filter((session) => !isMorning(session.startsAt));
  return (
    <PublicPage>
      <PageHero eyebrow="Studio schedule" title="Make time for how you want to feel." copy="Browse upcoming small-group sessions. Every listing shows the teacher, time, price and current seat availability." aside={<div className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-4 text-sm text-[#53675e] shadow-sm"><CalendarDays className="mb-2 size-5 text-[#a65f3d]" /><strong className="block text-[#17362d]">Times shown in IST</strong>Schedule refreshed for this demo</div>} />
      <section className="py-14 sm:py-20">
        <Container>
          <Tabs defaultValue="all" className="gap-7">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-full border border-[#17362d]/10 bg-white p-1 sm:w-fit">
              <TabsTrigger value="all" className="h-10 rounded-full px-5 data-[state=active]:bg-[#254d3f] data-[state=active]:text-white">All sessions</TabsTrigger>
              <TabsTrigger value="morning" className="h-10 rounded-full px-5 data-[state=active]:bg-[#254d3f] data-[state=active]:text-white">Morning</TabsTrigger>
              <TabsTrigger value="evening" className="h-10 rounded-full px-5 data-[state=active]:bg-[#254d3f] data-[state=active]:text-white">Evening</TabsTrigger>
            </TabsList>
            <TabsContent value="all"><SessionList items={sessions} /></TabsContent>
            <TabsContent value="morning"><SessionList items={morning} /></TabsContent>
            <TabsContent value="evening"><SessionList items={evening} /></TabsContent>
          </Tabs>
          <div className="mt-8 flex gap-3 rounded-[1.25rem] bg-[#f5e7dd] p-5 text-sm leading-6 text-[#6b5246]"><Info className="mt-0.5 size-5 shrink-0 text-[#a65f3d]" /><p><strong className="text-[#6f3e28]">Demo booking:</strong> Choose any session to experience customer access, booking type selection and simulated payment. No real payment or seat is processed.</p></div>
        </Container>
      </section>
      <CtaBanner title="New to Ananda? Start for ₹500." copy="Choose any eligible trial session and experience the studio before selecting a monthly plan." href="/classes" action="Explore class styles" />
    </PublicPage>
  );
}

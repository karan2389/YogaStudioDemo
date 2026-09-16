import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, MapPin, UserRound } from "lucide-react";
import { BookingFlow } from "@/components/booking/booking-flow";
import { Container } from "@/components/shared/container";
import { PublicPage } from "@/components/shared/public-page";
import { getClass, getInstructor, sessions } from "@/data/mock-data";

export const metadata: Metadata = { title: "Book a Session | Ananda Yoga Demo", description: "Complete a simulated yoga session booking and demo payment." };
export function generateStaticParams() { return sessions.map((session) => ({ sessionId: session.id })); }

export default async function BookSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = sessions.find((item) => item.id === sessionId);
  if (!session) notFound();
  const yogaClass = getClass(session.classId);
  const instructor = getInstructor(session.instructorId);
  if (!yogaClass || !instructor) notFound();
  const date = new Date(session.startsAt);
  return <PublicPage><section className="py-10 sm:py-16"><Container className="grid items-start gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14"><aside className="rounded-[1.75rem] bg-[#17362d] p-7 text-white lg:sticky lg:top-28"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#dfb77e]">Your selected session</p><h2 className="mt-3 font-display text-4xl">{yogaClass.name}</h2><p className="mt-3 text-sm leading-6 text-[#bdccc4]">{yogaClass.description}</p><div className="mt-7 grid gap-4 border-t border-white/12 pt-6 text-sm text-[#dde6e1]"><p className="flex items-center gap-3"><CalendarDays className="size-4 text-[#dfb77e]" />{date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" })}</p><p className="flex items-center gap-3"><Clock3 className="size-4 text-[#dfb77e]" />{date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })} · {yogaClass.durationMinutes} minutes</p><p className="flex items-center gap-3"><UserRound className="size-4 text-[#dfb77e]" />{instructor.name}</p><p className="flex items-center gap-3"><MapPin className="size-4 text-[#dfb77e]" />Ananda Studio · Demo location</p></div><div className="mt-7 rounded-xl bg-white/8 p-4 text-xs leading-5 text-[#bdccc4]">Booking and cancellation close two hours before the session. Eligible cancellations receive a simulated full refund in the customer dashboard.</div></aside><BookingFlow session={session} yogaClass={yogaClass} instructor={instructor} /></Container></section></PublicPage>;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, MapPin, UserRound, AlertCircle, ArrowLeft } from "lucide-react";
import { BookingFlow } from "@/components/booking/booking-flow";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { getClass, getInstructor, sessions } from "@/data/mock-data";
import { getStudioSessions } from "@/services/admin-storage";
import { formatSessionFullDate, formatSessionTimeRange } from "@/lib/date-time";
import type { Instructor, Session, YogaClass } from "@/types/domain";

export function BookingSessionClient({
  sessionId,
  initialSession,
}: {
  sessionId: string;
  initialSession?: Session;
}) {
  const [session, setSession] = useState<Session | null>(initialSession ?? null);
  const [loaded, setLoaded] = useState(Boolean(initialSession));

  useEffect(() => {
    const all = getStudioSessions();
    const found = all.find((item) => item.id === sessionId) || sessions.find((item) => item.id === sessionId);
    if (found) {
      setSession(found);
    }
    setLoaded(true);
  }, [sessionId]);

  if (!loaded) {
    return (
      <Container className="py-16">
        <div className="min-h-[400px] animate-pulse rounded-[1.75rem] bg-white/60" />
      </Container>
    );
  }

  if (!session) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg rounded-[1.75rem] border border-[#17362d]/10 bg-white p-8 text-center shadow-[0_18px_55px_rgba(36,57,47,0.08)]">
          <AlertCircle className="mx-auto size-10 text-[#a65f3d]" />
          <h1 className="mt-4 font-display text-3xl text-[#17362d]">Session not found</h1>
          <p className="mt-2 text-sm text-[#65756e]">
            The requested session could not be located. It may have been modified or removed.
          </p>
          <Button asChild className="mt-6 rounded-full bg-[#254d3f] text-white">
            <Link href="/schedule">
              <ArrowLeft className="mr-2 size-4" /> Return to schedule
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  const yogaClass = getClass(session.classId);
  const instructor = getInstructor(session.instructorId);

  if (!yogaClass || !instructor) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg rounded-[1.75rem] border border-[#17362d]/10 bg-white p-8 text-center shadow-[0_18px_55px_rgba(36,57,47,0.08)]">
          <AlertCircle className="mx-auto size-10 text-[#a65f3d]" />
          <h1 className="mt-4 font-display text-3xl text-[#17362d]">Class or instructor details unavailable</h1>
          <Button asChild className="mt-6 rounded-full bg-[#254d3f] text-white">
            <Link href="/schedule">Return to schedule</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="grid items-start gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
      <aside className="rounded-[1.75rem] bg-[#17362d] p-7 text-white lg:sticky lg:top-28">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#dfb77e]">Your selected session</p>
        <h2 className="mt-3 font-display text-4xl">{yogaClass.name}</h2>
        <p className="mt-3 text-sm leading-6 text-[#bdccc4]">{yogaClass.description}</p>
        <div className="mt-7 grid gap-4 border-t border-white/12 pt-6 text-sm text-[#dde6e1]">
          <p className="flex items-center gap-3">
            <CalendarDays className="size-4 text-[#dfb77e]" />
            {formatSessionFullDate(session.date || session.startsAt)}
          </p>
          <p className="flex items-center gap-3">
            <Clock3 className="size-4 text-[#dfb77e]" />
            {formatSessionTimeRange(session.startTime || session.startsAt, session.endTime, yogaClass.durationMinutes)}
            {yogaClass.durationMinutes ? ` (${yogaClass.durationMinutes} min)` : ""}
          </p>
          <p className="flex items-center gap-3">
            <UserRound className="size-4 text-[#dfb77e]" />
            {instructor.name}
          </p>
          <p className="flex items-center gap-3">
            <MapPin className="size-4 text-[#dfb77e]" />
            Ananda Studio · Demo location
          </p>
        </div>
        <div className="mt-7 rounded-xl bg-white/8 p-4 text-xs leading-5 text-[#bdccc4]">
          Booking and cancellation close two hours before the session. Eligible cancellations receive a simulated full
          refund in the customer dashboard.
        </div>
      </aside>
      <BookingFlow session={session} yogaClass={yogaClass} instructor={instructor} />
    </Container>
  );
}

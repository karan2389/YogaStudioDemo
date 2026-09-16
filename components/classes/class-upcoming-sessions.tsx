"use client";

import { useEffect, useState } from "react";
import { SessionCard } from "@/components/shared/session-card";
import { getClass, getInstructor } from "@/data/mock-data";
import { getStudioSessions } from "@/services/admin-storage";
import type { Session } from "@/types/domain";

export function ClassUpcomingSessions({
  classId,
  initialSessions,
}: {
  classId: string;
  initialSessions: Session[];
}) {
  const [sessionsList, setSessionsList] = useState<Session[]>(initialSessions);

  useEffect(() => {
    const load = () => {
      const active = getStudioSessions().filter(
        (s) => s.classId === classId && s.status !== "cancelled"
      );
      setSessionsList(active.length > 0 ? active.slice(0, 4) : initialSessions);
    };
    load();
    window.addEventListener("ananda-demo-change", load);
    return () => window.removeEventListener("ananda-demo-change", load);
  }, [classId, initialSessions]);

  if (sessionsList.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="font-display text-2xl text-[#17362d]">More sessions are being scheduled.</p>
        <p className="mt-2 text-sm text-[#65756e]">Explore the full timetable for upcoming classes.</p>
      </div>
    );
  }

  return (
    <>
      {sessionsList.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          yogaClass={getClass(session.classId)}
          instructor={getInstructor(session.instructorId)}
        />
      ))}
    </>
  );
}

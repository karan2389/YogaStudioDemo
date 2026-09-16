"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Users } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getClass, sessions } from "@/data/mock-data";
import { getSessionRoster } from "@/data/mock-rosters";
import { getDemoAttendance } from "@/services/demo-storage";
import { getStudioSessions } from "@/services/admin-storage";
import { formatSessionFullDate, formatSessionTimeRange } from "@/lib/date-time";
import type { DemoAttendanceRecord } from "@/types/demo";
import type { Session } from "@/types/domain";

export function AssignedSessions() {
  const [assignedSessions, setAssignedSessions] = useState<Session[]>(() =>
    sessions.filter((item) => item.instructorId === "ins-nikita")
  );
  const [attendanceRecords, setAttendanceRecords] = useState<DemoAttendanceRecord[]>([]);

  useEffect(() => {
    const load = () => {
      const all = getStudioSessions();
      setAssignedSessions(all.filter((item) => item.instructorId === "ins-nikita"));
      setAttendanceRecords(getDemoAttendance());
    };
    load();
    window.addEventListener("ananda-demo-change", load);
    return () => window.removeEventListener("ananda-demo-change", load);
  }, []);

  return (
    <>
      <DashboardPageHeader
        eyebrow="Assigned sessions"
        title="Your teaching schedule"
        copy="Open any roster to mark attendance and review membership eligibility."
      />
      <div className="grid gap-4">
        {assignedSessions.map((item) => {
          const yogaClass = getClass(item.classId);
          const roster = getSessionRoster(item.id);
          const attendance = attendanceRecords.filter((record) => record.sessionId === item.id);
          const complete = attendance.length === roster.length && roster.length > 0;
          const progress = roster.length ? (attendance.length / roster.length) * 100 : 0;
          return (
            <article
              key={item.id}
              className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-5 shadow-[0_8px_28px_rgba(36,57,47,0.04)] sm:p-6"
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#e8ede6] text-[#254d3f]">
                    <CalendarDays className="size-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-2xl">{yogaClass?.name}</h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          complete ? "bg-[#deeee3] text-[#315744]" : "bg-[#f4e7d8] text-[#895234]"
                        }`}
                      >
                        {complete ? "Attendance complete" : "Attendance pending"}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#65756e]">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-4 text-[#a65f3d]" />
                        {formatSessionFullDate(item.date || item.startsAt)}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-[#17362d]">
                        <Clock3 className="size-4 text-[#a65f3d]" />
                        {formatSessionTimeRange(item.startTime || item.startsAt, item.endTime, yogaClass?.durationMinutes)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="size-4 text-[#738078]" />
                        {roster.length} booked
                      </span>
                    </div>
                    <div className="mt-4 flex max-w-md items-center gap-3">
                      <Progress
                        value={progress}
                        className="bg-[#e4e9e3] [&_[data-slot=progress-indicator]]:bg-[#a65f3d]"
                      />
                      <span className="shrink-0 text-xs font-semibold text-[#65756e]">
                        {attendance.length}/{roster.length}
                      </span>
                    </div>
                  </div>
                </div>
                <Button asChild className="rounded-full bg-[#254d3f] text-white">
                  <Link href={`/instructor/sessions/${item.id}`}>
                    {complete ? <CheckCircle2 /> : null}
                    {complete ? "Review roster" : "Mark attendance"}
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

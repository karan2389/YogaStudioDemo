"use client";

import { useEffect, useState } from "react";
import { SessionCard } from "@/components/shared/session-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClass, getInstructor, sessions } from "@/data/mock-data";
import { getStudioSessions } from "@/services/admin-storage";
import type { Session } from "@/types/domain";

function isMorning(session: Session) {
  const timeStr = session.startTime || session.startsAt;
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    const hour = Number(timeStr.split(":")[0]);
    return hour < 12;
  }
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(
      new Date(session.startsAt)
    )
  );
  return hour < 12;
}

function SessionList({ items }: { items: Session[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-8 text-center text-[#65756e]">
        No sessions found in this time slot.
      </div>
    );
  }
  return (
    <div className="rounded-[1.5rem] border border-[#17362d]/10 bg-white px-5 py-2 shadow-[0_12px_38px_rgba(36,57,47,0.05)] sm:px-7">
      {items.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          yogaClass={getClass(session.classId)}
          instructor={getInstructor(session.instructorId)}
        />
      ))}
    </div>
  );
}

export function ScheduleView() {
  const [items, setItems] = useState<Session[]>(sessions);

  useEffect(() => {
    const load = () => {
      const active = getStudioSessions().filter((s) => s.status !== "cancelled");
      setItems(active.length > 0 ? active : sessions);
    };
    load();
    window.addEventListener("ananda-demo-change", load);
    return () => window.removeEventListener("ananda-demo-change", load);
  }, []);

  const morning = items.filter(isMorning);
  const evening = items.filter((s) => !isMorning(s));

  return (
    <Tabs defaultValue="all" className="gap-7">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-full border border-[#17362d]/10 bg-white p-1 sm:w-fit">
        <TabsTrigger
          value="all"
          className="h-10 rounded-full px-5 data-[state=active]:bg-[#254d3f] data-[state=active]:text-white"
        >
          All sessions ({items.length})
        </TabsTrigger>
        <TabsTrigger
          value="morning"
          className="h-10 rounded-full px-5 data-[state=active]:bg-[#254d3f] data-[state=active]:text-white"
        >
          Morning ({morning.length})
        </TabsTrigger>
        <TabsTrigger
          value="evening"
          className="h-10 rounded-full px-5 data-[state=active]:bg-[#254d3f] data-[state=active]:text-white"
        >
          Evening ({evening.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <SessionList items={items} />
      </TabsContent>
      <TabsContent value="morning">
        <SessionList items={morning} />
      </TabsContent>
      <TabsContent value="evening">
        <SessionList items={evening} />
      </TabsContent>
    </Tabs>
  );
}

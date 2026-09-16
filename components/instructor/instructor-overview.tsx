"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardCheck, MessageCircle, Users } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getClass, sessions, yogaClasses } from "@/data/mock-data";
import { getSessionRoster } from "@/data/mock-rosters";
import { useDemoSession } from "@/hooks/use-demo-session";
import { getDemoAttendance, getDemoPromotions } from "@/services/demo-storage";
import type { DemoAttendanceRecord } from "@/types/demo";

const instructorId = "ins-nikita";
const assigned = sessions.filter((item) => item.instructorId === instructorId);

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
}

export function InstructorOverview() {
  const { session } = useDemoSession();
  const [attendance, setAttendance] = useState<DemoAttendanceRecord[]>([]);
  const [promotions, setPromotions] = useState(0);

  useEffect(() => {
    const load = () => { setAttendance(getDemoAttendance()); setPromotions(getDemoPromotions().length); };
    load(); window.addEventListener("ananda-demo-change", load); return () => window.removeEventListener("ananda-demo-change", load);
  }, []);

  const assignedClassCount = yogaClasses.filter((item) => item.instructorId === instructorId).length;
  const totalRoster = assigned.reduce((sum, item) => sum + getSessionRoster(item.id).length, 0);
  const stats = [
    { label: "Assigned classes", value: assignedClassCount, icon: ClipboardCheck },
    { label: "Upcoming sessions", value: assigned.length, icon: CalendarDays },
    { label: "Attendance marked", value: `${attendance.length}/${totalRoster}`, icon: CheckCircle2 },
    { label: "Promotions sent", value: promotions, icon: MessageCircle },
  ];

  return <>
    <DashboardPageHeader eyebrow="Instructor overview" title={`Namaste, ${session?.name.split(" ")[0] ?? "Nikita"}.`} copy="Review your teaching schedule, open a roster and keep attendance up to date." action={<Button asChild className="h-11 rounded-full bg-[#254d3f] text-white"><Link href="/instructor/sessions">View sessions <ArrowRight /></Link></Button>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5 shadow-[0_8px_28px_rgba(36,57,47,0.04)]"><span className="grid size-10 place-items-center rounded-full bg-[#e8ede6] text-[#a65f3d]"><Icon className="size-5" /></span><p className="mt-5 text-2xl font-semibold">{value}</p><p className="mt-1 text-sm text-[#65756e]">{label}</p></div>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <section className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-6 sm:p-7">
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a65f3d]">Teaching schedule</p><h2 className="mt-2 font-display text-3xl">Your next sessions</h2></div><Link href="/instructor/sessions" className="text-sm font-bold text-[#a65f3d]">View all</Link></div>
        <div className="mt-5 divide-y divide-[#17362d]/10">{assigned.map((item) => { const yogaClass = getClass(item.classId); const roster = getSessionRoster(item.id); const count = attendance.filter((record) => record.sessionId === item.id).length; return <div key={item.id} className="grid gap-4 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="grid size-12 place-items-center rounded-xl bg-[#edf0e9] text-[#254d3f]"><CalendarDays className="size-5" /></span><div><p className="font-display text-xl">{yogaClass?.name}</p><p className="mt-1 text-sm text-[#65756e]">{formatDate(item.startsAt)} · {formatTime(item.startsAt)} · {roster.length} students</p><div className="mt-3 flex items-center gap-3"><Progress value={roster.length ? (count / roster.length) * 100 : 0} className="max-w-40 bg-[#e4e9e3] [&_[data-slot=progress-indicator]]:bg-[#a65f3d]" /><span className="text-xs font-semibold text-[#65756e]">{count}/{roster.length} marked</span></div></div><Button asChild variant="outline" className="rounded-full bg-transparent"><Link href={`/instructor/sessions/${item.id}`}>Open roster</Link></Button></div>; })}</div>
      </section>
      <section className="rounded-[1.5rem] bg-[#17362d] p-6 text-white sm:p-7">
        <MessageCircle className="size-5 text-[#dfb77e]" />
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#dfb77e]">Smart follow-up</p>
        <h2 className="mt-2 font-display text-3xl">Attendance powers the next conversation.</h2>
        <p className="mt-3 text-sm leading-6 text-[#bdccc4]">When a non-member is marked present, the demo simulates one WhatsApp membership promotion. Active members are excluded automatically.</p>
        <div className="mt-6 rounded-xl bg-white/8 p-4"><p className="text-3xl font-semibold">{promotions}</p><p className="mt-1 text-xs text-[#bdccc4]">unique promotions simulated</p></div>
      </section>
    </div>
  </>;
}

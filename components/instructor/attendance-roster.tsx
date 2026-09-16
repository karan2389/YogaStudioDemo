"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, CircleX, Info, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatSessionFullDate, formatSessionTimeRange } from "@/lib/date-time";
import type { Customer, Session, YogaClass } from "@/types/domain";
import type { DemoAttendanceRecord, DemoPromotionRecord } from "@/types/demo";
import { getDemoAttendance, getDemoPromotions, markDemoAttendance } from "@/services/demo-storage";

export function AttendanceRoster({ yogaSession, yogaClass, roster }: { yogaSession: Session; yogaClass: YogaClass; roster: Customer[] }) {
  const [attendance, setAttendance] = useState<DemoAttendanceRecord[]>([]);
  const [promotions, setPromotions] = useState<DemoPromotionRecord[]>([]);
  const [message, setMessage] = useState<{ title: string; body: string; tone: "green" | "amber" } | null>(null);

  function load() { setAttendance(getDemoAttendance(yogaSession.id)); setPromotions(getDemoPromotions()); }
  useEffect(() => { load(); const update = () => load(); window.addEventListener("ananda-demo-change", update); return () => window.removeEventListener("ananda-demo-change", update); }, [yogaSession.id]);

  function mark(customer: Customer, status: "present" | "absent", quiet = false) {
    const result = markDemoAttendance({ sessionId: yogaSession.id, customerId: customer.id, customerName: customer.name, status, markedBy: "ins-nikita", hasActiveMembership: customer.membershipStatus === "active" });
    if (quiet) return;
    if (status === "absent") setMessage({ title: "Attendance saved", body: `${customer.name} was marked absent. No promotion was triggered.`, tone: "green" });
    else if (customer.membershipStatus === "active") setMessage({ title: "Attendance saved", body: `${customer.name} is an active member, so no membership promotion was sent.`, tone: "green" });
    else if (result.promotionSent) setMessage({ title: "Promotion simulated", body: `${customer.name} was marked present and received the demo WhatsApp monthly-membership promotion.`, tone: "green" });
    else if (result.duplicatePrevented) setMessage({ title: "Duplicate prevented", body: `${customer.name} has already received this campaign, so the demo did not send it again.`, tone: "amber" });
    load();
  }

  function markRemainingAbsent() {
    const markedIds = new Set(attendance.map((item) => item.customerId));
    roster.filter((customer) => !markedIds.has(customer.id)).forEach((customer) => mark(customer, "absent", true));
    setMessage({ title: "Roster completed", body: "Every unmarked student was recorded as absent. No promotions were triggered.", tone: "green" });
    load();
  }

  const present = attendance.filter((item) => item.status === "present").length;
  const complete = attendance.length === roster.length;
  const sessionPromotions = promotions.filter((item) => item.sessionId === yogaSession.id);
  const percent = roster.length ? (attendance.length / roster.length) * 100 : 0;

  return <>
    <Link href="/instructor/sessions" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#65756e] hover:text-[#17362d]"><ArrowLeft className="size-4" /> Assigned sessions</Link>
    <DashboardPageHeader eyebrow="Attendance roster" title={yogaClass.name} copy={`${formatSessionFullDate(yogaSession.date || yogaSession.startsAt)} · ${formatSessionTimeRange(yogaSession.startTime || yogaSession.startsAt, yogaSession.endTime, yogaClass.durationMinutes)} · ${roster.length} booked students`} action={!complete ? <Button variant="outline" className="rounded-full bg-white" onClick={markRemainingAbsent}>Mark remaining absent</Button> : <span className="inline-flex items-center gap-2 rounded-full bg-[#deeee3] px-4 py-2 text-sm font-bold text-[#315744]"><CheckCircle2 className="size-4" /> Roster complete</span>} />
    {message && <Alert className={`mb-5 rounded-xl ${message.tone === "green" ? "border-[#315744]/20 bg-[#e7f0e8]" : "border-[#a65f3d]/25 bg-[#f6eadc]"}`}><Info className="size-4" /><AlertTitle>{message.title}</AlertTitle><AlertDescription>{message.body}</AlertDescription></Alert>}
    <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
      <section className="overflow-hidden rounded-[1.5rem] border border-[#17362d]/10 bg-white shadow-[0_8px_28px_rgba(36,57,47,0.04)]">
        <div className="border-b border-[#17362d]/10 p-5 sm:p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-2xl">Student roster</h2><p className="mt-1 text-sm text-[#65756e]">{present} present · {attendance.length - present} absent · {roster.length - attendance.length} unmarked</p></div><span className="grid size-10 place-items-center rounded-full bg-[#edf0e9] text-[#254d3f]"><Users className="size-5" /></span></div><Progress value={percent} className="mt-4 bg-[#e4e9e3] [&_[data-slot=progress-indicator]]:bg-[#a65f3d]" /></div>
        <div className="divide-y divide-[#17362d]/10">{roster.map((customer) => { const current = attendance.find((item) => item.customerId === customer.id); const active = customer.membershipStatus === "active"; return <div key={customer.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#254d3f] text-xs font-bold text-white">{customer.name.split(" ").map((part) => part[0]).join("")}</span><div className="min-w-0"><p className="font-semibold">{customer.name}</p><p className="truncate text-xs text-[#65756e]">{customer.phone}</p><span className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${active ? "bg-[#deeee3] text-[#315744]" : customer.membershipStatus === "expired" ? "bg-[#f4e7d8] text-[#895234]" : "bg-[#edf0e9] text-[#65756e]"}`}>{active ? "Active member" : customer.membershipStatus === "expired" ? "Membership expired" : "Non-member"}</span></div></div><div className="grid grid-cols-2 gap-2"><Button type="button" variant={current?.status === "present" ? "default" : "outline"} className={`rounded-full ${current?.status === "present" ? "bg-[#315744] text-white" : "bg-transparent"}`} onClick={() => mark(customer, "present")}><Check className="size-4" /> Present</Button><Button type="button" variant={current?.status === "absent" ? "default" : "outline"} className={`rounded-full ${current?.status === "absent" ? "bg-[#8b3d32] text-white" : "bg-transparent"}`} onClick={() => mark(customer, "absent")}><CircleX className="size-4" /> Absent</Button></div></div>; })}</div>
      </section>
      <aside className="space-y-5">
        <section className="rounded-[1.5rem] bg-[#17362d] p-6 text-white"><ShieldCheck className="size-5 text-[#dfb77e]" /><p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#dfb77e]">Promotion rule</p><h2 className="mt-2 font-display text-2xl">Present, eligible, once.</h2><ol className="mt-5 space-y-3 text-sm text-[#c5d2cb]"><li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs">1</span>Mark student present</li><li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs">2</span>Check active membership</li><li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs">3</span>Send to non-members once</li></ol><p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-[#9fb0a7]">WhatsApp delivery is simulated locally. No message leaves this browser.</p></section>
        <section className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#a65f3d]">WhatsApp activity</p><h2 className="mt-1 font-display text-2xl">This session</h2></div><MessageCircle className="size-5 text-[#315744]" /></div>{sessionPromotions.length ? <div className="mt-4 space-y-3">{sessionPromotions.map((item) => <div key={item.id} className="rounded-xl bg-[#edf0e9] p-3"><p className="text-sm font-semibold">{item.customerName}</p><p className="mt-1 text-xs text-[#65756e]">Monthly plan message · simulated sent</p></div>)}</div> : <p className="mt-4 rounded-xl border border-dashed border-[#17362d]/20 p-4 text-sm leading-6 text-[#65756e]">No eligible promotions triggered from this roster yet.</p>}</section>
      </aside>
    </div>
  </>;
}

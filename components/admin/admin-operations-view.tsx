"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, CreditCard, RefreshCw, Search, UserRound, WalletCards } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { advanceRefund, getOperationalBookings, getOperationalMemberships, getOperationalPayments, getOperationalRefunds, rejectRefund, updateOperationStatus } from "@/services/admin-operations";
import { getDemoAttendance, getDemoPromotions } from "@/services/demo-storage";
import type { OperationalBooking, OperationalMembership, OperationalPayment, OperationalRefund } from "@/types/admin";
import type { DemoAttendanceRecord, DemoPromotionRecord } from "@/types/demo";

type View = "memberships" | "bookings" | "payments" | "refunds" | "attendance";
const copy: Record<View, { eyebrow: string; title: string; description: string }> = {
  memberships: { eyebrow: "Operations", title: "Memberships", description: "Review customer plans and update their operational status." },
  bookings: { eyebrow: "Operations", title: "Bookings", description: "Track session reservations and update booking outcomes." },
  payments: { eyebrow: "Finance", title: "Payments", description: "Review simulated session and membership transactions." },
  refunds: { eyebrow: "Finance", title: "Refunds", description: "Move eligible demo refunds from request through completion." },
  attendance: { eyebrow: "Studio activity", title: "Attendance", description: "Review attendance submitted by instructors across sessions." },
};

const date = (value: string) => new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
const statusTone = (status: string) => status === "active" || status === "confirmed" || status === "paid" || status === "present" || status === "completed" ? "bg-[#deeee3] text-[#315744]" : status === "requested" || status === "processing" ? "bg-[#f5e7d6] text-[#895234]" : "bg-[#eceeed] text-[#65756e]";

export function AdminOperationsView({ view }: { view: View }) {
  const [memberships, setMemberships] = useState<OperationalMembership[]>([]);
  const [bookings, setBookings] = useState<OperationalBooking[]>([]);
  const [payments, setPayments] = useState<OperationalPayment[]>([]);
  const [refunds, setRefunds] = useState<OperationalRefund[]>([]);
  const [attendance, setAttendance] = useState<DemoAttendanceRecord[]>([]);
  const [promotions, setPromotions] = useState<DemoPromotionRecord[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => { const load = () => { setMemberships(getOperationalMemberships()); setBookings(getOperationalBookings()); setPayments(getOperationalPayments()); setRefunds(getOperationalRefunds()); setAttendance(getDemoAttendance()); setPromotions(getDemoPromotions()); }; load(); window.addEventListener("ananda-demo-change", load); return () => window.removeEventListener("ananda-demo-change", load); }, []);
  const normalizedQuery = query.toLowerCase();
  const filteredMemberships = useMemo(() => memberships.filter((item) => [item.customerName, item.planName, item.status].join(" ").toLowerCase().includes(normalizedQuery)), [memberships, normalizedQuery]);
  const filteredBookings = useMemo(() => bookings.filter((item) => [item.customerName, item.className, item.status, item.type].join(" ").toLowerCase().includes(normalizedQuery)), [bookings, normalizedQuery]);
  const filteredPayments = useMemo(() => payments.filter((item) => [item.customerName, item.description, item.status, item.method].join(" ").toLowerCase().includes(normalizedQuery)), [payments, normalizedQuery]);
  const filteredRefunds = useMemo(() => refunds.filter((item) => [item.customerName, item.reason, item.status].join(" ").toLowerCase().includes(normalizedQuery)), [refunds, normalizedQuery]);
  const filteredAttendance = useMemo(() => attendance.filter((item) => [item.customerName, item.sessionId, item.status].join(" ").toLowerCase().includes(normalizedQuery)), [attendance, normalizedQuery]);
  const count = view === "memberships" ? filteredMemberships.length : view === "bookings" ? filteredBookings.length : view === "payments" ? filteredPayments.length : view === "refunds" ? filteredRefunds.length : filteredAttendance.length;

  return <>
    <DashboardPageHeader eyebrow={copy[view].eyebrow} title={copy[view].title} copy={copy[view].description} />
    <div className="mb-5 flex flex-col gap-3 rounded-[1.25rem] border border-[#17362d]/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#738078]" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${view}`} className="h-11 rounded-full border-[#17362d]/15 bg-[#f7f8f6] pl-10" /></div><p className="text-sm font-semibold text-[#65756e]">{count} records</p></div>

    {view === "memberships" && <div className="grid gap-3">{filteredMemberships.map((item) => <article key={item.id} className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5"><div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"><div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e7ecea] text-[#3e5a62]"><WalletCards className="size-5" /></span><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-2xl">{item.customerName}</h2><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusTone(item.status)}`}>{item.status}</span></div><p className="mt-1 text-sm font-semibold">{item.planName} · ₹{item.amount.toLocaleString("en-IN")}</p><p className="mt-1 text-xs text-[#65756e]">{new Date(item.startsAt).toLocaleDateString("en-IN")} – {new Date(item.endsAt).toLocaleDateString("en-IN")}</p></div></div><NativeSelect value={item.status} onChange={(event) => updateOperationStatus("memberships", item.id, event.target.value)} className="h-10 w-full rounded-full border-[#17362d]/15 bg-white sm:w-36"><NativeSelectOption value="active">Active</NativeSelectOption><NativeSelectOption value="paused">Paused</NativeSelectOption><NativeSelectOption value="expired">Expired</NativeSelectOption></NativeSelect></div></article>)}</div>}

    {view === "bookings" && <div className="grid gap-3">{filteredBookings.map((item) => <article key={item.id} className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5"><div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"><div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e7ecea] text-[#3e5a62]"><CalendarDays className="size-5" /></span><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-2xl">{item.className}</h2><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusTone(item.status)}`}>{item.status}</span></div><p className="mt-1 text-sm font-semibold">{item.customerName} · {item.type} · {item.amount ? `₹${item.amount}` : "Membership"}</p><p className="mt-1 text-xs text-[#65756e]">{date(item.startsAt)}</p></div></div><NativeSelect value={item.status} onChange={(event) => updateOperationStatus("bookings", item.id, event.target.value)} className="h-10 w-full rounded-full border-[#17362d]/15 bg-white sm:w-40"><NativeSelectOption value="confirmed">Confirmed</NativeSelectOption><NativeSelectOption value="attended">Attended</NativeSelectOption><NativeSelectOption value="no-show">No-show</NativeSelectOption><NativeSelectOption value="cancelled">Cancelled</NativeSelectOption></NativeSelect></div></article>)}</div>}

    {view === "payments" && <div className="grid gap-3">{filteredPayments.map((item) => <article key={item.id} className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e7ecea] text-[#3e5a62]"><CreditCard className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-2xl">₹{item.amount.toLocaleString("en-IN")}</h2><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusTone(item.status)}`}>{item.status}</span></div><p className="mt-1 text-sm font-semibold">{item.customerName} · {item.description}</p><p className="mt-1 text-xs text-[#65756e]">{item.method} · {date(item.createdAt)} · {item.id}</p></div></div></article>)}</div>}

    {view === "refunds" && <div className="grid gap-3">{filteredRefunds.map((item) => <article key={item.id} className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5"><div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"><div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f4e8db] text-[#a65f3d]"><RefreshCw className="size-5" /></span><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-2xl">₹{item.amount.toLocaleString("en-IN")}</h2><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusTone(item.status)}`}>{item.status}</span></div><p className="mt-1 text-sm font-semibold">{item.customerName} · {item.reason}</p><p className="mt-1 text-xs text-[#65756e]">Requested {date(item.requestedAt)} · {item.paymentId}</p></div></div>{item.status === "requested" || item.status === "processing" ? <div className="flex gap-2"><Button variant="outline" className="rounded-full bg-transparent" onClick={() => rejectRefund(item.id)}>Reject</Button><Button className="rounded-full bg-[#254d3f] text-white" onClick={() => advanceRefund(item.id)}>{item.status === "requested" ? "Start processing" : "Complete refund"}</Button></div> : null}</div></article>)}</div>}

    {view === "attendance" && <div className="grid gap-3">{filteredAttendance.map((item) => { const promoted = promotions.some((promotion) => promotion.customerId === item.customerId && promotion.sessionId === item.sessionId); return <article key={item.id} className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5"><div className="flex items-center gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e7ecea] text-[#3e5a62]">{item.status === "present" ? <CheckCircle2 className="size-5" /> : <UserRound className="size-5" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-2xl">{item.customerName}</h2><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusTone(item.status)}`}>{item.status}</span>{promoted && <span className="rounded-full bg-[#e5eff0] px-2.5 py-1 text-[11px] font-bold text-[#3e5a62]">WhatsApp follow-up</span>}</div><p className="mt-1 text-sm text-[#65756e]">Session {item.sessionId} · marked by Nikita · {date(item.markedAt)}</p></div></div></article>; })}</div>}

    {count === 0 && <div className="rounded-[1.5rem] border border-dashed border-[#17362d]/20 bg-white p-10 text-center"><p className="font-display text-2xl">No matching records.</p><p className="mt-2 text-sm text-[#65756e]">Operational activity will appear here as the demo is used.</p></div>}
  </>;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CalendarCheck, CalendarDays, CreditCard, Sparkles, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { useDemoSession } from "@/hooks/use-demo-session";
import { getDemoBookings, getDemoMemberships, getDemoNotifications, getDemoPayments } from "@/services/demo-storage";
import type { DemoBookingRecord, DemoMembershipRecord, DemoNotificationRecord, DemoPaymentRecord } from "@/types/demo";

export function DashboardOverview() {
  const { session } = useDemoSession();
  const [bookings, setBookings] = useState<DemoBookingRecord[]>([]);
  const [memberships, setMemberships] = useState<DemoMembershipRecord[]>([]);
  const [payments, setPayments] = useState<DemoPaymentRecord[]>([]);
  const [notifications, setNotifications] = useState<DemoNotificationRecord[]>([]);
  useEffect(() => { const load = () => { if (!session) return; setBookings(getDemoBookings().filter((item) => item.customerId === session.id)); setMemberships(getDemoMemberships().filter((item) => item.customerId === session.id)); setPayments(getDemoPayments().filter((item) => item.customerId === session.id)); setNotifications(getDemoNotifications(session.id)); }; load(); window.addEventListener("ananda-demo-change", load); return () => window.removeEventListener("ananda-demo-change", load); }, [session]);
  const activeMembership = memberships.find((item) => item.status === "active");
  const upcoming = bookings.filter((item) => item.status === "confirmed" && new Date(item.startsAt) > new Date()).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const next = upcoming[0];
  const stats = [
    { label: "Upcoming bookings", value: upcoming.length, icon: CalendarCheck, href: "/dashboard/bookings" },
    { label: "Membership", value: activeMembership ? "Active" : "None", icon: WalletCards, href: "/dashboard/membership" },
    { label: "Payments", value: payments.length, icon: CreditCard, href: "/dashboard/payments" },
    { label: "Unread updates", value: notifications.filter((item) => !item.read).length, icon: Bell, href: "/dashboard/notifications" },
  ];
  return <><DashboardPageHeader eyebrow="Overview" title={`Welcome, ${session?.name.split(" ")[0] ?? "there"}.`} copy="Your practice, bookings and studio updates in one place." action={<Button asChild className="h-11 rounded-full bg-[#254d3f] text-white"><Link href="/schedule">Book a class <ArrowRight /></Link></Button>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon, href }) => <Link href={href} key={label} className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5 shadow-[0_8px_28px_rgba(36,57,47,0.04)] transition hover:-translate-y-0.5"><span className="grid size-10 place-items-center rounded-full bg-[#e8ede6] text-[#a65f3d]"><Icon className="size-5" /></span><p className="mt-5 text-2xl font-semibold">{value}</p><p className="mt-1 text-sm text-[#65756e]">{label}</p></Link>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <section className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-6 sm:p-7"><div className="flex items-center justify-between"><h2 className="font-display text-3xl">Next class</h2><Link href="/dashboard/bookings" className="text-sm font-bold text-[#a65f3d]">All bookings</Link></div>{next ? <div className="mt-6 grid items-center gap-5 rounded-[1.25rem] bg-[#edf0e9] p-5 sm:grid-cols-[auto_1fr_auto]"><span className="grid size-14 place-items-center rounded-xl bg-[#254d3f] text-white"><CalendarDays className="size-6" /></span><div><p className="font-display text-2xl">{next.className}</p><p className="mt-1 text-sm text-[#65756e]">{new Date(next.startsAt).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", timeZone: "Asia/Kolkata" })} · {new Date(next.startsAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}</p><p className="mt-1 text-xs text-[#7c8b84]">with {next.instructorName}</p></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#315744]">Confirmed</span></div> : <div className="mt-6 rounded-[1.25rem] border border-dashed border-[#17362d]/20 p-8 text-center"><CalendarDays className="mx-auto size-6 text-[#a65f3d]" /><p className="mt-3 font-semibold">Nothing booked yet.</p><p className="mt-1 text-sm text-[#65756e]">Choose a class to see it here.</p></div>}</section>
      <section className="rounded-[1.5rem] bg-[#17362d] p-6 text-white sm:p-7"><Sparkles className="size-5 text-[#dfb77e]" /><p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#dfb77e]">Membership</p><h2 className="mt-2 font-display text-3xl">{activeMembership ? activeMembership.planName : "Build a steady rhythm."}</h2><p className="mt-3 text-sm leading-6 text-[#bdccc4]">{activeMembership ? `Active until ${new Date(activeMembership.endsAt).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}.` : "Monthly plans start at ₹2,400 with flexible class access."}</p><Link href="/dashboard/membership" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white">{activeMembership ? "View membership" : "Explore plans"}<ArrowRight className="size-4" /></Link></section>
    </div></>;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ContactRound, Dumbbell, MessageCircle, UsersRound, WalletCards } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { getAdminCollection } from "@/services/admin-storage";
import { getDemoAttendance, getDemoPromotions } from "@/services/demo-storage";

const shortcuts = [
  { href: "/admin/customers", label: "Customers", copy: "Accounts and membership status", icon: ContactRound, resource: "customers" as const },
  { href: "/admin/instructors", label: "Instructors", copy: "Profiles and specialties", icon: UsersRound, resource: "instructors" as const },
  { href: "/admin/classes", label: "Classes", copy: "Catalogue, capacity and pricing", icon: Dumbbell, resource: "classes" as const },
  { href: "/admin/sessions", label: "Sessions", copy: "Dated studio timetable", icon: CalendarDays, resource: "sessions" as const },
  { href: "/admin/plans", label: "Plans", copy: "Public membership offers", icon: WalletCards, resource: "plans" as const },
];

export function AdminOverview() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => { const load = () => setCounts({ customers: getAdminCollection("customers").length, instructors: getAdminCollection("instructors").length, classes: getAdminCollection("classes").length, sessions: getAdminCollection("sessions").length, plans: getAdminCollection("plans").length, attendance: getDemoAttendance().length, promotions: getDemoPromotions().length }); load(); window.addEventListener("ananda-demo-change", load); return () => window.removeEventListener("ananda-demo-change", load); }, []);
  return <>
    <DashboardPageHeader eyebrow="Admin overview" title="Studio control centre" copy="Manage the people, programmes and timetable behind the Ananda Yoga demo." />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{shortcuts.map(({ href, label, copy, icon: Icon, resource }) => <Link key={href} href={href} className="group rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5 shadow-[0_8px_28px_rgba(36,57,47,0.04)] transition hover:-translate-y-0.5"><span className="grid size-10 place-items-center rounded-full bg-[#e5ecec] text-[#3e5a62]"><Icon className="size-5" /></span><p className="mt-5 text-2xl font-semibold">{counts[resource] ?? 0}</p><p className="mt-1 font-semibold">{label}</p><p className="mt-1 text-xs leading-5 text-[#65756e]">{copy}</p><ArrowRight className="mt-4 size-4 text-[#a65f3d] transition group-hover:translate-x-1" /></Link>)}</div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[1.5rem] bg-[#203b45] p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9bc3bf]">Today&apos;s operations</p><h2 className="mt-3 font-display text-4xl">The demo is running from one shared local workspace.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-[#c6d4d7]">Core management changes persist in this browser. Membership-plan edits also update customer-facing plan cards immediately.</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white/8 p-4"><p className="text-3xl font-semibold">{counts.attendance ?? 0}</p><p className="mt-1 text-sm text-[#c6d4d7]">attendance records</p></div><div className="rounded-xl bg-white/8 p-4"><p className="text-3xl font-semibold">{counts.promotions ?? 0}</p><p className="mt-1 flex items-center gap-2 text-sm text-[#c6d4d7]"><MessageCircle className="size-4" /> promotions simulated</p></div></div></section>
      <section className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a65f3d]">Quick actions</p><h2 className="mt-2 font-display text-3xl">Keep the studio current.</h2><div className="mt-5 divide-y divide-[#17362d]/10">{[{ href: "/admin/refunds", label: "Review refund requests" }, { href: "/admin/notifications", label: "Send a customer update" }, { href: "/admin/reports", label: "View studio performance" }, { href: "/admin/settings", label: "Adjust demo settings" }].map((item) => <Link href={item.href} key={item.href} className="flex items-center justify-between py-4 text-sm font-semibold hover:text-[#a65f3d]">{item.label}<ArrowRight className="size-4" /></Link>)}</div></section>
    </div>
  </>;
}

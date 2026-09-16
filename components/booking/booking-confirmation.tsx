"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, Clock3, LayoutDashboard, ReceiptText, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLatestDemoBooking } from "@/services/demo-storage";
import type { DemoBookingRecord } from "@/types/demo";

export function BookingConfirmation() {
  const [booking, setBooking] = useState<DemoBookingRecord | null | undefined>(undefined);
  useEffect(() => setBooking(getLatestDemoBooking()), []);

  if (booking === undefined) return <div className="min-h-[480px] animate-pulse rounded-[1.75rem] bg-white" />;
  if (!booking) return <div className="rounded-[1.75rem] border border-[#17362d]/10 bg-white p-9 text-center"><ReceiptText className="mx-auto size-7 text-[#a65f3d]" /><h1 className="mt-4 font-display text-4xl">No recent demo booking.</h1><p className="mt-3 text-sm text-[#65756e]">Choose a session to try the complete booking journey.</p><Button asChild className="mt-6 rounded-full bg-[#254d3f] text-white"><Link href="/schedule">View schedule</Link></Button></div>;
  const date = new Date(booking.startsAt);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#17362d]/10 bg-white shadow-[0_18px_55px_rgba(36,57,47,0.08)]">
      <div className="bg-[#17362d] px-6 py-10 text-center text-white sm:px-10"><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#dfb77e] text-[#17362d]"><Check className="size-8" strokeWidth={2.5} /></span><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#dfb77e]">Booking confirmed</p><h1 className="mt-2 font-display text-4xl sm:text-5xl">Your mat is waiting.</h1><p className="mt-3 text-sm text-[#becdc5]">A demo receipt and confirmation have been created in this browser.</p></div>
      <div className="p-6 sm:p-9">
        <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a65f3d]">{booking.bookingType === "trial" ? "New-student trial" : "Single session"}</p><h2 className="mt-2 font-display text-3xl">{booking.className}</h2></div><p className="text-right"><span className="block text-xs text-[#738078]">Paid</span><strong className="text-xl">₹{booking.amount}</strong></p></div>
        <div className="mt-7 grid gap-4 rounded-[1.25rem] bg-[#edf0e9] p-5 text-sm text-[#52665c] sm:grid-cols-2"><p className="flex gap-3"><CalendarDays className="size-4 shrink-0 text-[#a65f3d]" />{date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" })}</p><p className="flex gap-3"><Clock3 className="size-4 shrink-0 text-[#a65f3d]" />{date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })} IST</p><p className="flex gap-3"><UserRound className="size-4 shrink-0 text-[#a65f3d]" />{booking.instructorName}</p><p className="flex gap-3"><ReceiptText className="size-4 shrink-0 text-[#a65f3d]" />{booking.id}</p></div>
        <div className="mt-7 border-t border-[#17362d]/10 pt-6"><p className="font-semibold">Before your class</p><ul className="mt-3 grid gap-2 text-sm text-[#65756e]"><li>Arrive 10 minutes early for a comfortable start.</li><li>Wear easy-to-move clothing; mats are available at the studio.</li><li>Confirmation messages are simulated and are not sent externally.</li></ul></div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2"><Button asChild className="h-11 rounded-full bg-[#254d3f] text-white"><Link href="/schedule">Book another class</Link></Button><Button asChild variant="outline" className="h-11 rounded-full bg-transparent"><Link href="/dashboard"><LayoutDashboard className="size-4" />View dashboard</Link></Button></div>
      </div>
    </div>
  );
}

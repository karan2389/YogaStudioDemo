"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, RotateCcw, List } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { CustomerCalendar } from "@/components/dashboard/customer-calendar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDemoSession } from "@/hooks/use-demo-session";
import { canCancelBooking, cancelBooking, getDemoBookings } from "@/services/demo-storage";
import type { DemoBookingRecord } from "@/types/demo";

export function BookingsView() {
  const { session } = useDemoSession();
  const [items, setItems] = useState<DemoBookingRecord[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  useEffect(() => {
    const load = () => {
      if (session) {
        const userBookings = getDemoBookings()
          .filter((item) => item.customerId === session.id);
        setItems(userBookings);
      }
    };
    load();
    window.addEventListener("ananda-demo-change", load);
    return () => window.removeEventListener("ananda-demo-change", load);
  }, [session]);

  function handleCancel(bookingId: string) {
    const result = cancelBooking(bookingId);
    if (result.success) {
      setFeedback({ type: "success", message: result.message });
    } else {
      setFeedback({ type: "error", message: result.message });
    }
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="My bookings"
        title="Your sessions."
        copy="View confirmed and cancelled bookings. Cancellations are available until two hours before class."
        action={
          <Button asChild className="h-11 rounded-full bg-[#254d3f] text-white hover:bg-[#17362d]">
            <Link href="/schedule">Book another class</Link>
          </Button>
        }
      />

      {feedback && (
        <div
          role="status"
          className={`mb-5 flex items-start justify-between gap-3 rounded-2xl border p-4 text-sm font-medium ${
            feedback.type === "success"
              ? "border-[#254d3f]/20 bg-[#eef4f0] text-[#1c3e32]"
              : feedback.type === "info"
              ? "border-[#dfb77e]/30 bg-[#fbf6ed] text-[#7a5420]"
              : "border-[#9a4a3d]/20 bg-[#fdf2f0] text-[#9a4a3d]"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-5 shrink-0 text-[#254d3f]" />
            ) : (
              <AlertCircle className="size-5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <div className="flex bg-[#17362d]/5 p-1 rounded-full border border-[#17362d]/10">
          <button 
            onClick={() => setViewMode("list")} 
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition ${viewMode === "list" ? "bg-white text-[#17362d] shadow-sm" : "text-[#65756e] hover:text-[#17362d]"}`}
          >
            <List className="size-4" /> List
          </button>
          <button 
            onClick={() => setViewMode("calendar")} 
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition ${viewMode === "calendar" ? "bg-white text-[#17362d] shadow-sm" : "text-[#65756e] hover:text-[#17362d]"}`}
          >
            <CalendarDays className="size-4" /> Calendar
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {items.length ? (
          viewMode === "calendar" ? (
            <CustomerCalendar 
              bookings={items} 
              onCancel={(id, success, message) => {
                if (success) {
                  setFeedback({ type: "success", message });
                } else {
                  setFeedback({ type: "error", message });
                }
              }} 
            />
          ) : (
            items.map((booking) => {
            const date = new Date(booking.startsAt);
            const cancellable = canCancelBooking(booking);

            return (
              <article
                key={booking.id}
                className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-5 shadow-[0_8px_28px_rgba(36,57,47,0.04)] sm:p-6"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex gap-4">
                    <span
                      className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                        booking.status === "confirmed"
                          ? "bg-[#e3ece5] text-[#315744]"
                          : "bg-[#eeeae5] text-[#7a746d]"
                      }`}
                    >
                      <CalendarDays className="size-5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-2xl">{booking.className}</h2>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase ${
                            booking.status === "confirmed"
                              ? "bg-[#e3ece5] text-[#315744]"
                              : "bg-[#eeeae5] text-[#6f6963]"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#65756e]">
                        {date.toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          timeZone: "Asia/Kolkata",
                        })}{" "}
                        ·{" "}
                        {date.toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "2-digit",
                          timeZone: "Asia/Kolkata",
                        })}
                      </p>
                      <p className="mt-1 text-xs text-[#809087]">
                        {booking.instructorName} ·{" "}
                        {booking.bookingType === "trial" ? "Trial session (₹500)" : "Single session"} · {booking.id}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-semibold text-lg">₹{booking.amount}</p>

                    {booking.status === "cancelled" ? (
                      <div className="mt-2 text-xs">
                        <div className="text-[#8b3d32]">
                          <p className="font-semibold flex items-center justify-end gap-1">
                            <AlertCircle className="size-3.5" />
                            Cancelled
                          </p>
                          <p className="mt-1 text-[11px] text-[#738078]">No refund issued for cancelled bookings.</p>
                        </div>
                      </div>
                    ) : cancellable ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 rounded-full border-[#9a4337]/30 bg-transparent text-[#8b3d32] hover:bg-[#fbf4f3] hover:text-[#702f27]"
                          >
                            Cancel booking
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[1.5rem] bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-display text-2xl">
                              Cancel {booking.className}?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm leading-6 text-[#65756e]">
                              Cancellation Policy: You can cancel this booking up to 2 hours before the session. No refund will be issued for cancelled bookings.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4 gap-2 sm:gap-3">
                            <AlertDialogCancel className="rounded-full">Keep Booking</AlertDialogCancel>
                            <AlertDialogAction
                              className="rounded-full bg-[#9a4337] text-white hover:bg-[#7f342b]"
                              onClick={() => handleCancel(booking.id)}
                            >
                              Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <div className="mt-2 text-right">
                        <p className="flex items-center justify-end gap-1 text-xs font-semibold text-[#9a4a3d]">
                          <Clock3 className="size-3.5" />
                          Cancellation closed
                        </p>
                        <p className="mt-1 text-[11px] text-[#738078] max-w-[220px]">
                          This session cannot be cancelled online because it starts within the 2-hour cancellation window.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )) : (
          <div className="rounded-[1.5rem] border border-dashed border-[#17362d]/20 bg-white p-10 text-center">
            <CalendarDays className="mx-auto size-7 text-[#a65f3d]" />
            <h2 className="mt-4 font-display text-3xl">No bookings yet.</h2>
            <p className="mt-2 text-sm text-[#65756e]">Your confirmed sessions will appear here.</p>
            <Button asChild className="mt-6 rounded-full bg-[#254d3f] text-white hover:bg-[#17362d]">
              <Link href="/schedule">Explore schedule</Link>
            </Button>
          </div>
        )}
      </div>

      <p className="mt-5 text-xs leading-5 text-[#738078]">
        Demo rule: cancellations are available until two hours before the session start time.
        All state is stored locally in your browser.
      </p>
    </>
  );
}

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock3, MapPin } from "lucide-react";
import type { DemoBookingRecord } from "@/types/demo";
import { canCancelBooking, cancelBooking } from "@/services/demo-storage";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CustomerCalendar({ bookings, onCancel }: { bookings: DemoBookingRecord[], onCancel: (id: string, success: boolean, message: string) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<DemoBookingRecord | null>(null);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const activeBookings = bookings.filter((b) => b.status === "confirmed");

  function handleCancel() {
    if (!selectedBooking) return;
    const result = cancelBooking(selectedBooking.id);
    setSelectedBooking(null);
    onCancel(selectedBooking.id, result.success, result.message);
  }

  return (
    <div className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-6 shadow-[0_8px_28px_rgba(36,57,47,0.04)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-[#17362d]">
          {currentDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-full border-[#17362d]/20 text-[#17362d]">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full border-[#17362d]/20 text-[#17362d]">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-[#17362d]/10 rounded-xl overflow-hidden border border-[#17362d]/10">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-[#fcf8f5] py-2 text-center text-xs font-bold uppercase tracking-wider text-[#a65f3d]">
            {day}
          </div>
        ))}
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="bg-white min-h-[100px] p-2 opacity-50" />
        ))}
        {days.map((day) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayBookings = activeBookings.filter((b) => {
            const bDate = new Date(b.startsAt);
            return bDate.getDate() === day && bDate.getMonth() === currentDate.getMonth() && bDate.getFullYear() === currentDate.getFullYear();
          });

          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={day} className={`bg-white min-h-[100px] p-2 transition hover:bg-[#fcfcfc] ${isToday ? "bg-[#f3f6f1]" : ""}`}>
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${isToday ? "flex size-6 items-center justify-center rounded-full bg-[#254d3f] text-white" : "text-[#17362d]"}`}>
                  {day}
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {dayBookings.map((booking) => {
                  const bDate = new Date(booking.startsAt);
                  return (
                    <button
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full text-left flex flex-col rounded-md bg-[#e3ece5] px-2 py-1.5 text-xs transition hover:bg-[#d4e0d7]"
                    >
                      <span className="font-semibold text-[#17362d] truncate">{booking.className}</span>
                      <span className="text-[#5b6d65]">{bDate.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="rounded-[1.5rem] bg-white sm:max-w-[425px]">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{selectedBooking.className}</DialogTitle>
                <p className="text-sm text-[#65756e]">
                  {new Date(selectedBooking.startsAt).toLocaleDateString("en-IN", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-3 text-sm text-[#17362d]">
                  <span className="grid size-8 place-items-center rounded-full bg-[#f3f6f1] text-[#254d3f]"><Clock3 className="size-4" /></span>
                  <span className="font-medium">{new Date(selectedBooking.startsAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#17362d]">
                  <span className="grid size-8 place-items-center rounded-full bg-[#f3f6f1] text-[#254d3f]"><MapPin className="size-4" /></span>
                  <span className="font-medium">Studio A · {selectedBooking.instructorName}</span>
                </div>
              </div>
              <div className="border-t border-[#17362d]/10 pt-4 flex justify-between items-center">
                {canCancelBooking(selectedBooking) ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="rounded-full border-[#9a4337]/30 bg-transparent text-[#8b3d32] hover:bg-[#fbf4f3] hover:text-[#702f27]">
                        Cancel booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[1.5rem] bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-display text-2xl">Cancel {selectedBooking.className}?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-6 text-[#65756e]">
                          Cancellation Policy: You can cancel this booking up to 2 hours before the session. No refund will be issued for cancelled bookings.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4 gap-2 sm:gap-3">
                        <AlertDialogCancel className="rounded-full">Keep Booking</AlertDialogCancel>
                        <AlertDialogAction className="rounded-full bg-[#9a4337] text-white hover:bg-[#7f342b]" onClick={handleCancel}>
                          Cancel Booking
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <p className="text-xs font-semibold text-[#9a4a3d]">Cancellation closed ({"<"} 2 hours)</p>
                )}
                <Button variant="outline" className="rounded-full" onClick={() => setSelectedBooking(null)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

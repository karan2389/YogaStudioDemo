"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Plus, ShoppingCart } from "lucide-react";
import { SessionCard } from "@/components/shared/session-card";
import { getClass, getInstructor } from "@/data/mock-data";
import { getStudioSessions } from "@/services/admin-storage";
import { useDemoCart } from "@/hooks/use-demo-cart";
import type { Session, YogaClass, Instructor } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { formatSessionTimeRange } from "@/lib/date-time";

export function MultiSessionSelector({
  classId,
  initialSessions,
}: {
  classId: string;
  initialSessions: Session[];
}) {
  const [sessionsList, setSessionsList] = useState<Session[]>(initialSessions);
  const cart = useDemoCart();

  useEffect(() => {
    const load = () => {
      const active = getStudioSessions().filter(
        (s) => s.classId === classId && s.status !== "cancelled" && new Date(s.startsAt).getTime() >= Date.now()
      ).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
      
      setSessionsList(active.length > 0 ? active : initialSessions);
    };
    load();
    window.addEventListener("ananda-demo-change", load);
    return () => window.removeEventListener("ananda-demo-change", load);
  }, [classId, initialSessions]);

  if (sessionsList.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="font-display text-2xl text-[#17362d]">More sessions are being scheduled.</p>
        <p className="mt-2 text-sm text-[#65756e]">Explore the full timetable for upcoming classes.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-4">
        {sessionsList.map((session) => {
          const yogaClass = getClass(session.classId);
          const instructor = getInstructor(session.instructorId);
          if (!yogaClass || !instructor) return null;
          
          const inCart = cart.hasItem(session.id);
          const date = new Date(session.startsAt);
          const available = session.capacity - session.bookedSeats;

          return (
            <article key={session.id} className={`grid grid-cols-[70px_1fr] gap-4 rounded-[1.5rem] border p-5 sm:grid-cols-[90px_1fr_auto] sm:items-center ${inCart ? "border-[#254d3f] bg-[#f3f6f1]" : "border-[#17362d]/10 bg-white hover:border-[#17362d]/20"}`}>
              <div className="border-r border-[#17362d]/12 pr-4 text-center sm:pr-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a65f3d]">{date.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })}</p>
                <p className="font-display text-3xl leading-none text-[#17362d]">{date.getDate()}</p>
                <p className="mt-1 text-xs text-[#738078]">{date.toLocaleDateString("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" })}</p>
              </div>
              
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-display text-xl text-[#17362d]">{yogaClass.name}</h3>
                  <span className="rounded-full bg-[#e8ede6] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-[#40604f]">{yogaClass.difficulty}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-[#65756e]">Instructor: <span className="text-[#17362d]">{instructor.name}</span></p>
                <div className="mt-2 text-sm text-[#5b6d65]">
                  <span className="font-medium text-[#17362d]">
                    {formatSessionTimeRange(session.startTime || session.startsAt, session.endTime, yogaClass.durationMinutes)}
                  </span>
                  <span className="mx-2">·</span>
                  <span className={available <= 3 ? "font-bold text-[#a65f3d]" : "font-medium"}>
                    {available} seats remaining
                  </span>
                </div>
              </div>

              <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto">
                <span className="font-semibold text-[#254d3f]">₹{yogaClass.price}</span>
                {inCart ? (
                  <Button 
                    variant="outline" 
                    onClick={() => cart.removeItem(session.id)}
                    className="h-10 rounded-full border-[#254d3f]/30 bg-white text-[#254d3f] hover:bg-[#f9fbf8]"
                  >
                    <Check className="mr-2 size-4" /> Added
                  </Button>
                ) : (
                  <Button 
                    onClick={() => cart.addItem({
                      sessionId: session.id,
                      className: yogaClass.name,
                      instructorId: instructor.id,
                      instructorName: instructor.name,
                      startsAt: session.startsAt,
                      price: yogaClass.price,
                    })}
                    className="h-10 rounded-full bg-[#254d3f] text-white hover:bg-[#1a3a2f]"
                  >
                    <Plus className="mr-2 size-4" /> Add
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {cart.items.length > 0 && (
        <div className="sticky bottom-6 z-10 mt-8 rounded-[1.5rem] border border-[#254d3f]/10 bg-white p-4 shadow-[0_12px_40px_rgba(36,57,47,0.12)]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-full bg-[#f3f6f1] text-[#254d3f]">
                <ShoppingCart className="size-5" />
              </div>
              <div>
                <p className="font-display text-xl text-[#17362d]">{cart.items.length} sessions selected</p>
                <p className="text-sm font-semibold text-[#65756e]">Total: ₹{cart.totalAmount}</p>
              </div>
            </div>
            <Button asChild className="h-12 rounded-full bg-[#254d3f] px-8 text-white hover:bg-[#1a3a2f]">
              <Link href="/cart">
                Checkout <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

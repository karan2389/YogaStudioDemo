import Link from "next/link";
import { ArrowRight, Clock3, Users } from "lucide-react";
import type { Instructor, Session, YogaClass } from "@/types/domain";
import { formatSessionTimeRange } from "@/lib/date-time";

export function SessionCard({ session, yogaClass, instructor }: { session: Session; yogaClass?: YogaClass; instructor?: Instructor }) {
  const date = new Date(session.startsAt);
  const available = session.capacity - session.bookedSeats;
  return (
    <article className="grid grid-cols-[70px_1fr] gap-4 border-b border-[#17362d]/12 py-5 last:border-0 sm:grid-cols-[90px_1fr_auto] sm:items-center">
      <div className="border-r border-[#17362d]/12 pr-4 text-center sm:pr-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a65f3d]">{date.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })}</p>
        <p className="font-display text-3xl leading-none text-[#17362d]">{date.getDate()}</p>
        <p className="mt-1 text-xs text-[#738078]">{date.toLocaleDateString("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" })}</p>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-display text-xl text-[#17362d]">{yogaClass?.name}</h3>
          <span className="rounded-full bg-[#e8ede6] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-[#40604f]">{yogaClass?.difficulty}</span>
        </div>
        <p className="mt-1 text-sm font-medium text-[#65756e]">Instructor: <span className="text-[#17362d]">{instructor?.name ?? "Lead Instructor"}</span></p>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#5b6d65]">
          <span className="flex items-center gap-1.5 font-medium text-[#17362d]">
            <Clock3 className="size-4 text-[#a65f3d]" />
            {formatSessionTimeRange(session.startTime || session.startsAt, session.endTime, yogaClass?.durationMinutes)}
            {yogaClass?.durationMinutes ? ` (${yogaClass.durationMinutes} min)` : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4 text-[#738078]" />
            <span className={available <= 3 ? "font-bold text-[#a65f3d]" : "font-medium"}>
              {available} seats remaining
            </span>
          </span>
        </div>
      </div>
      <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto">
        <span className="font-semibold text-[#254d3f]">₹{yogaClass?.price}</span>
        <Link href={`/book/${session.id}`} className="group/cta flex items-center gap-2 rounded-full border border-[#254d3f]/25 px-4 py-2 text-sm font-bold text-[#254d3f] transition hover:bg-[#254d3f] hover:text-white">Book <ArrowRight className="size-4 transition group-hover/cta:translate-x-0.5" /></Link>
      </div>
    </article>
  );
}

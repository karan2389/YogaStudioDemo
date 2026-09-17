"use client";

import { useEffect, useState } from "react";
import { BarChart3, CalendarCheck, Download, IndianRupee, UsersRound, WalletCards } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { getAdminCollection } from "@/services/admin-storage";
import { getOperationalBookings, getOperationalMemberships, getOperationalPayments } from "@/services/admin-operations";
import { getDemoAttendance } from "@/services/demo-storage";

interface ReportState {
  revenue: number;
  bookings: number;
  activeMembers: number;
  present: number;
  occupancy: number;
  classes: { name: string; bookings: number }[];
}

const initial: ReportState = {
  revenue: 0,
  bookings: 0,
  activeMembers: 0,
  present: 0,
  occupancy: 0,
  classes: [],
};

export function AdminReports() {
  const [report, setReport] = useState(initial);

  useEffect(() => {
    const load = () => {
      const payments = getOperationalPayments();
      const bookings = getOperationalBookings();
      const memberships = getOperationalMemberships();
      const attendance = getDemoAttendance();
      const sessions = getAdminCollection("sessions");
      const capacity = sessions.reduce((sum, item) => sum + Number(item.capacity), 0);
      const occupied = sessions.reduce((sum, item) => sum + Number(item.bookedSeats), 0);
      const counts = bookings.reduce<Record<string, number>>((result, item) => ({
        ...result,
        [item.className]: (result[item.className] ?? 0) + 1,
      }), {});

      setReport({
        revenue: payments.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0),
        bookings: bookings.length,
        activeMembers: memberships.filter((item) => item.status === "active").length,
        present: attendance.filter((item) => item.status === "present").length,
        occupancy: capacity ? Math.round((occupied / capacity) * 100) : 0,
        classes: Object.entries(counts).map(([name, value]) => ({ name, bookings: value })).sort((a, b) => b.bookings - a.bookings),
      });
    };

    load();
    window.addEventListener("ananda-demo-change", load);
    return () => window.removeEventListener("ananda-demo-change", load);
  }, []);

  function exportCsv() {
    const rows = [
      ["Metric", "Value"],
      ["Revenue", report.revenue],
      ["Bookings", report.bookings],
      ["Active memberships", report.activeMembers],
      ["Present attendances", report.present],
      ["Occupancy percent", report.occupancy],
    ];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ananda-demo-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const cards = [
    { label: "Collected revenue", value: `₹${report.revenue.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Bookings", value: report.bookings, icon: CalendarCheck },
    { label: "Active members", value: report.activeMembers, icon: WalletCards },
    { label: "Present marks", value: report.present, icon: UsersRound },
  ];

  const max = Math.max(...report.classes.map((item) => item.bookings), 1);

  return <>
    <DashboardPageHeader
      eyebrow="Reporting"
      title="Studio reports"
      copy="A concise operational view built from this browser's demo activity."
      action={<Button variant="outline" className="h-11 rounded-full bg-white" onClick={exportCsv}><Download /> Export CSV</Button>}
    />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5">
          <span className="grid size-10 place-items-center rounded-full bg-[#e5ecec] text-[#3e5a62]">
            <Icon className="size-5" />
          </span>
          <p className="mt-5 text-2xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-[#65756e]">{label}</p>
        </div>
      ))}
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a65f3d]">Class interest</p>
            <h2 className="mt-2 font-display text-3xl">Bookings by class</h2>
          </div>
          <BarChart3 className="size-6 text-[#3e5a62]" />
        </div>
        <div className="mt-7 space-y-5">
          {report.classes.map((item) => (
            <div key={item.name}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold">{item.name}</span>
                <span className="text-[#65756e]">{item.bookings}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#e7ecea]">
                <div
                  className="h-full rounded-full bg-[#a65f3d]"
                  style={{ width: `${Math.max((item.bookings / max) * 100, 8)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-[1.5rem] bg-[#203b45] p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9bc3bf]">Capacity</p>
        <div
          className="mt-6 grid aspect-square place-items-center rounded-full border-[18px] border-[#9bc3bf]/20"
          style={{ background: `conic-gradient(#9bc3bf ${report.occupancy}%, transparent 0)` }}
        >
          <div className="grid size-[72%] place-items-center rounded-full bg-[#203b45] text-center">
            <div>
              <p className="font-display text-5xl">{report.occupancy}%</p>
              <p className="mt-1 text-sm text-[#c6d4d7]">scheduled occupancy</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between border-t border-white/10 pt-5 text-sm">
          <span className="text-[#c6d4d7]">Active members</span>
          <strong>{report.activeMembers}</strong>
        </div>
      </section>
    </div>
  </>;
}

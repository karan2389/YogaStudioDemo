"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  Filter,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  User,
  X,
  XCircle,
} from "lucide-react";
import { exportToCsv, type CsvColumn } from "@/lib/export-csv";
import { formatSessionTime } from "@/lib/date-time";
import { getStudioSessions } from "@/services/admin-storage";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getOperationalBookings,
  getOperationalPayments,
  updateOperationalBookingStatus,
} from "@/services/admin-operations";
import { customers, instructors, yogaClasses } from "@/data/mock-data";
import type { OperationalBooking } from "@/types/admin";

export function AdminBookingsView() {
  const [bookings, setBookings] = useState<OperationalBooking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [instructorFilter, setInstructorFilter] = useState("all");
  const [timingFilter, setTimingFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");

  // Sorting state
  const [sortField, setSortField] = useState<"createdAt" | "startsAt" | "amount" | "customerName">("startsAt");
  const [sortAsc, setSortAsc] = useState(false);


  useEffect(() => {
    const load = () => {
      setBookings(getOperationalBookings());
    };
    load();
    window.addEventListener("ananda-demo-change", load);
    return () => window.removeEventListener("ananda-demo-change", load);
  }, []);

  // Summary KPIs calculated dynamically from all bookings & refunds
  const metrics = useMemo(() => {
    const now = Date.now();
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const upcoming = bookings.filter((b) => new Date(b.startsAt).getTime() >= now).length;
    const today = bookings.filter((b) => {
      const d = new Date(b.startsAt);
      const todayDate = new Date();
      return (
        d.getDate() === todayDate.getDate() &&
        d.getMonth() === todayDate.getMonth() &&
        d.getFullYear() === todayDate.getFullYear()
      );
    }).length;

    const payments = getOperationalPayments();
    const totalReceived = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayments = bookings.filter((b) => b.paymentStatus === "pending" || b.paymentStatus === "failed").length;

    return {
      total: bookings.length,
      confirmed,
      cancelled,
      today,
      upcoming,
      totalReceived,
      pendingPayments,
    };
  }, [bookings]);

  // Filtered & Sorted items
  const filteredBookings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const now = Date.now();

    return bookings
      .filter((item) => {
        // Search filter
        if (query) {
          const matchText = [
            item.id,
            item.customerName,
            item.customerEmail,
            item.customerPhone,
            item.className,
            item.instructorName,
            item.paymentId,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          if (!matchText.includes(query)) return false;
        }

        // Status filter
        if (statusFilter !== "all" && item.status !== statusFilter) return false;

        // Payment status filter
        if (paymentFilter !== "all" && item.paymentStatus !== paymentFilter) return false;


        // Booking type filter
        if (typeFilter !== "all" && item.type !== typeFilter) return false;

        // Class filter
        if (classFilter !== "all" && item.className !== classFilter) return false;

        // Instructor filter
        if (instructorFilter !== "all" && item.instructorName !== instructorFilter) return false;

        // Timing filter
        if (timingFilter === "upcoming" && new Date(item.startsAt).getTime() < now) return false;
        if (timingFilter === "past" && new Date(item.startsAt).getTime() >= now) return false;

        // Membership filter
        if (membershipFilter === "member" && item.type !== "membership") return false;
        if (membershipFilter === "non-member" && item.type === "membership") return false;

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField] ?? "";
        let valB: any = b[sortField] ?? "";
        if (sortField === "startsAt" || sortField === "createdAt") {
          valA = new Date(valA).getTime() || 0;
          valB = new Date(valB).getTime() || 0;
        }
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [
    bookings,
    searchQuery,
    statusFilter,
    paymentFilter,
    typeFilter,
    classFilter,
    instructorFilter,
    timingFilter,
    membershipFilter,
    sortField,
    sortAsc,
  ]);

  const selectedBooking = useMemo(() => {
    if (!selectedBookingId) return null;
    return bookings.find((b) => b.id === selectedBookingId) ?? null;
  }, [bookings, selectedBookingId]);


  function resetFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setTypeFilter("all");
    setClassFilter("all");
    setInstructorFilter("all");
    setTimingFilter("all");
    setMembershipFilter("all");
  }

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "all" ||
    paymentFilter !== "all" ||
    typeFilter !== "all" ||
    classFilter !== "all" ||
    instructorFilter !== "all" ||
    timingFilter !== "all" ||
    membershipFilter !== "all";

  const [exportNotice, setExportNotice] = useState<string | null>(null);

  function handleExportBookings() {
    if (filteredBookings.length === 0) {
      setExportNotice("There is no data available to export.");
      setTimeout(() => setExportNotice(null), 3000);
      return;
    }

    const studioSessions = getStudioSessions();

    const columns: CsvColumn<OperationalBooking>[] = [
      { header: "Booking ID", accessor: (b) => b.id },
      { header: "Customer Name", accessor: (b) => b.customerName },
      { header: "Customer Email", accessor: (b) => b.customerEmail ?? "" },
      { header: "Customer Phone", accessor: (b) => b.customerPhone ?? "" },
      { header: "Session/Class Name", accessor: (b) => b.className },
      { header: "Instructor", accessor: (b) => b.instructorName ?? "Nikita Verma" },
      {
        header: "Session Date",
        accessor: (b) => {
          const s = studioSessions.find((item) => item.id === b.sessionId);
          return s?.date || (s?.startsAt ? s.startsAt.slice(0, 10) : b.startsAt.slice(0, 10));
        },
      },
      {
        header: "Session Start Time",
        accessor: (b) => {
          const s = studioSessions.find((item) => item.id === b.sessionId);
          const time = s?.startTime || (s?.startsAt ? s.startsAt.slice(11, 16) : b.startsAt.slice(11, 16));
          return formatSessionTime(time);
        },
      },
      {
        header: "Session End Time",
        accessor: (b) => {
          const s = studioSessions.find((item) => item.id === b.sessionId);
          return s?.endTime ? formatSessionTime(s.endTime) : "";
        },
      },
      { header: "Booking Type", accessor: (b) => b.type },
      { header: "Booking Status", accessor: (b) => b.status },
      { header: "Amount", accessor: (b) => `₹${b.amount}` },
      { header: "Payment ID", accessor: (b) => b.paymentId ?? "" },
      { header: "Payment Method", accessor: (b) => b.paymentMethod ?? "UPI" },
      { header: "Payment Status", accessor: (b) => b.paymentStatus ?? "paid" },
      { header: "Payroll %", accessor: (b) => b.payrollPercentageSnapshot ?? "" },
      { header: "Instructor Payout", accessor: (b) => b.instructorPayrollAmount ?? "" },
      { header: "Studio Share", accessor: (b) => b.studioShare ?? "" },
      { header: "Booking Created At", accessor: (b) => b.createdAt ?? "" },
      { header: "Cancelled At", accessor: (b) => b.cancelledAt ?? "" },
    ];

    const result = exportToCsv("bookings", columns, filteredBookings);
    if (!result.success && result.message) {
      setExportNotice(result.message);
      setTimeout(() => setExportNotice(null), 3000);
    }
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#deeee3] text-[#245237]";
      case "attended":
        return "bg-[#e5eff0] text-[#2c535d]";
      case "no-show":
        return "bg-[#f2ebe4] text-[#8c5a3a]";
      case "cancelled":
        return "bg-[#fbeaea] text-[#9b3a32]";
      case "pending":
        return "bg-[#fcf3e6] text-[#8f5f19]";
      default:
        return "bg-[#eceeed] text-[#65756e]";
    }
  };

  const paymentBadge = (status?: string) => {
    switch (status) {
      case "paid":
        return "bg-[#deeee3] text-[#245237]";
      case "refunded":
        return "bg-[#e5eff0] text-[#2c535d]";
      case "pending":
        return "bg-[#fcf3e6] text-[#8f5f19]";
      case "failed":
        return "bg-[#fbeaea] text-[#9b3a32]";
      default:
        return "bg-[#eceeed] text-[#65756e]";
    }
  };

  const refundBadge = (status?: string) => {
    switch (status) {
      case "requested":
        return "bg-[#fbf4eb] text-[#a65f3d] font-bold border border-[#a65f3d]/20";
      case "processing":
        return "bg-[#eef3f6] text-[#2c535d] font-bold border border-[#2c535d]/20";
      case "completed":
        return "bg-[#deeee3] text-[#245237]";
      case "rejected":
        return "bg-[#fbeaea] text-[#9b3a32]";
      default:
        return "bg-transparent text-[#8a9893]";
    }
  };

  return (
    <>
      <DashboardPageHeader
        eyebrow="Studio operations"
        title="Bookings & Reservations"
        copy="Monitor customer session enrollments, attendance, payments, cancellations, and staged refund requests."
      />

      {/* Summary Metrics Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-4 shadow-[0_4px_16px_rgba(36,57,47,0.03)]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#738078]">Total Bookings</p>
          <p className="mt-2 font-display text-3xl text-[#17362d]">{metrics.total}</p>
          <p className="mt-1 text-xs text-[#65756e]">{metrics.confirmed} confirmed · {metrics.cancelled} cancelled</p>
        </div>

        <div className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-4 shadow-[0_4px_16px_rgba(36,57,47,0.03)]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#738078]">Today's Sessions</p>
          <p className="mt-2 font-display text-3xl text-[#17362d]">{metrics.today}</p>
          <p className="mt-1 text-xs text-[#65756e]">{metrics.upcoming} total upcoming</p>
        </div>

        <div className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-4 shadow-[0_4px_16px_rgba(36,57,47,0.03)]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#738078]">Total Received</p>
          <p className="mt-2 font-display text-3xl text-[#245237]">₹{metrics.totalReceived.toLocaleString("en-IN")}</p>
          <p className="mt-1 text-xs text-[#65756e]">{metrics.pendingPayments} pending / failed</p>
        </div>


      </div>

      {exportNotice && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#a65f3d]/20 bg-[#fbf0e9] p-4 text-sm font-semibold text-[#8b4a2e]">
          <AlertCircle className="size-5 shrink-0 text-[#a65f3d]" />
          {exportNotice}
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="mb-6 rounded-[1.5rem] border border-[#17362d]/10 bg-white p-5 shadow-[0_6px_22px_rgba(36,57,47,0.035)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#738078]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, phone, booking ID, session, instructor..."
              className="h-11 rounded-full border-[#17362d]/15 bg-[#f8f9f7] pl-10 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportBookings}
              disabled={filteredBookings.length === 0}
              className="h-11 rounded-full border-[#17362d]/15 bg-white px-5 font-semibold text-[#17362d] hover:bg-[#edf0e9] disabled:opacity-50"
            >
              <Download className="mr-2 size-4 text-[#a65f3d]" />
              Export CSV
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-11 rounded-full border-[#8b3d32]/20 text-[#8b3d32] hover:bg-[#fbf4f3]"
              >
                <X className="mr-1 size-3.5" /> Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#738078]">Booking Status</label>
            <NativeSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 h-9 w-full rounded-xl text-xs"
            >
              <NativeSelectOption value="all">All statuses</NativeSelectOption>
              <NativeSelectOption value="confirmed">Confirmed</NativeSelectOption>
              <NativeSelectOption value="attended">Attended</NativeSelectOption>
              <NativeSelectOption value="no-show">No-show</NativeSelectOption>
              <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
              <NativeSelectOption value="pending">Pending</NativeSelectOption>
            </NativeSelect>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#738078]">Payment</label>
            <NativeSelect
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="mt-1 h-9 w-full rounded-xl text-xs"
            >
              <NativeSelectOption value="all">All payments</NativeSelectOption>
              <NativeSelectOption value="paid">Paid</NativeSelectOption>
              <NativeSelectOption value="pending">Pending</NativeSelectOption>
              <NativeSelectOption value="failed">Failed</NativeSelectOption>
              <NativeSelectOption value="refunded">Refunded</NativeSelectOption>
            </NativeSelect>
          </div>



          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#738078]">Booking Type</label>
            <NativeSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mt-1 h-9 w-full rounded-xl text-xs"
            >
              <NativeSelectOption value="all">All types</NativeSelectOption>
              <NativeSelectOption value="single">Single (Paid)</NativeSelectOption>
              <NativeSelectOption value="trial">Trial (₹500)</NativeSelectOption>
              <NativeSelectOption value="membership">Membership pass</NativeSelectOption>
            </NativeSelect>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#738078]">Session</label>
            <NativeSelect
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="mt-1 h-9 w-full rounded-xl text-xs"
            >
              <NativeSelectOption value="all">All sessions</NativeSelectOption>
              {yogaClasses.map((c) => (
                <NativeSelectOption key={c.id} value={c.name}>
                  {c.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#738078]">Instructor</label>
            <NativeSelect
              value={instructorFilter}
              onChange={(e) => setInstructorFilter(e.target.value)}
              className="mt-1 h-9 w-full rounded-xl text-xs"
            >
              <NativeSelectOption value="all">All instructors</NativeSelectOption>
              {instructors.map((i) => (
                <NativeSelectOption key={i.id} value={i.name}>
                  {i.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#738078]">Timing</label>
            <NativeSelect
              value={timingFilter}
              onChange={(e) => setTimingFilter(e.target.value)}
              className="mt-1 h-9 w-full rounded-xl text-xs"
            >
              <NativeSelectOption value="all">All times</NativeSelectOption>
              <NativeSelectOption value="upcoming">Upcoming</NativeSelectOption>
              <NativeSelectOption value="past">Past</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
      </div>

      {/* Results Count & Quick Sorting bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm font-semibold text-[#65756e]">
          Showing <span className="text-[#17362d]">{filteredBookings.length}</span> of {bookings.length} records
        </p>
        <div className="flex items-center gap-2 text-xs text-[#738078]">
          <span className="font-semibold">Sort by:</span>
          <button
            onClick={() => {
              if (sortField === "startsAt") setSortAsc(!sortAsc);
              else {
                setSortField("startsAt");
                setSortAsc(false);
              }
            }}
            className={`rounded-lg px-2 py-1 font-semibold transition ${
              sortField === "startsAt" ? "bg-[#17362d] text-white" : "hover:bg-white"
            }`}
          >
            Session Date {sortField === "startsAt" && (sortAsc ? "↑" : "↓")}
          </button>
          <button
            onClick={() => {
              if (sortField === "amount") setSortAsc(!sortAsc);
              else {
                setSortField("amount");
                setSortAsc(false);
              }
            }}
            className={`rounded-lg px-2 py-1 font-semibold transition ${
              sortField === "amount" ? "bg-[#17362d] text-white" : "hover:bg-white"
            }`}
          >
            Amount {sortField === "amount" && (sortAsc ? "↑" : "↓")}
          </button>
          <button
            onClick={() => {
              if (sortField === "customerName") setSortAsc(!sortAsc);
              else {
                setSortField("customerName");
                setSortAsc(true);
              }
            }}
            className={`rounded-lg px-2 py-1 font-semibold transition ${
              sortField === "customerName" ? "bg-[#17362d] text-white" : "hover:bg-white"
            }`}
          >
            Customer {sortField === "customerName" && (sortAsc ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-[1.5rem] border border-[#17362d]/10 bg-white shadow-[0_8px_30px_rgba(36,57,47,0.035)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#17362d]/10 bg-[#f7f8f6] text-[11px] font-bold uppercase tracking-wider text-[#65756e]">
              <tr>
                <th className="px-4 py-3.5">Booking ID</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Session / Class</th>
                <th className="px-4 py-3.5">Instructor</th>
                <th className="px-4 py-3.5">Session Date & Time</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Booking Status</th>
                <th className="px-4 py-3.5">Payroll</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17362d]/8">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((item) => {
                  const sDate = new Date(item.startsAt);
                  const isUpcoming = sDate.getTime() >= Date.now();

                  return (
                    <tr
                      key={item.id}
                      className="group transition hover:bg-[#fbfcfb]"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-[#3e5a62]">
                        {item.id}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#17362d]">{item.customerName}</div>
                        <div className="text-xs text-[#738078]">{item.customerEmail}</div>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-[#17362d]">
                        {item.className}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-[#65756e]">
                        {item.instructorName ?? "Nikita Verma"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-[#65756e]">
                        <div className="font-medium text-[#17362d]">
                          {sDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            timeZone: "Asia/Kolkata",
                          })}
                        </div>
                        <div className="text-[11px] text-[#738078]">
                          {sDate.toLocaleTimeString("en-IN", {
                            hour: "numeric",
                            minute: "2-digit",
                            timeZone: "Asia/Kolkata",
                          })}{" "}
                          ({isUpcoming ? "Upcoming" : "Past"})
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[11px] font-semibold capitalize text-[#55635c]">
                          {item.type}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-[#17362d]">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${paymentBadge(item.paymentStatus)}`}>
                          {item.paymentStatus ?? "paid"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span className="font-semibold text-[#17362d]">
                          {item.instructorPayrollAmount !== undefined ? `₹${item.instructorPayrollAmount}` : "—"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBookingId(item.id)}
                          className="h-8 rounded-full border-[#17362d]/15 bg-white text-xs hover:bg-[#254d3f] hover:text-white"
                        >
                          <Eye className="mr-1 size-3.5" /> Details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="p-12 text-center">
                    <CalendarDays className="mx-auto size-8 text-[#a65f3d]" />
                    <p className="mt-3 font-display text-2xl">No matching bookings found.</p>
                    <p className="mt-1 text-sm text-[#65756e]">
                      {hasActiveFilters ? "Try adjusting or clearing your filters." : "No bookings recorded yet."}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="mt-4 rounded-full"
                      >
                        Reset All Filters
                      </Button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Dialog */}
      <Dialog
        open={Boolean(selectedBookingId)}
        onOpenChange={(open) => {
          if (!open) setSelectedBookingId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[1.75rem] border-[#17362d]/10 bg-[#fbf8f5] p-6 sm:max-w-2xl sm:p-8">
          {selectedBooking && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#e3ece5] px-3 py-1 font-mono text-xs font-bold text-[#245237]">
                    {selectedBooking.id}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusBadge(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <DialogTitle className="mt-3 font-display text-3xl text-[#17362d]">
                  {selectedBooking.className}
                </DialogTitle>
                <DialogDescription className="text-sm text-[#65756e]">
                  Complete booking, payment, and refund audit details.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Customer Info Card */}
                <div className="rounded-2xl border border-[#17362d]/10 bg-white p-4">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a65f3d]">
                    <User className="size-3.5" /> Customer Details
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-[#738078]">Full Name</p>
                      <p className="font-semibold text-[#17362d]">{selectedBooking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#738078]">Customer ID</p>
                      <p className="font-mono text-xs text-[#65756e]">{selectedBooking.customerId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#738078]">Email</p>
                      <p className="text-xs font-medium text-[#17362d]">{selectedBooking.customerEmail ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#738078]">Phone</p>
                      <p className="text-xs font-medium text-[#17362d]">{selectedBooking.customerPhone ?? "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Session Info Card */}
                <div className="rounded-2xl border border-[#17362d]/10 bg-white p-4">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245237]">
                    <Calendar className="size-3.5" /> Session Details
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-[#738078]">Session Date</p>
                      <p className="font-semibold text-[#17362d]">
                        {new Date(selectedBooking.startsAt).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          timeZone: "Asia/Kolkata",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#738078]">Time & Duration</p>
                      <p className="font-semibold text-[#17362d]">
                        {new Date(selectedBooking.startsAt).toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "2-digit",
                          timeZone: "Asia/Kolkata",
                        })}{" "}
                        · {selectedBooking.durationMinutes ?? 60}m
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#738078]">Instructor</p>
                      <p className="font-semibold text-[#17362d]">{selectedBooking.instructorName ?? "Nikita Verma"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#738078]">Booking Type</p>
                      <p className="font-semibold capitalize text-[#17362d]">{selectedBooking.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#738078]">Session ID</p>
                      <p className="font-mono text-xs text-[#65756e]">{selectedBooking.sessionId}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="rounded-2xl border border-[#17362d]/10 bg-white p-4">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3e5a62]">
                    <CreditCard className="size-3.5" /> Payment Information
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-[#738078]">Amount</p>
                      <p className="font-display text-xl font-bold text-[#17362d]">₹{selectedBooking.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#738078]">Payment Method</p>
                      <p className="font-semibold text-[#17362d]">{selectedBooking.paymentMethod ?? "UPI"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#738078]">Payment Status</p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold capitalize ${paymentBadge(selectedBooking.paymentStatus)}`}>
                        {selectedBooking.paymentStatus ?? "paid"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-[#738078]">Payment ID</p>
                      <p className="font-mono text-xs text-[#65756e]">{selectedBooking.paymentId ?? "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Instructor Payroll Information */}
                {selectedBooking.instructorPayrollAmount !== undefined && (
                  <div className="rounded-2xl border border-[#17362d]/10 bg-white p-4">
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245237]">
                      <Sparkles className="size-3.5" /> Instructor Payroll
                    </h3>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-[#738078]">Payout Amount</p>
                        <p className="font-display text-xl font-bold text-[#17362d]">₹{selectedBooking.instructorPayrollAmount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#738078]">Payroll Percentage</p>
                        <p className="font-semibold text-[#17362d]">{selectedBooking.payrollPercentageSnapshot}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#738078]">Studio Share</p>
                        <p className="font-semibold text-[#17362d]">₹{selectedBooking.studioShare}</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Booking Lifecycle Timeline */}
                <div className="rounded-2xl border border-[#17362d]/10 bg-white p-4">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#738078]">
                    <Clock className="size-3.5" /> Booking Lifecycle Timeline
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3 text-xs">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#deeee3] text-[#245237] text-[10px] font-bold">
                        ✓
                      </span>
                      <div>
                        <p className="font-semibold text-[#17362d]">Booking Created</p>
                        <p className="text-[11px] text-[#738078]">
                          {selectedBooking.createdAt
                            ? new Date(selectedBooking.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                            : "Recorded in studio system"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs">
                      <span className={`grid size-5 shrink-0 place-items-center rounded-full ${
                        selectedBooking.paymentStatus === "failed" ? "bg-[#fbeaea] text-[#9b3a32]" : "bg-[#deeee3] text-[#245237]"
                      } text-[10px] font-bold`}>
                        {selectedBooking.paymentStatus === "failed" ? "✕" : "✓"}
                      </span>
                      <div>
                        <p className="font-semibold text-[#17362d]">
                          {selectedBooking.paymentStatus === "failed" ? "Payment Failed" : "Payment Completed"}
                        </p>
                        <p className="text-[11px] text-[#738078]">
                          {selectedBooking.paymentMethod ?? "UPI"} · ₹{selectedBooking.amount}
                        </p>
                      </div>
                    </div>

                    {selectedBooking.status === "confirmed" && (
                      <div className="flex items-start gap-3 text-xs">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#deeee3] text-[#245237] text-[10px] font-bold">
                          ✓
                        </span>
                        <div>
                          <p className="font-semibold text-[#17362d]">Booking Confirmed</p>
                          <p className="text-[11px] text-[#738078]">Session seat reserved for customer</p>
                        </div>
                      </div>
                    )}

                    {selectedBooking.status === "attended" && (
                      <div className="flex items-start gap-3 text-xs">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#e5eff0] text-[#2c535d] text-[10px] font-bold">
                          ✓
                        </span>
                        <div>
                          <p className="font-semibold text-[#17362d]">Attended Class</p>
                          <p className="text-[11px] text-[#738078]">Attendance verified by teacher</p>
                        </div>
                      </div>
                    )}

                    {selectedBooking.status === "no-show" && (
                      <div className="flex items-start gap-3 text-xs">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#f2ebe4] text-[#8c5a3a] text-[10px] font-bold">
                          !
                        </span>
                        <div>
                          <p className="font-semibold text-[#17362d]">Marked No-Show</p>
                          <p className="text-[11px] text-[#738078]">Student did not attend scheduled session</p>
                        </div>
                      </div>
                    )}

                    {selectedBooking.status === "cancelled" && (
                      <div className="flex items-start gap-3 text-xs">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#fbeaea] text-[#9b3a32] text-[10px] font-bold">
                          ✕
                        </span>
                        <div>
                          <p className="font-semibold text-[#17362d]">Cancellation Requested</p>
                          <p className="text-[11px] text-[#738078]">
                            {selectedBooking.cancelledAt
                              ? new Date(selectedBooking.cancelledAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                              : "Cancelled online"}
                          </p>
                        </div>
                      </div>
                    )}


                  </div>
                </div>

                {/* Quick Status Control */}
                <div className="flex items-center justify-between rounded-2xl border border-[#17362d]/10 bg-white p-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#738078]">Administrative Status Control</p>
                    <p className="text-xs text-[#65756e]">Manually update this booking's lifecycle state.</p>
                  </div>
                  <NativeSelect
                    value={selectedBooking.status}
                    onChange={(e) => {
                      updateOperationalBookingStatus(selectedBooking.id, e.target.value as any);
                    }}
                    className="h-10 w-36 rounded-full border-[#17362d]/15 bg-white text-xs font-semibold"
                  >
                    <NativeSelectOption value="confirmed">Confirmed</NativeSelectOption>
                    <NativeSelectOption value="attended">Attended</NativeSelectOption>
                    <NativeSelectOption value="no-show">No-show</NativeSelectOption>
                    <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </>
  );
}

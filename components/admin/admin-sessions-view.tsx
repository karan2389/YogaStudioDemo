"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  Clock3,
  Download,
  FilterX,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getClass, getInstructor, instructors, yogaClasses } from "@/data/mock-data";
import {
  calculateEndTime,
  formatSessionCompactDate,
  formatSessionFullDate,
  formatSessionTime,
  formatSessionTimeRange,
  isTimeAfter,
  isValidDate,
  isValidTime,
  parseSessionDateTime,
} from "@/lib/date-time";
import { exportToCsv, type CsvColumn } from "@/lib/export-csv";
import {
  deleteStudioSession,
  getStudioSessions,
  upsertStudioSession,
} from "@/services/admin-storage";
import type { Session } from "@/types/domain";

type DateFilterMode = "all" | "specific" | "range" | "upcoming" | "past";

interface SessionFormData {
  id?: string;
  classId: string;
  instructorId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedSeats: number;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

const blankForm: SessionFormData = {
  classId: yogaClasses[0]?.id ?? "class-hatha",
  instructorId: instructors[0]?.id ?? "ins-nikita",
  date: new Date().toISOString().slice(0, 10),
  startTime: "07:00",
  endTime: "08:00",
  capacity: 14,
  bookedSeats: 0,
  status: "scheduled",
  notes: "",
};

export function AdminSessionsView() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [instructorFilter, setInstructorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateMode, setDateMode] = useState<DateFilterMode>("all");
  const [specificDate, setSpecificDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SessionFormData>(blankForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const load = () => {
    setSessions(getStudioSessions());
  };

  useEffect(() => {
    load();
    window.addEventListener("ananda-demo-change", load);
    return () => window.removeEventListener("ananda-demo-change", load);
  }, []);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    const now = new Date();
    const query = search.toLowerCase().trim();

    return sessions.filter((session) => {
      const cls = getClass(session.classId);
      const ins = getInstructor(session.instructorId);
      const className = cls?.name.toLowerCase() ?? "";
      const instructorName = ins?.name.toLowerCase() ?? "";

      // 1. Text Search
      if (query && !className.includes(query) && !instructorName.includes(query)) {
        return false;
      }

      // 2. Class Filter
      if (classFilter !== "all" && session.classId !== classFilter) {
        return false;
      }

      // 3. Instructor Filter
      if (instructorFilter !== "all" && session.instructorId !== instructorFilter) {
        return false;
      }

      // 4. Status Filter
      if (statusFilter !== "all" && session.status !== statusFilter) {
        return false;
      }

      // 5. Date Filters
      const sessionDate = session.date || session.startsAt.slice(0, 10);
      const sessionTime = new Date(session.startsAt).getTime();

      if (dateMode === "specific") {
        if (specificDate && sessionDate !== specificDate) return false;
      } else if (dateMode === "range") {
        if (fromDate && sessionDate < fromDate) return false;
        if (toDate && sessionDate > toDate) return false;
      } else if (dateMode === "upcoming") {
        if (sessionTime < now.getTime()) return false;
      } else if (dateMode === "past") {
        if (sessionTime >= now.getTime()) return false;
      }

      return true;
    }).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [
    sessions,
    search,
    classFilter,
    instructorFilter,
    statusFilter,
    dateMode,
    specificDate,
    fromDate,
    toDate,
  ]);

  const hasActiveFilters =
    Boolean(search) ||
    classFilter !== "all" ||
    instructorFilter !== "all" ||
    statusFilter !== "all" ||
    dateMode !== "all" ||
    Boolean(specificDate) ||
    Boolean(fromDate) ||
    Boolean(toDate);

  function resetFilters() {
    setSearch("");
    setClassFilter("all");
    setInstructorFilter("all");
    setStatusFilter("all");
    setDateMode("all");
    setSpecificDate("");
    setFromDate("");
    setToDate("");
  }

  function startCreate() {
    setIsEditing(false);
    const defaultDate = new Date().toISOString().slice(0, 10);
    const cls = yogaClasses[0];
    const computedEnd = calculateEndTime("07:00", cls?.durationMinutes ?? 60);
    setFormData({
      classId: cls?.id ?? "class-hatha",
      instructorId: cls?.instructorId ?? instructors[0]?.id ?? "ins-nikita",
      date: defaultDate,
      startTime: "07:00",
      endTime: computedEnd,
      capacity: cls?.capacity ?? 14,
      bookedSeats: 0,
      status: "scheduled",
      notes: "",
    });
    setFormErrors({});
    setDialogOpen(true);
  }

  function startEdit(session: Session) {
    setIsEditing(true);
    const cls = getClass(session.classId);
    const sessionDate = session.date || session.startsAt.slice(0, 10);
    const sessionStartTime = session.startTime || session.startsAt.slice(11, 16);
    const computedEnd =
      session.endTime || calculateEndTime(sessionStartTime, cls?.durationMinutes ?? 60);

    setFormData({
      id: session.id,
      classId: session.classId,
      instructorId: session.instructorId,
      date: sessionDate,
      startTime: sessionStartTime,
      endTime: computedEnd,
      capacity: session.capacity,
      bookedSeats: session.bookedSeats,
      status: session.status,
      notes: session.notes ?? "",
    });
    setFormErrors({});
    setDialogOpen(true);
  }

  // Auto update end time when class or start time changes in create mode
  function handleClassChange(newClassId: string) {
    const cls = getClass(newClassId);
    const duration = cls?.durationMinutes ?? 60;
    const computedEnd = calculateEndTime(formData.startTime, duration);
    setFormData((prev) => ({
      ...prev,
      classId: newClassId,
      instructorId: cls?.instructorId ?? prev.instructorId,
      capacity: cls?.capacity ?? prev.capacity,
      endTime: computedEnd,
    }));
  }

  function handleStartTimeChange(newStartTime: string) {
    const cls = getClass(formData.classId);
    const duration = cls?.durationMinutes ?? 60;
    const computedEnd = calculateEndTime(newStartTime, duration);
    setFormData((prev) => ({
      ...prev,
      startTime: newStartTime,
      endTime: computedEnd,
    }));
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!formData.classId) {
      errors.classId = "Please select a session offering.";
    }

    if (!formData.instructorId) {
      errors.instructorId = "Please select an instructor.";
    }

    if (!formData.date) {
      errors.date = "Date is required.";
    } else if (!isValidDate(formData.date)) {
      errors.date = "Please enter a valid date (YYYY-MM-DD).";
    }

    if (!formData.startTime) {
      errors.startTime = "Start time is required.";
    } else if (!isValidTime(formData.startTime)) {
      errors.startTime = "Please enter a valid start time (HH:mm).";
    }

    if (formData.endTime) {
      if (!isValidTime(formData.endTime)) {
        errors.endTime = "Please enter a valid end time (HH:mm).";
      } else if (!isTimeAfter(formData.startTime, formData.endTime)) {
        errors.endTime = "End time must be later than Start time.";
      }
    }

    if (!formData.capacity || formData.capacity < 1) {
      errors.capacity = "Capacity must be at least 1.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    const startsAt = parseSessionDateTime(formData.date, formData.startTime);
    const newSession: Session = {
      id: formData.id || `ses-${Date.now().toString(36)}`,
      classId: formData.classId,
      instructorId: formData.instructorId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime || undefined,
      startsAt,
      capacity: Number(formData.capacity),
      bookedSeats: Number(formData.bookedSeats),
      status: formData.status,
      notes: formData.notes.trim() || undefined,
    };

    upsertStudioSession(newSession);
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteStudioSession(id);
  }

  function handleExport() {
    if (filteredSessions.length === 0) {
      setExportNotice("There is no data available to export.");
      setTimeout(() => setExportNotice(null), 3000);
      return;
    }

    const columns: CsvColumn<Session>[] = [
      { header: "Session ID", accessor: (s) => s.id },
      { header: "Session/Class Name", accessor: (s) => getClass(s.classId)?.name ?? s.classId },
      { header: "Category", accessor: (s) => getClass(s.classId)?.categoryId ?? "General" },
      { header: "Instructor", accessor: (s) => getInstructor(s.instructorId)?.name ?? s.instructorId },
      { header: "Date", accessor: (s) => s.date || s.startsAt.slice(0, 10) },
      { header: "Start Time", accessor: (s) => formatSessionTime(s.startTime || s.startsAt) },
      { header: "End Time", accessor: (s) => (s.endTime ? formatSessionTime(s.endTime) : "") },
      { header: "Duration", accessor: (s) => `${getClass(s.classId)?.durationMinutes ?? 60} min` },
      { header: "Capacity", accessor: (s) => s.capacity },
      { header: "Booked Seats", accessor: (s) => s.bookedSeats },
      { header: "Remaining Seats", accessor: (s) => s.capacity - s.bookedSeats },
      { header: "Status", accessor: (s) => s.status },
      { header: "Price", accessor: (s) => `₹${getClass(s.classId)?.price ?? 600}` },
      { header: "Starts At (ISO)", accessor: (s) => s.startsAt },
      { header: "Notes", accessor: (s) => s.notes ?? "" },
    ];

    const result = exportToCsv("sessions", columns, filteredSessions);
    if (!result.success && result.message) {
      setExportNotice(result.message);
      setTimeout(() => setExportNotice(null), 3000);
    }
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Timetable"
        title="Studio sessions"
        copy="Manage scheduled yoga sessions, assign instructors, set dates and times, and monitor seat capacity."
        action={
          <Button className="h-11 rounded-full bg-[#254d3f] text-white hover:bg-[#17362d]" onClick={startCreate}>
            <Plus className="mr-1.5 size-4" /> Add session
          </Button>
        }
      />

      {exportNotice && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#a65f3d]/20 bg-[#fbf0e9] p-4 text-sm font-semibold text-[#8b4a2e]">
          <AlertCircle className="size-5 shrink-0 text-[#a65f3d]" />
          {exportNotice}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="mb-6 rounded-[1.5rem] border border-[#17362d]/10 bg-white p-5 shadow-[0_6px_24px_rgba(36,57,47,0.03)]">
        {/* Row 1: Search & Export */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#738078]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by session or instructor..."
              className="h-11 rounded-full border-[#17362d]/15 bg-[#f7f8f6] pl-10"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={filteredSessions.length === 0}
              className="h-11 rounded-full border-[#17362d]/15 bg-white px-5 font-semibold text-[#17362d] hover:bg-[#edf0e9] disabled:opacity-50"
            >
              <Download className="mr-2 size-4 text-[#a65f3d]" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Row 2: Dimensional Filters */}
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#17362d]/10 pt-4 sm:grid-cols-4 lg:grid-cols-5">
          {/* Class Filter */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#738078]">Offering</label>
            <NativeSelect
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl text-xs"
            >
              <NativeSelectOption value="all">All offerings</NativeSelectOption>
              {yogaClasses.map((c) => (
                <NativeSelectOption key={c.id} value={c.id}>
                  {c.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {/* Instructor Filter */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#738078]">Instructor</label>
            <NativeSelect
              value={instructorFilter}
              onChange={(e) => setInstructorFilter(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl text-xs"
            >
              <NativeSelectOption value="all">All instructors</NativeSelectOption>
              {instructors.map((ins) => (
                <NativeSelectOption key={ins.id} value={ins.id}>
                  {ins.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#738078]">Status</label>
            <NativeSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl text-xs"
            >
              <NativeSelectOption value="all">All statuses</NativeSelectOption>
              <NativeSelectOption value="scheduled">Scheduled</NativeSelectOption>
              <NativeSelectOption value="completed">Completed</NativeSelectOption>
              <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
            </NativeSelect>
          </div>

          {/* Date Filter Mode */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#738078]">Date filter</label>
            <NativeSelect
              value={dateMode}
              onChange={(e) => setDateMode(e.target.value as DateFilterMode)}
              className="mt-1 h-10 w-full rounded-xl text-xs"
            >
              <NativeSelectOption value="all">All Dates</NativeSelectOption>
              <NativeSelectOption value="specific">Specific Date</NativeSelectOption>
              <NativeSelectOption value="range">Date Range</NativeSelectOption>
              <NativeSelectOption value="upcoming">Upcoming</NativeSelectOption>
              <NativeSelectOption value="past">Past</NativeSelectOption>
            </NativeSelect>
          </div>

          {/* Clear Button */}
          <div className="col-span-2 flex items-end sm:col-span-4 lg:col-span-1">
            {hasActiveFilters ? (
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="h-10 w-full rounded-xl text-xs font-semibold text-[#8b3d32] hover:bg-[#8b3d32]/10"
              >
                <FilterX className="mr-1.5 size-3.5" /> Clear filters
              </Button>
            ) : null}
          </div>
        </div>

        {/* Dynamic Secondary Date Inputs */}
        {dateMode === "specific" && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-[#f5f7f5] p-3">
            <span className="text-xs font-semibold text-[#52665c]">Select Date:</span>
            <Input
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              className="h-9 w-44 rounded-lg border-[#17362d]/20 bg-white text-xs"
            />
          </div>
        )}

        {dateMode === "range" && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-[#f5f7f5] p-3">
            <span className="text-xs font-semibold text-[#52665c]">From:</span>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 w-44 rounded-lg border-[#17362d]/20 bg-white text-xs"
            />
            <span className="text-xs font-semibold text-[#52665c]">To:</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 w-44 rounded-lg border-[#17362d]/20 bg-white text-xs"
            />
          </div>
        )}
      </div>

      {/* Result Count */}
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-[#65756e]">
          Showing <span className="text-[#17362d]">{filteredSessions.length}</span> of {sessions.length} sessions
        </p>
      </div>

      {/* Sessions Table (Desktop) */}
      <div className="overflow-hidden rounded-[1.5rem] border border-[#17362d]/10 bg-white shadow-[0_8px_30px_rgba(36,57,47,0.035)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#17362d]/10 bg-[#edf0e9] text-[11px] uppercase tracking-wider text-[#65756e]">
              <tr>
                <th className="px-5 py-4 font-bold">Session / Class</th>
                <th className="px-5 py-4 font-bold">Instructor</th>
                <th className="px-5 py-4 font-bold">Date & Time</th>
                <th className="px-5 py-4 font-bold">Capacity</th>
                <th className="px-5 py-4 font-bold">Booked</th>
                <th className="px-5 py-4 font-bold">Remaining</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17362d]/10">
              {filteredSessions.map((session) => {
                const yogaClass = getClass(session.classId);
                const instructor = getInstructor(session.instructorId);
                const remaining = session.capacity - session.bookedSeats;
                const statusStyle =
                  session.status === "scheduled"
                    ? "bg-[#deeee3] text-[#315744]"
                    : session.status === "completed"
                    ? "bg-[#e5eff0] text-[#3e5a62]"
                    : "bg-[#f5e7dd] text-[#8b4a2e]";

                return (
                  <tr key={session.id} className="transition hover:bg-[#fafbf9]">
                    <td className="px-5 py-4">
                      <strong className="block font-display text-lg text-[#17362d]">
                        {yogaClass?.name ?? session.classId}
                      </strong>
                      <span className="text-xs text-[#738078]">
                        {yogaClass?.difficulty} · {yogaClass?.durationMinutes} min
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-[#17362d]">
                      {instructor?.name ?? session.instructorId}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-[#17362d]">
                        <CalendarDays className="size-4 text-[#a65f3d]" />
                        {formatSessionCompactDate(session.date || session.startsAt)}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#65756e]">
                        <Clock3 className="size-3.5 text-[#738078]" />
                        {formatSessionTimeRange(
                          session.startTime || session.startsAt,
                          session.endTime,
                          yogaClass?.durationMinutes
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#5b6d65] font-semibold">{session.capacity}</td>
                    <td className="px-5 py-4 text-[#5b6d65]">{session.bookedSeats}</td>
                    <td className="px-5 py-4">
                      <span className={`font-semibold ${remaining <= 3 ? "text-[#a65f3d]" : "text-[#254d3f]"}`}>
                        {remaining}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusStyle}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(session)}
                          className="h-8 rounded-full border-[#17362d]/20 px-3 text-xs"
                        >
                          <Pencil className="mr-1 size-3" /> Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              className="size-8 rounded-full border-[#8b3d32]/20 text-[#8b3d32] hover:bg-[#8b3d32]/10"
                              aria-label={`Delete ${yogaClass?.name}`}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[1.25rem] bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this session?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the {yogaClass?.name} session on{" "}
                                {formatSessionCompactDate(session.date || session.startsAt)} from demo storage.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel>
                              <AlertDialogAction
                                className="rounded-full bg-[#8b3d32] text-white hover:bg-[#702f27]"
                                onClick={() => handleDelete(session.id)}
                              >
                                Delete session
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredSessions.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="mx-auto size-8 text-[#a65f3d]" />
            <h3 className="mt-3 font-display text-2xl">No matching sessions found.</h3>
            <p className="mt-1 text-sm text-[#65756e]">
              Try adjusting your date filters or search terms, or create a new session.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="mt-4 rounded-full border-[#17362d]/20 text-xs font-semibold"
              >
                Reset filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[1.5rem] border-[#17362d]/10 bg-[#f5f6f2] sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">
              {isEditing ? "Edit session" : "Create new session"}
            </DialogTitle>
            <DialogDescription>
              Schedule a specific session occurrence with Date, Start Time and End Time in IST.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="mt-2 space-y-4">
            {/* Session/Class Offering */}
            <div>
              <Label htmlFor="session-class" className="text-xs font-bold uppercase tracking-wider text-[#65756e]">
                Yoga Class Offering *
              </Label>
              <NativeSelect
                id="session-class"
                value={formData.classId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border-[#17362d]/15 bg-white text-sm"
              >
                {yogaClasses.map((cls) => (
                  <NativeSelectOption key={cls.id} value={cls.id}>
                    {cls.name} ({cls.difficulty} · {cls.durationMinutes}m · ₹{cls.price})
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {formErrors.classId && <p className="mt-1 text-xs text-[#8b3d32]">{formErrors.classId}</p>}
            </div>

            {/* Instructor */}
            <div>
              <Label htmlFor="session-instructor" className="text-xs font-bold uppercase tracking-wider text-[#65756e]">
                Assigned Instructor *
              </Label>
              <NativeSelect
                id="session-instructor"
                value={formData.instructorId}
                onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border-[#17362d]/15 bg-white text-sm"
              >
                {instructors.map((ins) => (
                  <NativeSelectOption key={ins.id} value={ins.id}>
                    {ins.name} ({ins.specialties.slice(0, 2).join(", ")})
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {formErrors.instructorId && (
                <p className="mt-1 text-xs text-[#8b3d32]">{formErrors.instructorId}</p>
              )}
            </div>

            {/* Date & Start Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="session-date" className="text-xs font-bold uppercase tracking-wider text-[#65756e]">
                  Session Date *
                </Label>
                <Input
                  id="session-date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1.5 h-11 rounded-xl border-[#17362d]/15 bg-white text-sm"
                />
                {formErrors.date && <p className="mt-1 text-xs text-[#8b3d32]">{formErrors.date}</p>}
              </div>

              <div>
                <Label htmlFor="session-start-time" className="text-xs font-bold uppercase tracking-wider text-[#65756e]">
                  Start Time (IST) *
                </Label>
                <Input
                  id="session-start-time"
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="mt-1.5 h-11 rounded-xl border-[#17362d]/15 bg-white text-sm"
                />
                {formErrors.startTime && (
                  <p className="mt-1 text-xs text-[#8b3d32]">{formErrors.startTime}</p>
                )}
              </div>
            </div>

            {/* End Time & Capacity */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="session-end-time" className="text-xs font-bold uppercase tracking-wider text-[#65756e]">
                  End Time (Optional)
                </Label>
                <Input
                  id="session-end-time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  placeholder="Auto calculated"
                  className="mt-1.5 h-11 rounded-xl border-[#17362d]/15 bg-white text-sm"
                />
                {formErrors.endTime && <p className="mt-1 text-xs text-[#8b3d32]">{formErrors.endTime}</p>}
              </div>

              <div>
                <Label htmlFor="session-capacity" className="text-xs font-bold uppercase tracking-wider text-[#65756e]">
                  Seat Capacity *
                </Label>
                <Input
                  id="session-capacity"
                  type="number"
                  min={1}
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="mt-1.5 h-11 rounded-xl border-[#17362d]/15 bg-white text-sm"
                />
                {formErrors.capacity && <p className="mt-1 text-xs text-[#8b3d32]">{formErrors.capacity}</p>}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="session-status" className="text-xs font-bold uppercase tracking-wider text-[#65756e]">
                Status *
              </Label>
              <NativeSelect
                id="session-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "scheduled" | "completed" | "cancelled",
                  })
                }
                className="mt-1.5 h-11 w-full rounded-xl border-[#17362d]/15 bg-white text-sm"
              >
                <NativeSelectOption value="scheduled">Scheduled</NativeSelectOption>
                <NativeSelectOption value="completed">Completed</NativeSelectOption>
                <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
              </NativeSelect>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="session-notes" className="text-xs font-bold uppercase tracking-wider text-[#65756e]">
                Notes (Optional)
              </Label>
              <Textarea
                id="session-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Special instructions, studio setup or props needed..."
                className="mt-1.5 min-h-20 rounded-xl border-[#17362d]/15 bg-white text-sm"
              />
            </div>

            <DialogFooter className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full bg-[#254d3f] text-white hover:bg-[#17362d]">
                {isEditing ? "Save changes" : "Create session"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, CheckCircle2, ChevronLeft, AlertCircle, X, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateRecurringSessions, getAdminCollection } from "@/services/admin-storage";

const WEEKDAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

export function RecurringSessionsPlanner() {
  const router = useRouter();
  const classes = getAdminCollection("classes");
  const instructors = getAdminCollection("instructors");
  
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    classId: "",
    instructorId: "",
    startDate: "",
    endDate: "",
    startTime: "07:00",
    capacity: 12,
    weekdays: [] as number[],
  });
  const [excludedDates, setExcludedDates] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const previewDates = useMemo(() => {
    if (!formData.startDate || !formData.endDate || formData.weekdays.length === 0) return [];
    
    const dates = [];
    const start = new Date(formData.startDate + "T00:00:00+05:30");
    const end = new Date(formData.endDate + "T23:59:59+05:30");
    let current = new Date(start);
    
    // limit to reasonable span (e.g., 6 months max)
    const maxEnd = new Date(start);
    maxEnd.setMonth(maxEnd.getMonth() + 6);
    const actualEnd = end > maxEnd ? maxEnd : end;
    
    while (current <= actualEnd) {
      if (formData.weekdays.includes(current.getDay())) {
        const dateStr = current.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        dates.push({
          dateStr,
          dateObj: new Date(current),
          excluded: excludedDates.includes(dateStr)
        });
      }
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }, [formData, excludedDates]);

  function handleGenerate() {
    try {
      const count = generateRecurringSessions({
        classId: formData.classId,
        instructorId: formData.instructorId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        weekdays: formData.weekdays,
        excludedDates: excludedDates,
        startTime: formData.startTime,
        capacity: formData.capacity,
      });
      setFeedback({ type: "success", message: `Successfully generated ${count} sessions.` });
      setTimeout(() => router.push("/admin/sessions"), 2000);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to generate sessions." });
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-[#17362d]">Recurring Sessions</h1>
          <p className="mt-2 text-[#65756e]">Plan and generate multiple sessions at once.</p>
        </div>
      </div>

      {feedback && (
        <div className={`mb-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium ${feedback.type === "success" ? "bg-[#eef4f0] text-[#1c3e32]" : "bg-[#fdf2f0] text-[#9a4a3d]"}`}>
          {feedback.type === "success" ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
          {feedback.message}
        </div>
      )}

      <div className="rounded-[1.75rem] border border-[#17362d]/10 bg-white shadow-sm overflow-hidden">
        <div className="flex border-b border-[#17362d]/10">
          <div className={`flex-1 p-4 text-center text-sm font-bold uppercase tracking-wider ${step === 1 ? "bg-[#f3f6f1] text-[#254d3f]" : "text-[#738078]"}`}>
            1. Configure Plan
          </div>
          <div className={`flex-1 p-4 text-center text-sm font-bold uppercase tracking-wider ${step === 2 ? "bg-[#f3f6f1] text-[#254d3f]" : "text-[#738078]"}`}>
            2. Preview & Generate
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {step === 1 && (
            <div className="grid gap-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#17362d]">Yoga Class</label>
                  <select 
                    className="w-full rounded-xl border border-[#17362d]/20 bg-transparent px-4 py-3 text-sm focus:border-[#254d3f] focus:outline-none"
                    value={formData.classId}
                    onChange={(e) => setFormData(p => ({...p, classId: e.target.value}))}
                  >
                    <option value="">Select a class...</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#17362d]">Instructor</label>
                  <select 
                    className="w-full rounded-xl border border-[#17362d]/20 bg-transparent px-4 py-3 text-sm focus:border-[#254d3f] focus:outline-none"
                    value={formData.instructorId}
                    onChange={(e) => setFormData(p => ({...p, instructorId: e.target.value}))}
                  >
                    <option value="">Select an instructor...</option>
                    {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#17362d]">Start Date</label>
                  <input 
                    type="date"
                    className="w-full rounded-xl border border-[#17362d]/20 bg-transparent px-4 py-3 text-sm focus:border-[#254d3f] focus:outline-none"
                    value={formData.startDate}
                    onChange={(e) => setFormData(p => ({...p, startDate: e.target.value}))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#17362d]">End Date</label>
                  <input 
                    type="date"
                    className="w-full rounded-xl border border-[#17362d]/20 bg-transparent px-4 py-3 text-sm focus:border-[#254d3f] focus:outline-none"
                    value={formData.endDate}
                    onChange={(e) => setFormData(p => ({...p, endDate: e.target.value}))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#17362d]">Repeats on Weekdays</label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map(day => (
                    <button
                      key={day.value}
                      onClick={() => {
                        const has = formData.weekdays.includes(day.value);
                        setFormData(p => ({
                          ...p, 
                          weekdays: has ? p.weekdays.filter(d => d !== day.value) : [...p.weekdays, day.value]
                        }));
                      }}
                      className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${formData.weekdays.includes(day.value) ? "bg-[#254d3f] text-white" : "bg-[#f3f6f1] text-[#254d3f] hover:bg-[#e8ede6]"}`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#17362d]">Time</label>
                  <input 
                    type="time"
                    className="w-full rounded-xl border border-[#17362d]/20 bg-transparent px-4 py-3 text-sm focus:border-[#254d3f] focus:outline-none"
                    value={formData.startTime}
                    onChange={(e) => setFormData(p => ({...p, startTime: e.target.value}))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#17362d]">Capacity</label>
                  <input 
                    type="number"
                    className="w-full rounded-xl border border-[#17362d]/20 bg-transparent px-4 py-3 text-sm focus:border-[#254d3f] focus:outline-none"
                    value={formData.capacity}
                    onChange={(e) => setFormData(p => ({...p, capacity: parseInt(e.target.value)}))}
                    min={1}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button 
                  disabled={!formData.classId || !formData.instructorId || !formData.startDate || !formData.endDate || formData.weekdays.length === 0}
                  onClick={() => setStep(2)}
                  className="rounded-full bg-[#254d3f] px-8 text-white hover:bg-[#1a3a2f]"
                >
                  Continue to Preview
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setStep(1)} className="flex items-center justify-center rounded-full bg-[#f3f6f1] p-2 text-[#254d3f] hover:bg-[#e8ede6]">
                  <ChevronLeft className="size-5" />
                </button>
                <div>
                  <h3 className="font-display text-2xl">Preview Sessions</h3>
                  <p className="text-sm text-[#65756e]">Review the {previewDates.filter(d => !d.excluded).length} sessions to be created. Click on a date to exclude it.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {previewDates.map((d) => (
                  <button
                    key={d.dateStr}
                    onClick={() => {
                      if (d.excluded) {
                        setExcludedDates(prev => prev.filter(x => x !== d.dateStr));
                      } else {
                        setExcludedDates(prev => [...prev, d.dateStr]);
                      }
                    }}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                      d.excluded 
                        ? "border-[#17362d]/5 bg-[#fbfcfb] opacity-50 grayscale" 
                        : "border-[#254d3f]/20 bg-[#f3f6f1] hover:border-[#254d3f]/50"
                    }`}
                  >
                    <div>
                      <p className={`font-semibold ${d.excluded ? "line-through text-[#65756e]" : "text-[#17362d]"}`}>
                        {d.dateObj.toLocaleDateString("en-IN", { month: "short", day: "numeric", weekday: "short" })}
                      </p>
                      <p className="text-xs text-[#65756e] mt-1">{formData.startTime}</p>
                    </div>
                    {d.excluded ? (
                      <X className="size-4 text-[#8b3d32]" />
                    ) : (
                      <Check className="size-4 text-[#254d3f]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-6 border-t border-[#17362d]/10">
                <Button 
                  onClick={handleGenerate}
                  disabled={previewDates.filter(d => !d.excluded).length === 0}
                  className="rounded-full bg-[#254d3f] px-8 text-white hover:bg-[#1a3a2f]"
                >
                  Generate {previewDates.filter(d => !d.excluded).length} Sessions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

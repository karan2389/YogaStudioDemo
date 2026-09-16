/**
 * Shared Indian timezone (Asia/Kolkata / en-IN) and session date-time helpers.
 */

const TIMEZONE = "Asia/Kolkata";
const LOCALE = "en-IN";

/**
 * Format a Date or ISO string into a standard Indian readable date:
 * e.g. "Sunday, 20 September 2026"
 */
export function formatSessionFullDate(dateOrStartsAt: string | Date): string {
  const d = typeof dateOrStartsAt === "string" ? new Date(dateOrStartsAt) : dateOrStartsAt;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE,
  });
}

/**
 * Format date without weekday: e.g. "20 September 2026"
 */
export function formatSessionDate(dateOrStartsAt: string | Date): string {
  const d = typeof dateOrStartsAt === "string" ? new Date(dateOrStartsAt) : dateOrStartsAt;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE,
  });
}

/**
 * Format date for compact table display: e.g. "20 Sep 2026"
 */
export function formatSessionCompactDate(dateOrStartsAt: string | Date): string {
  const d = typeof dateOrStartsAt === "string" ? new Date(dateOrStartsAt) : dateOrStartsAt;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIMEZONE,
  });
}

/**
 * Format a 24-hour time "HH:mm" or ISO string into readable 12-hour time:
 * e.g. "07:00" -> "7:00 AM", "18:30" -> "6:30 PM"
 */
export function formatSessionTime(timeOrStartsAt: string): string {
  if (!timeOrStartsAt) return "";

  // If passed as "HH:mm"
  if (/^\d{1,2}:\d{2}$/.test(timeOrStartsAt)) {
    const [h, m] = timeOrStartsAt.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const minStr = m.toString().padStart(2, "0");
    return `${hour12}:${minStr} ${period}`;
  }

  // Otherwise assume ISO string or parseable date
  const d = new Date(timeOrStartsAt);
  if (isNaN(d.getTime())) return timeOrStartsAt;
  return d.toLocaleTimeString(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIMEZONE,
  });
}

/**
 * Formats a start and end time range:
 * e.g. "7:00 AM – 8:00 AM"
 */
export function formatSessionTimeRange(
  startTime: string,
  endTime?: string,
  durationMinutes?: number
): string {
  const formattedStart = formatSessionTime(startTime);
  if (endTime) {
    return `${formattedStart} – ${formatSessionTime(endTime)}`;
  }
  if (durationMinutes && /^\d{1,2}:\d{2}$/.test(startTime)) {
    const computedEnd = calculateEndTime(startTime, durationMinutes);
    return `${formattedStart} – ${formatSessionTime(computedEnd)}`;
  }
  return formattedStart;
}

/**
 * Full session string: "Sunday, 20 September 2026 · 7:00 AM – 8:00 AM"
 */
export function formatSessionFull(
  startsAt: string,
  endTime?: string,
  durationMinutes?: number
): string {
  const datePart = formatSessionFullDate(startsAt);
  const timePart = formatSessionTimeRange(startsAt, endTime, durationMinutes);
  if (!datePart) return timePart;
  if (!timePart) return datePart;
  return `${datePart} · ${timePart}`;
}

/**
 * Calculate end time given start time "HH:mm" and duration in minutes:
 * e.g. ("07:00", 60) -> "08:00"
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  if (!/^\d{1,2}:\d{2}$/.test(startTime)) return "";
  const [h, m] = startTime.split(":").map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMin = totalMinutes % 60;
  return `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;
}

/**
 * Checks if endTime is strictly later than startTime (in "HH:mm" format):
 */
export function isTimeAfter(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false;
  const [h1, m1] = startTime.split(":").map(Number);
  const [h2, m2] = endTime.split(":").map(Number);
  return h2 * 60 + m2 > h1 * 60 + m1;
}

/**
 * Construct an ISO 8601 string in IST (+05:30) from "YYYY-MM-DD" and "HH:mm":
 * e.g. ("2026-09-20", "07:00") -> "2026-09-20T07:00:00+05:30"
 */
export function parseSessionDateTime(date: string, startTime: string): string {
  if (!date || !startTime) return "";
  const cleanDate = date.trim();
  const cleanTime = startTime.trim().padStart(5, "0"); // ensure HH:mm
  return `${cleanDate}T${cleanTime}:00+05:30`;
}

/**
 * Extract { date: "YYYY-MM-DD", startTime: "HH:mm" } from an ISO string in Asia/Kolkata timezone:
 */
export function extractSessionDateTime(startsAt: string): { date: string; startTime: string } {
  if (!startsAt) return { date: "", startTime: "" };

  const d = new Date(startsAt);
  if (isNaN(d.getTime())) return { date: "", startTime: "" };

  // Use Intl formatters targeting Asia/Kolkata to prevent local machine browser offset shifts
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const date = formatter.format(d); // "YYYY-MM-DD" in en-CA

  const timeParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d); // "HH:mm" in en-GB

  return { date, startTime: timeParts };
}

/**
 * Validate YYYY-MM-DD format and validity:
 */
export function isValidDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(`${dateStr}T00:00:00+05:30`);
  return !isNaN(d.getTime());
}

/**
 * Validate HH:mm format:
 */
export function isValidTime(timeStr: string): boolean {
  if (!/^\d{1,2}:\d{2}$/.test(timeStr)) return false;
  const [h, m] = timeStr.split(":").map(Number);
  return h >= 0 && h < 24 && m >= 0 && m < 60;
}

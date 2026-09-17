"use client";

import type { DemoAttendanceRecord, DemoAttendanceStatus, DemoBookingRecord, DemoMembershipRecord, DemoNotificationRecord, DemoPaymentRecord, DemoPromotionRecord, DemoSessionState } from "@/types/demo";
import type { OperationalNotification, OperationalRefund } from "@/types/admin";
import { getStudioSettings } from "@/services/demo-settings";

const SESSION_KEY = "ananda-demo-session";
const BOOKINGS_KEY = "ananda-demo-bookings";
const MEMBERSHIPS_KEY = "ananda-demo-memberships";
const PAYMENTS_KEY = "ananda-demo-payments";
const NOTIFICATIONS_KEY = "ananda-demo-notifications";
const ATTENDANCE_KEY = "ananda-demo-attendance";
const PROMOTIONS_KEY = "ananda-demo-promotions";

export const demoAccounts: DemoSessionState[] = [
  { id: "cus-aarav", name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 98111 11111", role: "customer" },
  { id: "ins-nikita", name: "Nikita Verma", email: "nikita@anandayoga.demo", phone: "+91 90000 10001", role: "instructor" },
  { id: "admin-demo", name: "Studio Admin", email: "admin@anandayoga.demo", phone: "+91 90000 00000", role: "admin" },
];

function notify() {
  window.dispatchEvent(new Event("ananda-demo-change"));
}

export function getDemoSession(): DemoSessionState | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored) as DemoSessionState; } catch { return null; }
}

export function setDemoSession(session: DemoSessionState) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  if (session.role === "customer" && getDemoNotifications(session.id).length === 0) {
    addDemoNotification({ customerId: session.id, title: "Welcome to Ananda", body: "Your demo customer workspace is ready. Choose a session whenever you are ready to begin.", category: "studio" });
  }
  notify();
}

export function updateDemoProfile(details: Pick<DemoSessionState, "name" | "email" | "phone">) {
  const current = getDemoSession();
  if (!current) return;
  setDemoSession({ ...current, ...details });
}

export function clearDemoSession() {
  window.localStorage.removeItem(SESSION_KEY);
  notify();
}

export function getDemoBookings(): DemoBookingRecord[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(BOOKINGS_KEY);
  if (!stored) return [];
  try { return JSON.parse(stored) as DemoBookingRecord[]; } catch { return []; }
}

export function saveDemoBooking(booking: DemoBookingRecord) {
  const bookings = getDemoBookings();
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...bookings]));
  window.localStorage.setItem("ananda-latest-booking", booking.id);
  const payments = getDemoPayments();
  window.localStorage.setItem(PAYMENTS_KEY, JSON.stringify([{ id: booking.paymentId, customerId: booking.customerId, description: `${booking.className} · ${booking.bookingType === "trial" ? "Trial" : "Single session"}`, amount: booking.amount, method: booking.paymentMethod.toUpperCase(), status: "paid", createdAt: booking.createdAt, referenceId: booking.id }, ...payments]));
  addDemoNotification({ customerId: booking.customerId, title: "Booking confirmed", body: `${booking.className} with ${booking.instructorName} is confirmed.`, category: "booking" });
  notify();
}

export function saveDemoCartBookings(bookingsToAdd: DemoBookingRecord[]) {
  const bookings = getDemoBookings();
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify([...bookingsToAdd, ...bookings]));
  window.localStorage.setItem("ananda-latest-booking", bookingsToAdd[0].id);
  
  const payments = getDemoPayments();
  const totalAmount = bookingsToAdd.reduce((sum, b) => sum + b.amount, 0);
  const first = bookingsToAdd[0];
  
  const paymentRecord = {
    id: first.paymentId,
    customerId: first.customerId,
    description: `Combined Checkout: ${bookingsToAdd.length} sessions`,
    amount: totalAmount,
    method: first.paymentMethod.toUpperCase(),
    status: "paid" as const,
    createdAt: first.createdAt,
    referenceId: `CART-${Date.now().toString(36).toUpperCase()}`
  };
  
  window.localStorage.setItem(PAYMENTS_KEY, JSON.stringify([paymentRecord, ...payments]));
  
  addDemoNotification({
    customerId: first.customerId,
    title: "Multiple Bookings Confirmed",
    body: `You have successfully booked ${bookingsToAdd.length} sessions.`,
    category: "booking"
  });
  
  notify();
}

export function getLatestDemoBooking(): DemoBookingRecord | null {
  if (typeof window === "undefined") return null;
  const latestId = window.localStorage.getItem("ananda-latest-booking");
  return getDemoBookings().find((booking) => booking.id === latestId) ?? null;
}

export function hasSessionBooking(customerId: string, sessionId: string) {
  return getDemoBookings().some((booking) => booking.customerId === customerId && booking.sessionId === sessionId && booking.status === "confirmed");
}

export function hasUsedTrial(customerId: string) {
  return getDemoBookings().some((booking) => booking.customerId === customerId && booking.bookingType === "trial");
}

export function canCancelBooking(booking: DemoBookingRecord) {
  return booking.status === "confirmed" && new Date(booking.startsAt).getTime() - Date.now() >= getStudioSettings().bookingCutoffHours * 60 * 60 * 1000;
}

export function cancelBooking(bookingId: string): {
  success: boolean;
  reason?: "not_found" | "too_late" | "already_cancelled";
  message: string;
} {
  if (typeof window === "undefined") {
    return { success: false, reason: "not_found", message: "Window storage not available." };
  }
  const bookings = getDemoBookings();
  const booking = bookings.find((item) => item.id === bookingId);
  if (!booking) {
    return { success: false, reason: "not_found", message: "Booking not found." };
  }

  // Duplicate prevention
  if (booking.status === "cancelled") {
    return {
      success: false,
      reason: "already_cancelled",
      message: "This booking is already cancelled.",
    };
  }

  // 2-hour cutoff check
  if (!canCancelBooking(booking)) {
    return {
      success: false,
      reason: "too_late",
      message: "This session cannot be cancelled online because it starts within the 2-hour cancellation window.",
    };
  }

  const now = new Date().toISOString();

  // 1. Update Booking
  const updatedBookings = bookings.map((item) =>
    item.id === bookingId
      ? {
          ...item,
          status: "cancelled" as const,
          cancelledAt: now,
        }
      : item
  );
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));

  // 2. Customer Notification
  addDemoNotification({
    customerId: booking.customerId,
    title: "Booking cancelled",
    body: `Your booking for ${booking.className} has been cancelled.`,
    category: "booking",
  });

  notify();
  return {
    success: true,
    message: "Your booking has been cancelled successfully.",
  };
}

export function cancelDemoBooking(bookingId: string) {
  return cancelBooking(bookingId).success;
}

export function getDemoMemberships(): DemoMembershipRecord[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(MEMBERSHIPS_KEY);
  if (!stored) return [];
  try { return JSON.parse(stored) as DemoMembershipRecord[]; } catch { return []; }
}

export function purchaseDemoMembership(record: DemoMembershipRecord, method: string) {
  const memberships = getDemoMemberships().filter((item) => !(item.customerId === record.customerId && item.status === "active"));
  window.localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify([record, ...memberships]));
  const payment: DemoPaymentRecord = { id: `PAY-MEM-${Date.now().toString(36).toUpperCase()}`, customerId: record.customerId, description: record.planName, amount: record.amount, method, status: "paid", createdAt: new Date().toISOString(), referenceId: record.id };
  window.localStorage.setItem(PAYMENTS_KEY, JSON.stringify([payment, ...getDemoPayments()]));
  addDemoNotification({ customerId: record.customerId, title: "Membership activated", body: `${record.planName} is active until ${new Date(record.endsAt).toLocaleDateString("en-IN")}.`, category: "membership" });
  notify();
}

export function getDemoPayments(): DemoPaymentRecord[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(PAYMENTS_KEY);
  if (!stored) return [];
  try { return JSON.parse(stored) as DemoPaymentRecord[]; } catch { return []; }
}

export function getDemoNotifications(customerId?: string): DemoNotificationRecord[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(NOTIFICATIONS_KEY);
  let items: DemoNotificationRecord[] = [];
  if (stored) { try { items = JSON.parse(stored) as DemoNotificationRecord[]; } catch { items = []; } }
  return customerId ? items.filter((item) => item.customerId === customerId) : items;
}

export function addDemoNotification(input: Omit<DemoNotificationRecord, "id" | "createdAt" | "read">) {
  const item: DemoNotificationRecord = { ...input, id: `NOT-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString(), read: false };
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([item, ...getDemoNotifications()]));
}

export function markAllNotificationsRead(customerId: string) {
  const updated = getDemoNotifications().map((item) => item.customerId === customerId ? { ...item, read: true } : item);
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  notify();
}

export function getDemoAttendance(sessionId?: string): DemoAttendanceRecord[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(ATTENDANCE_KEY);
  let items: DemoAttendanceRecord[] = [];
  if (stored) { try { items = JSON.parse(stored) as DemoAttendanceRecord[]; } catch { items = []; } }
  return sessionId ? items.filter((item) => item.sessionId === sessionId) : items;
}

export function getDemoPromotions(): DemoPromotionRecord[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(PROMOTIONS_KEY);
  if (!stored) return [];
  try { return JSON.parse(stored) as DemoPromotionRecord[]; } catch { return []; }
}

export function markDemoAttendance(input: {
  sessionId: string;
  customerId: string;
  customerName: string;
  status: DemoAttendanceStatus;
  markedBy: string;
  hasActiveMembership: boolean;
}) {
  const now = new Date().toISOString();
  const existing = getDemoAttendance();
  const record: DemoAttendanceRecord = {
    id: `ATT-${input.sessionId}-${input.customerId}`,
    sessionId: input.sessionId,
    customerId: input.customerId,
    customerName: input.customerName,
    status: input.status,
    markedBy: input.markedBy,
    markedAt: now,
  };
  const updated = [record, ...existing.filter((item) => !(item.sessionId === input.sessionId && item.customerId === input.customerId))];
  window.localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(updated));

  let promotionSent = false;
  let duplicatePrevented = false;
  if (input.status === "present" && !input.hasActiveMembership) {
    const promotions = getDemoPromotions();
    const alreadySent = promotions.some((item) => item.customerId === input.customerId && item.campaign === "monthly-membership");
    if (alreadySent) {
      duplicatePrevented = true;
    } else {
      const promotion: DemoPromotionRecord = {
        id: `WAP-${Date.now().toString(36).toUpperCase()}`,
        customerId: input.customerId,
        customerName: input.customerName,
        sessionId: input.sessionId,
        channel: "whatsapp",
        campaign: "monthly-membership",
        status: "sent",
        sentAt: now,
      };
      window.localStorage.setItem(PROMOTIONS_KEY, JSON.stringify([promotion, ...promotions]));
      promotionSent = true;
    }
  }
  notify();
  return { promotionSent, duplicatePrevented };
}

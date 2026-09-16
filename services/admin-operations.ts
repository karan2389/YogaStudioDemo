"use client";

import { customers } from "@/data/mock-data";
import { addDemoNotification, cancelDemoBooking, getDemoBookings, getDemoMemberships, getDemoNotifications, getDemoPayments } from "@/services/demo-storage";
import type { AdminOperation, OperationalBooking, OperationalMembership, OperationalNotification, OperationalPayment, OperationalRefund } from "@/types/admin";

export { getStudioSettings, saveStudioSettings } from "@/services/demo-settings";

const key = (name: string) => `ananda-operations-${name}`;

const membershipSeeds: OperationalMembership[] = [
  { id: "mem-meera", customerId: "cus-meera", customerName: "Meera Joshi", planName: "Monthly Wellness", status: "active", startsAt: "2026-09-01", endsAt: "2026-09-30", amount: 4200 },
  { id: "mem-priya", customerId: "cus-priya", customerName: "Priya Singh", planName: "Monthly Starter", status: "expired", startsAt: "2026-07-10", endsAt: "2026-08-08", amount: 2400 },
];

const bookingSeeds: OperationalBooking[] = [
  { id: "book-kabir-1", customerId: "cus-kabir", customerName: "Kabir Jain", sessionId: "ses-1", className: "Hatha Yoga", startsAt: "2026-09-16T07:00:00+05:30", type: "single", amount: 650, status: "confirmed" },
  { id: "book-meera-1", customerId: "cus-meera", customerName: "Meera Joshi", sessionId: "ses-2", className: "Vinyasa Flow", startsAt: "2026-09-16T18:30:00+05:30", type: "membership", amount: 0, status: "confirmed" },
  { id: "book-priya-1", customerId: "cus-priya", customerName: "Priya Singh", sessionId: "ses-4", className: "Power Yoga", startsAt: "2026-09-17T19:00:00+05:30", type: "single", amount: 800, status: "cancelled" },
];

const paymentSeeds: OperationalPayment[] = [
  { id: "pay-kabir-1", customerId: "cus-kabir", customerName: "Kabir Jain", description: "Hatha Yoga · Single session", amount: 650, method: "UPI", status: "paid", createdAt: "2026-09-14T10:20:00+05:30", referenceId: "book-kabir-1" },
  { id: "pay-meera-plan", customerId: "cus-meera", customerName: "Meera Joshi", description: "Monthly Wellness", amount: 4200, method: "CARD", status: "paid", createdAt: "2026-09-01T09:10:00+05:30", referenceId: "mem-meera" },
  { id: "pay-priya-1", customerId: "cus-priya", customerName: "Priya Singh", description: "Power Yoga · Single session", amount: 800, method: "WALLET", status: "paid", createdAt: "2026-09-12T18:00:00+05:30", referenceId: "book-priya-1" },
];

const refundSeeds: OperationalRefund[] = [
  { id: "ref-priya-1", paymentId: "pay-priya-1", customerId: "cus-priya", customerName: "Priya Singh", amount: 800, reason: "Eligible booking cancellation", status: "requested", requestedAt: "2026-09-15T09:30:00+05:30" },
];

const notificationSeeds: OperationalNotification[] = [
  { id: "camp-schedule", audience: "All customers", title: "Weekend schedule is open", body: "New weekend sessions are ready to book.", channel: "in-app", status: "sent", createdAt: "2026-09-14T11:00:00+05:30" },
  { id: "camp-breath", audience: "Non-members", title: "Build a calmer monthly rhythm", body: "Explore the Monthly Starter plan after your next class.", channel: "whatsapp", status: "sent", createdAt: "2026-09-13T17:30:00+05:30" },
];

function read<T>(name: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key(name));
  if (!stored) return fallback;
  try { return JSON.parse(stored) as T; } catch { return fallback; }
}

function write<T>(name: string, value: T) {
  window.localStorage.setItem(key(name), JSON.stringify(value));
  window.dispatchEvent(new Event("ananda-demo-change"));
}

function mergeById<T extends { id: string }>(base: T[], additions: T[]) {
  const seen = new Set(base.map((item) => item.id));
  return [...base, ...additions.filter((item) => !seen.has(item.id))];
}

export function getOperationalMemberships(): OperationalMembership[] {
  const dynamic = getDemoMemberships().map((item) => ({ id: item.id, customerId: item.customerId, customerName: customers.find((customer) => customer.id === item.customerId)?.name ?? "Demo customer", planName: item.planName, status: item.status, startsAt: item.startsAt, endsAt: item.endsAt, amount: item.amount })) as OperationalMembership[];
  return mergeById(read("memberships", membershipSeeds), dynamic);
}

export function getOperationalBookings(): OperationalBooking[] {
  const dynamic = getDemoBookings().map((item) => ({ id: item.id, customerId: item.customerId, customerName: item.customerName, sessionId: item.sessionId, className: item.className, startsAt: item.startsAt, type: item.bookingType, amount: item.amount, status: item.status })) as OperationalBooking[];
  return mergeById(read("bookings", bookingSeeds), dynamic);
}

export function getOperationalPayments(): OperationalPayment[] {
  const dynamic = getDemoPayments().map((item) => ({ ...item, customerName: customers.find((customer) => customer.id === item.customerId)?.name ?? "Demo customer" })) as OperationalPayment[];
  return mergeById(read("payments", paymentSeeds), dynamic);
}

export function getOperationalRefunds(): OperationalRefund[] { return read("refunds", refundSeeds); }

export function getOperationalNotifications(): OperationalNotification[] {
  const dynamic = getDemoNotifications().map((item) => ({ id: item.id, audience: customers.find((customer) => customer.id === item.customerId)?.name ?? item.customerId, customerId: item.customerId, title: item.title, body: item.body, channel: "in-app" as const, status: "sent" as const, createdAt: item.createdAt }));
  return mergeById(read("notifications", notificationSeeds), dynamic);
}

export function updateOperationStatus(operation: "memberships" | "bookings", id: string, status: string) {
  if (operation === "memberships") write(operation, getOperationalMemberships().map((item) => item.id === id ? { ...item, status: status as OperationalMembership["status"] } : item));
  else {
    if (status === "cancelled") cancelDemoBooking(id);
    const bookings = getOperationalBookings().map((item) => item.id === id ? { ...item, status: status as OperationalBooking["status"] } : item);
    write(operation, bookings);
  }
}

export function advanceRefund(id: string) {
  const refunds = getOperationalRefunds();
  const target = refunds.find((item) => item.id === id);
  if (!target) return;
  const next = target.status === "requested" ? "processing" : target.status === "processing" ? "completed" : target.status;
  write("refunds", refunds.map((item) => item.id === id ? { ...item, status: next } : item));
  if (next === "completed") {
    write("payments", getOperationalPayments().map((item) => item.id === target.paymentId ? { ...item, status: "refunded" as const } : item));
    addDemoNotification({ customerId: target.customerId, title: "Refund completed", body: `Your demo refund of ₹${target.amount} has been completed.`, category: "payment" });
  }
}

export function rejectRefund(id: string) {
  write("refunds", getOperationalRefunds().map((item) => item.id === id ? { ...item, status: "rejected" as const } : item));
}

export function sendOperationalNotification(input: Omit<OperationalNotification, "id" | "status" | "createdAt">) {
  const item: OperationalNotification = { ...input, id: `CAMP-${Date.now().toString(36).toUpperCase()}`, status: "sent", createdAt: new Date().toISOString() };
  write("notifications", [item, ...getOperationalNotifications()]);
  if (input.channel === "in-app") {
    const targets = input.customerId ? [input.customerId] : customers.map((customer) => customer.id);
    targets.forEach((customerId) => addDemoNotification({ customerId, title: input.title, body: input.body, category: "studio" }));
  }
}

export function resetDemoWorkspace() {
  const session = window.localStorage.getItem("ananda-demo-session");
  Object.keys(window.localStorage).filter((item) => item.startsWith("ananda-")).forEach((item) => window.localStorage.removeItem(item));
  if (session) window.localStorage.setItem("ananda-demo-session", session);
  window.dispatchEvent(new Event("ananda-demo-change"));
}

export function getOperationCount(operation: AdminOperation) {
  if (operation === "memberships") return getOperationalMemberships().length;
  if (operation === "bookings") return getOperationalBookings().length;
  if (operation === "payments") return getOperationalPayments().length;
  if (operation === "refunds") return getOperationalRefunds().length;
  return getOperationalNotifications().length;
}

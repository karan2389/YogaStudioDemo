"use client";

import { customers } from "@/data/mock-data";
import { addDemoNotification, cancelDemoBooking, getDemoBookings, getDemoMemberships, getDemoNotifications, getDemoPayments } from "@/services/demo-storage";
import type { AdminOperation, OperationalBooking, OperationalMembership, OperationalNotification, OperationalPayment, OperationalRefund } from "@/types/admin";
import type { DemoBookingRecord } from "@/types/demo";

export { getStudioSettings, saveStudioSettings } from "@/services/demo-settings";

const key = (name: string) => `ananda-operations-${name}`;

const membershipSeeds: OperationalMembership[] = [
  { id: "mem-meera", customerId: "cus-meera", customerName: "Meera Joshi", planName: "Monthly Wellness", status: "active", startsAt: "2026-09-01", endsAt: "2026-09-30", amount: 4200 },
  { id: "mem-priya", customerId: "cus-priya", customerName: "Priya Singh", planName: "Monthly Starter", status: "expired", startsAt: "2026-07-10", endsAt: "2026-08-08", amount: 2400 },
];

const bookingSeeds: OperationalBooking[] = [
  {
    id: "book-kabir-1",
    customerId: "cus-kabir",
    customerName: "Kabir Jain",
    customerEmail: "kabir@example.com",
    customerPhone: "+91 98444 44444",
    sessionId: "ses-1",
    className: "Hatha Yoga",
    instructorName: "Nikita Verma",
    startsAt: "2026-09-16T07:00:00+05:30",
    durationMinutes: 60,
    capacity: 14,
    type: "single",
    amount: 650,
    paymentId: "pay-kabir-1",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    status: "confirmed",
    refundStatus: "none",
    createdAt: "2026-09-14T10:20:00+05:30",
  },
  {
    id: "book-meera-1",
    customerId: "cus-meera",
    customerName: "Meera Joshi",
    customerEmail: "meera@example.com",
    customerPhone: "+91 98222 22222",
    sessionId: "ses-2",
    className: "Vinyasa Flow",
    instructorName: "Ananya Mehta",
    startsAt: "2026-09-16T18:30:00+05:30",
    durationMinutes: 60,
    capacity: 16,
    type: "membership",
    amount: 0,
    paymentId: "pay-meera-plan",
    paymentMethod: "CARD",
    paymentStatus: "paid",
    status: "confirmed",
    refundStatus: "none",
    createdAt: "2026-09-01T09:10:00+05:30",
  },
  {
    id: "book-priya-1",
    customerId: "cus-priya",
    customerName: "Priya Singh",
    customerEmail: "priya@example.com",
    customerPhone: "+91 98333 33333",
    sessionId: "ses-4",
    className: "Power Yoga",
    instructorName: "Rohan Kapoor",
    startsAt: "2026-09-17T19:00:00+05:30",
    durationMinutes: 50,
    capacity: 12,
    type: "single",
    amount: 800,
    paymentId: "pay-priya-1",
    paymentMethod: "WALLET",
    paymentStatus: "paid",
    status: "cancelled",
    refundStatus: "requested",
    refundId: "ref-priya-1",
    createdAt: "2026-09-12T18:00:00+05:30",
    cancelledAt: "2026-09-15T09:30:00+05:30",
  },
  {
    id: "book-aarav-trial",
    customerId: "cus-aarav",
    customerName: "Aarav Sharma",
    customerEmail: "aarav@example.com",
    customerPhone: "+91 98111 11111",
    sessionId: "ses-3",
    className: "Beginner Yoga",
    instructorName: "Nikita Verma",
    startsAt: "2026-09-17T08:00:00+05:30",
    durationMinutes: 45,
    capacity: 12,
    type: "trial",
    amount: 500,
    paymentId: "pay-aarav-trial",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    status: "confirmed",
    refundStatus: "none",
    createdAt: "2026-09-15T11:00:00+05:30",
  },
  {
    id: "book-tanvi-past",
    customerId: "cus-tanvi",
    customerName: "Tanvi Iyer",
    customerEmail: "tanvi@example.com",
    customerPhone: "+91 98555 55555",
    sessionId: "ses-past-1",
    className: "Hatha Yoga",
    instructorName: "Nikita Verma",
    startsAt: "2026-09-10T07:00:00+05:30",
    durationMinutes: 60,
    capacity: 14,
    type: "single",
    amount: 650,
    paymentId: "pay-tanvi-1",
    paymentMethod: "CARD",
    paymentStatus: "paid",
    status: "attended",
    refundStatus: "none",
    createdAt: "2026-09-08T14:30:00+05:30",
  },
  {
    id: "book-aditya-noshow",
    customerId: "cus-aditya",
    customerName: "Aditya Roy",
    customerEmail: "aditya@example.com",
    customerPhone: "+91 98666 66666",
    sessionId: "ses-past-2",
    className: "Power Yoga",
    instructorName: "Rohan Kapoor",
    startsAt: "2026-09-11T19:00:00+05:30",
    durationMinutes: 50,
    capacity: 12,
    type: "single",
    amount: 800,
    paymentId: "pay-aditya-1",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    status: "no-show",
    refundStatus: "none",
    createdAt: "2026-09-09T16:00:00+05:30",
  },
  {
    id: "book-rohit-processing",
    customerId: "cus-rohit",
    customerName: "Rohit Patel",
    customerEmail: "rohit@example.com",
    customerPhone: "+91 98777 77777",
    sessionId: "ses-5",
    className: "Pranayama & Breathwork",
    instructorName: "Nikita Verma",
    startsAt: "2026-09-18T07:30:00+05:30",
    durationMinutes: 40,
    capacity: 18,
    type: "single",
    amount: 550,
    paymentId: "pay-rohit-1",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    status: "cancelled",
    refundStatus: "processing",
    refundId: "ref-rohit-1",
    createdAt: "2026-09-13T10:00:00+05:30",
    cancelledAt: "2026-09-14T12:00:00+05:30",
  },
  {
    id: "book-neha-completed",
    customerId: "cus-neha",
    customerName: "Neha Nair",
    customerEmail: "neha@example.com",
    customerPhone: "+91 98888 88888",
    sessionId: "ses-past-3",
    className: "Mobility & Stretching",
    instructorName: "Ananya Mehta",
    startsAt: "2026-09-12T17:30:00+05:30",
    durationMinutes: 50,
    capacity: 16,
    type: "single",
    amount: 600,
    paymentId: "pay-neha-1",
    paymentMethod: "CARD",
    paymentStatus: "refunded",
    status: "cancelled",
    refundStatus: "completed",
    refundId: "ref-neha-1",
    createdAt: "2026-09-09T09:15:00+05:30",
    cancelledAt: "2026-09-10T11:30:00+05:30",
  },
  {
    id: "book-vikram-rejected",
    customerId: "cus-vikram",
    customerName: "Vikram Malhotra",
    customerEmail: "vikram@example.com",
    customerPhone: "+91 98999 99999",
    sessionId: "ses-6",
    className: "Mobility & Stretching",
    instructorName: "Ananya Mehta",
    startsAt: "2026-09-19T17:30:00+05:30",
    durationMinutes: 50,
    capacity: 16,
    type: "single",
    amount: 600,
    paymentId: "pay-vikram-1",
    paymentMethod: "WALLET",
    paymentStatus: "paid",
    status: "cancelled",
    refundStatus: "rejected",
    refundId: "ref-vikram-1",
    createdAt: "2026-09-14T15:00:00+05:30",
    cancelledAt: "2026-09-15T16:00:00+05:30",
  },
  {
    id: "book-kavita-pending",
    customerId: "cus-kavita",
    customerName: "Kavita Rao",
    customerEmail: "kavita@example.com",
    customerPhone: "+91 98000 00001",
    sessionId: "ses-3",
    className: "Beginner Yoga",
    instructorName: "Nikita Verma",
    startsAt: "2026-09-17T08:00:00+05:30",
    durationMinutes: 45,
    capacity: 12,
    type: "single",
    amount: 500,
    paymentId: "pay-kavita-1",
    paymentMethod: "UPI",
    paymentStatus: "failed",
    status: "pending",
    refundStatus: "none",
    createdAt: "2026-09-16T14:00:00+05:30",
  },
];

const paymentSeeds: OperationalPayment[] = [
  { id: "pay-kabir-1", customerId: "cus-kabir", customerName: "Kabir Jain", description: "Hatha Yoga · Single session", amount: 650, method: "UPI", status: "paid", createdAt: "2026-09-14T10:20:00+05:30", referenceId: "book-kabir-1" },
  { id: "pay-meera-plan", customerId: "cus-meera", customerName: "Meera Joshi", description: "Monthly Wellness", amount: 4200, method: "CARD", status: "paid", createdAt: "2026-09-01T09:10:00+05:30", referenceId: "mem-meera" },
  { id: "pay-priya-1", customerId: "cus-priya", customerName: "Priya Singh", description: "Power Yoga · Single session", amount: 800, method: "WALLET", status: "paid", createdAt: "2026-09-12T18:00:00+05:30", referenceId: "book-priya-1" },
  { id: "pay-aarav-trial", customerId: "cus-aarav", customerName: "Aarav Sharma", description: "Beginner Yoga · Trial session", amount: 500, method: "UPI", status: "paid", createdAt: "2026-09-15T11:00:00+05:30", referenceId: "book-aarav-trial" },
  { id: "pay-tanvi-1", customerId: "cus-tanvi", customerName: "Tanvi Iyer", description: "Hatha Yoga · Single session", amount: 650, method: "CARD", status: "paid", createdAt: "2026-09-08T14:30:00+05:30", referenceId: "book-tanvi-past" },
  { id: "pay-aditya-1", customerId: "cus-aditya", customerName: "Aditya Roy", description: "Power Yoga · Single session", amount: 800, method: "UPI", status: "paid", createdAt: "2026-09-09T16:00:00+05:30", referenceId: "book-aditya-noshow" },
  { id: "pay-rohit-1", customerId: "cus-rohit", customerName: "Rohit Patel", description: "Pranayama & Breathwork", amount: 550, method: "UPI", status: "paid", createdAt: "2026-09-13T10:00:00+05:30", referenceId: "book-rohit-processing" },
  { id: "pay-neha-1", customerId: "cus-neha", customerName: "Neha Nair", description: "Mobility & Stretching", amount: 600, method: "CARD", status: "refunded", createdAt: "2026-09-09T09:15:00+05:30", referenceId: "book-neha-completed" },
  { id: "pay-vikram-1", customerId: "cus-vikram", customerName: "Vikram Malhotra", description: "Mobility & Stretching", amount: 600, method: "WALLET", status: "paid", createdAt: "2026-09-14T15:00:00+05:30", referenceId: "book-vikram-rejected" },
  { id: "pay-kavita-1", customerId: "cus-kavita", customerName: "Kavita Rao", description: "Beginner Yoga · Single session", amount: 500, method: "UPI", status: "failed", createdAt: "2026-09-16T14:00:00+05:30", referenceId: "book-kavita-pending" },
];

const refundSeeds: OperationalRefund[] = [
  {
    id: "ref-priya-1",
    bookingId: "book-priya-1",
    paymentId: "pay-priya-1",
    customerId: "cus-priya",
    customerName: "Priya Singh",
    sessionId: "ses-4",
    className: "Power Yoga",
    amount: 800,
    reason: "Eligible booking cancellation",
    status: "requested",
    requestedAt: "2026-09-15T09:30:00+05:30",
    adminNote: "Customer cancelled well outside 2-hour window",
  },
  {
    id: "ref-rohit-1",
    bookingId: "book-rohit-processing",
    paymentId: "pay-rohit-1",
    customerId: "cus-rohit",
    customerName: "Rohit Patel",
    sessionId: "ses-5",
    className: "Pranayama & Breathwork",
    amount: 550,
    reason: "Medical appointment reschedule",
    status: "processing",
    requestedAt: "2026-09-14T12:00:00+05:30",
    processedAt: "2026-09-15T10:00:00+05:30",
    processedBy: "Studio Admin",
    adminNote: "Verifying UPI reference with banking portal",
  },
  {
    id: "ref-neha-1",
    bookingId: "book-neha-completed",
    paymentId: "pay-neha-1",
    customerId: "cus-neha",
    customerName: "Neha Nair",
    sessionId: "ses-past-3",
    className: "Mobility & Stretching",
    amount: 600,
    reason: "Travel delay cancellation",
    status: "completed",
    requestedAt: "2026-09-10T11:30:00+05:30",
    processedAt: "2026-09-11T09:00:00+05:30",
    completedAt: "2026-09-11T16:45:00+05:30",
    processedBy: "Studio Admin",
    adminNote: "Card gateway refund transaction TRX-99812",
  },
  {
    id: "ref-vikram-1",
    bookingId: "book-vikram-rejected",
    paymentId: "pay-vikram-1",
    customerId: "cus-vikram",
    customerName: "Vikram Malhotra",
    sessionId: "ses-6",
    className: "Mobility & Stretching",
    amount: 600,
    reason: "Late cancellation",
    status: "rejected",
    requestedAt: "2026-09-15T16:00:00+05:30",
    processedAt: "2026-09-15T16:30:00+05:30",
    processedBy: "Studio Admin",
    adminNote: "Cancelled within 45 mins of class; studio 2-hr cutoff policy applies",
  },
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
  const storedRefunds = getOperationalRefunds();
  const storedPayments = getOperationalPayments();
  
  const dynamic = getDemoBookings().map((item) => {
    const customer = customers.find((c) => c.id === item.customerId);
    const refund = storedRefunds.find((r) => r.bookingId === item.id || r.paymentId === item.paymentId);
    const payment = storedPayments.find((p) => p.referenceId === item.id || p.id === item.paymentId);

    return {
      id: item.id,
      customerId: item.customerId,
      customerName: item.customerName,
      customerEmail: customer?.email ?? "aarav@example.com",
      customerPhone: customer?.phone ?? "+91 98111 11111",
      sessionId: item.sessionId,
      className: item.className,
      instructorName: item.instructorName,
      startsAt: item.startsAt,
      durationMinutes: 60,
      capacity: 14,
      type: item.bookingType,
      amount: item.amount,
      paymentId: item.paymentId,
      paymentMethod: item.paymentMethod.toUpperCase(),
      paymentStatus: payment?.status ?? "paid",
      status: item.status,
      refundStatus: refund?.status ?? (item.refundStatus === "requested" ? "requested" : item.refundStatus === "processing" ? "processing" : item.refundStatus === "completed" || item.refundStatus === "refunded" ? "completed" : item.refundStatus === "rejected" ? "rejected" : "none"),
      refundId: refund?.id ?? item.refundRequestId,
      createdAt: item.createdAt,
      cancelledAt: item.cancelledAt,
    } as OperationalBooking;
  });

  const baseEnriched = read("bookings", bookingSeeds).map((seed) => {
    const refund = storedRefunds.find((r) => r.bookingId === seed.id || r.paymentId === seed.paymentId);
    const payment = storedPayments.find((p) => p.referenceId === seed.id || p.id === seed.paymentId);
    return {
      ...seed,
      paymentStatus: payment?.status ?? seed.paymentStatus ?? "paid",
      refundStatus: refund?.status ?? seed.refundStatus ?? "none",
      refundId: refund?.id ?? seed.refundId,
    };
  });

  return mergeById(baseEnriched, dynamic);
}

export function getOperationalPayments(): OperationalPayment[] {
  const dynamic = getDemoPayments().map((item) => ({
    id: item.id,
    customerId: item.customerId,
    customerName: customers.find((customer) => customer.id === item.customerId)?.name ?? "Demo customer",
    description: item.description,
    amount: item.amount,
    method: item.method,
    status: item.status,
    createdAt: item.createdAt,
    referenceId: item.referenceId,
  })) as OperationalPayment[];
  return mergeById(read("payments", paymentSeeds), dynamic);
}

export function getOperationalRefunds(): OperationalRefund[] {
  return read("refunds", refundSeeds);
}

export function getOperationalNotifications(): OperationalNotification[] {
  const dynamic = getDemoNotifications().map((item) => ({ id: item.id, audience: customers.find((customer) => customer.id === item.customerId)?.name ?? item.customerId, customerId: item.customerId, title: item.title, body: item.body, channel: "in-app" as const, status: "sent" as const, createdAt: item.createdAt }));
  return mergeById(read("notifications", notificationSeeds), dynamic);
}

export function updateOperationStatus(operation: "memberships" | "bookings", id: string, status: string) {
  if (operation === "memberships") {
    write(operation, getOperationalMemberships().map((item) => item.id === id ? { ...item, status: status as OperationalMembership["status"] } : item));
  } else {
    if (status === "cancelled") cancelDemoBooking(id);
    const bookings = getOperationalBookings().map((item) => item.id === id ? { ...item, status: status as OperationalBooking["status"] } : item);
    write(operation, bookings);
  }
}

export function updateOperationalBookingStatus(id: string, status: OperationalBooking["status"]) {
  updateOperationStatus("bookings", id, status);
}

export function advanceRefund(id: string, adminNote?: string) {
  const refunds = getOperationalRefunds();
  const target = refunds.find((item) => item.id === id);
  if (!target) return;
  const next = target.status === "requested" ? "processing" : target.status === "processing" ? "completed" : target.status;
  const now = new Date().toISOString();

  const updatedRefunds = refunds.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      status: next,
      adminNote: adminNote !== undefined ? adminNote : item.adminNote,
      processedAt: next === "processing" ? now : item.processedAt,
      completedAt: next === "completed" ? now : item.completedAt,
      processedBy: "Studio Admin",
    };
  });
  write("refunds", updatedRefunds);

  // Sync related booking
  const bookingId = target.bookingId;
  if (bookingId) {
    const operationalBookings = getOperationalBookings().map((b) =>
      b.id === bookingId ? { ...b, refundStatus: next as OperationalBooking["refundStatus"] } : b
    );
    write("bookings", operationalBookings);

    if (typeof window !== "undefined") {
      const demoBookings = getDemoBookings();
      if (demoBookings.some((b) => b.id === bookingId)) {
        window.localStorage.setItem(
          "ananda-demo-bookings",
          JSON.stringify(demoBookings.map((b) => (b.id === bookingId ? { ...b, refundStatus: next as DemoBookingRecord["refundStatus"] } : b)))
        );
      }
    }
  }

  // If completed, update payment status to refunded
  if (next === "completed") {
    write("payments", getOperationalPayments().map((item) => item.id === target.paymentId || item.referenceId === target.bookingId ? { ...item, status: "refunded" as const } : item));
    if (typeof window !== "undefined") {
      const demoPayments = getDemoPayments();
      window.localStorage.setItem(
        "ananda-demo-payments",
        JSON.stringify(demoPayments.map((p) => (p.referenceId === target.bookingId || p.id === target.paymentId ? { ...p, status: "refunded" as const } : p)))
      );
    }
    addDemoNotification({ customerId: target.customerId, title: "Refund completed", body: `Your demo refund of ₹${target.amount} has been completed.`, category: "payment" });
  } else if (next === "processing") {
    addDemoNotification({ customerId: target.customerId, title: "Refund under review", body: `Your refund request for ₹${target.amount} is currently being processed by the studio admin.`, category: "payment" });
  }
}

export function rejectRefund(id: string, adminNote?: string) {
  const refunds = getOperationalRefunds();
  const target = refunds.find((item) => item.id === id);
  if (!target) return;
  const now = new Date().toISOString();

  write("refunds", refunds.map((item) => item.id === id ? { ...item, status: "rejected" as const, adminNote: adminNote !== undefined ? adminNote : item.adminNote, processedAt: now, processedBy: "Studio Admin" } : item));

  if (target.bookingId) {
    const operationalBookings = getOperationalBookings().map((b) =>
      b.id === target.bookingId ? { ...b, refundStatus: "rejected" as const } : b
    );
    write("bookings", operationalBookings);
    if (typeof window !== "undefined") {
      const demoBookings = getDemoBookings();
      window.localStorage.setItem(
        "ananda-demo-bookings",
        JSON.stringify(demoBookings.map((b) => (b.id === target.bookingId ? { ...b, refundStatus: "rejected" as const } : b)))
      );
    }
  }

  addDemoNotification({ customerId: target.customerId, title: "Refund request update", body: `Your refund request for ₹${target.amount} was reviewed and could not be approved.`, category: "payment" });
}

export function updateRefundNote(id: string, adminNote: string) {
  const refunds = getOperationalRefunds();
  write("refunds", refunds.map((item) => item.id === id ? { ...item, adminNote } : item));
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

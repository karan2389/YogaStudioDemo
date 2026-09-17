import type { UserRole } from "@/types/domain";

export interface DemoSessionState {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface DemoBookingRecord {
  id: string;
  customerId: string;
  customerName: string;
  sessionId: string;
  className: string;
  instructorName: string;
  startsAt: string;
  bookingType: "single" | "trial";
  amount: number;
  paymentMethod: "upi" | "card" | "wallet";
  paymentId: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
  cancelledAt?: string;
  payrollPercentageSnapshot?: number;
  instructorPayrollAmount?: number;
  studioShare?: number;
}

export interface DemoMembershipRecord {
  id: string;
  customerId: string;
  planId: string;
  planName: string;
  status: "active" | "expired";
  startsAt: string;
  endsAt: string;
  sessionsPerMonth: number | null;
  amount: number;
}

export interface DemoPaymentRecord {
  id: string;
  customerId: string;
  description: string;
  amount: number;
  method: string;
  status: "paid" | "refunded";
  createdAt: string;
  referenceId: string;
}

export interface DemoNotificationRecord {
  id: string;
  customerId: string;
  title: string;
  body: string;
  category: "booking" | "membership" | "payment" | "studio";
  createdAt: string;
  read: boolean;
}

export type DemoAttendanceStatus = "present" | "absent";

export interface DemoAttendanceRecord {
  id: string;
  sessionId: string;
  customerId: string;
  customerName: string;
  status: DemoAttendanceStatus;
  markedBy: string;
  markedAt: string;
}

export interface DemoPromotionRecord {
  id: string;
  customerId: string;
  customerName: string;
  sessionId: string;
  channel: "whatsapp";
  campaign: "monthly-membership";
  status: "sent";
  sentAt: string;
}

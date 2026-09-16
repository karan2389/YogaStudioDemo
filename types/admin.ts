export type AdminResource = "customers" | "instructors" | "classes" | "categories" | "schedules" | "sessions" | "plans";

export type AdminRecordValue = string | number | boolean | string[] | null;
export type AdminRecord = { id: string; [key: string]: AdminRecordValue };

export interface AdminFieldOption {
  label: string;
  value: string;
}

export interface AdminField {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "select" | "datetime-local" | "checkbox" | "list";
  required?: boolean;
  nullable?: boolean;
  options?: AdminFieldOption[];
  placeholder?: string;
}

export type AdminOperation = "memberships" | "bookings" | "payments" | "refunds" | "notifications";

export interface OperationalMembership {
  id: string; customerId: string; customerName: string; planName: string;
  status: "active" | "expired" | "paused"; startsAt: string; endsAt: string; amount: number;
}

export type RefundStatus = "requested" | "processing" | "completed" | "rejected";

export interface OperationalBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  sessionId: string;
  className: string;
  instructorName?: string;
  instructorId?: string;
  startsAt: string;
  durationMinutes?: number;
  capacity?: number;
  type: "single" | "trial" | "membership";
  amount: number;
  paymentId?: string;
  paymentMethod?: string;
  paymentStatus?: "paid" | "pending" | "failed" | "refunded";
  status: "confirmed" | "cancelled" | "attended" | "no-show" | "pending";
  refundStatus?: "none" | "requested" | "processing" | "completed" | "rejected";
  refundId?: string;
  createdAt?: string;
  cancelledAt?: string;
}

export interface OperationalPayment {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  amount: number;
  method: string;
  status: "paid" | "refunded" | "failed" | "pending";
  createdAt: string;
  referenceId: string;
}

export interface OperationalRefund {
  id: string;
  bookingId?: string;
  paymentId: string;
  customerId: string;
  customerName: string;
  sessionId?: string;
  className?: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  processedBy?: string;
  adminNote?: string;
}

export interface OperationalNotification {
  id: string; audience: string; customerId?: string; title: string; body: string;
  channel: "in-app" | "email" | "whatsapp"; status: "sent"; createdAt: string;
}

export interface StudioSettings {
  studioName: string; address: string; phone: string; email: string; whatsapp: string;
  bookingCutoffHours: number; trialPrice: number; timezone: string;
  emailEnabled: boolean; whatsappEnabled: boolean;
}

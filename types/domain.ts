export type ID = string;

export type UserRole = "customer" | "instructor" | "admin";
export type UserStatus = "active" | "inactive" | "suspended";
export type Difficulty = "Beginner" | "All levels" | "Intermediate" | "Advanced";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "attended" | "no-show";
export type MembershipStatus = "active" | "expired" | "cancelled" | "paused";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially-refunded";
export type AttendanceStatus = "present" | "absent" | "not-marked";
export type NotificationChannel = "email" | "whatsapp" | "in-app";
export type NotificationStatus = "queued" | "sent" | "failed" | "read";
export type RefundStatus = "requested" | "processing" | "completed" | "rejected";

export interface User {
  id: ID;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
}

export interface Customer extends User {
  role: "customer";
  membershipStatus: MembershipStatus | "none";
  upcomingBookingId?: ID;
}

export interface Instructor extends User {
  role: "instructor";
  specialties: string[];
  experienceYears: number;
  bio: string;
}

export interface ClassCategory {
  id: ID;
  name: string;
  description: string;
}

export interface YogaClass {
  id: ID;
  name: string;
  slug: string;
  categoryId: ID;
  instructorId: ID;
  description: string;
  difficulty: Difficulty;
  durationMinutes: number;
  price: number;
  capacity: number;
  image: string;
  accent: string;
}

export interface Session {
  id: ID;
  classId: ID;
  instructorId: ID;
  date?: string;          // YYYY-MM-DD
  startTime?: string;     // HH:mm
  endTime?: string;       // HH:mm, optional
  startsAt: string;       // ISO 8601
  capacity: number;
  bookedSeats: number;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface Booking {
  id: ID;
  customerId: ID;
  sessionId: ID;
  status: BookingStatus;
  type: "single" | "trial" | "membership";
  amount: number;
  createdAt: string;
}

export interface MembershipPlan {
  id: ID;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  sessionsPerMonth: number | null;
  benefits: string[];
  featured?: boolean;
}

export interface Membership {
  id: ID;
  customerId: ID;
  planId: ID;
  status: MembershipStatus;
  startsAt: string;
  endsAt: string;
}

export interface Payment {
  id: ID;
  customerId: ID;
  bookingId?: ID;
  membershipId?: ID;
  amount: number;
  status: PaymentStatus;
  method: "upi" | "card" | "cash" | "demo";
  createdAt: string;
}

export interface Attendance {
  id: ID;
  sessionId: ID;
  customerId: ID;
  markedBy: ID;
  status: AttendanceStatus;
  markedAt?: string;
}

export interface Notification {
  id: ID;
  userId: ID;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  body: string;
  createdAt: string;
}

export interface Refund {
  id: ID;
  paymentId: ID;
  amount: number;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
}

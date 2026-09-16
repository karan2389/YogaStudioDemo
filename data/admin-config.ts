import { instructors, yogaClasses } from "@/data/mock-data";
import type { AdminField, AdminRecord, AdminResource } from "@/types/admin";

export interface AdminResourceConfig {
  resource: AdminResource;
  eyebrow: string;
  title: string;
  copy: string;
  singular: string;
  fields: AdminField[];
  titleFor: (record: AdminRecord) => string;
  detailsFor: (record: AdminRecord) => string[];
  statusFor?: (record: AdminRecord) => string;
  newRecord: () => AdminRecord;
}

const statusOptions = [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }];
const classOptions = yogaClasses.map((item) => ({ label: item.name, value: item.id }));
const instructorOptions = instructors.map((item) => ({ label: item.name, value: item.id }));
const categoryOptions = [
  { label: "Foundations", value: "cat-foundation" }, { label: "Flow", value: "cat-flow" },
  { label: "Strength", value: "cat-strength" }, { label: "Restoration", value: "cat-restoration" },
];

const id = (prefix: string) => `${prefix}-${Date.now().toString(36)}`;
const className = (value: unknown) => yogaClasses.find((item) => item.id === value)?.name ?? String(value ?? "");
const instructorName = (value: unknown) => instructors.find((item) => item.id === value)?.name ?? String(value ?? "");

export const adminResourceConfigs: Record<AdminResource, AdminResourceConfig> = {
  customers: {
    resource: "customers", eyebrow: "People", title: "Customers", singular: "customer",
    copy: "Maintain customer contact details, account status and membership visibility.",
    fields: [
      { key: "name", label: "Full name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      { key: "membershipStatus", label: "Membership", type: "select", options: [{ label: "None", value: "none" }, { label: "Active", value: "active" }, { label: "Expired", value: "expired" }] },
      { key: "status", label: "Account status", type: "select", options: statusOptions },
    ],
    titleFor: (record) => String(record.name), detailsFor: (record) => [String(record.email), String(record.phone), `${String(record.membershipStatus)} membership`], statusFor: (record) => String(record.status),
    newRecord: () => ({ id: id("cus"), name: "", email: "", phone: "", role: "customer", membershipStatus: "none", status: "active" }),
  },
  instructors: {
    resource: "instructors", eyebrow: "People", title: "Instructors", singular: "instructor",
    copy: "Manage teaching profiles, specialties, experience and account availability.",
    fields: [
      { key: "name", label: "Full name", type: "text", required: true }, { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true }, { key: "specialties", label: "Specialties", type: "list", placeholder: "Hatha, Pranayama" },
      { key: "experienceYears", label: "Experience (years)", type: "number", required: true }, { key: "bio", label: "Short biography", type: "textarea" },
      { key: "status", label: "Account status", type: "select", options: statusOptions },
    ],
    titleFor: (record) => String(record.name), detailsFor: (record) => [Array.isArray(record.specialties) ? record.specialties.join(" · ") : "", `${record.experienceYears} years experience`, String(record.email)], statusFor: (record) => String(record.status),
    newRecord: () => ({ id: id("ins"), name: "", email: "", phone: "", role: "instructor", specialties: [], experienceYears: 1, bio: "", status: "active" }),
  },
  classes: {
    resource: "classes", eyebrow: "Studio catalogue", title: "Sessions", singular: "session",
    copy: "Manage yoga offerings and session templates, instructor assignment, capacity and public pricing.",
    fields: [
      { key: "name", label: "Session name", type: "text", required: true }, { key: "slug", label: "URL slug", type: "text", required: true },
      { key: "categoryId", label: "Category", type: "select", options: categoryOptions }, { key: "instructorId", label: "Instructor", type: "select", options: instructorOptions },
      { key: "difficulty", label: "Difficulty", type: "select", options: ["Beginner", "All levels", "Intermediate", "Advanced"].map((value) => ({ label: value, value })) },
      { key: "durationMinutes", label: "Duration (minutes)", type: "number", required: true }, { key: "price", label: "Single price (₹)", type: "number", required: true },
      { key: "capacity", label: "Default capacity", type: "number", required: true }, { key: "description", label: "Description", type: "textarea" },
      { key: "image", label: "Image path", type: "text" }, { key: "accent", label: "Accent color hex", type: "text" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
    ],
    titleFor: (record) => String(record.name), detailsFor: (record) => [instructorName(record.instructorId), `${record.difficulty} · ${record.durationMinutes} min`, `₹${Number(record.price).toLocaleString("en-IN")} · ${record.capacity} seats`],
    statusFor: (record) => String(record.status ?? "active"),
    newRecord: () => ({ id: id("class"), name: "", slug: "", categoryId: "cat-foundation", instructorId: "ins-nikita", description: "", difficulty: "All levels", durationMinutes: 60, price: 600, capacity: 12, image: "/class.jpg", accent: "#58745d", status: "active" }),
  },
  categories: {
    resource: "categories", eyebrow: "Studio catalogue", title: "Class categories", singular: "category",
    copy: "Organise classes into clear groups for discovery and reporting.",
    fields: [{ key: "name", label: "Category name", type: "text", required: true }, { key: "description", label: "Description", type: "textarea" }, { key: "status", label: "Status", type: "select", options: statusOptions }],
    titleFor: (record) => String(record.name), detailsFor: (record) => [String(record.description)], statusFor: (record) => String(record.status),
    newRecord: () => ({ id: id("cat"), name: "", description: "", status: "active" }),
  },
  schedules: {
    resource: "schedules", eyebrow: "Timetable", title: "Recurring schedules", singular: "schedule",
    copy: "Define the weekly teaching pattern used to prepare future studio sessions.",
    fields: [
      { key: "classId", label: "Class", type: "select", options: classOptions }, { key: "instructorId", label: "Instructor", type: "select", options: instructorOptions },
      { key: "dayOfWeek", label: "Day", type: "select", options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((value) => ({ label: value, value })) },
      { key: "time", label: "Start time", type: "text", required: true, placeholder: "07:00" }, { key: "capacity", label: "Capacity", type: "number", required: true },
      { key: "status", label: "Status", type: "select", options: statusOptions },
    ],
    titleFor: (record) => `${className(record.classId)} · ${record.dayOfWeek}`, detailsFor: (record) => [`${record.time} · ${record.capacity} seats`, instructorName(record.instructorId)], statusFor: (record) => String(record.status),
    newRecord: () => ({ id: id("sch"), classId: "class-hatha", instructorId: "ins-nikita", dayOfWeek: "Monday", time: "07:00", capacity: 12, status: "active" }),
  },
  sessions: {
    resource: "sessions", eyebrow: "Timetable", title: "Studio sessions", singular: "session",
    copy: "Review dated sessions, adjust capacity and keep scheduling status accurate.",
    fields: [
      { key: "classId", label: "Class", type: "select", options: classOptions }, { key: "instructorId", label: "Instructor", type: "select", options: instructorOptions },
      { key: "startsAt", label: "Date and time", type: "datetime-local", required: true }, { key: "capacity", label: "Capacity", type: "number", required: true },
      { key: "bookedSeats", label: "Booked seats", type: "number", required: true },
      { key: "status", label: "Status", type: "select", options: ["scheduled", "completed", "cancelled"].map((value) => ({ label: value[0].toUpperCase() + value.slice(1), value })) },
    ],
    titleFor: (record) => className(record.classId), detailsFor: (record) => [new Date(String(record.startsAt)).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }), instructorName(record.instructorId), `${record.bookedSeats}/${record.capacity} booked`], statusFor: (record) => String(record.status),
    newRecord: () => ({ id: id("ses"), classId: "class-hatha", instructorId: "ins-nikita", startsAt: "2026-09-21T07:00", capacity: 12, bookedSeats: 0, status: "scheduled" }),
  },
  plans: {
    resource: "plans", eyebrow: "Memberships", title: "Membership plans", singular: "plan",
    copy: "Update public plan pricing, limits and benefits. Changes appear immediately on customer-facing plan cards in this browser.",
    fields: [
      { key: "name", label: "Plan name", type: "text", required: true }, { key: "description", label: "Description", type: "textarea" },
      { key: "price", label: "Monthly price (₹)", type: "number", required: true }, { key: "durationDays", label: "Duration (days)", type: "number", required: true },
      { key: "sessionsPerMonth", label: "Sessions per month", type: "number", nullable: true, placeholder: "Leave blank for unlimited" },
      { key: "benefits", label: "Benefits", type: "list", placeholder: "Priority booking, All class styles" }, { key: "featured", label: "Featured plan", type: "checkbox" },
    ],
    titleFor: (record) => String(record.name), detailsFor: (record) => [`₹${Number(record.price).toLocaleString("en-IN")} / month`, record.sessionsPerMonth === null ? "Unlimited sessions" : `${record.sessionsPerMonth} sessions`, Array.isArray(record.benefits) ? record.benefits.join(" · ") : ""], statusFor: (record) => record.featured ? "featured" : "standard",
    newRecord: () => ({ id: id("plan"), name: "", description: "", price: 3000, durationDays: 30, sessionsPerMonth: 4, benefits: [], featured: false }),
  },
};

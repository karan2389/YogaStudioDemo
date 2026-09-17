import type {
  Customer,
  Instructor,
  Membership,
  MembershipPlan,
  Session,
  YogaClass,
} from "@/types/domain";

export const instructors: Instructor[] = [
  {
    id: "ins-nikita",
    name: "Nikita Verma",
    email: "nikita@anandayoga.demo",
    phone: "+91 90000 10001",
    role: "instructor",
    status: "active",
    specialties: ["Hatha", "Pranayama"],
    experienceYears: 9,
    bio: "Grounded practices that bring breath, alignment and calm into everyday life.",
    payrollPercentage: 60,
  },
  {
    id: "ins-ananya",
    name: "Ananya Mehta",
    email: "ananya@anandayoga.demo",
    phone: "+91 90000 10002",
    role: "instructor",
    status: "active",
    specialties: ["Vinyasa", "Mobility"],
    experienceYears: 7,
    bio: "Fluid, thoughtful classes designed to build confidence and joyful movement.",
    payrollPercentage: 55,
  },
  {
    id: "ins-rohan",
    name: "Rohan Kapoor",
    email: "rohan@anandayoga.demo",
    phone: "+91 90000 10003",
    role: "instructor",
    status: "active",
    specialties: ["Power Yoga", "Strength"],
    experienceYears: 8,
    bio: "Energising practice with precise guidance, purposeful strength and steady progress.",
    payrollPercentage: 65,
  },
];

export const customers: Customer[] = [
  { id: "cus-aarav", name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 98111 11111", role: "customer", status: "active", membershipStatus: "none" },
  { id: "cus-meera", name: "Meera Joshi", email: "meera@example.com", phone: "+91 98222 22222", role: "customer", status: "active", membershipStatus: "active" },
  { id: "cus-priya", name: "Priya Singh", email: "priya@example.com", phone: "+91 98333 33333", role: "customer", status: "active", membershipStatus: "expired" },
  { id: "cus-kabir", name: "Kabir Jain", email: "kabir@example.com", phone: "+91 98444 44444", role: "customer", status: "active", membershipStatus: "none", upcomingBookingId: "book-kabir-1" },
];

export const yogaClasses: YogaClass[] = [
  { id: "class-hatha", name: "Hatha Yoga", slug: "hatha-yoga", categoryId: "cat-foundation", instructorId: "ins-nikita", description: "Slow, attentive movement and breath to build a strong, balanced foundation.", difficulty: "Beginner", durationMinutes: 60, price: 650, capacity: 14, image: "/class.jpg", accent: "#58745d" },
  { id: "class-vinyasa", name: "Vinyasa Flow", slug: "vinyasa-flow", categoryId: "cat-flow", instructorId: "ins-ananya", description: "Breath-led sequences that create fluidity, focus and whole-body energy.", difficulty: "All levels", durationMinutes: 60, price: 750, capacity: 16, image: "/class.jpg", accent: "#a96848" },
  { id: "class-power", name: "Power Yoga", slug: "power-yoga", categoryId: "cat-strength", instructorId: "ins-rohan", description: "A focused, dynamic class that develops stamina, stability and strength.", difficulty: "Intermediate", durationMinutes: 50, price: 800, capacity: 12, image: "/class.jpg", accent: "#3e5a62" },
  { id: "class-beginner", name: "Beginner Yoga", slug: "beginner-yoga", categoryId: "cat-foundation", instructorId: "ins-nikita", description: "A welcoming introduction to foundational postures, breathing and studio practice.", difficulty: "Beginner", durationMinutes: 45, price: 500, capacity: 12, image: "/class.jpg", accent: "#6d8067" },
  { id: "class-pranayama", name: "Pranayama & Breathwork", slug: "pranayama-breathwork", categoryId: "cat-restoration", instructorId: "ins-nikita", description: "Guided breathing practices for a clear mind and a regulated nervous system.", difficulty: "All levels", durationMinutes: 40, price: 550, capacity: 18, image: "/class.jpg", accent: "#82705b" },
  { id: "class-mobility", name: "Mobility & Stretching", slug: "mobility-stretching", categoryId: "cat-restoration", instructorId: "ins-ananya", description: "Gentle mobility work to release tension and restore ease of movement.", difficulty: "All levels", durationMinutes: 50, price: 600, capacity: 16, image: "/class.jpg", accent: "#785f6f" },
];

export const membershipPlans: MembershipPlan[] = [
  { id: "plan-starter", name: "Monthly Starter", description: "A gentle rhythm for building your practice.", price: 2400, durationDays: 30, sessionsPerMonth: 4, benefits: ["4 studio sessions", "Easy rescheduling", "Member guidance"] },
  { id: "plan-wellness", name: "Monthly Wellness", description: "Consistent practice with room to explore.", price: 4200, durationDays: 30, sessionsPerMonth: 8, benefits: ["8 studio sessions", "Priority booking", "One breathwork class"], featured: true },
  { id: "plan-unlimited", name: "Monthly Unlimited", description: "Make the studio part of your everyday life.", price: 6500, durationDays: 30, sessionsPerMonth: null, benefits: ["Unlimited sessions", "Priority booking", "All class styles"] },
];

export const sessions: Session[] = [
  { id: "ses-1", classId: "class-hatha", instructorId: "ins-nikita", date: "2026-09-16", startTime: "07:00", endTime: "08:00", startsAt: "2026-09-16T07:00:00+05:30", capacity: 14, bookedSeats: 6, status: "scheduled" },
  { id: "ses-2", classId: "class-vinyasa", instructorId: "ins-ananya", date: "2026-09-16", startTime: "18:30", endTime: "19:45", startsAt: "2026-09-16T18:30:00+05:30", capacity: 16, bookedSeats: 11, status: "scheduled" },
  { id: "ses-3", classId: "class-beginner", instructorId: "ins-nikita", date: "2026-09-17", startTime: "08:00", endTime: "09:00", startsAt: "2026-09-17T08:00:00+05:30", capacity: 12, bookedSeats: 4, status: "scheduled" },
  { id: "ses-4", classId: "class-power", instructorId: "ins-rohan", date: "2026-09-17", startTime: "19:00", endTime: "20:00", startsAt: "2026-09-17T19:00:00+05:30", capacity: 12, bookedSeats: 9, status: "scheduled" },
  { id: "ses-5", classId: "class-pranayama", instructorId: "ins-nikita", date: "2026-09-18", startTime: "07:30", endTime: "08:15", startsAt: "2026-09-18T07:30:00+05:30", capacity: 18, bookedSeats: 7, status: "scheduled" },
  { id: "ses-6", classId: "class-mobility", instructorId: "ins-ananya", date: "2026-09-19", startTime: "17:30", endTime: "18:30", startsAt: "2026-09-19T17:30:00+05:30", capacity: 16, bookedSeats: 8, status: "scheduled" },
];

export const memberships: Membership[] = [
  { id: "mem-meera", customerId: "cus-meera", planId: "plan-wellness", status: "active", startsAt: "2026-09-01", endsAt: "2026-09-30" },
  { id: "mem-priya", customerId: "cus-priya", planId: "plan-starter", status: "expired", startsAt: "2026-07-10", endsAt: "2026-08-08" },
];

export const getInstructor = (id: string) => instructors.find((item) => item.id === id);
export const getClass = (id: string) => yogaClasses.find((item) => item.id === id);
export const getAvailableSeats = (session: Session) => session.capacity - session.bookedSeats;

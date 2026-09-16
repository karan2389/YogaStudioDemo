import { customers, instructors, membershipPlans, sessions, yogaClasses } from "@/data/mock-data";

export const demoDataService = {
  getCustomers: () => customers,
  getInstructors: () => instructors,
  getClasses: () => yogaClasses,
  getUpcomingSessions: () => sessions.filter((session) => session.status === "scheduled"),
  getMembershipPlans: () => membershipPlans,
};

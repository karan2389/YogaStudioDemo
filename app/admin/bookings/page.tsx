import type { Metadata } from "next";
import { AdminBookingsView } from "@/components/admin/admin-bookings-view";

export const metadata: Metadata = {
  title: "Manage Bookings | Ananda Yoga Demo",
  description: "Centralized administrative management for all customer session reservations, payment statuses, and refund requests.",
};

export default function AdminBookingsPage() {
  return <AdminBookingsView />;
}


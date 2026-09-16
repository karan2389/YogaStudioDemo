import type { Metadata } from "next";
import { AdminOperationsView } from "@/components/admin/admin-operations-view";
export const metadata: Metadata = { title: "Booking Operations | Ananda Yoga Demo" };
export default function AdminBookingsPage() { return <AdminOperationsView view="bookings" />; }

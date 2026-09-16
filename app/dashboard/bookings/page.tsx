import type { Metadata } from "next";
import { BookingsView } from "@/components/dashboard/bookings-view";
export const metadata: Metadata = { title: "My Bookings | Ananda Yoga Demo" };
export default function DashboardBookingsPage() { return <BookingsView />; }

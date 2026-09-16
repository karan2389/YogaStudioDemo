import type { Metadata } from "next";
import { AdminOperationsView } from "@/components/admin/admin-operations-view";
export const metadata: Metadata = { title: "Attendance Operations | Ananda Yoga Demo" };
export default function AdminAttendancePage() { return <AdminOperationsView view="attendance" />; }

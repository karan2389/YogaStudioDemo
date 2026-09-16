import type { Metadata } from "next";
import { AdminResourceManager } from "@/components/admin/admin-resource-manager";

export const metadata: Metadata = { title: "Recurring Schedules | Ananda Yoga Demo" };
export default function AdminSchedulesPage() { return <AdminResourceManager resource="schedules" />; }

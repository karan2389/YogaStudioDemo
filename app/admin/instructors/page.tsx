import type { Metadata } from "next";
import { AdminResourceManager } from "@/components/admin/admin-resource-manager";

export const metadata: Metadata = { title: "Manage Instructors | Ananda Yoga Demo" };
export default function AdminInstructorsPage() { return <AdminResourceManager resource="instructors" />; }

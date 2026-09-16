import type { Metadata } from "next";
import { AdminResourceManager } from "@/components/admin/admin-resource-manager";

export const metadata: Metadata = { title: "Manage Classes | Ananda Yoga Demo" };
export default function AdminClassesPage() { return <AdminResourceManager resource="classes" />; }

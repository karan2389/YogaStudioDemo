import type { Metadata } from "next";
import { AdminResourceManager } from "@/components/admin/admin-resource-manager";

export const metadata: Metadata = { title: "Manage Membership Plans | Ananda Yoga Demo" };
export default function AdminPlansPage() { return <AdminResourceManager resource="plans" />; }

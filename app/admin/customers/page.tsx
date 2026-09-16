import type { Metadata } from "next";
import { AdminResourceManager } from "@/components/admin/admin-resource-manager";

export const metadata: Metadata = { title: "Manage Customers | Ananda Yoga Demo" };
export default function AdminCustomersPage() { return <AdminResourceManager resource="customers" />; }

import type { Metadata } from "next";
import { AdminSettings } from "@/components/admin/admin-settings";
export const metadata: Metadata = { title: "Studio Settings | Ananda Yoga Demo" };
export default function AdminSettingsPage() { return <AdminSettings />; }

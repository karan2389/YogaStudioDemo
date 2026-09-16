import type { Metadata } from "next";
import { AdminOperationsView } from "@/components/admin/admin-operations-view";
export const metadata: Metadata = { title: "Payment Operations | Ananda Yoga Demo" };
export default function AdminPaymentsPage() { return <AdminOperationsView view="payments" />; }

import type { Metadata } from "next";
import { AdminOperationsView } from "@/components/admin/admin-operations-view";
export const metadata: Metadata = { title: "Refund Operations | Ananda Yoga Demo" };
export default function AdminRefundsPage() { return <AdminOperationsView view="refunds" />; }

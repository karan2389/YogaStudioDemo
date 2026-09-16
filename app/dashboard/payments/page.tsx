import type { Metadata } from "next";
import { PaymentsView } from "@/components/dashboard/payments-view";
export const metadata: Metadata = { title: "Payments | Ananda Yoga Demo" };
export default function DashboardPaymentsPage() { return <PaymentsView />; }

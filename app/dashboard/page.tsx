import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
export const metadata: Metadata = { title: "Customer Dashboard | Ananda Yoga Demo" };
export default function DashboardPage() { return <DashboardOverview />; }

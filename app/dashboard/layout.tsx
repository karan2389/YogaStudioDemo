import type { ReactNode } from "react";
import { CustomerDashboardShell } from "@/components/dashboard/customer-dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <CustomerDashboardShell>{children}</CustomerDashboardShell>;
}

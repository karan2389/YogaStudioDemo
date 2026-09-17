import type { Metadata } from "next";
import { RecurringSessionsPlanner } from "@/components/admin/recurring-sessions-planner";

export const metadata: Metadata = {
  title: "Recurring Sessions | Admin | Ananda Yoga",
  description: "Plan and generate recurring sessions.",
};

export default function RecurringSessionsPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <RecurringSessionsPlanner />
    </div>
  );
}

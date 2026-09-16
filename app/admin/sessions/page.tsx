import type { Metadata } from "next";
import { AdminSessionsView } from "@/components/admin/admin-sessions-view";

export const metadata: Metadata = {
  title: "Studio Sessions | Ananda Yoga Demo",
  description: "Schedule sessions, set dates and start/end times, manage capacity and export session data.",
};

export default function AdminSessionsPage() {
  return <AdminSessionsView />;
}

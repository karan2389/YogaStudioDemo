import type { Metadata } from "next";
import { NotificationsView } from "@/components/dashboard/notifications-view";
export const metadata: Metadata = { title: "Notifications | Ananda Yoga Demo" };
export default function DashboardNotificationsPage() { return <NotificationsView />; }

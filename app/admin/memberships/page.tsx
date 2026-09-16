import type { Metadata } from "next";
import { AdminOperationsView } from "@/components/admin/admin-operations-view";
export const metadata: Metadata = { title: "Membership Operations | Ananda Yoga Demo" };
export default function AdminMembershipsPage() { return <AdminOperationsView view="memberships" />; }

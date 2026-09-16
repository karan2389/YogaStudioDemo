import type { Metadata } from "next";
import { MembershipView } from "@/components/dashboard/membership-view";
export const metadata: Metadata = { title: "Membership | Ananda Yoga Demo" };
export default function DashboardMembershipPage() { return <MembershipView />; }

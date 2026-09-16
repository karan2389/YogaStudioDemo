import type { Metadata } from "next";
import { ProfileView } from "@/components/dashboard/profile-view";
export const metadata: Metadata = { title: "Profile | Ananda Yoga Demo" };
export default function DashboardProfilePage() { return <ProfileView />; }

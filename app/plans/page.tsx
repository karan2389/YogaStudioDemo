import type { Metadata } from "next";
import { PlansContent } from "@/components/plans/plans-content";
import { PublicPage } from "@/components/shared/public-page";

export const metadata: Metadata = {
  title: "Monthly Memberships | Ananda Yoga",
  description: "Compare flexible monthly yoga memberships from ₹2,400.",
};

export default function PlansPage() {
  return <PublicPage><PlansContent /></PublicPage>;
}

import type { Metadata } from "next";
import { InstructorOverview } from "@/components/instructor/instructor-overview";

export const metadata: Metadata = { title: "Instructor Dashboard | Ananda Yoga Demo" };
export default function InstructorPage() { return <InstructorOverview />; }

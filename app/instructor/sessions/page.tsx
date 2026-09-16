import type { Metadata } from "next";
import { AssignedSessions } from "@/components/instructor/assigned-sessions";

export const metadata: Metadata = { title: "Assigned Sessions | Ananda Yoga Demo" };
export default function InstructorSessionsPage() { return <AssignedSessions />; }

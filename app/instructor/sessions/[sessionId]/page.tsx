import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AttendanceRoster } from "@/components/instructor/attendance-roster";
import { getClass, sessions } from "@/data/mock-data";
import { getSessionRoster } from "@/data/mock-rosters";

type PageProps = { params: Promise<{ sessionId: string }> };

export function generateStaticParams() {
  return sessions.filter((item) => item.instructorId === "ins-nikita").map((item) => ({ sessionId: item.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sessionId } = await params;
  const item = sessions.find((session) => session.id === sessionId && session.instructorId === "ins-nikita");
  const yogaClass = item ? getClass(item.classId) : undefined;
  return yogaClass ? { title: `${yogaClass.name} Attendance | Ananda Yoga Demo` } : {};
}

export default async function AttendancePage({ params }: PageProps) {
  const { sessionId } = await params;
  const yogaSession = sessions.find((item) => item.id === sessionId && item.instructorId === "ins-nikita");
  if (!yogaSession) notFound();
  const yogaClass = getClass(yogaSession.classId);
  if (!yogaClass) notFound();
  return <AttendanceRoster yogaSession={yogaSession} yogaClass={yogaClass} roster={getSessionRoster(yogaSession.id)} />;
}

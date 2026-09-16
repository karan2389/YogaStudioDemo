import type { ReactNode } from "react";
import { InstructorShell } from "@/components/instructor/instructor-shell";

export default function InstructorLayout({ children }: { children: ReactNode }) {
  return <InstructorShell>{children}</InstructorShell>;
}

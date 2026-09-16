"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ClipboardCheck, LayoutDashboard, LogIn } from "lucide-react";
import { DashboardNavLink } from "@/components/shared/dashboard-nav-link";
import { DemoIndicator } from "@/components/shared/demo-indicator";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { useDemoSession } from "@/hooks/use-demo-session";
import { demoAccounts, setDemoSession } from "@/services/demo-storage";

const nav = [
  { href: "/instructor", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/instructor/sessions", label: "Assigned Sessions", icon: CalendarDays },
];

export function InstructorShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session, ready } = useDemoSession();
  if (!ready) return <main className="min-h-screen bg-[#f4f2ec]" />;
  if (!session || session.role !== "instructor") {
    return <main className="min-h-screen bg-[#fbf8f1]"><DemoIndicator /><Header /><section className="grid min-h-[65vh] place-items-center px-5 py-16"><div className="max-w-lg rounded-[1.75rem] border border-[#17362d]/10 bg-white p-8 text-center shadow-lg"><LogIn className="mx-auto size-7 text-[#a65f3d]" /><h1 className="mt-4 font-display text-4xl">Instructor access required.</h1><p className="mt-3 text-sm leading-6 text-[#65756e]">Switch to Nikita&apos;s demo account to review assigned sessions and record attendance.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Button className="rounded-full bg-[#254d3f] text-white" onClick={() => setDemoSession(demoAccounts[1])}>Continue as Nikita</Button><Button asChild variant="outline" className="rounded-full bg-transparent"><Link href="/login">Demo login</Link></Button></div></div></section><Footer /></main>;
  }

  return (
    <main className="min-h-screen bg-[#f4f2ec] text-[#17362d]">
      <DemoIndicator /><Header />
      <div className="mx-auto grid w-full max-w-[1380px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[238px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <aside className="lg:sticky lg:top-[108px] lg:self-start">
          <div className="rounded-[1.5rem] bg-[#17362d] p-4 text-white shadow-sm">
            <div className="px-3 py-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#dfb77e]">Instructor portal</p><p className="mt-2 font-display text-2xl">Hi, {session.name.split(" ")[0]}</p><p className="mt-2 flex items-center gap-2 text-xs text-[#c5d2cb]"><ClipboardCheck className="size-3.5" /> Attendance workspace</p></div>
            <nav aria-label="Instructor dashboard" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              {nav.map(({ href, label, icon: Icon, exact }) => (
                <DashboardNavLink
                  key={href}
                  href={href}
                  label={label}
                  icon={Icon}
                  currentPathname={pathname}
                  exact={exact}
                  variant="instructor"
                />
              ))}
            </nav>
          </div>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
      <Footer />
    </main>
  );
}

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BellRing, CalendarCheck, CalendarDays, ClipboardCheck, ContactRound, CreditCard, FolderTree, LayoutDashboard, LogIn, PanelsTopLeft, RefreshCw, Settings2, Sparkles, UsersRound, WalletCards } from "lucide-react";
import { DashboardNavLink } from "@/components/shared/dashboard-nav-link";
import { DemoIndicator } from "@/components/shared/demo-indicator";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { useDemoSession } from "@/hooks/use-demo-session";
import { demoAccounts, setDemoSession } from "@/services/demo-storage";

interface AdminNavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  aliases?: string[];
}

const navGroups: { label: string; items: AdminNavItem[] }[] = [
  { label: "Core", items: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/customers", label: "Customers", icon: ContactRound },
    { href: "/admin/instructors", label: "Instructors", icon: UsersRound },
    { href: "/admin/classes", label: "Classes", icon: Sparkles },
    { href: "/admin/sessions", label: "Sessions", icon: CalendarDays },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/admin/plans", label: "Plans", icon: WalletCards },
  ] },
  { label: "Operations", items: [
    { href: "/admin/memberships", label: "Memberships", icon: WalletCards },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
    { href: "/admin/refunds", label: "Refunds", icon: RefreshCw },
    { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
    { href: "/admin/notifications", label: "Notifications", icon: BellRing },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings2 },
  ] },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session, ready } = useDemoSession();
  if (!ready) return <main className="min-h-screen bg-[#eef1f1]" />;
  if (!session || session.role !== "admin") {
    return <main className="min-h-screen bg-[#fbf8f1]"><DemoIndicator /><Header /><section className="grid min-h-[65vh] place-items-center px-5 py-16"><div className="max-w-lg rounded-[1.75rem] border border-[#17362d]/10 bg-white p-8 text-center shadow-lg"><LogIn className="mx-auto size-7 text-[#3e5a62]" /><h1 className="mt-4 font-display text-4xl">Admin access required.</h1><p className="mt-3 text-sm leading-6 text-[#65756e]">Switch to the Studio Admin demo account to manage people, sessions and bookings.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Button className="rounded-full bg-[#254d3f] text-white" onClick={() => setDemoSession(demoAccounts[2])}>Continue as Admin</Button><Button asChild variant="outline" className="rounded-full bg-transparent"><Link href="/login">Demo login</Link></Button></div></div></section><Footer /></main>;
  }

  return <main className="min-h-screen bg-[#eef1f1] text-[#17362d]">
    <DemoIndicator /><Header />
    <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[248px_minmax(0,1fr)] lg:px-8 lg:py-8">
      <aside className="lg:sticky lg:top-[108px] lg:self-start">
        <div className="max-h-[calc(100vh-112px)] overflow-y-auto rounded-[1.5rem] bg-[#203b45] p-4 text-white shadow-sm">
          <div className="px-3 py-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9bc3bf]">Studio administration</p><p className="mt-2 font-display text-2xl">Control centre</p><p className="mt-2 flex items-center gap-2 text-xs text-[#c6d4d7]"><PanelsTopLeft className="size-3.5" /> Demo operations</p></div>
          <nav aria-label="Admin dashboard" className="flex gap-5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {navGroups.map((group) => (
              <div key={group.label} className="flex shrink-0 gap-1 lg:flex-col">
                <p className="hidden px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7fa09f] lg:block">{group.label}</p>
                {group.items.map(({ href, label, icon: Icon, exact, aliases }) => (
                  <DashboardNavLink
                    key={href}
                    href={href}
                    label={label}
                    icon={Icon}
                    currentPathname={pathname}
                    exact={exact}
                    aliases={aliases}
                    variant="admin"
                  />
                ))}
              </div>
            ))}
          </nav>
        </div>
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
    <Footer />
  </main>;
}

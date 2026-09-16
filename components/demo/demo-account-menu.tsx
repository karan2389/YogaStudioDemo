"use client";

import Link from "next/link";
import { CalendarCheck, ChevronDown, ClipboardCheck, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDemoSession } from "@/hooks/use-demo-session";
import { clearDemoSession, demoAccounts, setDemoSession } from "@/services/demo-storage";

export function DemoAccountMenu({ mobile = false }: { mobile?: boolean }) {
  const { session, ready } = useDemoSession();

  if (!ready) return <div className={mobile ? "h-11" : "h-9 w-28"} />;
  if (!session) {
    return (
      <div className={mobile ? "grid grid-cols-2 gap-2" : "flex items-center gap-2"}>
        <Button asChild variant="ghost" className="rounded-full text-[#254d3f]"><Link href="/login">Login</Link></Button>
        <Button asChild variant="outline" className="rounded-full border-[#254d3f]/25 bg-transparent text-[#254d3f]"><Link href="/register">Register</Link></Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`rounded-full border-[#254d3f]/20 bg-white text-[#254d3f] ${mobile ? "h-11 w-full justify-between" : "max-w-[180px]"}`}>
          <UserRound className="size-4" /><span className="truncate">{session.name}</span><ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl border-[#17362d]/10 bg-white p-2">
        <DropdownMenuLabel><span className="block truncate">{session.name}</span><span className="text-xs font-normal capitalize text-[#738078]">Demo {session.role}</span></DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session.role === "customer" && <><DropdownMenuItem asChild className="rounded-lg"><Link href="/dashboard/bookings"><CalendarCheck className="size-4" />My bookings</Link></DropdownMenuItem><DropdownMenuSeparator /></>}
        {session.role === "instructor" && <><DropdownMenuItem asChild className="rounded-lg"><Link href="/instructor"><ClipboardCheck className="size-4" />Instructor workspace</Link></DropdownMenuItem><DropdownMenuSeparator /></>}
        {session.role === "admin" && <><DropdownMenuItem asChild className="rounded-lg"><Link href="/admin"><ShieldCheck className="size-4" />Admin control centre</Link></DropdownMenuItem><DropdownMenuSeparator /></>}
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-[#738078]">Switch demo role</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={session.role} onValueChange={(role) => { const account = demoAccounts.find((item) => item.role === role); if (account) setDemoSession(account); }}>
          {demoAccounts.map((account) => <DropdownMenuRadioItem key={account.role} value={account.role} className="rounded-lg capitalize">{account.role}<span className="ml-auto text-xs text-[#738078]">{account.name}</span></DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-lg text-[#8b3d32]" onSelect={clearDemoSession}><LogOut className="size-4" /> Sign out of demo</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { DemoAccountMenu } from "@/components/demo/demo-account-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Classes", "/classes"],
  ["Schedule", "/schedule"],
  ["Monthly Plans", "/plans"],
  ["Contact", "/contact"],
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#17362d]/10 bg-[#fbf8f1]/92 backdrop-blur-xl">
      <Container className="flex h-[74px] items-center justify-between gap-6">
        <Brand />

        <nav aria-label="Primary navigation" className="hidden items-center gap-5 xl:flex">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-medium text-[#40584f] transition-colors hover:text-[#17362d]">
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <DemoAccountMenu />
          <Button asChild className="rounded-full bg-[#254d3f] px-5 text-[#fffaf1] hover:bg-[#17362d]">
            <Link href="/schedule">Book a Session</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-[#254d3f] md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[88%] border-[#17362d]/10 bg-[#fbf8f1] p-0 sm:max-w-sm">
            <SheetHeader className="border-b border-[#17362d]/10 p-6 text-left">
              <SheetTitle><Brand /></SheetTitle>
              <SheetDescription className="text-[#65756e]">Move, breathe and feel at home.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile navigation" className="flex flex-col px-4 py-5">
              {navItems.map(([label, href]) => (
                <SheetClose asChild key={href}>
                  <Link href={href} className="rounded-xl px-4 py-3.5 font-medium text-[#27463c] hover:bg-[#e8ede6]">{label}</Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto grid gap-2 border-t border-[#17362d]/10 p-5">
              <SheetClose asChild><Button asChild className="h-11 rounded-full bg-[#254d3f] text-[#fffaf1]"><Link href="/schedule">Book a Session</Link></Button></SheetClose>
              <DemoAccountMenu mobile />
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { LoginPanel } from "@/components/auth/login-panel";
import { Container } from "@/components/shared/container";
import { PublicPage } from "@/components/shared/public-page";

export const metadata: Metadata = { title: "Demo Login | Ananda Yoga", description: "Enter the Ananda Yoga client demo as a customer, instructor or administrator." };

export default function LoginPage() {
  return <PublicPage><section className="py-12 sm:py-16"><Container className="grid items-center gap-12 lg:grid-cols-[1fr_0.82fr] lg:gap-20"><div className="hidden lg:block"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a65f3d]">Explore every role</p><h2 className="mt-4 font-display text-6xl leading-[0.95] tracking-[-0.05em]">One studio.<br />Three clear journeys.</h2><p className="mt-6 max-w-lg text-lg leading-8 text-[#5b6d65]">Use the role cards to move between the customer, instructor and administrator experiences. Everything here is simulated for a safe client presentation.</p><div className="relative mt-9 aspect-[16/9] overflow-hidden rounded-[1.75rem]"><img src="/hero.jpg" alt="Peaceful yoga studio interior" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-[#17362d]/15" /></div></div><div><LoginPanel /><p className="mt-5 text-center text-sm text-[#65756e]">New here? <Link href="/register" className="font-bold text-[#a65f3d]">Create a demo account</Link></p></div></Container></section></PublicPage>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { RegisterPanel } from "@/components/auth/register-panel";
import { Container } from "@/components/shared/container";
import { PublicPage } from "@/components/shared/public-page";

export const metadata: Metadata = { title: "Register | Ananda Yoga Demo", description: "Create a simulated customer account for the Ananda Yoga client demo." };

export default function RegisterPage() {
  return <PublicPage><section className="py-12 sm:py-16"><Container className="grid items-center gap-12 lg:grid-cols-[0.82fr_1fr] lg:gap-20"><div><RegisterPanel /><p className="mt-5 text-center text-sm text-[#65756e]">Already have demo access? <Link href="/login" className="font-bold text-[#a65f3d]">Log in</Link></p></div><div className="hidden lg:block"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a65f3d]">Begin your practice</p><h2 className="mt-4 font-display text-6xl leading-[0.95] tracking-[-0.05em]">A welcoming first step.</h2><p className="mt-6 max-w-lg text-lg leading-8 text-[#5b6d65]">The registration journey demonstrates customer onboarding and mobile verification without sending messages or creating a real account.</p><div className="mt-9 grid grid-cols-3 gap-3">{["1. Your details", "2. Demo OTP", "3. Choose a class"].map((item) => <div key={item} className="rounded-xl bg-[#edf0e9] p-4 text-sm font-semibold">{item}</div>)}</div></div></Container></section></PublicPage>;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, HelpCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { PlanCard } from "@/components/shared/plan-card";
import { membershipPlans as seedPlans } from "@/data/mock-data";
import { getAdminMembershipPlans } from "@/services/admin-storage";
import type { MembershipPlan } from "@/types/domain";

const faqs = [
  ["When does a plan begin?", "Your 30-day membership begins on the activation date selected during purchase."],
  ["Can I switch plans?", "Yes. In the demo journey, a new plan can be selected after the current period ends."],
  ["What if I need to cancel?", "Confirmed bookings can be cancelled with a full demo refund until two hours before the session."],
];

export function PlansContent() {
  const [plans, setPlans] = useState<MembershipPlan[]>(seedPlans);
  useEffect(() => { const load = () => setPlans(getAdminMembershipPlans()); load(); window.addEventListener("ananda-demo-change", load); return () => window.removeEventListener("ananda-demo-change", load); }, []);
  return <>
    <PageHero eyebrow="Monthly memberships" title="A plan for the rhythm you want." copy="Practice once a week, twice a week or whenever the mood strikes. Every plan keeps booking simple and your options open." />
    <section className="py-16 sm:py-24"><Container><div className="grid gap-6 lg:grid-cols-3">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div><p className="mt-5 text-center text-sm text-[#738078]">All prices are demo values in INR. Admin changes appear here immediately in this browser.</p></Container></section>
    <section className="bg-[#edf0e9] py-16 sm:py-20"><Container><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a65f3d]">Compare plans</p><h2 className="mt-3 font-display text-4xl sm:text-5xl">See what each month includes.</h2></div><div className="mt-10 overflow-x-auto rounded-[1.5rem] border border-[#17362d]/10 bg-white"><table className="w-full min-w-[680px] border-collapse text-left text-sm"><thead><tr className="border-b border-[#17362d]/10"><th className="p-5 font-semibold text-[#65756e]">Plan</th><th className="p-5 font-semibold text-[#65756e]">Price</th><th className="p-5 font-semibold text-[#65756e]">Sessions</th><th className="p-5 font-semibold text-[#65756e]">Included benefits</th></tr></thead><tbody>{plans.map((plan) => <tr key={plan.id} className="border-b border-[#17362d]/10 last:border-0"><th className="p-5 font-display text-xl">{plan.name}</th><td className="p-5 text-[#5b6d65]">₹{plan.price.toLocaleString("en-IN")} / month</td><td className="p-5 text-[#5b6d65]">{plan.sessionsPerMonth ?? "Unlimited"}</td><td className="p-5 text-[#5b6d65]"><Check className="mr-2 inline size-4 text-[#a65f3d]" />{plan.benefits.join(" · ")}</td></tr>)}</tbody></table></div></Container></section>
    <section className="py-16 sm:py-24"><Container className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20"><div><HelpCircle className="size-7 text-[#a65f3d]" /><h2 className="mt-5 font-display text-4xl">A few useful answers.</h2><p className="mt-4 text-[#65756e]">Still deciding? <Link href="/contact" className="font-semibold text-[#a65f3d]">Talk to the studio <ArrowRight className="inline size-4" /></Link></p></div><div className="divide-y divide-[#17362d]/12 border-y border-[#17362d]/12">{faqs.map(([question, answer]) => <article key={question} className="py-6"><h3 className="font-display text-2xl">{question}</h3><p className="mt-2 text-sm leading-6 text-[#65756e]">{answer}</p></article>)}</div></Container></section>
    <CtaBanner title="Try one class before you decide." copy="New students can choose an eligible trial session for ₹500." action="Find a trial session" />
  </>;
}

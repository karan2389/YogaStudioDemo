import Link from "next/link";
import { Check } from "lucide-react";
import type { MembershipPlan } from "@/types/domain";

export function PlanCard({ plan }: { plan: MembershipPlan }) {
  return (
    <article className={`relative rounded-[1.5rem] border p-6 ${plan.featured ? "border-[#a65f3d] bg-[#17362d] text-white" : "border-[#17362d]/10 bg-white text-[#17362d]"}`}>
      {plan.featured && <span className="absolute right-5 top-5 rounded-full bg-[#dfb77e] px-3 py-1 text-xs font-bold text-[#17362d]">Most loved</span>}
      <p className="text-sm font-bold uppercase tracking-[0.15em] opacity-70">{plan.name}</p>
      <p className="mt-4 font-display text-4xl">₹{plan.price.toLocaleString("en-IN")}<span className="ml-1 text-base font-sans font-normal opacity-60">/ month</span></p>
      <p className="mt-3 text-sm leading-6 opacity-70">{plan.description}</p>
      <ul className="my-6 space-y-3">
        {plan.benefits.map((benefit) => <li key={benefit} className="flex items-center gap-2 text-sm"><Check className="size-4 text-[#c98562]" />{benefit}</li>)}
      </ul>
      <Link href="/plans" className={`inline-flex w-full justify-center rounded-full px-5 py-3 text-sm font-bold ${plan.featured ? "bg-[#f8f1e7] text-[#17362d]" : "bg-[#e8ede6] text-[#254d3f]"}`}>Explore this plan</Link>
    </article>
  );
}

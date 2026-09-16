"use client";

import { useEffect, useState } from "react";
import { Check, CreditCard, ShieldCheck } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDemoSession } from "@/hooks/use-demo-session";
import { membershipPlans as seedPlans } from "@/data/mock-data";
import { getAdminMembershipPlans } from "@/services/admin-storage";
import { getDemoMemberships, purchaseDemoMembership } from "@/services/demo-storage";
import type { DemoMembershipRecord } from "@/types/demo";
import type { MembershipPlan } from "@/types/domain";

export function MembershipView() {
  const { session } = useDemoSession();
  const [memberships, setMemberships] = useState<DemoMembershipRecord[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>(seedPlans);
  const [selected, setSelected] = useState<string | null>(null);
  const [method, setMethod] = useState("UPI");
  useEffect(() => { const load = () => { setPlans(getAdminMembershipPlans()); if (session) setMemberships(getDemoMemberships().filter((item) => item.customerId === session.id)); }; load(); window.addEventListener("ananda-demo-change", load); return () => window.removeEventListener("ananda-demo-change", load); }, [session]);
  const active = memberships.find((item) => item.status === "active");
  const plan = plans.find((item) => item.id === selected);
  function purchase() { if (!session || !plan) return; const start = new Date(); const end = new Date(start.getTime() + plan.durationDays * 86400000); purchaseDemoMembership({ id: `MEM-${Date.now().toString(36).toUpperCase()}`, customerId: session.id, planId: plan.id, planName: plan.name, status: "active", startsAt: start.toISOString(), endsAt: end.toISOString(), sessionsPerMonth: plan.sessionsPerMonth, amount: plan.price }, method); setSelected(null); }
  return <><DashboardPageHeader eyebrow="Membership" title="Your practice plan." copy="See your current plan or activate a demo monthly membership." />
    {active && <section className="mb-6 overflow-hidden rounded-[1.5rem] bg-[#17362d] p-6 text-white sm:p-8"><div className="flex flex-col justify-between gap-6 sm:flex-row"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#dfb77e]">Active membership</p><h2 className="mt-2 font-display text-4xl">{active.planName}</h2><p className="mt-3 text-sm text-[#bdccc4]">Valid until {new Date(active.endsAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div><span className="grid size-14 place-items-center rounded-full bg-white/10 text-[#dfb77e]"><ShieldCheck className="size-7" /></span></div><div className="mt-8 max-w-xl"><div className="mb-2 flex justify-between text-xs text-[#bdccc4]"><span>Membership period</span><span>Active</span></div><Progress value={35} className="bg-white/15 [&_[data-slot=progress-indicator]]:bg-[#dfb77e]" /></div></section>}
    <div className="grid gap-5 xl:grid-cols-3">{plans.map((item) => <article key={item.id} className={`rounded-[1.5rem] border bg-white p-6 ${item.featured ? "border-[#a65f3d]" : "border-[#17362d]/10"}`}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a65f3d]">{item.name}</p><p className="mt-3 font-display text-4xl">₹{item.price.toLocaleString("en-IN")}</p><p className="text-sm text-[#738078]">for {item.durationDays} days</p></div>{item.featured && <span className="rounded-full bg-[#f5e7dd] px-3 py-1 text-xs font-bold text-[#8b4a2e]">Popular</span>}</div><p className="mt-4 text-sm leading-6 text-[#65756e]">{item.description}</p><ul className="my-6 space-y-3">{item.benefits.map((benefit) => <li key={benefit} className="flex gap-2 text-sm"><Check className="mt-0.5 size-4 text-[#a65f3d]" />{benefit}</li>)}</ul><Button variant={selected === item.id ? "default" : "outline"} className={`w-full rounded-full ${selected === item.id ? "bg-[#254d3f] text-white" : "bg-transparent"}`} onClick={() => setSelected(item.id)}>{active?.planId === item.id ? "Renew this plan" : "Choose plan"}</Button></article>)}</div>
    {plan && <section className="mt-6 rounded-[1.5rem] border border-[#17362d]/10 bg-white p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a65f3d]">Demo checkout</p><h2 className="mt-2 font-display text-3xl">Activate {plan.name}</h2></div><strong className="text-xl">₹{plan.price.toLocaleString("en-IN")}</strong></div><RadioGroup value={method} onValueChange={setMethod} className="mt-6 grid gap-3 sm:grid-cols-3">{["UPI", "Card", "Wallet"].map((value) => <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${method === value ? "border-[#254d3f] bg-[#edf0e9]" : "border-[#17362d]/10"}`}><RadioGroupItem value={value} /><CreditCard className="size-4 text-[#a65f3d]" /><span className="text-sm font-semibold">{value}</span></label>)}</RadioGroup><div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><Button variant="ghost" className="rounded-full" onClick={() => setSelected(null)}>Cancel</Button><Button className="rounded-full bg-[#254d3f] text-white" onClick={purchase}>Pay ₹{plan.price.toLocaleString("en-IN")} and activate</Button></div><p className="mt-4 text-right text-xs text-[#738078]">Simulated payment only. No charge is made.</p></section>}
  </>;
}

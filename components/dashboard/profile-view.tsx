"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, UserRound } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemoSession } from "@/hooks/use-demo-session";
import { updateDemoProfile } from "@/services/demo-storage";

export function ProfileView() {
  const { session } = useDemoSession();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [saved, setSaved] = useState(false);
  useEffect(() => { if (session) { setName(session.name); setEmail(session.email); setPhone(session.phone); } }, [session]);
  return <><DashboardPageHeader eyebrow="Profile" title="Your details." copy="Keep your demo contact information current. Changes stay only in this browser." />
    <div className="grid gap-6 xl:grid-cols-[1fr_0.55fr]">
      <form className="rounded-[1.5rem] border border-[#17362d]/10 bg-white p-6 sm:p-8" onSubmit={(event) => { event.preventDefault(); updateDemoProfile({ name, email, phone }); setSaved(true); window.setTimeout(() => setSaved(false), 2500); }}><div className="flex items-center gap-4 border-b border-[#17362d]/10 pb-6"><span className="grid size-14 place-items-center rounded-full bg-[#254d3f] text-white"><UserRound className="size-6" /></span><div><h2 className="font-display text-2xl">Personal information</h2><p className="text-sm text-[#65756e]">Demo customer ID: {session?.id}</p></div></div><div className="mt-6 grid gap-5 sm:grid-cols-2"><div className="grid gap-2 sm:col-span-2"><Label htmlFor="profile-name">Full name</Label><Input id="profile-name" required value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-[#fbf8f1]" /></div><div className="grid gap-2"><Label htmlFor="profile-email">Email</Label><Input id="profile-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl bg-[#fbf8f1]" /></div><div className="grid gap-2"><Label htmlFor="profile-phone">Mobile number</Label><Input id="profile-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl bg-[#fbf8f1]" /></div></div><div className="mt-7 flex items-center justify-end gap-4">{saved && <span className="flex items-center gap-2 text-sm font-semibold text-[#315744]"><CheckCircle2 className="size-4" />Saved</span>}<Button type="submit" className="rounded-full bg-[#254d3f] px-6 text-white">Save changes</Button></div></form>
      <aside className="rounded-[1.5rem] bg-[#17362d] p-6 text-white sm:p-7"><ShieldCheck className="size-6 text-[#dfb77e]" /><h2 className="mt-6 font-display text-3xl">Demo privacy</h2><p className="mt-3 text-sm leading-6 text-[#bdccc4]">Profile changes use browser storage. They are not transmitted, synced or available on another device.</p><div className="mt-6 border-t border-white/12 pt-5 text-xs leading-5 text-[#91a69b]">Production will use secure authentication, access controls and verified contact details.</div></aside>
    </div></>;
}

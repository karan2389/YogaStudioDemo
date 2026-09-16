"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { demoAccounts, setDemoSession } from "@/services/demo-storage";

export function LoginPanel() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("+91 98111 11111");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  function enter(account: (typeof demoAccounts)[number]) {
    setDemoSession(account);
    router.push(account.role === "customer" ? "/dashboard" : account.role === "instructor" ? "/instructor" : "/admin");
  }

  function verify() {
    if (otp !== "123456") { setError("Use the demo OTP 123456."); return; }
    enter({ ...demoAccounts[0], phone });
  }

  return (
    <div className="rounded-[1.75rem] border border-[#17362d]/10 bg-white p-6 shadow-[0_18px_55px_rgba(36,57,47,0.08)] sm:p-8">
      <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-[#e8ede6] text-[#254d3f]"><ShieldCheck className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a65f3d]">Demo access</p><h1 className="font-display text-3xl">Welcome back</h1></div></div>

      {step === "phone" ? (
        <form className="mt-7" onSubmit={(event) => { event.preventDefault(); setStep("otp"); }}>
          <Label htmlFor="phone">Mobile number</Label>
          <Input id="phone" type="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 h-12 rounded-xl border-[#17362d]/15 bg-[#fbf8f1]" />
          <Button type="submit" size="lg" className="mt-4 h-12 w-full rounded-full bg-[#254d3f] text-white">Send demo OTP <ArrowRight /></Button>
        </form>
      ) : (
        <div className="mt-7">
          <div className="flex items-start gap-3 rounded-xl bg-[#edf0e9] p-4 text-sm text-[#50645a]"><Smartphone className="mt-0.5 size-5 shrink-0" /><p>OTP simulated for <strong>{phone}</strong>. Use <strong>123456</strong>.</p></div>
          <Label className="mt-6 block">Enter 6-digit OTP</Label>
          <InputOTP maxLength={6} value={otp} onChange={(value) => { setOtp(value); setError(""); }} containerClassName="mt-2">
            <InputOTPGroup>{Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} className="h-12 w-11 border-[#17362d]/15 bg-[#fbf8f1] text-base" />)}</InputOTPGroup>
          </InputOTP>
          {error && <p role="alert" className="mt-2 text-sm text-[#a23d32]">{error}</p>}
          <Button type="button" size="lg" className="mt-5 h-12 w-full rounded-full bg-[#254d3f] text-white" onClick={verify}>Verify and continue <CheckCircle2 /></Button>
          <button type="button" onClick={() => { setStep("phone"); setOtp(""); setError(""); }} className="mt-4 w-full text-sm font-semibold text-[#65756e]">Change number</button>
        </div>
      )}

      <div className="my-7 flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-[#8b9892]"><span className="h-px flex-1 bg-[#17362d]/10" />or choose a role<span className="h-px flex-1 bg-[#17362d]/10" /></div>
      <div className="grid gap-2">
        {demoAccounts.map((account) => <button key={account.role} type="button" onClick={() => enter(account)} className="flex items-center gap-3 rounded-xl border border-[#17362d]/10 px-4 py-3 text-left transition hover:border-[#254d3f]/35 hover:bg-[#f4f6f1]"><span className={`grid size-9 place-items-center rounded-full text-xs font-bold uppercase text-white ${account.role === "customer" ? "bg-[#254d3f]" : account.role === "instructor" ? "bg-[#a65f3d]" : "bg-[#3e5a62]"}`}>{account.role[0]}</span><span className="min-w-0 flex-1"><strong className="block capitalize">{account.role}</strong><span className="block truncate text-xs text-[#738078]">{account.name}</span></span><ArrowRight className="size-4 text-[#738078]" /></button>)}
      </div>
      <p className="mt-5 text-center text-xs leading-5 text-[#809087]">No password or real OTP is used. This access exists only to demonstrate role-based journeys.</p>
    </div>
  );
}

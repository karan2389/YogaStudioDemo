"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { setDemoSession } from "@/services/demo-storage";

export function RegisterPanel() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("Kavya Rao");
  const [email, setEmail] = useState("kavya@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  function finish() {
    if (otp !== "123456") { setError("Use the demo OTP 123456."); return; }
    setDemoSession({ id: `demo-${Date.now()}`, name, email, phone, role: "customer" });
    router.push("/schedule");
  }

  return (
    <div className="rounded-[1.75rem] border border-[#17362d]/10 bg-white p-6 shadow-[0_18px_55px_rgba(36,57,47,0.08)] sm:p-8">
      <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-[#f5e7dd] text-[#a65f3d]"><UserPlus className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a65f3d]">New customer</p><h1 className="font-display text-3xl">Create demo account</h1></div></div>
      {step === "details" ? (
        <form className="mt-7 grid gap-5" onSubmit={(event) => { event.preventDefault(); setStep("otp"); }}>
          <div className="grid gap-2"><Label htmlFor="name">Full name</Label><Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-[#fbf8f1]" /></div>
          <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl bg-[#fbf8f1]" /></div>
          <div className="grid gap-2"><Label htmlFor="register-phone">Mobile number</Label><Input id="register-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl bg-[#fbf8f1]" /></div>
          <label className="flex gap-3 text-sm leading-6 text-[#65756e]"><input required type="checkbox" className="mt-1 size-4 accent-[#254d3f]" />I agree to the demo Terms and Privacy Policy.</label>
          <Button type="submit" size="lg" className="h-12 rounded-full bg-[#254d3f] text-white">Continue to verification <ArrowRight /></Button>
        </form>
      ) : (
        <div className="mt-7">
          <div className="rounded-xl bg-[#edf0e9] p-4 text-sm leading-6 text-[#50645a]">A simulated OTP was sent to <strong>{phone}</strong>. Enter <strong>123456</strong> to continue.</div>
          <Label className="mt-6 block">Enter demo OTP</Label>
          <InputOTP maxLength={6} value={otp} onChange={(value) => { setOtp(value); setError(""); }} containerClassName="mt-2"><InputOTPGroup>{Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} className="h-12 w-11 bg-[#fbf8f1] text-base" />)}</InputOTPGroup></InputOTP>
          {error && <p role="alert" className="mt-2 text-sm text-[#a23d32]">{error}</p>}
          <Button type="button" size="lg" className="mt-5 h-12 w-full rounded-full bg-[#254d3f] text-white" onClick={finish}>Create account <CheckCircle2 /></Button>
          <button type="button" onClick={() => setStep("details")} className="mt-4 w-full text-sm font-semibold text-[#65756e]">Edit details</button>
        </div>
      )}
      <p className="mt-5 text-center text-xs leading-5 text-[#809087]">Information stays only in this browser and can be cleared with browser storage.</p>
    </div>
  );
}

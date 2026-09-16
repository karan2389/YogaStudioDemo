"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Check, CreditCard, IndianRupee, LockKeyhole, Smartphone, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDemoSession } from "@/hooks/use-demo-session";
import { demoAccounts, hasSessionBooking, hasUsedTrial, saveDemoBooking, setDemoSession } from "@/services/demo-storage";
import { getStudioSettings } from "@/services/demo-settings";
import type { Instructor, Session, YogaClass } from "@/types/domain";

type BookingType = "single" | "trial";
type PaymentMethod = "upi" | "card" | "wallet";

export function BookingFlow({ session: classSession, yogaClass, instructor }: { session: Session; yogaClass: YogaClass; instructor: Instructor }) {
  const router = useRouter();
  const { session, ready } = useDemoSession();
  const [bookingType, setBookingType] = useState<BookingType>("single");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [step, setStep] = useState<"details" | "payment">("details");
  const [error, setError] = useState("");
  const [trialPrice, setTrialPrice] = useState(500);
  const date = useMemo(() => new Date(classSession.startsAt), [classSession.startsAt]);
  const amount = bookingType === "trial" ? trialPrice : yogaClass.price;
  const isCustomer = session?.role === "customer";
  const trialUsed = session ? hasUsedTrial(session.id) : false;
  useEffect(() => { const load = () => setTrialPrice(getStudioSettings().trialPrice); const timer = window.setTimeout(load, 0); window.addEventListener("ananda-demo-change", load); return () => { window.clearTimeout(timer); window.removeEventListener("ananda-demo-change", load); }; }, []);

  if (!ready) return <div className="min-h-[480px] animate-pulse rounded-[1.75rem] bg-white" />;

  if (!session) {
    return <div className="rounded-[1.75rem] border border-[#17362d]/10 bg-white p-7 text-center shadow-[0_18px_55px_rgba(36,57,47,0.08)] sm:p-10"><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e8ede6] text-[#254d3f]"><LockKeyhole className="size-6" /></span><h1 className="mt-5 font-display text-4xl">Sign in to reserve your place.</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#65756e]">This demo uses browser-local access only. Continue with the sample customer or use the full login journey.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Button className="h-11 rounded-full bg-[#254d3f] text-white" onClick={() => setDemoSession(demoAccounts[0])}>Continue as Aarav</Button><Button asChild variant="outline" className="h-11 rounded-full bg-transparent"><Link href="/login">Open demo login</Link></Button></div></div>;
  }

  if (!isCustomer) {
    return <div className="rounded-[1.75rem] border border-[#17362d]/10 bg-white p-8 text-center"><AlertCircle className="mx-auto size-7 text-[#a65f3d]" /><h1 className="mt-4 font-display text-3xl">Customer access is needed to book.</h1><p className="mt-3 text-sm text-[#65756e]">You are currently viewing the demo as {session.role}.</p><Button className="mt-6 rounded-full bg-[#254d3f] text-white" onClick={() => setDemoSession(demoAccounts[0])}>Switch to customer</Button></div>;
  }

  function continueToPayment() {
    if (!session) return;
    if (hasSessionBooking(session.id, classSession.id)) { setError("This customer already has a confirmed demo booking for this session."); return; }
    setError("");
    setStep("payment");
  }

  function completePayment() {
    if (!session) return;
    const seed = Date.now().toString(36).toUpperCase();
    saveDemoBooking({ id: `BK-${seed}`, customerId: session.id, customerName: session.name, sessionId: classSession.id, className: yogaClass.name, instructorName: instructor.name, startsAt: classSession.startsAt, bookingType, amount, paymentMethod, paymentId: `PAY-${seed}`, status: "confirmed", createdAt: new Date().toISOString() });
    router.push("/booking-confirmation");
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#17362d]/10 bg-white shadow-[0_18px_55px_rgba(36,57,47,0.08)]">
      <div className="border-b border-[#17362d]/10 bg-[#edf0e9] px-6 py-4"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]"><span className={step === "details" ? "text-[#254d3f]" : "text-[#738078]"}>1 · Booking</span><span className={step === "payment" ? "text-[#254d3f]" : "text-[#738078]"}>2 · Payment</span><span className="text-[#738078]">3 · Confirmed</span></div></div>
      <div className="p-6 sm:p-8">
        {step === "details" ? (
          <>
            <Link href="/schedule" className="inline-flex items-center gap-2 text-sm text-[#65756e]"><ArrowLeft className="size-4" /> Back to schedule</Link>
            <h1 className="mt-5 font-display text-4xl">Choose how you’d like to book.</h1>
            <p className="mt-2 text-sm text-[#65756e]">Signed in as <strong>{session.name}</strong></p>
            <RadioGroup value={bookingType} onValueChange={(value) => setBookingType(value as BookingType)} className="mt-7 gap-3">
              <label className={`flex cursor-pointer items-start gap-4 rounded-[1.25rem] border p-5 ${bookingType === "single" ? "border-[#254d3f] bg-[#f3f6f1]" : "border-[#17362d]/10"}`}><RadioGroupItem value="single" className="mt-1" /><span className="flex-1"><span className="flex items-center justify-between gap-4"><strong>Single session</strong><strong>₹{yogaClass.price}</strong></span><span className="mt-1 block text-sm leading-6 text-[#65756e]">Pay for this class only. No membership required.</span></span></label>
              <label className={`flex items-start gap-4 rounded-[1.25rem] border p-5 ${trialUsed ? "cursor-not-allowed opacity-55" : "cursor-pointer"} ${bookingType === "trial" && !trialUsed ? "border-[#a65f3d] bg-[#fbf0e9]" : "border-[#17362d]/10"}`}><RadioGroupItem value="trial" disabled={trialUsed} className="mt-1" /><span className="flex-1"><span className="flex items-center justify-between gap-4"><strong>New-student trial</strong><strong>₹{trialPrice}</strong></span><span className="mt-1 block text-sm leading-6 text-[#65756e]">One discounted studio session per demo customer.{trialUsed ? " Already used on this browser." : ""}</span></span></label>
            </RadioGroup>
            {error && <div role="alert" className="mt-4 flex gap-3 rounded-xl bg-[#f9e6e3] p-4 text-sm text-[#8b3d32]"><AlertCircle className="size-5 shrink-0" />{error}</div>}
            <Button size="lg" className="mt-7 h-12 w-full rounded-full bg-[#254d3f] text-white" onClick={continueToPayment}>Continue to payment · ₹{amount}</Button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => { setStep("details"); setError(""); }} className="inline-flex items-center gap-2 text-sm text-[#65756e]"><ArrowLeft className="size-4" /> Edit booking</button>
            <div className="mt-5 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a65f3d]">Razorpay checkout simulation</p><h1 className="mt-2 font-display text-4xl">Pay ₹{amount}</h1></div><span className="grid size-11 place-items-center rounded-full bg-[#e8ede6] text-[#254d3f]"><LockKeyhole className="size-5" /></span></div>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)} className="mt-7 gap-3">
              {[{ value: "upi", label: "UPI", icon: Smartphone, hint: "Demo UPI payment" }, { value: "card", label: "Card", icon: CreditCard, hint: "Demo credit or debit card" }, { value: "wallet", label: "Wallet", icon: WalletCards, hint: "Demo digital wallet" }].map(({ value, label, icon: Icon, hint }) => <label key={value} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${paymentMethod === value ? "border-[#254d3f] bg-[#f3f6f1]" : "border-[#17362d]/10"}`}><RadioGroupItem value={value} /><Icon className="size-5 text-[#a65f3d]" /><span><strong className="block">{label}</strong><span className="text-xs text-[#738078]">{hint}</span></span></label>)}
            </RadioGroup>
            {error && <div role="alert" className="mt-4 flex gap-3 rounded-xl bg-[#f9e6e3] p-4 text-sm text-[#8b3d32]"><AlertCircle className="size-5 shrink-0" />{error}</div>}
            <Button size="lg" className="mt-7 h-12 w-full rounded-full bg-[#254d3f] text-white" onClick={completePayment}><IndianRupee className="size-4" />Pay ₹{amount} securely</Button>
            <button type="button" className="mt-3 w-full rounded-full py-2 text-sm font-semibold text-[#9a4a3d]" onClick={() => setError("Demo payment declined. Choose Pay securely to simulate a successful payment.")}>Simulate payment failure</button>
            <p className="mt-3 text-center text-xs leading-5 text-[#809087]">No bank details are requested and no real payment is made.</p>
          </>
        )}
      </div>
    </div>
  );
}

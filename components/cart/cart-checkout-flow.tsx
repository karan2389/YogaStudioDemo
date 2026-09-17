"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, CalendarDays, Clock3, CreditCard, IndianRupee, LockKeyhole, Smartphone, Trash2, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDemoSession } from "@/hooks/use-demo-session";
import { useDemoCart } from "@/hooks/use-demo-cart";
import { demoAccounts, saveDemoCartBookings, setDemoSession } from "@/services/demo-storage";
import { formatSessionFullDate, formatSessionTime } from "@/lib/date-time";
import { getInstructor } from "@/data/mock-data";

type PaymentMethod = "upi" | "card" | "wallet";

export function CartCheckoutFlow() {
  const router = useRouter();
  const { session, ready } = useDemoSession();
  const cart = useDemoCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [error, setError] = useState("");
  const isCustomer = session?.role === "customer";

  if (!ready || !cart.isReady) return <div className="min-h-[480px] animate-pulse rounded-[1.75rem] bg-white" />;

  if (!session) {
    return <div className="rounded-[1.75rem] border border-[#17362d]/10 bg-white p-7 text-center shadow-[0_18px_55px_rgba(36,57,47,0.08)] sm:p-10"><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e8ede6] text-[#254d3f]"><LockKeyhole className="size-6" /></span><h1 className="mt-5 font-display text-4xl">Sign in to checkout.</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#65756e]">This demo uses browser-local access only. Continue with the sample customer or use the full login journey.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Button className="h-11 rounded-full bg-[#254d3f] text-white" onClick={() => setDemoSession(demoAccounts[0])}>Continue as Aarav</Button><Button asChild variant="outline" className="h-11 rounded-full bg-transparent"><Link href="/login">Open demo login</Link></Button></div></div>;
  }

  if (!isCustomer) {
    return <div className="rounded-[1.75rem] border border-[#17362d]/10 bg-white p-8 text-center"><AlertCircle className="mx-auto size-7 text-[#a65f3d]" /><h1 className="mt-4 font-display text-3xl">Customer access is needed to book.</h1><p className="mt-3 text-sm text-[#65756e]">You are currently viewing the demo as {session.role}.</p><Button className="mt-6 rounded-full bg-[#254d3f] text-white" onClick={() => setDemoSession(demoAccounts[0])}>Switch to customer</Button></div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-[#17362d]/10 bg-white p-12 text-center">
        <h1 className="font-display text-4xl">Your cart is empty.</h1>
        <p className="mt-3 text-[#65756e]">Explore our timetable to select sessions to book.</p>
        <Button asChild className="mt-8 rounded-full bg-[#254d3f] text-white">
          <Link href="/schedule">View Schedule</Link>
        </Button>
      </div>
    );
  }

  function completePayment() {
    if (!session || cart.items.length === 0) return;
    
    const seed = Date.now().toString(36).toUpperCase();
    
    const bookingsToAdd = cart.items.map((item, index) => {
      const instructor = getInstructor(item.instructorId);
      const pct = instructor?.payrollPercentage ?? 60;
      const payroll = Math.round((item.price * pct) / 100);
      const studio = item.price - payroll;
      
      return {
        id: `BK-${seed}-${index}`,
        customerId: session.id,
        customerName: session.name,
        sessionId: item.sessionId,
        className: item.className,
        instructorName: item.instructorName,
        startsAt: item.startsAt,
        bookingType: "single" as const,
        amount: item.price,
        paymentMethod: paymentMethod,
        paymentId: `PAY-${seed}`,
        status: "confirmed" as const,
        createdAt: new Date().toISOString(),
        payrollPercentageSnapshot: pct,
        instructorPayrollAmount: payroll,
        studioShare: studio
      };
    });
    
    saveDemoCartBookings(bookingsToAdd);
    cart.clearCart();
    router.push("/booking-confirmation");
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#17362d]/10 bg-white shadow-[0_18px_55px_rgba(36,57,47,0.08)]">
      <div className="border-b border-[#17362d]/10 bg-[#edf0e9] px-6 py-4"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]"><span className="text-[#254d3f]">1 · Cart Checkout</span><span className="text-[#738078]">2 · Confirmed</span></div></div>
      <div className="p-6 sm:p-8">
        <Link href="/schedule" className="inline-flex items-center gap-2 text-sm text-[#65756e]"><ArrowLeft className="size-4" /> Back to schedule</Link>
        
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a65f3d]">Multi-session checkout</p>
            <h1 className="mt-2 font-display text-4xl">Pay ₹{cart.totalAmount}</h1>
          </div>
          <span className="grid size-11 place-items-center rounded-full bg-[#e8ede6] text-[#254d3f]"><LockKeyhole className="size-5" /></span>
        </div>
        
        <div className="mt-6 space-y-3">
          <p className="text-sm font-bold text-[#17362d]">{cart.items.length} sessions selected:</p>
          {cart.items.map((item) => (
            <div key={item.sessionId} className="rounded-2xl border border-[#17362d]/10 bg-[#fbfcfb] p-4 text-sm flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#17362d]">{item.className}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#52665c]">
                  <span className="flex items-center gap-1.5 font-medium"><CalendarDays className="size-3.5 text-[#a65f3d]" />{formatSessionFullDate(item.startsAt)}</span>
                  <span className="flex items-center gap-1.5 font-medium text-[#17362d]"><Clock3 className="size-3.5 text-[#a65f3d]" />{formatSessionTime(item.startsAt.slice(11, 16))}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#254d3f]">₹{item.price}</span>
                <button 
                  onClick={() => cart.removeItem(item.sessionId)}
                  className="p-2 text-[#65756e] hover:text-[#9b3a32] hover:bg-[#fbeaea] rounded-full transition"
                  title="Remove from cart"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)} className="mt-8 gap-3">
          {[{ value: "upi", label: "UPI", icon: Smartphone, hint: "Demo UPI payment" }, { value: "card", label: "Card", icon: CreditCard, hint: "Demo credit or debit card" }, { value: "wallet", label: "Wallet", icon: WalletCards, hint: "Demo digital wallet" }].map(({ value, label, icon: Icon, hint }) => <label key={value} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${paymentMethod === value ? "border-[#254d3f] bg-[#f3f6f1]" : "border-[#17362d]/10"}`}><RadioGroupItem value={value} /><Icon className="size-5 text-[#a65f3d]" /><span><strong className="block">{label}</strong><span className="text-xs text-[#738078]">{hint}</span></span></label>)}
        </RadioGroup>
        
        {error && <div role="alert" className="mt-4 flex gap-3 rounded-xl bg-[#f9e6e3] p-4 text-sm text-[#8b3d32]"><AlertCircle className="size-5 shrink-0" />{error}</div>}
        
        <Button size="lg" className="mt-7 h-12 w-full rounded-full bg-[#254d3f] text-white" onClick={completePayment}>
          <IndianRupee className="size-4 mr-2" /> Pay ₹{cart.totalAmount} securely
        </Button>
        <button type="button" className="mt-3 w-full rounded-full py-2 text-sm font-semibold text-[#9a4a3d]" onClick={() => setError("Demo payment declined. Choose Pay securely to simulate a successful payment.")}>Simulate payment failure</button>
        <p className="mt-3 text-center text-xs leading-5 text-[#809087]">No bank details are requested and no real payment is made.</p>
      </div>
    </div>
  );
}

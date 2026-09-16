"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="grid min-h-[430px] place-items-center rounded-[1.75rem] border border-[#17362d]/10 bg-white p-8 text-center shadow-[0_14px_40px_rgba(36,57,47,0.06)]">
        <div><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e3ece5] text-[#315744]"><CheckCircle2 className="size-7" /></span><h2 className="mt-5 font-display text-3xl">Message captured for the demo.</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#65756e]">No message was sent externally. A real contact service will replace this simulation during production integration.</p><Button type="button" variant="outline" className="mt-6 rounded-full bg-transparent" onClick={() => setSent(false)}>Send another message</Button></div>
      </div>
    );
  }

  return (
    <form className="rounded-[1.75rem] border border-[#17362d]/10 bg-white p-6 shadow-[0_14px_40px_rgba(36,57,47,0.06)] sm:p-8" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a65f3d]">Send a message</p><h2 className="mt-2 font-display text-3xl">How can we help?</h2></div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required placeholder="Your name" className="h-11 rounded-xl border-[#17362d]/15 bg-[#fbf8f1]" /></div>
        <div className="grid gap-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" required type="tel" placeholder="+91 98XXX XXXXX" className="h-11 rounded-xl border-[#17362d]/15 bg-[#fbf8f1]" /></div>
      </div>
      <div className="mt-5 grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" required type="email" placeholder="you@example.com" className="h-11 rounded-xl border-[#17362d]/15 bg-[#fbf8f1]" /></div>
      <div className="mt-5 grid gap-2"><Label htmlFor="message">What would you like to know?</Label><Textarea id="message" name="message" required rows={5} placeholder="Tell us about your experience level, preferred time, or anything else." className="resize-none rounded-xl border-[#17362d]/15 bg-[#fbf8f1]" /></div>
      <Button type="submit" size="lg" className="mt-6 h-12 w-full rounded-full bg-[#254d3f] text-white">Send demo message <Send className="size-4" /></Button>
      <p className="mt-3 text-center text-xs text-[#738078]">Demo only—this form does not transmit or store personal information.</p>
    </form>
  );
}

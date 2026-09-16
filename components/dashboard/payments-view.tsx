"use client";

import { useEffect, useState } from "react";
import { CreditCard, Download, ReceiptText } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { useDemoSession } from "@/hooks/use-demo-session";
import { getDemoPayments } from "@/services/demo-storage";
import type { DemoPaymentRecord } from "@/types/demo";

export function PaymentsView() {
  const { session } = useDemoSession();
  const [items, setItems] = useState<DemoPaymentRecord[]>([]);
  useEffect(() => { const load = () => { if (session) setItems(getDemoPayments().filter((item) => item.customerId === session.id)); }; load(); window.addEventListener("ananda-demo-change", load); return () => window.removeEventListener("ananda-demo-change", load); }, [session]);
  const paid = items.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0);
  const refunded = items.filter((item) => item.status === "refunded").reduce((sum, item) => sum + item.amount, 0);
  return <><DashboardPageHeader eyebrow="Payments" title="Payment history." copy="Demo receipts for session and membership payments made in this browser." />
    <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-[1.25rem] bg-[#17362d] p-6 text-white"><p className="text-sm text-[#bdccc4]">Successful payments</p><p className="mt-2 font-display text-4xl">₹{paid.toLocaleString("en-IN")}</p></div><div className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-6"><p className="text-sm text-[#65756e]">Refunded</p><p className="mt-2 font-display text-4xl">₹{refunded.toLocaleString("en-IN")}</p></div></div>
    <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#17362d]/10 bg-white">{items.length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[#edf0e9] text-xs uppercase tracking-[0.1em] text-[#65756e]"><tr><th className="p-5">Payment</th><th className="p-5">Date</th><th className="p-5">Method</th><th className="p-5">Status</th><th className="p-5 text-right">Amount</th></tr></thead><tbody>{items.map((payment) => <tr key={payment.id} className="border-t border-[#17362d]/10"><td className="p-5"><strong className="block">{payment.description}</strong><span className="text-xs text-[#809087]">{payment.id}</span></td><td className="p-5 text-[#65756e]">{new Date(payment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td><td className="p-5 text-[#65756e]">{payment.method}</td><td className="p-5"><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${payment.status === "paid" ? "bg-[#e3ece5] text-[#315744]" : "bg-[#f5e7dd] text-[#8b4a2e]"}`}>{payment.status}</span></td><td className="p-5 text-right font-semibold">₹{payment.amount.toLocaleString("en-IN")}</td></tr>)}</tbody></table></div> : <div className="p-10 text-center"><ReceiptText className="mx-auto size-7 text-[#a65f3d]" /><h2 className="mt-4 font-display text-3xl">No payments yet.</h2><p className="mt-2 text-sm text-[#65756e]">Complete a session booking or membership purchase to create a demo receipt.</p></div>}</div>
    <div className="mt-5 flex items-center justify-between gap-4 text-xs text-[#738078]"><p>Receipts are simulated and cannot be used as tax invoices.</p><Button variant="ghost" size="sm" disabled className="gap-2"><Download className="size-4" />Export in production</Button></div></>;
}

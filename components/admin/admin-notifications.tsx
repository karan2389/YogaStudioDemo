"use client";

import { useEffect, useState } from "react";
import { Mail, MessageCircle, Plus, Send } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { customers } from "@/data/mock-data";
import { getOperationalNotifications, sendOperationalNotification } from "@/services/admin-operations";
import type { OperationalNotification } from "@/types/admin";

export function AdminNotifications() {
  const [items, setItems] = useState<OperationalNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [audience, setAudience] = useState("all");
  const [channel, setChannel] = useState<OperationalNotification["channel"]>("in-app");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  useEffect(() => { const load = () => setItems(getOperationalNotifications()); load(); window.addEventListener("ananda-demo-change", load); return () => window.removeEventListener("ananda-demo-change", load); }, []);
  function send() { const customer = customers.find((item) => item.id === audience); sendOperationalNotification({ audience: customer?.name ?? "All customers", customerId: customer?.id, title, body, channel }); setOpen(false); setTitle(""); setBody(""); }
  return <>
    <DashboardPageHeader eyebrow="Communication" title="Notifications" copy="Send simulated in-app, email or WhatsApp messages and review campaign history." action={<Button className="h-11 rounded-full bg-[#254d3f] text-white" onClick={() => setOpen(true)}><Plus /> New message</Button>} />
    <div className="rounded-[1.5rem] border border-[#17362d]/10 bg-white"><div className="border-b border-[#17362d]/10 p-5 sm:p-6"><h2 className="font-display text-2xl">Message history</h2><p className="mt-1 text-sm text-[#65756e]">All delivery is simulated for this client demo.</p></div><div className="divide-y divide-[#17362d]/10">{items.map((item) => <article key={item.id} className="flex gap-4 p-5 sm:p-6"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e7ecea] text-[#3e5a62]">{item.channel === "whatsapp" ? <MessageCircle className="size-4" /> : item.channel === "email" ? <Mail className="size-4" /> : <Send className="size-4" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{item.title}</h3><span className="rounded-full bg-[#deeee3] px-2.5 py-1 text-[11px] font-bold capitalize text-[#315744]">{item.channel} · sent</span></div><p className="mt-1 text-sm leading-6 text-[#65756e]">{item.body}</p><p className="mt-2 text-xs text-[#829089]">{item.audience} · {new Date(item.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}</p></div></article>)}</div></div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="rounded-[1.5rem] border-[#17362d]/10 bg-[#f5f6f2]"><DialogHeader><DialogTitle className="font-display text-3xl">Send a demo message</DialogTitle><DialogDescription>No external provider is called.</DialogDescription></DialogHeader><form onSubmit={(event) => { event.preventDefault(); send(); }} className="grid gap-4"><div><Label>Audience</Label><NativeSelect value={audience} onChange={(event) => setAudience(event.target.value)} className="mt-2 h-11 w-full rounded-xl bg-white"><NativeSelectOption value="all">All customers</NativeSelectOption>{customers.map((item) => <NativeSelectOption key={item.id} value={item.id}>{item.name}</NativeSelectOption>)}</NativeSelect></div><div><Label>Channel</Label><NativeSelect value={channel} onChange={(event) => setChannel(event.target.value as OperationalNotification["channel"])} className="mt-2 h-11 w-full rounded-xl bg-white"><NativeSelectOption value="in-app">In-app</NativeSelectOption><NativeSelectOption value="email">Email</NativeSelectOption><NativeSelectOption value="whatsapp">WhatsApp</NativeSelectOption></NativeSelect></div><div><Label htmlFor="campaign-title">Title</Label><Input id="campaign-title" required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 h-11 rounded-xl bg-white" /></div><div><Label htmlFor="campaign-body">Message</Label><Textarea id="campaign-body" required value={body} onChange={(event) => setBody(event.target.value)} className="mt-2 min-h-28 rounded-xl bg-white" /></div><DialogFooter><Button type="button" variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" className="rounded-full bg-[#254d3f] text-white"><Send /> Simulate send</Button></DialogFooter></form></DialogContent></Dialog>
  </>;
}

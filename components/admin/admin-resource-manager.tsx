"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { adminResourceConfigs } from "@/data/admin-config";
import { deleteAdminRecord, getAdminCollection, upsertAdminRecord } from "@/services/admin-storage";
import type { AdminField, AdminRecord, AdminRecordValue, AdminResource } from "@/types/admin";

function inputValue(field: AdminField, value: AdminRecordValue) {
  if (field.type === "list") return Array.isArray(value) ? value.join(", ") : "";
  if (field.type === "datetime-local") return String(value ?? "").slice(0, 16);
  return value === null ? "" : String(value ?? "");
}

function ResourceField({ field, value, onChange }: { field: AdminField; value: AdminRecordValue; onChange: (value: AdminRecordValue) => void }) {
  if (field.type === "checkbox") return <label className="flex items-center justify-between rounded-xl border border-[#17362d]/12 bg-[#f6f7f4] px-4 py-3 text-sm font-semibold"><span>{field.label}</span><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-[#254d3f]" /></label>;
  return <div><Label htmlFor={field.key} className="text-sm">{field.label}</Label>
    {field.type === "select" ? <NativeSelect id={field.key} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-xl border-[#17362d]/15 bg-white"><>{field.options?.map((option) => <NativeSelectOption key={option.value} value={option.value}>{option.label}</NativeSelectOption>)}</></NativeSelect>
      : field.type === "textarea" ? <Textarea id={field.key} value={inputValue(field, value)} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} className="mt-2 min-h-24 rounded-xl border-[#17362d]/15 bg-white" />
      : <Input id={field.key} type={field.type === "list" ? "text" : field.type} required={field.required} value={inputValue(field, value)} placeholder={field.placeholder} onChange={(event) => { const raw = event.target.value; if (field.type === "number") onChange(raw === "" ? (field.nullable ? null : "") : Number(raw)); else if (field.type === "list") onChange(raw.split(",").map((item) => item.trim()).filter(Boolean)); else onChange(raw); }} className="mt-2 h-11 rounded-xl border-[#17362d]/15 bg-white" />}
  </div>;
}

export function AdminResourceManager({ resource }: { resource: AdminResource }) {
  const config = adminResourceConfigs[resource];
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { const load = () => setRecords(getAdminCollection(config.resource)); load(); window.addEventListener("ananda-demo-change", load); return () => window.removeEventListener("ananda-demo-change", load); }, [config.resource]);
  const filtered = useMemo(() => records.filter((record) => JSON.stringify(record).toLowerCase().includes(query.toLowerCase())), [records, query]);

  function startCreate() { setEditing(config.newRecord()); setOpen(true); }
  function startEdit(record: AdminRecord) { setEditing(structuredClone(record)); setOpen(true); }
  function save() { if (!editing) return; upsertAdminRecord(config.resource, editing); setOpen(false); setEditing(null); }

  return <>
    <DashboardPageHeader eyebrow={config.eyebrow} title={config.title} copy={config.copy} action={<Button className="h-11 rounded-full bg-[#254d3f] text-white" onClick={startCreate}><Plus /> Add {config.singular}</Button>} />
    <div className="mb-5 flex flex-col gap-3 rounded-[1.25rem] border border-[#17362d]/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#738078]" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}`} className="h-11 rounded-full border-[#17362d]/15 bg-[#f7f8f6] pl-10" /></div><p className="text-sm font-semibold text-[#65756e]">{filtered.length} {filtered.length === 1 ? config.singular : config.title.toLowerCase()}</p></div>
    <div className="grid gap-3">{filtered.map((record) => <article key={record.id} className="rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5 shadow-[0_6px_22px_rgba(36,57,47,0.035)]"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-2xl">{config.titleFor(record)}</h2>{config.statusFor && <span className="rounded-full bg-[#e7ecea] px-2.5 py-1 text-[11px] font-bold capitalize text-[#3e5a62]">{config.statusFor(record)}</span>}</div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#65756e]">{config.detailsFor(record).filter(Boolean).map((detail, index) => <span key={`${record.id}-${index}`}>{detail}</span>)}</div></div><div className="flex shrink-0 gap-2"><Button variant="outline" size="sm" className="rounded-full bg-transparent" onClick={() => startEdit(record)}><Pencil /> Edit</Button><AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="icon-sm" className="rounded-full border-[#8b3d32]/20 text-[#8b3d32]" aria-label={`Delete ${config.titleFor(record)}`}><Trash2 /></Button></AlertDialogTrigger><AlertDialogContent className="rounded-[1.25rem] bg-white"><AlertDialogHeader><AlertDialogTitle>Delete this {config.singular}?</AlertDialogTitle><AlertDialogDescription>{config.titleFor(record)} will be removed from this browser&apos;s demo data. This does not affect any real system.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel><AlertDialogAction className="rounded-full bg-[#8b3d32] text-white hover:bg-[#702f27]" onClick={() => deleteAdminRecord(config.resource, record.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></div></article>)}</div>
    {filtered.length === 0 && <div className="rounded-[1.5rem] border border-dashed border-[#17362d]/20 bg-white p-10 text-center"><p className="font-display text-2xl">No matching {config.title.toLowerCase()}.</p><p className="mt-2 text-sm text-[#65756e]">Try another search or add a new {config.singular}.</p></div>}
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) setEditing(null); }}><DialogContent className="max-h-[90vh] overflow-y-auto rounded-[1.5rem] border-[#17362d]/10 bg-[#f5f6f2] sm:max-w-2xl"><DialogHeader><DialogTitle className="font-display text-3xl">{records.some((record) => record.id === editing?.id) ? "Edit" : "Add"} {config.singular}</DialogTitle><DialogDescription>Changes are stored locally for this demo.</DialogDescription></DialogHeader>{editing && <form onSubmit={(event) => { event.preventDefault(); save(); }} className="grid gap-4 sm:grid-cols-2">{config.fields.map((field) => <div key={field.key} className={field.type === "textarea" || field.type === "list" || field.type === "checkbox" ? "sm:col-span-2" : ""}><ResourceField field={field} value={editing[field.key]} onChange={(value) => setEditing({ ...editing, [field.key]: value })} /></div>)}<DialogFooter className="mt-2 sm:col-span-2"><Button type="button" variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" className="rounded-full bg-[#254d3f] text-white">Save {config.singular}</Button></DialogFooter></form>}</DialogContent></Dialog>
  </>;
}

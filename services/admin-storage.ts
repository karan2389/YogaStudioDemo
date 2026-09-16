"use client";

import { customers, instructors, membershipPlans, sessions, yogaClasses } from "@/data/mock-data";
import type { AdminRecord, AdminResource } from "@/types/admin";
import type { MembershipPlan } from "@/types/domain";

const PREFIX = "ananda-admin-";

const categorySeeds: AdminRecord[] = [
  { id: "cat-foundation", name: "Foundations", description: "Accessible classes for strong, confident beginnings.", status: "active" },
  { id: "cat-flow", name: "Flow", description: "Breath-led movement and dynamic sequences.", status: "active" },
  { id: "cat-strength", name: "Strength", description: "Focused practices for stamina and stability.", status: "active" },
  { id: "cat-restoration", name: "Restoration", description: "Slower practices for mobility, breath and recovery.", status: "active" },
];

const seeds: Record<AdminResource, AdminRecord[]> = {
  customers: customers.map((item) => ({ ...item })) as AdminRecord[],
  instructors: instructors.map((item) => ({ ...item })) as AdminRecord[],
  classes: yogaClasses.map((item) => ({ ...item })) as AdminRecord[],
  categories: categorySeeds,
  sessions: sessions.map((item) => ({ ...item })) as AdminRecord[],
  plans: membershipPlans.map((item) => ({ ...item })) as AdminRecord[],
};


function announce() {
  window.dispatchEvent(new Event("ananda-demo-change"));
}

export function getAdminCollection(resource: AdminResource): AdminRecord[] {
  if (typeof window === "undefined") return seeds[resource].map((item) => ({ ...item }));
  const stored = window.localStorage.getItem(`${PREFIX}${resource}`);
  if (!stored) return seeds[resource].map((item) => ({ ...item }));
  try { return JSON.parse(stored) as AdminRecord[]; } catch { return seeds[resource].map((item) => ({ ...item })); }
}

export function saveAdminCollection(resource: AdminResource, records: AdminRecord[]) {
  window.localStorage.setItem(`${PREFIX}${resource}`, JSON.stringify(records));
  announce();
}

export function upsertAdminRecord(resource: AdminResource, record: AdminRecord) {
  const current = getAdminCollection(resource);
  const exists = current.some((item) => item.id === record.id);
  saveAdminCollection(resource, exists ? current.map((item) => item.id === record.id ? record : item) : [record, ...current]);
}

export function deleteAdminRecord(resource: AdminResource, id: string) {
  saveAdminCollection(resource, getAdminCollection(resource).filter((item) => item.id !== id));
}

export function getAdminMembershipPlans(): MembershipPlan[] {
  return getAdminCollection("plans").map((item) => ({
    id: String(item.id),
    name: String(item.name),
    description: String(item.description),
    price: Number(item.price),
    durationDays: Number(item.durationDays),
    sessionsPerMonth: item.sessionsPerMonth === null ? null : Number(item.sessionsPerMonth),
    benefits: Array.isArray(item.benefits) ? item.benefits.map(String) : [],
    featured: Boolean(item.featured),
  }));
}

export function getStudioSessions(): (typeof sessions) {
  const rawRecords = getAdminCollection("sessions");
  return rawRecords.map((item) => {
    const startsAt = String(item.startsAt ?? "");
    let date = item.date ? String(item.date) : "";
    let startTime = item.startTime ? String(item.startTime) : "";
    if ((!date || !startTime) && startsAt) {
      const d = new Date(startsAt);
      if (!isNaN(d.getTime())) {
        const parts = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(d);
        date = parts;
        startTime = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(d);
      }
    }

    return {
      id: String(item.id),
      classId: String(item.classId),
      instructorId: String(item.instructorId),
      date: date || "2026-09-16",
      startTime: startTime || "07:00",
      endTime: item.endTime ? String(item.endTime) : undefined,
      startsAt: startsAt || `${date || "2026-09-16"}T${startTime || "07:00"}:00+05:30`,
      capacity: Number(item.capacity ?? 12),
      bookedSeats: Number(item.bookedSeats ?? 0),
      status: (item.status as "scheduled" | "completed" | "cancelled") ?? "scheduled",
      notes: item.notes ? String(item.notes) : undefined,
    };
  });
}

export function upsertStudioSession(session: (typeof sessions)[number]) {
  upsertAdminRecord("sessions", session as unknown as AdminRecord);
}

export function deleteStudioSession(id: string) {
  deleteAdminRecord("sessions", id);
}

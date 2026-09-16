"use client";

import type { StudioSettings } from "@/types/admin";

const SETTINGS_KEY = "ananda-operations-settings";

export const defaultStudioSettings: StudioSettings = {
  studioName: "Ananda Yoga Studio", address: "12 Indiranagar Main Road, Bengaluru", phone: "+91 80 4000 2200",
  email: "hello@anandayoga.demo", whatsapp: "+91 90000 22000", bookingCutoffHours: 2, trialPrice: 500,
  timezone: "Asia/Kolkata", emailEnabled: true, whatsappEnabled: true,
};

export function getStudioSettings(): StudioSettings {
  if (typeof window === "undefined") return defaultStudioSettings;
  const stored = window.localStorage.getItem(SETTINGS_KEY);
  if (!stored) return defaultStudioSettings;
  try { return JSON.parse(stored) as StudioSettings; } catch { return defaultStudioSettings; }
}

export function saveStudioSettings(settings: StudioSettings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("ananda-demo-change"));
}

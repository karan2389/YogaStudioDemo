"use client";

import { useEffect, useState } from "react";
import { getDemoSession } from "@/services/demo-storage";
import type { DemoSessionState } from "@/types/demo";

export function useDemoSession() {
  const [session, setSession] = useState<DemoSessionState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => { setSession(getDemoSession()); setReady(true); };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("ananda-demo-change", sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener("ananda-demo-change", sync); };
  }, []);

  return { session, ready };
}

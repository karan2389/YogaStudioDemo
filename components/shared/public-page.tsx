import type { ReactNode } from "react";
import { DemoIndicator } from "@/components/shared/demo-indicator";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export function PublicPage({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf8f1] text-[#17362d]">
      <DemoIndicator />
      <Header />
      {children}
      <Footer />
    </main>
  );
}

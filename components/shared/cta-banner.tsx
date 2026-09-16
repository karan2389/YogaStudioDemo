import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export function CtaBanner({ title = "Begin with one class.", copy = "Come as you are. We’ll help you choose a session that feels right.", href = "/schedule", action = "View the schedule" }: { title?: string; copy?: string; href?: string; action?: string }) {
  return (
    <section className="border-t border-[#17362d]/10 bg-[#edf0e9] py-14 sm:py-16">
      <Container className="flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
        <div><h2 className="font-display text-4xl tracking-[-0.035em]">{title}</h2><p className="mt-2 text-[#65756e]">{copy}</p></div>
        <Button asChild size="lg" className="h-12 shrink-0 rounded-full bg-[#254d3f] px-6 text-white"><Link href={href}>{action}<ArrowRight /></Link></Button>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ClassCard } from "@/components/shared/class-card";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { PublicPage } from "@/components/shared/public-page";
import { getInstructor, yogaClasses } from "@/data/mock-data";

export const metadata: Metadata = {
  title: "Yoga Classes | Ananda Yoga",
  description: "Explore Hatha, Vinyasa, Power Yoga, beginner, breathwork and mobility classes.",
};

export default function ClassesPage() {
  return (
    <PublicPage>
      <PageHero eyebrow="Explore classes" title="Choose the practice your day needs." copy="Build strong foundations, find a lively flow or slow down with breathwork. Every class includes options and attentive guidance." aside={<Link href="/schedule" className="inline-flex items-center gap-2 rounded-full bg-[#254d3f] px-6 py-3 text-sm font-bold text-white">View live schedule <ArrowRight className="size-4" /></Link>} />
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mb-10 flex flex-wrap gap-2" aria-label="Class categories">
            {["All classes", "Foundations", "Flow", "Strength", "Restoration"].map((category, index) => <span key={category} className={`rounded-full px-4 py-2 text-sm font-semibold ${index === 0 ? "bg-[#254d3f] text-white" : "border border-[#17362d]/12 bg-white text-[#4f655c]"}`}>{category}</span>)}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {yogaClasses.map((item) => <ClassCard key={item.id} item={item} instructor={getInstructor(item.instructorId)} image={item.image} />)}
          </div>
          <div className="mt-12 rounded-[1.5rem] border border-[#a65f3d]/25 bg-[#f5e7dd] p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-9">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a65f3d]">New student offer</p><h2 className="mt-2 font-display text-3xl">Your first eligible class is ₹500.</h2><p className="mt-2 text-sm text-[#65756e]">A simple way to experience the studio before choosing a plan.</p></div>
            <Link href="/schedule" className="mt-5 inline-flex shrink-0 items-center gap-2 font-bold text-[#8b4a2e] sm:mt-0">Find a trial session <ArrowRight className="size-4" /></Link>
          </div>
        </Container>
      </section>
      <CtaBanner title="Not sure which class fits?" copy="Beginner Yoga and Hatha are both welcoming places to start." href="/contact" action="Ask the studio" />
    </PublicPage>
  );
}

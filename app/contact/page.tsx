import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { PublicPage } from "@/components/shared/public-page";

export const metadata: Metadata = {
  title: "Contact the Studio | Ananda Yoga",
  description: "Contact Ananda Yoga Studio, view demo opening hours and find the Bengaluru studio.",
};

const details = [
  { icon: MapPin, label: "Visit", value: "21 Serenity Lane, Indiranagar, Bengaluru 560038" },
  { icon: Phone, label: "Call", value: "+91 80000 12345" },
  { icon: Mail, label: "Email", value: "hello@anandayoga.demo" },
  { icon: MessageCircle, label: "WhatsApp", value: "+91 80000 12345" },
];

export default function ContactPage() {
  return (
    <PublicPage>
      <PageHero eyebrow="Contact" title="Questions are welcome." copy="Choosing a first class or the right membership should feel simple. Tell us what you need and the studio team will point you in the right direction." />
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <div className="grid gap-3">{details.map(({ icon: Icon, label, value }) => <div key={label} className="flex gap-4 rounded-[1.25rem] border border-[#17362d]/10 bg-white p-5"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e8ede6] text-[#a65f3d]"><Icon className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#738078]">{label}</p><p className="mt-1 text-sm font-semibold leading-6">{value}</p></div></div>)}</div>
            <div className="mt-6 rounded-[1.25rem] bg-[#17362d] p-6 text-white"><Clock3 className="size-5 text-[#dfb77e]" /><h2 className="mt-4 font-display text-2xl">Studio hours</h2><div className="mt-4 grid gap-2 text-sm text-[#c4d1ca]"><p className="flex justify-between gap-4"><span>Monday–Friday</span><span>6:30 AM–9:00 PM</span></p><p className="flex justify-between gap-4"><span>Saturday</span><span>7:00 AM–6:00 PM</span></p><p className="flex justify-between gap-4"><span>Sunday</span><span>7:00 AM–12:00 PM</span></p></div></div>
            <p className="mt-5 text-xs leading-5 text-[#738078]">Address, contact channels and opening hours are representative demo content.</p>
          </div>
          <ContactForm />
        </Container>
      </section>
      <section className="bg-[#edf0e9] py-14 sm:py-16"><Container><div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a65f3d]">Finding the studio</p><h2 className="mt-3 font-display text-4xl">Quietly tucked into the neighbourhood.</h2><p className="mt-4 max-w-xl text-[#65756e]">The demo studio is shown in Indiranagar, close to public transport, cafés and residential streets. A real map integration can be added with the production location.</p></div><div className="relative min-h-[250px] overflow-hidden rounded-[1.5rem] bg-[#d8e0d7]"><img src="/hero.jpg" alt="Peaceful interior representing the Ananda yoga studio" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-[#17362d]/20" /><div className="absolute inset-0 grid place-items-center"><span className="rounded-full bg-[#fbf8f1] px-5 py-3 text-sm font-bold shadow-xl">Ananda Yoga · Demo location</span></div></div></div></Container></section>
    </PublicPage>
  );
}

import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { Container } from "@/components/shared/container";

const details = [
  [MapPin, "21 Serenity Lane, Indiranagar, Bengaluru"],
  [Phone, "+91 80000 12345"],
  [Mail, "hello@anandayoga.demo"],
  [MessageCircle, "WhatsApp: +91 80000 12345"],
] as const;

export function Footer() {
  return (
    <footer id="contact" className="bg-[#132f27] py-14 text-[#e9eee8] sm:py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_auto]">
          <div>
            <Brand inverse />
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#b8c7bf]">A considered space for movement, breath and lasting wellbeing—wherever you are in your practice.</p>
            <p className="mt-4 text-xs text-[#8fa298]">Studio name and contact details are sample content for this client demo.</p>
          </div>
          <div className="grid gap-3">
            {details.map(([Icon, value]) => <div key={value} className="flex items-center gap-3 text-sm text-[#c9d4ce]"><Icon className="size-4 text-[#d9ad72]" />{value}</div>)}
          </div>
          <nav aria-label="Legal" className="flex flex-col gap-3 text-sm text-[#c9d4ce]">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/refund-policy" className="hover:text-white">Refund Policy</Link>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#8fa298] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Ananda Yoga Studio. Demo experience.</p>
          <p>Photography from Unsplash · Olga Pukhalskaya, Vitaly Gariev & Aparna Johri</p>
        </div>
      </Container>
    </footer>
  );
}

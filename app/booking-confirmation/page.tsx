import type { Metadata } from "next";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { Container } from "@/components/shared/container";
import { PublicPage } from "@/components/shared/public-page";

export const metadata: Metadata = { title: "Booking Confirmed | Ananda Yoga Demo", description: "Confirmation for a simulated Ananda Yoga booking." };

export default function BookingConfirmationPage() {
  return <PublicPage><section className="bg-[#f3eee5] py-12 sm:py-16"><Container className="max-w-3xl"><BookingConfirmation /></Container></section></PublicPage>;
}

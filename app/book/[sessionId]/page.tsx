import type { Metadata } from "next";
import { BookingSessionClient } from "@/components/booking/booking-session-client";
import { PublicPage } from "@/components/shared/public-page";
import { sessions } from "@/data/mock-data";

export const metadata: Metadata = {
  title: "Book a Session | Ananda Yoga Demo",
  description: "Complete a simulated yoga session booking and demo payment.",
};

export function generateStaticParams() {
  return sessions.map((session) => ({ sessionId: session.id }));
}

export default async function BookSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const initialSession = sessions.find((item) => item.id === sessionId);

  return (
    <PublicPage>
      <section className="py-10 sm:py-16">
        <BookingSessionClient sessionId={sessionId} initialSession={initialSession} />
      </section>
    </PublicPage>
  );
}

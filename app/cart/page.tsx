import type { Metadata } from "next";
import { CartCheckoutFlow } from "@/components/cart/cart-checkout-flow";
import { PublicPage } from "@/components/shared/public-page";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Checkout | Ananda Yoga",
  description: "Complete your multi-session booking securely.",
};

export default function CartPage() {
  return (
    <PublicPage>
      <section className="bg-[#fcf8f5] py-16 sm:py-24 min-h-screen">
        <Container>
          <div className="mx-auto max-w-2xl">
            <CartCheckoutFlow />
          </div>
        </Container>
      </section>
    </PublicPage>
  );
}

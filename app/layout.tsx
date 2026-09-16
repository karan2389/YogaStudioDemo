import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ananda Yoga Studio | Move, Breathe, Belong",
  description: "Small-group yoga classes, caring instructors and flexible monthly memberships in Bengaluru.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

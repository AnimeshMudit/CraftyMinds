import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Track Your Order | Crafty Mind Studio",
  description: "Track the shipping status of your handcrafted orders from Crafty Mind Studio securely with your order number and phone number.",
  alternates: {
    canonical: getCanonicalUrl("/track-order"),
  },
  openGraph: {
    title: "Track Your Order | Crafty Mind Studio",
    description: "Track the shipping status of your handcrafted orders from Crafty Mind Studio securely with your order number and phone number.",
  },
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

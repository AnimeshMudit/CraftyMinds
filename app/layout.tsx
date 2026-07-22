import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";

export const metadata: Metadata = {
  title: "Crafty Mind Studio | Handcrafted with Love",
  description: "Beautiful hand-painted MDF Board Arts, hand-painted pouches, and adorable fridge magnets. Lovingly handmade by a real artisan. Order securely on our website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground min-h-screen flex flex-col font-sans"
        suppressHydrationWarning
      >
        <CustomerAuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}

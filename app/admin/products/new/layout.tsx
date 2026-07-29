import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product | Crafty Minds Admin",
  description: "Create a new handmade creation in the store inventory.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AddProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

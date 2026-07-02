export interface Product {
  id: string;
  title: string;
  price: number;
  category: "mdf" | "pouch" | "magnet";
  description: string;
  image_url: string;
  featured: boolean;
  customizable: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: "mdf" | "pouch" | "magnet" | "rakhis";
  description: string;
  image_url: string;
  featured: boolean;
  customizable: boolean;
  specifications?: Specification[];
  created_at?: string;
  updated_at?: string;
}

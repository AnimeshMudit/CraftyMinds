import { Product } from "./product";

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string;
  email: string;
  phone: string;
  house_flat: string;
  street: string;
  landmark: string | null;
  city: string;
  state: string;
  pin_code: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  payment_status: "pending" | "paid" | "failed";
  order_status: "pending" | "processing" | "shipped" | "delivered";
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  updated_at?: string;
  user_id?: string | null;
}

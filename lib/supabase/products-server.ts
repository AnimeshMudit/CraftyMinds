import { createServerSupabaseClient } from "./server";
import { Product } from "@/types/product";

/**
 * Normalizes and parses the specifications field from the database to ensure it's always an array.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseProduct(product: any): Product {
  if (!product) return product;
  let specifications = product.specifications;
  if (typeof specifications === "string") {
    try {
      specifications = JSON.parse(specifications);
    } catch {
      specifications = [];
    }
  }
  return {
    ...product,
    specifications: Array.isArray(specifications) ? specifications : [],
  };
}

/**
 * Fetch all products from the products table on the server, ordered by created_at desc.
 */
export async function getProductsServer(): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Server error fetching products:", error);
    throw new Error(error.message);
  }

  return (data || []).map(parseProduct);
}

/**
 * Fetch a single product by its ID on the server.
 */
export async function getProductServer(id: string): Promise<Product | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Server error fetching product ${id}:`, error);
    throw new Error(error.message);
  }

  return data ? parseProduct(data) : null;
}

/**
 * Create a new product on the server.
 */
export async function createProductServer(
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<Product> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error("Server error creating product:", error);
    throw new Error(error.message);
  }

  return parseProduct(data);
}

/**
 * Update an existing product by ID on the server.
 */
export async function updateProductServer(
  id: string,
  product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
): Promise<Product> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Server error updating product ${id}:`, error);
    throw new Error(error.message);
  }

  return parseProduct(data);
}

/**
 * Delete a product by ID on the server.
 */
export async function deleteProductServer(id: string): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Server error deleting product ${id}:`, error);
    throw new Error(error.message);
  }
}

/**
 * Upload an image file to the 'product-images' bucket in Supabase Storage on the server.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImageServer(
  fileBuffer: Buffer | ArrayBuffer,
  filename: string,
  contentType: string
): Promise<string> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage
    .from("product-images")
    .upload(filename, fileBuffer, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Server error uploading image to storage:", error);
    throw new Error(error.message);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(filename);

  return publicUrl;
}

/**
 * Delete an image from Supabase Storage by parsing the public URL on the server.
 */
export async function deleteImageServer(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  const parts = imageUrl.split("/product-images/");
  if (parts.length <= 1) {
    console.warn("Could not parse image filename from URL on server:", imageUrl);
    return;
  }

  const filename = decodeURIComponent(parts[1]);
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage
    .from("product-images")
    .remove([filename]);

  if (error) {
    console.error("Server error deleting image from storage:", error);
    throw new Error(error.message);
  }
}

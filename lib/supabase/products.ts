import { supabase } from "@/lib/supabase";
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
 * Fetch all products from the products table, ordered by created_at desc.
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message);
  }

  return (data || []).map(parseProduct);
}

/**
 * Fetch a single product by its ID.
 */
export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error(error.message);
  }

  return data ? parseProduct(data) : null;
}

/**
 * Create a new product.
 */
export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw new Error(error.message);
  }

  return parseProduct(data);
}

/**
 * Update an existing product by ID.
 */
export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating product ${id}:`, error);
    throw new Error(error.message);
  }

  return parseProduct(data);
}


/**
 * Delete a product by ID.
 */
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw new Error(error.message);
  }
}

/**
 * Upload an image file to the 'product-images' bucket in Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(file: File): Promise<string> {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const filename = `${timestamp}_${sanitizedName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image to storage:", error);
    throw new Error(error.message);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(filename);

  return publicUrl;
}

/**
 * Delete an image from Supabase Storage by parsing the public URL.
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  const parts = imageUrl.split("/product-images/");
  if (parts.length <= 1) {
    console.warn("Could not parse image filename from URL:", imageUrl);
    return;
  }

  const filename = decodeURIComponent(parts[1]);

  const { error } = await supabase.storage
    .from("product-images")
    .remove([filename]);

  if (error) {
    console.error("Error deleting image from storage:", error);
    throw new Error(error.message);
  }
}

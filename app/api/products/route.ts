import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/utils/auth";
import { getProductsServer, createProductServer } from "@/lib/supabase/products-server";

export async function GET() {
  try {
    const products = await getProductsServer();
    return NextResponse.json(products);
  } catch (err) {
    console.error("GET /api/products error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, category, image_url, featured, customizable } = body;

    if (!title || !description || price === undefined || !category || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await createProductServer({
      title,
      description,
      price: Number(price),
      category,
      image_url,
      featured: !!featured,
      customizable: !!customizable,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("POST /api/products error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

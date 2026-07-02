import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/utils/auth";
import { updateProductServer, deleteProductServer, getProductServer, deleteImageServer } from "@/lib/supabase/products-server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  let id = "";
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    id = (await params).id;
    const body = await request.json();

    // Fetch existing product to get old image url
    const oldProduct = await getProductServer(id);

    // Update product
    const updatedProduct = await updateProductServer(id, body);

    // If update succeeded and image changed, delete old image from storage
    if (oldProduct && body.image_url && oldProduct.image_url !== body.image_url) {
      try {
        await deleteImageServer(oldProduct.image_url);
      } catch (err) {
        console.warn("Failed to delete old image from storage on server during update:", err);
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error(`PUT /api/products/${id} error:`, err);
    const errorMessage = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  let id = "";
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    id = (await params).id;

    // Fetch product to find its image_url before deleting
    const product = await getProductServer(id);

    // Delete from database
    await deleteProductServer(id);

    // Clean up image from storage if it exists
    if (product?.image_url) {
      try {
        await deleteImageServer(product.image_url);
      } catch (err) {
        console.warn("Failed to delete product image from storage on server:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/products/${id} error:`, err);
    const errorMessage = err instanceof Error ? err.message : "Failed to delete product";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

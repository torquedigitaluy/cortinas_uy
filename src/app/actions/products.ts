"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { productSchema, type ProductInput } from "@/lib/validations/product";

function revalidateProductPaths(categorySlug?: string, productSlug?: string) {
  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");
  if (categorySlug) revalidatePath(`/productos/${categorySlug}`);
  if (categorySlug && productSlug) {
    revalidatePath(`/productos/${categorySlug}/${productSlug}`);
  }
}

export async function createProduct(input: ProductInput) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Datos inválidos." };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(parsed.data)
    .select("id, slug, categories(slug)")
    .single();

  if (error) {
    const message = error.code === "23505" ? "Ese slug ya existe." : "No pudimos crear el producto.";
    return { success: false as const, error: message };
  }

  revalidateProductPaths(data.categories?.slug, data.slug);
  return { success: true as const, id: data.id };
}

export async function updateProduct(id: string, input: ProductInput) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Datos inválidos." };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update(parsed.data)
    .eq("id", id)
    .select("id, slug, categories(slug)")
    .single();

  if (error) {
    const message = error.code === "23505" ? "Ese slug ya existe." : "No pudimos actualizar el producto.";
    return { success: false as const, error: message };
  }

  revalidateProductPaths(data.categories?.slug, data.slug);
  return { success: true as const, id: data.id };
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { success: false as const, error: "No pudimos eliminar el producto." };
  }

  revalidateProductPaths();
  return { success: true as const };
}

export async function uploadProductImage(productId: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false as const, error: "Elegí una imagen." };
  }

  const supabase = createClient();

  const { data: existingImages } = await supabase
    .from("product_images")
    .select("id, storage_path")
    .eq("product_id", productId);

  if (existingImages && existingImages.length > 0) {
    await supabase.storage
      .from("product-images")
      .remove(existingImages.map((image) => image.storage_path));
    await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId);
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${productId}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { success: false as const, error: "No pudimos subir la imagen." };
  }

  const { error: insertError } = await supabase.from("product_images").insert({
    product_id: productId,
    storage_path: path,
    sort_order: 0,
  });

  if (insertError) {
    return { success: false as const, error: "No pudimos guardar la imagen." };
  }

  revalidateProductPaths();
  return { success: true as const };
}

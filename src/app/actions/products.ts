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

export async function uploadProductImages(productId: string, formData: FormData) {
  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    return { success: false as const, error: "Elegí al menos una imagen." };
  }

  const supabase = createClient();

  const { data: lastImage } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextSortOrder = (lastImage?.sort_order ?? -1) + 1;

  for (const file of files) {
    const extension = file.name.split(".").pop() ?? "jpg";
    const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      return { success: false as const, error: "No pudimos subir una de las imágenes." };
    }

    const { error: insertError } = await supabase.from("product_images").insert({
      product_id: productId,
      storage_path: path,
      sort_order: nextSortOrder,
    });

    if (insertError) {
      return { success: false as const, error: "No pudimos guardar una de las imágenes." };
    }

    nextSortOrder += 1;
  }

  revalidateProductPaths();
  return { success: true as const };
}

export async function deleteProductImage(imageId: string) {
  const supabase = createClient();

  const { data: image } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("id", imageId)
    .maybeSingle();

  if (!image) {
    return { success: false as const, error: "Imagen no encontrada." };
  }

  await supabase.storage.from("product-images").remove([image.storage_path]);

  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) {
    return { success: false as const, error: "No pudimos eliminar la imagen." };
  }

  revalidateProductPaths();
  return { success: true as const };
}

export async function reorderProductImages(productId: string, orderedImageIds: string[]) {
  const supabase = createClient();

  const results = await Promise.all(
    orderedImageIds.map((id, index) =>
      supabase
        .from("product_images")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("product_id", productId),
    ),
  );

  if (results.some((result) => result.error)) {
    return { success: false as const, error: "No pudimos reordenar las imágenes." };
  }

  revalidateProductPaths();
  return { success: true as const };
}

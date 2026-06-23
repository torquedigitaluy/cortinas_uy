"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";

function revalidateCategoryPaths() {
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/productos");
}

export async function createCategory(input: CategoryInput) {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Datos inválidos." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("categories").insert(parsed.data);

  if (error) {
    const message = error.code === "23505" ? "Ese slug ya existe." : "No pudimos crear la categoría.";
    return { success: false as const, error: message };
  }

  revalidateCategoryPaths();
  return { success: true as const };
}

export async function updateCategory(id: string, input: CategoryInput) {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Datos inválidos." };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    const message = error.code === "23505" ? "Ese slug ya existe." : "No pudimos actualizar la categoría.";
    return { success: false as const, error: message };
  }

  revalidateCategoryPaths();
  return { success: true as const };
}

export async function deleteCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    const message =
      error.code === "23503"
        ? "No se puede eliminar: tiene productos asociados."
        : "No pudimos eliminar la categoría.";
    return { success: false as const, error: message };
  }

  revalidateCategoryPaths();
  return { success: true as const };
}

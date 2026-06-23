import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  ProductCardData,
  ProductListItem,
  ProductWithCategory,
  ProductWithDetails,
} from "@/lib/types";

const PRODUCT_CARD_SELECT =
  "*, product_images(storage_path, alt_text, sort_order)";

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getFeaturedProducts(
  limit = 6,
): Promise<ProductListItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`${PRODUCT_CARD_SELECT}, categories(id, slug, name)`)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { foreignTable: "product_images" })
    .limit(limit);

  if (error) throw error;
  return data as unknown as ProductListItem[];
}

export async function getProductsByCategory(
  categoryId: string,
): Promise<ProductCardData[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("sort_order", { foreignTable: "product_images" })
    .order("name", { ascending: true });

  if (error) throw error;
  return data as unknown as ProductCardData[];
}

export async function getProductBySlug(
  slug: string,
): Promise<(ProductWithCategory & ProductWithDetails) | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, categories(id, slug, name), product_variants(*), product_images(*)",
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .order("sort_order", { foreignTable: "product_images" })
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProductWithCategory & ProductWithDetails;
}

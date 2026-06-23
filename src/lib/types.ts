import type { Database } from "@/lib/supabase/database.types";

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariant =
  Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductImage =
  Database["public"]["Tables"]["product_images"]["Row"];
export type ServiceRequest =
  Database["public"]["Tables"]["service_requests"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Membership = Database["public"]["Tables"]["memberships"]["Row"];
export type MembershipPayment =
  Database["public"]["Tables"]["membership_payments"]["Row"];
export type RemaxAgent = Database["public"]["Tables"]["remax_agents"]["Row"];

export type ProductWithCategory = Product & {
  categories: Pick<Category, "id" | "slug" | "name">;
};

export type ProductWithDetails = Product & {
  product_variants: ProductVariant[];
  product_images: ProductImage[];
};

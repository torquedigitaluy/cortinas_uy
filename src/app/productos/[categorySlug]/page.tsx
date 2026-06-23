import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/products/product-card";
import {
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/supabase/queries/products";

export async function generateMetadata({
  params,
}: {
  params: { categorySlug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.categorySlug);
  if (!category) return {};

  return {
    title: category.name,
    description:
      category.description ?? `Productos de la categoría ${category.name}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { categorySlug: string };
}) {
  const category = await getCategoryBySlug(params.categorySlug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">{category.name}</h1>
      {category.description && (
        <p className="mt-2 text-muted-foreground">{category.description}</p>
      )}

      {products.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categorySlug={category.slug}
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted-foreground">
          Todavía no hay productos cargados en esta categoría.
        </p>
      )}
    </div>
  );
}

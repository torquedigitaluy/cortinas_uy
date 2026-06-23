import type { Metadata } from "next";

import { CategoryCard } from "@/components/products/category-card";
import { getCategories } from "@/lib/supabase/queries/products";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Catálogo de cortinas, cerramientos, puertas plegables, mamparas y accesorios.",
};

export default async function ProductosPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Catálogo</h1>
      <p className="mt-2 text-muted-foreground">
        Elegí una categoría para ver los productos disponibles.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

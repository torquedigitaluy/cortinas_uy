import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/supabase/queries/products";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold">Nuevo producto</h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import {
  getCategories,
  getProductByIdForAdmin,
} from "@/lib/supabase/queries/products";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [categories, product] = await Promise.all([
    getCategories(),
    getProductByIdForAdmin(params.id),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Editar producto</h1>
      <div className="mt-6">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";

import { ServiceRequestForm } from "@/components/forms/service-request-form";
import {
  getCategoryBySlug,
  getProductBySlug,
} from "@/lib/supabase/queries/products";

export const metadata: Metadata = {
  title: "Solicitar presupuesto",
  description: "Solicitá presupuesto para instalación, reparación o mantenimiento.",
};

export default async function SolicitarPage({
  searchParams,
}: {
  searchParams: { categoria?: string; producto?: string };
}) {
  const [category, product] = await Promise.all([
    searchParams.categoria
      ? getCategoryBySlug(searchParams.categoria)
      : Promise.resolve(null),
    searchParams.producto
      ? getProductBySlug(searchParams.producto)
      : Promise.resolve(null),
  ]);

  const defaultMessage = product
    ? `Quiero presupuesto para: ${product.name}.`
    : undefined;

  return (
    <div className="container mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold">Solicitar presupuesto</h1>
      <p className="mt-2 text-muted-foreground">
        Completá tus datos y te contactamos a la brevedad.
      </p>

      <div className="mt-8">
        <ServiceRequestForm
          defaultProductCategoryId={category?.id}
          defaultMessage={defaultMessage}
        />
      </div>
    </div>
  );
}

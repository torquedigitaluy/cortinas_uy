import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/products/product-gallery";
import { VariantSelector } from "@/components/products/variant-selector";
import { getProductBySlug } from "@/lib/supabase/queries/products";

export async function generateMetadata({
  params,
}: {
  params: { categorySlug: string; productSlug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.productSlug);
  if (!product || product.categories.slug !== params.categorySlug) return {};

  return {
    title: product.name,
    description: product.short_description ?? product.description ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { categorySlug: string; productSlug: string };
}) {
  const product = await getProductBySlug(params.productSlug);
  if (!product || product.categories.slug !== params.categorySlug) {
    notFound();
  }

  const quoteUrl = `/servicios/solicitar?categoria=${product.categories.slug}&producto=${product.slug}`;

  return (
    <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2">
      <ProductGallery images={product.product_images} productName={product.name} />

      <div>
        <p className="text-sm text-muted-foreground">
          {product.categories.name}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>

        {product.description && (
          <p className="mt-4 text-muted-foreground">{product.description}</p>
        )}

        <div className="mt-6">
          <VariantSelector variants={product.product_variants} />
        </div>

        <Button size="lg" className="mt-8 w-full sm:w-auto" asChild>
          <Link href={quoteUrl}>Solicitar presupuesto</Link>
        </Button>
      </div>
    </div>
  );
}

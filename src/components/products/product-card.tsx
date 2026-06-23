import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ProductImage } from "@/components/products/product-image";
import type { ProductCardData } from "@/lib/types";

export function ProductCard({
  product,
  categorySlug,
}: {
  product: ProductCardData;
  categorySlug: string;
}) {
  const coverImage = product.product_images[0];

  return (
    <Link href={`/productos/${categorySlug}/${product.slug}`}>
      <Card className="h-full overflow-hidden transition-colors hover:border-primary">
        <ProductImage
          storagePath={coverImage?.storage_path}
          alt={coverImage?.alt_text ?? product.name}
          className="aspect-[4/3] w-full"
        />
        <CardContent className="pt-4">
          <CardTitle className="text-base">{product.name}</CardTitle>
          {product.short_description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {product.short_description}
            </p>
          )}
        </CardContent>
        <CardFooter>
          {product.base_price ? (
            <p className="text-sm font-semibold text-primary">
              Desde ${product.base_price.toLocaleString("es-UY")}
            </p>
          ) : (
            <p className="text-sm font-semibold text-muted-foreground">
              Consultar precio
            </p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

import { ProductImage } from "@/components/products/product-image";
import type { ProductImage as ProductImageRow } from "@/lib/types";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImageRow[];
  productName: string;
}) {
  const [main, ...rest] = images;

  return (
    <div>
      <ProductImage
        storagePath={main?.storage_path}
        alt={main?.alt_text ?? productName}
        className="aspect-square w-full rounded-lg border"
      />
      {rest.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {rest.map((image) => (
            <ProductImage
              key={image.id}
              storagePath={image.storage_path}
              alt={image.alt_text ?? productName}
              className="aspect-square w-full rounded-md border"
            />
          ))}
        </div>
      )}
    </div>
  );
}

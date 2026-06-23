import Image from "next/image";
import Link from "next/link";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/productos/${category.slug}`}>
      <Card className="h-full overflow-hidden transition-colors hover:border-primary">
        {category.image_url && (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
          {category.description && (
            <CardDescription>{category.description}</CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}

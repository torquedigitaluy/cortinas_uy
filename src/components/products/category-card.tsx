import Link from "next/link";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/productos/${category.slug}`}>
      <Card className="h-full transition-colors hover:border-primary">
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

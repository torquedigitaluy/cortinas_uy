import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { getAllProductsForAdmin } from "@/lib/supabase/queries/products";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button asChild>
          <Link href="/admin/productos/nuevo">Nuevo producto</Link>
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="p-2 font-medium">Nombre</th>
              <th className="p-2 font-medium">Categoría</th>
              <th className="p-2 font-medium">Precio</th>
              <th className="p-2 font-medium">Estado</th>
              <th className="p-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.categories.name}</td>
                <td className="p-2">
                  {product.base_price
                    ? `$${product.base_price.toLocaleString("es-UY")}`
                    : "—"}
                </td>
                <td className="p-2">
                  <div className="flex gap-1">
                    {product.is_active ? (
                      <Badge variant="secondary">Activo</Badge>
                    ) : (
                      <Badge variant="outline">Inactivo</Badge>
                    )}
                    {product.is_featured && <Badge>Destacado</Badge>}
                  </div>
                </td>
                <td className="p-2 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/productos/${product.id}/editar`}>
                      Editar
                    </Link>
                  </Button>
                  <DeleteProductButton id={product.id} name={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="mt-4 text-muted-foreground">No hay productos todavía.</p>
        )}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/admin/category-dialog";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { getCategories } from "@/lib/supabase/queries/products";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <CategoryDialog trigger={<Button>Nueva categoría</Button>} />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="p-2 font-medium">Nombre</th>
              <th className="p-2 font-medium">Slug</th>
              <th className="p-2 font-medium">Orden</th>
              <th className="p-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="p-2">{category.name}</td>
                <td className="p-2 text-muted-foreground">{category.slug}</td>
                <td className="p-2">{category.sort_order}</td>
                <td className="p-2 text-right">
                  <CategoryDialog
                    category={category}
                    trigger={
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    }
                  />
                  <DeleteCategoryButton id={category.id} name={category.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

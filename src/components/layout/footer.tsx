import Link from "next/link";

import { getCategories } from "@/lib/supabase/queries/products";
import { CONTACT_INFO, SITE_NAME } from "@/lib/constants";

export async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="border-t bg-secondary/40">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-primary">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Cortinas, cerramientos y servicios técnicos en Uruguay.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Catálogo</p>
          <ul className="mt-2 space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/productos/${category.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Contacto</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>{CONTACT_INFO.phone}</li>
            <li>{CONTACT_INFO.email}</li>
            <li>{CONTACT_INFO.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4">
        <p className="container mx-auto px-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}

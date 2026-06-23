import Link from "next/link";
import { CalendarCheck, Hammer, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/products/category-card";
import { ProductCard } from "@/components/products/product-card";
import {
  getCategories,
  getFeaturedProducts,
} from "@/lib/supabase/queries/products";

const SERVICES = [
  {
    icon: Hammer,
    title: "Instalación",
    description: "Instalamos cortinas, cerramientos y mamparas a medida.",
  },
  {
    icon: Wrench,
    title: "Reparación",
    description: "Arreglamos motores, rieles y mecanismos trabados.",
  },
  {
    icon: CalendarCheck,
    title: "Mantenimiento",
    description: "Mantenimiento preventivo para que no se rompan.",
  },
];

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div>
      <section className="border-b bg-secondary/30">
        <div className="container mx-auto flex flex-col items-start gap-6 px-4 py-16 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Cortinas, cerramientos y servicios técnicos en Uruguay
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Catálogo completo, instalación y reparación profesional, y una
            membresía de mantenimiento anual para que no tengas que pensarlo
            de nuevo.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/productos">Ver catálogo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/servicios/solicitar">Solicitar presupuesto</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold">Categorías</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold">Productos destacados</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categorySlug={product.categories.slug}
              />
            ))}
          </div>
        </section>
      )}

      <section className="border-t bg-secondary/30">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold">Servicios técnicos</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {SERVICES.map((service) => (
              <div key={service.title} className="rounded-lg border bg-background p-6">
                <service.icon className="size-8 text-primary" />
                <p className="mt-3 font-semibold">{service.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <Button className="mt-6" asChild>
            <Link href="/servicios">Conocer más sobre servicios</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="rounded-xl border bg-primary px-6 py-10 text-center text-primary-foreground sm:px-12">
          <h2 className="text-2xl font-bold">Membresía de mantenimiento</h2>
          <p className="mx-auto mt-2 max-w-xl text-primary-foreground/90">
            Mantenimiento anual con débito automático para que tus cortinas y
            cerramientos siempre funcionen.
          </p>
          <Button size="lg" variant="secondary" className="mt-6" asChild>
            <Link href="/membresia">Conocer la membresía</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

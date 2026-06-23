import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCategories } from "@/lib/supabase/queries/products";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-primary">
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) =>
            item.href === "/productos" ? (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1">
                    {item.label}
                    <ChevronDown className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/productos">Ver todo el catálogo</Link>
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link href={`/productos/${category.slug}`}>
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button key={item.href} variant="ghost" asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ),
          )}
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link href="/servicios/solicitar">Solicitar presupuesto</Link>
          </Button>
        </div>

        <MobileNav categories={categories} />
      </div>
    </header>
  );
}

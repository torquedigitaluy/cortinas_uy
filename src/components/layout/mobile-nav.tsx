"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import type { Category } from "@/lib/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" aria-label="Abrir menú">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-primary">{SITE_NAME}</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
          {categories.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">
                Categorías
              </p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/productos/${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </nav>
        <Button asChild className="mt-6 w-full" onClick={() => setOpen(false)}>
          <Link href="/servicios/solicitar">Solicitar presupuesto</Link>
        </Button>
      </SheetContent>
    </Sheet>
  );
}

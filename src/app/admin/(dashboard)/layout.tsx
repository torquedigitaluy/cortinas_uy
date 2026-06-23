import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/admin/logout-button";
import { getCurrentProfile } from "@/lib/supabase/queries/auth";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Categorías", href: "/admin/categorias" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Membresías", href: "/admin/membresias" },
] as const;

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r bg-secondary/30 p-4">
        <Link href="/admin" className="text-lg font-bold text-primary">
          Cortinas UY
        </Link>
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

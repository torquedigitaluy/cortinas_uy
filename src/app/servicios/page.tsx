import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Hammer, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Servicios técnicos",
  description:
    "Instalación, reparación y mantenimiento de cortinas, cerramientos y mamparas en Uruguay.",
};

const SERVICES = [
  {
    icon: Hammer,
    title: "Instalación",
    description:
      "Instalamos cortinas de enrollar, cortinas interiores, puertas plegables y mamparas a medida, con o sin albañilería según el producto.",
  },
  {
    icon: Wrench,
    title: "Reparación",
    description:
      "Reparamos motores, rieles, manijas y mecanismos trabados o rotos en cortinas y cerramientos existentes.",
  },
  {
    icon: CalendarCheck,
    title: "Mantenimiento",
    description:
      "Mantenimiento preventivo periódico para que tus cortinas y cerramientos funcionen sin sorpresas. Disponible también como membresía anual.",
  },
];

export default function ServiciosPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Servicios técnicos</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Trabajamos con técnicos propios para instalación, reparación y
        mantenimiento de cortinas, cerramientos y mamparas en todo Uruguay.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {SERVICES.map((service) => (
          <div key={service.title} className="rounded-lg border p-6">
            <service.icon className="size-8 text-primary" />
            <p className="mt-3 font-semibold">{service.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <Button size="lg" className="mt-8" asChild>
        <Link href="/servicios/solicitar">Solicitar presupuesto</Link>
      </Button>
    </div>
  );
}

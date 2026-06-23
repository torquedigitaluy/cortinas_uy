import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactanos por teléfono, email o WhatsApp.",
};

export default function ContactoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Contacto</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Escribinos por WhatsApp o dejanos tus datos y te contactamos a la
        brevedad para coordinar un presupuesto.
      </p>

      <div className="mt-8 space-y-3 text-sm">
        <p className="flex items-center gap-2">
          <Phone className="size-4 text-primary" /> {CONTACT_INFO.phone}
        </p>
        <p className="flex items-center gap-2">
          <Mail className="size-4 text-primary" /> {CONTACT_INFO.email}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="size-4 text-primary" /> {CONTACT_INFO.address}
        </p>
      </div>

      <Button size="lg" className="mt-8" asChild>
        <Link href="/servicios/solicitar">Solicitar presupuesto</Link>
      </Button>
    </div>
  );
}

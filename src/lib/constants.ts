export const SITE_NAME = "Cortinas UY";

export const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/productos" },
  { label: "Servicios", href: "/servicios" },
  { label: "Membresía", href: "/membresia" },
  { label: "RE/MAX", href: "/remax" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const CONTACT_INFO = {
  phone: "+598 99 123 456",
  email: "info@cortinas.uy",
  address: "Montevideo, Uruguay",
} as const;

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola, me gustaría recibir más información sobre sus productos y servicios.";

export function getWhatsappUrl(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${number}?${params.toString()}`;
}

export const URUGUAY_DEPARTMENTS = [
  "Artigas",
  "Canelones",
  "Cerro Largo",
  "Colonia",
  "Durazno",
  "Flores",
  "Florida",
  "Lavalleja",
  "Maldonado",
  "Montevideo",
  "Paysandú",
  "Río Negro",
  "Rivera",
  "Rocha",
  "Salto",
  "San José",
  "Soriano",
  "Tacuarembó",
  "Treinta y Tres",
] as const;

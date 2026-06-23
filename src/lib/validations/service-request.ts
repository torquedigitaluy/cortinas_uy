import { z } from "zod";

import { URUGUAY_DEPARTMENTS } from "@/lib/constants";

export const SERVICE_TYPES = [
  { value: "instalacion", label: "Instalación" },
  { value: "reparacion", label: "Reparación" },
  { value: "mantenimiento", label: "Mantenimiento" },
] as const;

export const serviceRequestSchema = z.object({
  service_type: z.enum(
    ["instalacion", "reparacion", "mantenimiento"],
    "Elegí un tipo de servicio",
  ),
  full_name: z.string().min(2, "Ingresá tu nombre completo"),
  phone: z
    .string()
    .min(6, "Ingresá un teléfono válido")
    .regex(/^[0-9+\s-]+$/, "Ingresá un teléfono válido"),
  email: z.union([z.literal(""), z.string().email("Email inválido")]).optional(),
  address: z.string().optional(),
  department: z.enum(URUGUAY_DEPARTMENTS, "Elegí un departamento"),
  product_category_id: z.string().uuid().optional().or(z.literal("")),
  message: z.string().optional(),
  is_remax_referral: z.boolean(),
});

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;

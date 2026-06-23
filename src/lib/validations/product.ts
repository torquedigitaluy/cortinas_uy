import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Ingresá un nombre"),
  slug: z
    .string()
    .min(2, "Ingresá un slug")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  category_id: z.string().uuid("Elegí una categoría"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  base_price: z.number().min(0).optional(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
});

export type ProductInput = z.infer<typeof productSchema>;

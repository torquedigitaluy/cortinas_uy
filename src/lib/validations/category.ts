import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Ingresá un nombre"),
  slug: z
    .string()
    .min(2, "Ingresá un slug")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  description: z.string().optional(),
  sort_order: z.number().int(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

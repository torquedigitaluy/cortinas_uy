"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ServiceRequest } from "@/lib/types";
import {
  serviceRequestSchema,
  type ServiceRequestInput,
} from "@/lib/validations/service-request";

export async function createServiceRequest(input: ServiceRequestInput) {
  const parsed = serviceRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Datos inválidos." };
  }

  const { email, product_category_id, ...rest } = parsed.data;

  const supabase = createClient();
  const { error } = await supabase.from("service_requests").insert({
    ...rest,
    email: email || null,
    product_category_id: product_category_id || null,
  });

  if (error) {
    return { success: false as const, error: "No pudimos enviar tu solicitud. Probá de nuevo." };
  }

  return { success: true as const };
}

export async function updateServiceRequestStatus(
  id: string,
  status: ServiceRequest["status"],
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("service_requests")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { success: false as const, error: "No pudimos actualizar el estado." };
  }

  revalidatePath("/admin/leads");
  return { success: true as const };
}

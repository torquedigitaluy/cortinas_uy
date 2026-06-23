import { createClient } from "@/lib/supabase/server";
import type { ServiceRequest } from "@/lib/types";

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

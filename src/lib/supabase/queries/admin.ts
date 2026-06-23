import { createClient } from "@/lib/supabase/server";

export async function getDashboardMetrics() {
  const supabase = createClient();

  const [newLeads, activeMemberships] = await Promise.all([
    supabase
      .from("service_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "nuevo"),
    supabase
      .from("memberships")
      .select("*", { count: "exact", head: true })
      .eq("status", "activa"),
  ]);

  return {
    newLeadsCount: newLeads.count ?? 0,
    activeMembershipsCount: activeMemberships.count ?? 0,
  };
}

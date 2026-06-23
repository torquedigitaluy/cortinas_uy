import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardMetrics } from "@/lib/supabase/queries/admin";

export default async function AdminDashboardPage() {
  const { newLeadsCount, activeMembershipsCount } = await getDashboardMetrics();

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leads nuevos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{newLeadsCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Membresías activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeMembershipsCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

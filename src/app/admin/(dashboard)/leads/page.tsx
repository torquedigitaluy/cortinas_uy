import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { getServiceRequests } from "@/lib/supabase/queries/leads";

const SERVICE_TYPE_LABELS: Record<string, string> = {
  instalacion: "Instalación",
  reparacion: "Reparación",
  mantenimiento: "Mantenimiento",
};

export default async function AdminLeadsPage() {
  const leads = await getServiceRequests();

  return (
    <div>
      <h1 className="text-2xl font-bold">Leads</h1>

      {leads.length === 0 ? (
        <p className="mt-6 text-muted-foreground">No hay leads todavía.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-2 font-medium">Fecha</th>
                <th className="p-2 font-medium">Nombre</th>
                <th className="p-2 font-medium">Teléfono</th>
                <th className="p-2 font-medium">Servicio</th>
                <th className="p-2 font-medium">Departamento</th>
                <th className="p-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b">
                  <td className="whitespace-nowrap p-2">
                    {new Date(lead.created_at).toLocaleDateString("es-UY")}
                  </td>
                  <td className="p-2">{lead.full_name}</td>
                  <td className="whitespace-nowrap p-2">{lead.phone}</td>
                  <td className="p-2">
                    {SERVICE_TYPE_LABELS[lead.service_type] ?? lead.service_type}
                  </td>
                  <td className="p-2">{lead.department}</td>
                  <td className="p-2">
                    <LeadStatusSelect id={lead.id} status={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

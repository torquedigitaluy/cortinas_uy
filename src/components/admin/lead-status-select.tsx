"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateServiceRequestStatus } from "@/app/actions/service-requests";
import type { ServiceRequest } from "@/lib/types";

const STATUS_OPTIONS: { value: ServiceRequest["status"]; label: string }[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "contactado", label: "Contactado" },
  { value: "agendado", label: "Agendado" },
  { value: "resuelto", label: "Resuelto" },
  { value: "descartado", label: "Descartado" },
];

export function LeadStatusSelect({
  id,
  status,
}: {
  id: string;
  status: ServiceRequest["status"];
}) {
  const { toast } = useToast();
  const [value, setValue] = useState(status);
  const [isPending, setIsPending] = useState(false);

  async function handleChange(next: ServiceRequest["status"]) {
    setValue(next);
    setIsPending(true);
    const result = await updateServiceRequestStatus(id, next);
    setIsPending(false);

    if (!result.success) {
      setValue(status);
      toast({
        title: "Ocurrió un error",
        description: result.error,
        variant: "destructive",
      });
    }
  }

  return (
    <Select
      value={value}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

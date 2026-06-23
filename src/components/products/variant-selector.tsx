"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductVariant } from "@/lib/types";

export function VariantSelector({ variants }: { variants: ProductVariant[] }) {
  const defaultVariant = variants.find((v) => v.is_default) ?? variants[0];
  const [selectedId, setSelectedId] = useState(defaultVariant?.id);
  const selected = variants.find((v) => v.id === selectedId) ?? defaultVariant;

  if (variants.length === 0 || !selected) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Medida</label>
      <Select value={selectedId} onValueChange={setSelectedId}>
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Elegí una medida" />
        </SelectTrigger>
        <SelectContent>
          {variants.map((variant) => (
            <SelectItem key={variant.id} value={variant.id}>
              {variant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-2xl font-bold text-primary">
        ${selected.price.toLocaleString("es-UY")}
      </p>
    </div>
  );
}

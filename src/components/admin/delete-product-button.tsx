"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteProduct } from "@/app/actions/products";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsPending(true);
    const result = await deleteProduct(id);
    setIsPending(false);

    if (!result.success) {
      toast({
        title: "Ocurrió un error",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Producto eliminado" });
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      Eliminar
    </Button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteCategory } from "@/app/actions/categories";

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsPending(true);
    const result = await deleteCategory(id);
    setIsPending(false);

    if (!result.success) {
      toast({
        title: "Ocurrió un error",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Categoría eliminada" });
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

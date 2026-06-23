"use client";

import { useEffect, useState, type MutableRefObject } from "react";
import { GripVertical, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  deleteProductImage,
  reorderProductImages,
  uploadProductImages,
} from "@/app/actions/products";
import { getProductImageUrl } from "@/lib/supabase/storage";
import type { ProductImage } from "@/lib/types";

type PendingImage = {
  id: string;
  kind: "pending";
  file: File;
  previewUrl: string;
};

type SavedImage = {
  id: string;
  kind: "saved";
  storagePath: string;
};

type ManagedImage = PendingImage | SavedImage;

function toManaged(images: ProductImage[]): ManagedImage[] {
  return images
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => ({ id: image.id, kind: "saved" as const, storagePath: image.storage_path }));
}

// Las imágenes pendientes (productos todavía no creados) solo viven en memoria del
// browser hasta que el form padre llama uploadProductImages tras crear el producto;
// por eso expone los File originales vía pendingFilesRef en vez de un callback.
export function ProductImageManager({
  productId,
  initialImages,
  pendingFilesRef,
}: {
  productId: string | null;
  initialImages: ProductImage[];
  pendingFilesRef: MutableRefObject<File[]>;
}) {
  const { toast } = useToast();
  const [images, setImages] = useState<ManagedImage[]>(() => toManaged(initialImages));
  const [isUploading, setIsUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const syncKey = initialImages.map((image) => `${image.id}:${image.sort_order}`).join(",");

  useEffect(() => {
    setImages(toManaged(initialImages));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncKey]);

  useEffect(() => {
    pendingFilesRef.current = images
      .filter((image): image is PendingImage => image.kind === "pending")
      .map((image) => image.file);
  }, [images, pendingFilesRef]);

  async function handleAddFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    if (!productId) {
      setImages((prev) => [
        ...prev,
        ...files.map((file) => ({
          id: `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          kind: "pending" as const,
          file,
          previewUrl: URL.createObjectURL(file),
        })),
      ]);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const result = await uploadProductImages(productId, formData);
    setIsUploading(false);

    if (!result.success) {
      toast({
        title: "No pudimos subir las imágenes",
        description: result.error,
        variant: "destructive",
      });
    }
  }

  async function handleDelete(image: ManagedImage) {
    setImages((prev) => prev.filter((img) => img.id !== image.id));

    if (image.kind === "pending") {
      URL.revokeObjectURL(image.previewUrl);
      return;
    }

    const result = await deleteProductImage(image.id);
    if (!result.success) {
      toast({
        title: "No pudimos eliminar la imagen",
        description: result.error,
        variant: "destructive",
      });
      setImages(toManaged(initialImages));
    }
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }

    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setImages(reordered);
    setDragIndex(null);

    if (productId) {
      const savedIds = reordered
        .filter((img): img is SavedImage => img.kind === "saved")
        .map((img) => img.id);

      reorderProductImages(productId, savedIds).then((result) => {
        if (!result.success) {
          toast({
            title: "No pudimos guardar el orden",
            description: result.error,
            variant: "destructive",
          });
        }
      });
    }
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="product-images">Imágenes</Label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, index) => {
            const src =
              image.kind === "pending" ? image.previewUrl : getProductImageUrl(image.storagePath);

            return (
              <div
                key={image.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="group relative aspect-square cursor-grab overflow-hidden rounded-md border bg-muted active:cursor-grabbing"
              >
                {src ? (
                  // El admin maneja previews locales (blob:) y fotos del bucket en la misma
                  // grilla; next/image no optimiza blob: URLs, así que se usa <img> simple.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="h-full w-full object-cover" />
                ) : null}
                <div className="absolute left-1 top-1 rounded bg-background/80 p-0.5 text-foreground/70">
                  <GripVertical className="size-4" />
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(image)}
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-foreground/70 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  aria-label="Eliminar imagen"
                >
                  <X className="size-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                    Portada
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Input
        id="product-images"
        type="file"
        accept="image/*"
        multiple
        disabled={isUploading}
        onChange={(e) => {
          handleAddFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <p className="text-xs text-muted-foreground">
        Arrastrá las imágenes para reordenarlas. La primera es la portada del producto.
      </p>
    </div>
  );
}

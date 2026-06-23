import Image from "next/image";
import { ImageOff } from "lucide-react";

import { getProductImageUrl } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";

export function ProductImage({
  storagePath,
  alt,
  className,
}: {
  storagePath: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const url = storagePath ? getProductImageUrl(storagePath) : null;

  if (!url) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground",
          className,
        )}
      >
        <ImageOff className="size-8" />
        <span className="text-xs">Imagen próximamente</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={url}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}

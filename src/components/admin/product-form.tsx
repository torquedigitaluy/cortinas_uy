"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createProduct, updateProduct, uploadProductImages } from "@/app/actions/products";
import { ProductImageManager } from "@/components/admin/product-image-manager";
import { slugify } from "@/lib/utils";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import type { Category, ProductWithCategory, ProductWithDetails } from "@/lib/types";

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductWithCategory & ProductWithDetails;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = Boolean(product);
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const pendingImageFiles = useRef<File[]>([]);

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      category_id: product?.category_id ?? "",
      short_description: product?.short_description ?? "",
      description: product?.description ?? "",
      base_price: product?.base_price ?? undefined,
      is_featured: product?.is_featured ?? false,
      is_active: product?.is_active ?? true,
    },
  });

  async function onSubmit(values: ProductInput) {
    const result = isEditing
      ? await updateProduct(product!.id, values)
      : await createProduct(values);

    if (!result.success) {
      toast({
        title: "Ocurrió un error",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    const productId = isEditing ? product!.id : result.id;

    if (!isEditing && pendingImageFiles.current.length > 0 && productId) {
      const formData = new FormData();
      pendingImageFiles.current.forEach((file) => formData.append("files", file));
      const imageResult = await uploadProductImages(productId, formData);
      if (!imageResult.success) {
        toast({
          title: "Producto guardado, pero las imágenes fallaron",
          description: imageResult.error,
          variant: "destructive",
        });
      }
    }

    toast({ title: isEditing ? "Producto actualizado" : "Producto creado" });
    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!slugTouched) {
                      form.setValue("slug", slugify(e.target.value));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    setSlugTouched(true);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Elegí una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="short_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción corta</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="base_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio base (UYU)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : e.target.valueAsNumber,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ProductImageManager
          productId={isEditing ? product!.id : null}
          initialImages={product?.product_images ?? []}
          pendingFilesRef={pendingImageFiles}
        />

        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="!mt-0">Destacado</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="!mt-0">Activo (visible en el catálogo)</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear producto"}
        </Button>
      </form>
    </Form>
  );
}

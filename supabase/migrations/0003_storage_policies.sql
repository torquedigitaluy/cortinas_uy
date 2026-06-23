-- Etapa 5: políticas de Storage para el bucket product-images.
-- El bucket ya es público para lectura (creado con public=true en Etapa 1), pero
-- insert/update/delete sobre storage.objects siempre requieren políticas RLS propias,
-- independientemente del flag "public" del bucket.

create policy "product_images_storage_insert_admin" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_storage_update_admin" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_storage_delete_admin" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());

-- Etapa 1: políticas RLS.
-- Convención: lectura pública en catálogo y agentes activos de RE/MAX; escritura solo admin
-- (vía public.is_admin()); memberships/membership_payments sin acceso anon/authenticated en
-- absoluto — se escriben exclusivamente con la service_role key desde Route Handlers
-- server-to-server (ver Etapa 6), que bypasea RLS por diseño de Supabase.

create function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ===================== CATÁLOGO =====================

create policy "categories_select_public" on public.categories
  for select using (true);
create policy "categories_insert_admin" on public.categories
  for insert with check (public.is_admin());
create policy "categories_update_admin" on public.categories
  for update using (public.is_admin()) with check (public.is_admin());
create policy "categories_delete_admin" on public.categories
  for delete using (public.is_admin());

create policy "products_select_public" on public.products
  for select using (true);
create policy "products_insert_admin" on public.products
  for insert with check (public.is_admin());
create policy "products_update_admin" on public.products
  for update using (public.is_admin()) with check (public.is_admin());
create policy "products_delete_admin" on public.products
  for delete using (public.is_admin());

create policy "product_variants_select_public" on public.product_variants
  for select using (true);
create policy "product_variants_insert_admin" on public.product_variants
  for insert with check (public.is_admin());
create policy "product_variants_update_admin" on public.product_variants
  for update using (public.is_admin()) with check (public.is_admin());
create policy "product_variants_delete_admin" on public.product_variants
  for delete using (public.is_admin());

create policy "product_images_select_public" on public.product_images
  for select using (true);
create policy "product_images_insert_admin" on public.product_images
  for insert with check (public.is_admin());
create policy "product_images_update_admin" on public.product_images
  for update using (public.is_admin()) with check (public.is_admin());
create policy "product_images_delete_admin" on public.product_images
  for delete using (public.is_admin());

-- ===================== LEADS DE SERVICIOS TÉCNICOS =====================

create policy "service_requests_insert_public" on public.service_requests
  for insert with check (true);
create policy "service_requests_select_admin" on public.service_requests
  for select using (public.is_admin());
create policy "service_requests_update_admin" on public.service_requests
  for update using (public.is_admin()) with check (public.is_admin());
create policy "service_requests_delete_admin" on public.service_requests
  for delete using (public.is_admin());

-- ===================== PERFILES / ADMIN =====================
-- Sin policy de insert: la fila la crea el trigger handle_new_user (security definer),
-- que bypasea RLS.

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ===================== MEMBRESÍA =====================
-- Sin policies de insert/update/delete: esas operaciones solo las hacen Route Handlers
-- usando la service_role key (bypasea RLS). anon/authenticated quedan sin acceso de escritura.

create policy "memberships_select_admin" on public.memberships
  for select using (public.is_admin());
create policy "membership_payments_select_admin" on public.membership_payments
  for select using (public.is_admin());

-- ===================== RE/MAX =====================

create policy "remax_agents_select_active_or_admin" on public.remax_agents
  for select using (is_active = true or public.is_admin());
create policy "remax_agents_insert_admin" on public.remax_agents
  for insert with check (public.is_admin());
create policy "remax_agents_update_admin" on public.remax_agents
  for update using (public.is_admin()) with check (public.is_admin());
create policy "remax_agents_delete_admin" on public.remax_agents
  for delete using (public.is_admin());

-- Etapa 1: esquema inicial — catálogo, leads, perfiles admin, membresías y alianza RE/MAX.
-- RLS se habilita aquí mismo (deny-all hasta que 0002_rls_policies.sql agregue las políticas).

create extension if not exists pgcrypto;

-- ===================== CATÁLOGO =====================

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text,
  short_description text,
  base_price numeric(10, 2),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on public.products (category_id);

alter table public.products enable row level security;

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price numeric(10, 2) not null,
  sku text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index product_variants_product_id_idx on public.product_variants (product_id);

alter table public.product_variants enable row level security;

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_images_product_id_idx on public.product_images (product_id);

alter table public.product_images enable row level security;

-- ===================== RE/MAX =====================
-- Se crea antes de service_requests/memberships porque ambas la referencian.

create table public.remax_agents (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  office text,
  referral_code text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.remax_agents enable row level security;

-- ===================== LEADS DE SERVICIOS TÉCNICOS =====================

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  service_type text not null check (service_type in ('instalacion', 'reparacion', 'mantenimiento')),
  full_name text not null,
  phone text not null,
  email text,
  address text,
  department text,
  product_category_id uuid references public.categories(id) on delete set null,
  message text,
  status text not null default 'nuevo' check (status in ('nuevo', 'contactado', 'agendado', 'resuelto', 'descartado')),
  is_remax_referral boolean not null default false,
  remax_agent_id uuid references public.remax_agents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index service_requests_status_idx on public.service_requests (status);

alter table public.service_requests enable row level security;

-- ===================== PERFILES / ADMIN =====================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Los admins se invitan manualmente desde el dashboard de Supabase (sin self-signup público).
-- Este trigger crea automáticamente el perfil correspondiente al crearse el usuario en auth.users.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===================== MEMBRESÍA =====================
-- No se modela cuenta de usuario para clientes finales: la membresía es transaccional vía
-- Mercado Pago y no requiere que el cliente tenga login (ver Etapa 6).

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  status text not null default 'pendiente' check (status in ('pendiente', 'activa', 'vencida', 'cancelada')),
  mercadopago_subscription_id text unique,
  mercadopago_payer_id text,
  start_date date,
  next_billing_date date,
  is_remax_client boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.memberships enable row level security;

create table public.membership_payments (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.memberships(id) on delete cascade,
  mercadopago_payment_id text not null unique,
  amount numeric(10, 2),
  status text,
  paid_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create index membership_payments_membership_id_idx on public.membership_payments (membership_id);

alter table public.membership_payments enable row level security;

-- ===================== updated_at automático =====================

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.categories
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at before update on public.products
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at before update on public.service_requests
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at before update on public.memberships
  for each row execute procedure public.set_updated_at();

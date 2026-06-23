# Plan de desarrollo por etapas — Cortinas UY

## Contexto

El proyecto está recién scaffoldeado: Next.js 14.2.35 + TypeScript + Tailwind v3 + shadcn/ui (11 componentes base) + clientes Supabase (browser/server/middleware) ya configurados, pero sin ninguna lógica de negocio implementada. No existe esquema de base de datos, no hay páginas más allá del boilerplate de `create-next-app`, no hay color corporativo aplicado, y no hay integración de Mercado Pago.

El objetivo de negocio es una plataforma con cuatro pilares (ver CLAUDE.md): catálogo de productos de cortinas/cerramientos, embudo de leads para servicios técnicos, membresía anual de mantenimiento con cobro recurrente vía Mercado Pago, y beneficios para la red RE/MAX. Este plan cubre el desarrollo de un **MVP completo end-to-end** desplegable, usando datos placeholder/seed para el catálogo (el contenido real se cargará después vía el panel admin) y un esquema de autenticación simple (un solo rol "admin" vía Supabase Auth).

Decisiones de alcance ya tomadas:
- RE/MAX: landing genérica (`/remax`) + código de referido validado contra una tabla de agentes, **sin** landing personalizada por agente en esta etapa.
- Mercado Pago: el código de integración queda listo, pero las credenciales de sandbox se asumen como prerequisito a configurar antes de poder probar el flujo end-to-end (no bloquea el desarrollo del resto del código).
- No se instala test runner (Vitest/Jest/Playwright) sin antes confirmarlo con el usuario — queda señalado como pregunta abierta en la Etapa 8.

Las etapas están ordenadas para minimizar retrabajo: cada una construye sobre artefactos (tablas, layout, queries, Server Actions) de la etapa anterior.

Estado de avance: actualizar la casilla de cada etapa a medida que se completa.

- [x] Etapa 0 — Fundación de proyecto
- [x] Etapa 1 — Modelado de base de datos en Supabase
- [x] Etapa 2 — Sistema de diseño y layout compartido
- [x] Etapa 3 — Catálogo público
- [x] Etapa 4 — Embudo de leads
- [x] Etapa 5 — Auth admin + dashboard
- [ ] Etapa 6 — Membresía + Mercado Pago
- [ ] Etapa 7 — Alianza RE/MAX
- [ ] Etapa 8 — Pulido final

---

## Etapa 0 — Fundación de proyecto

**Objetivo:** corregir deuda de scaffolding antes de construir lógica de negocio encima.

- Crear `.docs/PLAN.md` dentro del repo con el contenido completo de este plan (todas las etapas), para que quede versionado junto al código y no solo en el plan mode de Claude Code. Actualizarlo a medida que cada etapa se complete o el alcance cambie.
- `src/app/layout.tsx`: `lang="en"` → `lang="es"`; agregar `metadataBase`, Open Graph básico (`openGraph.locale: "es_UY"`), title template.
- `.env.local.example`: agregar `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`, `MERCADOPAGO_PUBLIC_KEY`, `MERCADOPAGO_WEBHOOK_SECRET` (se usan recién en Etapa 6, pero se documentan ahora para no retocar el archivo después).
- Crear `src/hooks/` (la carpeta ya está referenciada como alias en `components.json` pero no existe).

**Hecho cuando:** `npm run build` pasa sin errores; la home sirve con `lang="es"`; sin cambios visuales todavía (eso es la Etapa 2).

---

## Etapa 1 — Modelado de base de datos en Supabase

**Objetivo:** esquema completo para catálogo, leads, perfiles admin, membresías y RE/MAX, con RLS y seed ficticio. Bloquea todas las etapas siguientes.

**Archivos a crear:**
- `supabase/migrations/0001_init_schema.sql`
- `supabase/migrations/0002_rls_policies.sql`
- `supabase/seed.sql`
- `src/lib/supabase/database.types.ts` (tipos generados al final, vía `supabase gen types typescript` si hay CLI, o manual si no)
- `src/lib/types.ts` (tipos de dominio derivados, ej. `ProductWithCategory`)

**Tablas:**
1. **`categories`** — `id uuid pk`, `slug unique`, `name`, `description`, `sort_order`, timestamps. Seed: cortinas-enrollar, cortinas-interiores, puertas-plegables, mamparas-bano, automatismos, accesorios.
2. **`products`** — `id`, `category_id fk`, `slug unique`, `name`, `description`, `short_description`, `base_price numeric`, `is_featured`, `is_active`, timestamps.
3. **`product_variants`** — `id`, `product_id fk`, `name` (ej. "1.20m x 1.50m — Blackout"), `price numeric`, `sku`, `is_default`. Separado de `products` porque el precio varía por medida/material.
4. **`product_images`** — `id`, `product_id fk`, `storage_path`, `alt_text`, `sort_order`. Referencia al bucket `product-images` de Supabase Storage (crear como bucket público de lectura).
5. **`service_requests`** (leads) — `id`, `service_type check (instalacion|reparacion|mantenimiento)`, `full_name`, `phone`, `email`, `address`, `department`, `product_category_id fk nullable`, `message`, `status check (nuevo|contactado|agendado|resuelto|descartado) default 'nuevo'`, `is_remax_referral boolean`, `remax_agent_id fk -> remax_agents nullable`, timestamps.
6. **`profiles`** — `id references auth.users(id) on delete cascade`, `full_name`, `role check (admin) default 'admin'`, `created_at`. Trigger `handle_new_user` (`security definer`) que inserta automáticamente al crearse un usuario en `auth.users` — los admins se invitan manualmente desde el dashboard de Supabase, no hay self-signup público.
7. **`memberships`** — `id`, `customer_name`, `customer_email`, `customer_phone`, `status check (pendiente|activa|vencida|cancelada)`, `mercadopago_subscription_id unique`, `mercadopago_payer_id`, `start_date`, `next_billing_date`, `is_remax_client boolean`, timestamps. No se modela cuenta de usuario para clientes finales — la membresía es transaccional vía Mercado Pago, simplifica Etapa 6.
8. **`membership_payments`** — `id`, `membership_id fk`, `mercadopago_payment_id unique`, `amount`, `status`, `paid_at`, `raw_payload jsonb` (auditoría del webhook), `created_at`.
9. **`remax_agents`** — `id`, `full_name`, `email`, `phone`, `office`, `referral_code unique`, `is_active boolean`, `created_at`.

**RLS:**
- `categories`/`products`/`product_variants`/`product_images`: `SELECT` público; `INSERT/UPDATE/DELETE` solo si `auth.uid()` está en `profiles` con `role='admin'`.
- `service_requests`: `INSERT` público (lead sin login); `SELECT/UPDATE/DELETE` admin-only.
- `profiles`: `SELECT` propio + admin ve todos; sin `INSERT` público (lo hace el trigger).
- `memberships`/`membership_payments`: sin acceso anon; admin-only para `SELECT`; `INSERT/UPDATE` solo vía `service_role` key desde Route Handlers (webhook MP), bypaseando RLS deliberadamente — documentar con comentarios SQL.
- `remax_agents`: `SELECT` público solo de `is_active=true` (para validar código de referido); resto admin-only.

**Seed:** 6 categorías, ~15 productos (2-3 por categoría) con 1-3 variantes cada uno, `storage_path` con placeholders que resuelven a imagen de stock genérica en el componente (sin Storage real todavía), 2-3 `remax_agents` ficticios, 3-4 `service_requests` en distintos estados. El usuario admin se crea manualmente desde el dashboard de Supabase (no vía SQL).

**Hecho cuando:** migraciones + seed corren sin error contra el proyecto Supabase; `select * from products` devuelve 15 filas; políticas RLS verificables (anon vs admin).

---

## Etapa 2 — Sistema de diseño y layout compartido

**Objetivo:** paleta corporativa + shell de la app (header, footer, WhatsApp flotante) reutilizable en todo el sitio público.

- `src/app/globals.css`: reemplazar `--primary` por el rojo corporativo en HSL (punto de partida `0 72% 45%`, ajustable), mantener neutros existentes. Agregar las variables `--sidebar-*` que `tailwind.config.ts` ya referencia pero que no existen (huérfanas hoy, no rompen build pero conviene resolverlas).
- `src/components/layout/header.tsx`: Server Component — logo, nav (Inicio, Catálogo con dropdown de categorías desde Supabase, Servicios, Membresía, RE/MAX, Contacto), CTA "Solicitar presupuesto".
- `src/components/layout/mobile-nav.tsx`: Client Component con `Sheet` de shadcn (`npx shadcn@3.8.5 add sheet`, no instalado todavía).
- `src/components/layout/footer.tsx`: Server Component — contacto, links a categorías, redes placeholder.
- `src/components/layout/whatsapp-button.tsx`: Client Component fixed bottom-right, lee `NEXT_PUBLIC_WHATSAPP_NUMBER`, mensaje parametrizable por prop según la página.
- `src/app/layout.tsx`: envolver `children` con Header + main + Footer + WhatsappButton.
- `src/lib/constants.ts`: nav items, mensaje default de WhatsApp, info de contacto.

**Hecho cuando:** `npm run dev` muestra header con acento rojo + footer + WhatsApp flotante funcional (abre `wa.me` con mensaje prellenado) en mobile y desktop.

**Depende de:** Etapa 0. Conviene tener Etapa 1 lista antes para que el dropdown de categorías ya sea dinámico desde el inicio.

---

## Etapa 3 — Catálogo público

**Objetivo:** navegación completa del catálogo como Server Components, reemplazando el boilerplate de `src/app/page.tsx`.

**Rutas:**
- `src/app/page.tsx` — hero, categorías destacadas, productos `is_featured`, resumen de servicios, CTA membresía.
- `src/app/productos/page.tsx` — grid de categorías.
- `src/app/productos/[categorySlug]/page.tsx` — productos de la categoría; `notFound()` si el slug no existe.
- `src/app/productos/[categorySlug]/[productSlug]/page.tsx` — detalle: galería, variantes/precio, descripción, CTA a formulario de leads (Etapa 4) con query params; `generateMetadata` dinámico.
- `src/app/servicios/page.tsx` — los 3 servicios técnicos con CTA.
- `src/app/contacto/page.tsx` — datos de contacto + formulario de leads genérico.

**Componentes/lib:**
- `src/components/products/product-card.tsx`, `category-card.tsx`, `product-gallery.tsx`, `variant-selector.tsx` (Client Component si hay selección interactiva de precio).
- `src/lib/supabase/queries/products.ts` — `getCategories()`, `getCategoryBySlug()`, `getProductsByCategory()`, `getProductBySlug()`, `getFeaturedProducts()`.

**Hecho cuando:** navegación home → categoría → producto funciona con datos del seed; slugs inválidos manejan `notFound()`; metadata por página presente.

**Depende de:** Etapa 1 (datos), Etapa 2 (layout).

---

## Etapa 4 — Embudo de leads

**Objetivo:** captar leads reales en `service_requests` desde formularios públicos.

- `src/lib/validations/service-request.ts` — schema Zod: `service_type` enum, `full_name`, `phone` (regex UY), `email` opcional, `address`, `department` (19 departamentos, lista en `src/lib/constants.ts`), `message` opcional, `is_remax_referral` boolean.
- `src/components/forms/service-request-form.tsx` — Client Component, RHF + `zodResolver`, usa `Form` de shadcn ya instalado; campo condicional de código de agente si `is_remax_referral=true`.
- `src/app/actions/service-requests.ts` — Server Action `createServiceRequest(data)`: valida server-side, inserta vía `createClient()` de `src/lib/supabase/server.ts` (RLS permite `INSERT` anon).
- `src/app/servicios/solicitar/page.tsx` — página del formulario, acepta `searchParams` (`?categoria=`, `?producto=`) para prellenar contexto.
- `npx shadcn@3.8.5 add toast` (o componente de feedback equivalente) + `<Toaster />` en el layout raíz para mostrar éxito/error.

**Hecho cuando:** completar el formulario inserta una fila visible en `service_requests`; validaciones Zod bloquean datos inválidos; feedback visible al usuario.

**Depende de:** Etapa 1 (tabla + RLS), Etapa 2 (layout). Etapa 3 da el link contextual desde producto pero no es bloqueante estricto.

---

## Etapa 5 — Auth admin + dashboard

**Objetivo:** acceso protegido a panel de gestión de catálogo y leads.

- `src/app/admin/login/page.tsx` — Client Component, `supabase.auth.signInWithPassword` (cliente browser).
- `src/middleware.ts` / `src/lib/supabase/middleware.ts` — extender: si `pathname` empieza con `/admin` (excepto `/admin/login`) y no hay sesión, redirect a `/admin/login`.
- `src/app/admin/layout.tsx` — sidebar (Dashboard, Productos, Categorías, Leads, Membresías), valida sesión + `profile.role === 'admin'` (defense in depth).
- `src/app/admin/page.tsx` — métricas básicas (`count()` de leads nuevos, membresías activas).
- `src/app/admin/leads/page.tsx` — tabla de `service_requests`, cambio de `status` vía Server Action.
- `src/app/admin/productos/page.tsx`, `nuevo/page.tsx`, `[id]/editar/page.tsx` — CRUD con RHF+Zod, Server Actions en `src/app/actions/products.ts` (`createProduct`/`updateProduct`/`deleteProduct`), subida de imágenes al bucket `product-images`.
- `src/app/admin/categorias/page.tsx` — CRUD simple, probablemente con `Dialog` de shadcn (ya instalado) en lugar de páginas separadas, dado que son pocas categorías.
- `src/components/admin/logout-button.tsx`.

**Hecho cuando:** `/admin` sin sesión redirige a login; login con el admin creado en Etapa 1 funciona; crear un producto desde el dashboard lo hace aparecer en el catálogo público (Etapa 3); se puede cambiar el estado de un lead.

**Depende de:** Etapa 1 (`profiles`, RLS), Etapa 3 (queries de productos a extender para mutación).

---

## Etapa 6 — Membresía + Mercado Pago

**Objetivo:** alta de membresía anual con cobro recurrente vía Mercado Pago, confirmado por webhook.

**Prerequisito externo (no bloquea el desarrollo del código, sí las pruebas end-to-end):** credenciales de sandbox de Mercado Pago — a obtener antes de validar el flujo completo.

- `npm install mercadopago` (confirmar versión compatible con Node de Next 14.2 al momento de instalar).
- `src/lib/mercadopago/client.ts` — instancia del SDK con `MERCADOPAGO_ACCESS_TOKEN`.
- `src/lib/supabase/admin.ts` — cliente nuevo con `createClient` de `@supabase/supabase-js` (no `@supabase/ssr`, sin cookies) usando `SUPABASE_SERVICE_ROLE_KEY`, exclusivo para Route Handlers server-to-server — nunca importar en código que llegue al browser.
- `src/lib/validations/membership.ts` — schema Zod (nombre, email, teléfono, `is_remax_client`).
- `src/components/forms/membership-form.tsx` — Client Component.
- `src/app/membresia/page.tsx` — informativa + formulario.
- `src/app/api/membership/create/route.ts` — `POST`: crea preapproval (débito automático recurrente) en Mercado Pago, inserta `memberships` con `status='pendiente'`, retorna `init_point` para redirigir al checkout.
- `src/app/api/webhooks/mercadopago/route.ts` — `POST`: recibe notificaciones (`preapproval`/`payment`), valida firma con `MERCADOPAGO_WEBHOOK_SECRET`, usa `src/lib/supabase/admin.ts` para actualizar `memberships.status` e insertar en `membership_payments`.
- `src/app/membresia/confirmacion/page.tsx` — página de retorno post-checkout (`back_urls` de MP).

**Hecho cuando:** en sandbox — completar el form, redirigir a checkout MP, simular pago aprobado, el webhook actualiza `memberships.status='activa'` y crea fila en `membership_payments`, visible en `/admin` o vía SQL editor.

**Riesgo a validar antes de empezar:** probar webhooks en local puede requerir un tunneling (ngrok o similar) ya que Mercado Pago necesita una URL pública para notificar.

**Depende de:** Etapa 1 (tablas), Etapa 2 (layout). Etapa 5 es útil para visualizar resultados en dashboard pero no bloqueante.

---

## Etapa 7 — Alianza RE/MAX

**Objetivo:** landing genérica + trazabilidad de referidos vía código de agente (sin landing personalizada por agente en este alcance).

- `src/app/remax/page.tsx` — landing informativa (beneficios para clientes/agentes RE/MAX), Server Component.
- Extender `service-request-form.tsx` (Etapa 4) y `membership-form.tsx` (Etapa 6): agregar input de `referral_code`.
- `src/app/actions/remax.ts` — Server Action `validateReferralCode(code)` que valida contra `remax_agents.referral_code` (`is_active=true`) y resuelve el `remax_agent_id` a guardar en `service_requests`/`memberships`.

**Hecho cuando:** `/remax` accesible desde el nav; los formularios de servicio y membresía aceptan y validan código de agente; un lead creado con código válido queda trazable a `remax_agents`.

**Depende de:** Etapa 1 (`remax_agents`), Etapa 4 y Etapa 6 (forms a extender).

---

## Etapa 8 — Pulido final

**Objetivo:** SEO, accesibilidad y verificación manual end-to-end antes de considerar el MVP desplegable.

- `src/app/sitemap.ts` — dinámico, incluye rutas estáticas + `productos/[categorySlug]/[productSlug]` desde Supabase.
- `src/app/robots.ts` — reglas básicas, deshabilitar crawling de `/admin`.
- Revisar `generateMetadata` en todas las páginas de Etapa 3.
- Auditoría de accesibilidad: `alt` en imágenes, labels en forms custom, contraste AA del rojo corporativo, focus states en nav mobile.
- `src/app/not-found.tsx`, `src/app/error.tsx` — copy en español.
- Checklist manual end-to-end en preview deploy (Vercel): catálogo, lead de servicio, login admin, CRUD producto, alta de membresía, webhook MP, lead RE/MAX.

**Pregunta abierta a resolver con el usuario en su momento (no decidida aún):** si conviene instalar Playwright para al menos un smoke test E2E de leads y membresía antes de dar el MVP por "production ready" — no instalar sin confirmar primero, según indica CLAUDE.md.

**Hecho cuando:** Lighthouse SEO/Accessibility/Best Practices 90+ en home, detalle de producto y `/membresia`; sitemap válido; checklist de los 7 flujos de negocio ejecutado sin errores en preview deploy.

**Depende de:** todas las etapas anteriores.

---

## Orden de dependencias

```
Etapa 0 (fundación)
  → Etapa 1 (DB/Supabase)
      → Etapa 2 (diseño/layout)
          → Etapa 3 (catálogo público)
              → Etapa 4 (leads)
                  → Etapa 5 (admin/dashboard)
                      → Etapa 6 (membresía + MP)
                          → Etapa 7 (RE/MAX, extiende forms de 4 y 6)
                              → Etapa 8 (pulido/SEO/QA final)
```

Las etapas 4, 5 y 6 solo requieren 1+2+3 como base real y tienen cierta independencia entre sí; el orden secuencial propuesto minimiza retrabajo porque cada una reutiliza Server Actions/componentes de la anterior, pero podrían reordenarse si surge una prioridad de negocio distinta.

---

## Verificación

- **Etapa 0-2:** `npm run build` + revisión visual en `npm run dev`.
- **Etapa 1:** queries SQL directas en el SQL Editor de Supabase para confirmar datos y RLS (probar como anon vs como admin).
- **Etapa 3-5:** navegación manual en el navegador siguiendo cada flujo (catálogo → lead → admin → CRUD).
- **Etapa 6:** modo sandbox de Mercado Pago, simulación de pago aprobado, confirmación en `membership_payments`.
- **Etapa 7:** crear un lead/membresía con código de agente válido e inválido, confirmar comportamiento esperado.
- **Etapa 8:** Lighthouse + checklist manual de los 7 flujos de negocio en un preview deploy real (Vercel), no solo en local.

## Archivos críticos

- `supabase/migrations/0001_init_schema.sql` y `0002_rls_policies.sql` (no existen — base de todo lo demás)
- `src/app/globals.css` (existe, sin acento rojo — bloquea Etapa 2)
- `src/lib/supabase/server.ts` (existe — base de las queries de Etapas 3-7)
- `src/middleware.ts` (existe, sin protección de `/admin` — se extiende en Etapa 5)
- `src/app/layout.tsx` (existe, boilerplate — punto de integración del layout de Etapa 2)

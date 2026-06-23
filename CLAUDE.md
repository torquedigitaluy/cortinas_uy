# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. Visión General del Proyecto
Este proyecto es una plataforma web moderna, rápida y escalable para una empresa integral de cortinas, cerramientos y servicios técnicos. El sitio debe funcionar como catálogo interactivo de productos, embudo de captación de leads para servicios técnicos (instalación, reparación, mantenimiento) y plataforma de gestión para una membresía de mantenimiento anual y beneficios exclusivos de la red RE/MAX.

### Modelo de Negocio Clave:
1. **Catálogo de Productos:** Cortinas de enrollar (tradicionales y sin albañilería), cortinas interiores (roller, venecianas, bandas verticales), puertas plegables, mamparas de baño, automatismos y accesorios.
2. **Servicios Técnicos:** Formulario dinámico para solicitar instalación, reparación o mantenimiento.
3. **Membresía Anual:** Modelo de suscripción recurrente para mantenimiento integral.
4. **Alianza RE/MAX:** Beneficios y flujos exclusivos para agentes y clientes de la red RE/MAX.

---

## 2. Stack Tecnológico Obligatorio
* **Framework:** Next.js 14 (App Router, React Server Components para SEO óptimo). Pineado a la rama 14.x deliberadamente — no actualizar a Next 15/16 sin verificar antes la compatibilidad de shadcn/ui y `@supabase/ssr`.
* **Lenguaje:** TypeScript.
* **Estilos:** Tailwind CSS v3 (no v4 — ver nota en sección 7).
* **Componentes UI:** shadcn/ui, estilo `new-york`, base color `neutral` (basado en Radix UI y Lucide React).
* **Backend & Base de Datos:** Supabase (PostgreSQL) + Supabase Auth + Supabase Storage (para imágenes de productos y reportes de fallas).
* **Gestión de Estado/Formularios:** React Hook Form + Zod (validación de esquemas).
* **Pasarela de Pagos (Suscripciones):** Mercado Pago API (SDK oficial para cobros recurrentes / débitos automáticos en Uruguay) — pendiente de integrar.

---

## 3. Comandos

```bash
npm run dev      # servidor de desarrollo en http://localhost:3000
npm run build    # build de producción
npm run start    # sirve el build de producción
npm run lint     # ESLint (next lint)
```

No hay test runner configurado todavía. Antes de añadir uno, preguntar al usuario su preferencia (Vitest/Jest + Playwright son las opciones naturales para este stack).

### Componentes de shadcn/ui
Usar siempre la CLI fijada a la rama 3.x, **no** `shadcn@latest`: la versión 4.x reescribió el registro a "presets" (Nova/Vega/...) y al momento de escribir esto varios componentes compuestos (p.ej. `form`) están vacíos en esos presets nuevos.

```bash
npx shadcn@3.8.5 add <componente>
```

---

## 4. Arquitectura

### Cliente de Supabase (`src/lib/supabase/`)
Hay tres entry points distintos porque Supabase SSR requiere manejo de cookies diferente según el contexto de ejecución:
- `client.ts` — `createBrowserClient`, para Client Components.
- `server.ts` — `createServerClient` leyendo `next/headers` cookies, para Server Components y Route Handlers. El `setAll` está envuelto en try/catch porque los Server Components no pueden escribir cookies (eso lo refresca el middleware).
- `middleware.ts` — `updateSession`, refresca el token de auth en cada request. Está enganchado desde `src/middleware.ts` (matcher excluye assets estáticos).

### Componentes y Renderizado
1. **Server Components por defecto:** todas las páginas del catálogo, detalles de producto y secciones informativas deben ser Server Components para SEO y velocidad.
2. **Client Components (`'use client'`):** solo en formularios interactivos (cotizador, solicitud de soporte), modales de shadcn/ui, o el dashboard administrativo con interactividad en tiempo real o llamadas directas a Supabase Auth.
3. **Formularios:** siempre `react-hook-form` + `zod` (componente `Form` de shadcn/ui, ya instalado en `src/components/ui/form.tsx`).

### Manejo de Datos y Consultas
1. Usar siempre el cliente de Supabase del lado del servidor (`@/lib/supabase/server`) en Server Components y Route Handlers para que las cookies se empaqueten correctamente.
2. Validar siempre los parámetros dinámicos de las rutas (`slug`, `id`) y manejar estados de error limpios (`notFound()`).

### Variables de entorno
Ver `.env.local.example`. Copiar a `.env.local` (gitignored) y completar con las credenciales reales de Supabase / Mercado Pago / WhatsApp antes de levantar el proyecto.

---

## 5. Estilos y Diseño Visual
1. **Mobile-First obligatorio.** El público objetivo suele pedir presupuestos técnicos desde su teléfono móvil en el lugar de la instalación.
2. **Paleta corporativa:** tonos neutros desaturados (pizarras, grises claros) combinados con un acento rojo, color de marca. Las variables de tema viven en `src/app/globals.css` (formato HSL, consumidas vía `hsl(var(--x))` en `tailwind.config.ts` — no usar `oklch()` directo, eso es Tailwind v4).
3. **Botón flotante de WhatsApp:** no invasivo pero omnipresente en la sección pública, parametrizando el mensaje dinámicamente según la página actual.

---

## 6. Notas de scaffolding (evitar repetir estos problemas)
- `create-next-app@latest` instala Next 16 por defecto, que trae cambios de breaking que rompen patrones conocidos — usar siempre `create-next-app@14` explícito.
- `shadcn@latest` (4.x) usa presets nuevos (`base-nova`, etc.) con componentes compuestos incompletos en el registro remoto (confirmado con `form`) y además se instala a sí mismo y `@base-ui/react` como dependencias de runtime innecesarias. Usar `shadcn@3.8.5` con `--style new-york`.
- Al mezclar ambas versiones del registro puede quedar `globals.css` con variables en `oklch()` (sintaxis v4) mientras `tailwind.config.ts` espera `hsl(var(--x))` (sintaxis v3) — si se vuelve a correr el init, revisar que ambos archivos usen la misma convención.

## 7. Changelog
- **2026-06-22:** Scaffold inicial del proyecto: Next.js 14.2.35 (App Router, TS, `src/`), Tailwind v3 + shadcn/ui (`new-york`, neutral), componentes base instalados (button, input, label, form, card, dialog, dropdown-menu, select, textarea, badge, separator). Clientes de Supabase (browser/server/middleware) creados en `src/lib/supabase/`. React Hook Form + Zod + `@hookform/resolvers` instalados. `.env.local.example` añadido. Repo git inicializado con commit base.

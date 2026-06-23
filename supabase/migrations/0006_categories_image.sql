-- Etapa 8: imagen de portada para cada categoría, mostrada en CategoryCard
-- (home y /productos). Se completa vía seed.sql / panel admin más adelante.

alter table public.categories
  add column image_url text;

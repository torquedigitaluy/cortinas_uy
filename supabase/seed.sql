-- Etapa 1: datos ficticios para poder maquetar y probar el catálogo, leads y RE/MAX.
-- El contenido real se carga después vía el panel admin (Etapa 5). Las imágenes son
-- placeholders (storage_path apunta a 'placeholder/...') que el componente de producto
-- resuelve a una imagen de stock genérica hasta que se suba contenido real al bucket.

-- ===================== CATEGORÍAS =====================

insert into public.categories (slug, name, description, sort_order) values
  ('cortinas-enrollar', 'Cortinas de Enrollar', 'Cortinas de enrollar tradicionales y sin albañilería.', 1),
  ('cortinas-interiores', 'Cortinas Interiores', 'Roller, venecianas y bandas verticales.', 2),
  ('puertas-plegables', 'Puertas Plegables', 'Puertas plegables en PVC y aluminio.', 3),
  ('mamparas-bano', 'Mamparas de Baño', 'Mamparas corredizas y fijas para baño.', 4),
  ('automatismos', 'Automatismos', 'Motorización y control remoto para cortinas.', 5),
  ('accesorios', 'Accesorios', 'Repuestos y accesorios para cortinas y cerramientos.', 6);

-- ===================== PRODUCTOS: cortinas-enrollar =====================

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'cortina-enrollar-tradicional', 'Cortina de Enrollar Tradicional',
  'Cortina de enrollar de chapa galvanizada con instalación tradicional.',
  'Cortina de enrollar de chapa galvanizada, instalación con albañilería. Resistente y de bajo mantenimiento, ideal para aberturas exteriores.',
  9200, true
from public.categories where slug = 'cortinas-enrollar';

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'cortina-enrollar-sin-albanileria', 'Cortina de Enrollar Sin Albañilería',
  'Cortina de enrollar con sistema de instalación sin obra.',
  'Sistema de cortina de enrollar que se instala sobre la abertura existente, sin romper paredes ni necesitar albañilería.',
  11500, false
from public.categories where slug = 'cortinas-enrollar';

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'cortina-enrollar-motorizada', 'Cortina de Enrollar Motorizada',
  'Cortina de enrollar con motor tubular incluido.',
  'Cortina de enrollar con motor tubular incluido y control remoto, para apertura y cierre eléctrico.',
  18900, true
from public.categories where slug = 'cortinas-enrollar';

-- ===================== PRODUCTOS: cortinas-interiores =====================

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'cortina-roller-blackout', 'Cortina Roller Blackout',
  'Cortina roller con tela blackout, bloqueo total de luz.',
  'Cortina roller con tela blackout que bloquea por completo el paso de luz, ideal para dormitorios.',
  4200, true
from public.categories where slug = 'cortinas-interiores';

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'cortina-veneciana-aluminio', 'Cortina Veneciana de Aluminio',
  'Cortina veneciana de lamas de aluminio, regulación de luz graduable.',
  'Cortina veneciana de lamas de aluminio con regulación de luz graduable mediante varilla u opción motorizada.',
  3800, false
from public.categories where slug = 'cortinas-interiores';

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'cortina-bandas-verticales', 'Cortina de Bandas Verticales',
  'Cortina de bandas verticales en tela, ideal para grandes ventanales.',
  'Cortina de bandas verticales en tela, recomendada para grandes ventanales y puertas vidriadas.',
  7200, false
from public.categories where slug = 'cortinas-interiores';

-- ===================== PRODUCTOS: puertas-plegables =====================

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'puerta-plegable-pvc', 'Puerta Plegable PVC',
  'Puerta plegable de PVC, liviana y de fácil mantenimiento.',
  'Puerta plegable de PVC, liviana y de fácil mantenimiento, apta para interiores y exteriores cubiertos.',
  5400, false
from public.categories where slug = 'puertas-plegables';

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'puerta-plegable-aluminio', 'Puerta Plegable Aluminio',
  'Puerta plegable de aluminio reforzado, mayor durabilidad.',
  'Puerta plegable de aluminio reforzado, mayor durabilidad y resistencia a la intemperie que la versión en PVC.',
  8200, true
from public.categories where slug = 'puertas-plegables';

-- ===================== PRODUCTOS: mamparas-bano =====================

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'mampara-corrediza', 'Mampara Corrediza',
  'Mampara de baño corrediza en vidrio templado.',
  'Mampara de baño corrediza en vidrio templado de 6mm, herrajes en aluminio anodizado.',
  12500, false
from public.categories where slug = 'mamparas-bano';

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'mampara-fija-puerta-batiente', 'Mampara Fija con Puerta Batiente',
  'Mampara fija con puerta batiente en vidrio templado.',
  'Mampara fija con puerta batiente en vidrio templado de 8mm, ideal para bañeras y duchas amplias.',
  15800, false
from public.categories where slug = 'mamparas-bano';

-- ===================== PRODUCTOS: automatismos =====================

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'motor-tubular-cortina-enrollar', 'Motor Tubular para Cortina de Enrollar',
  'Motor tubular para automatizar cortinas de enrollar existentes.',
  'Motor tubular para automatizar cortinas de enrollar existentes, compatible con control remoto y domótica.',
  6200, true
from public.categories where slug = 'automatismos';

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'kit-automatizacion-control-remoto', 'Kit de Automatización con Control Remoto',
  'Kit completo de automatización con control remoto incluido.',
  'Kit completo de automatización con control remoto incluido, instalación recomendada por técnico certificado.',
  9800, false
from public.categories where slug = 'automatismos';

-- ===================== PRODUCTOS: accesorios =====================

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'manija-cortina-enrollar', 'Manija de Cortina de Enrollar',
  'Manija de repuesto para cortina de enrollar manual.',
  'Manija de repuesto para cortina de enrollar manual, compatible con la mayoría de los modelos estándar.',
  450, false
from public.categories where slug = 'accesorios';

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'riel-bandas-verticales', 'Riel para Cortina de Bandas Verticales',
  'Riel de repuesto para cortina de bandas verticales.',
  'Riel de repuesto para cortina de bandas verticales, disponible en distintas medidas.',
  1200, false
from public.categories where slug = 'accesorios';

insert into public.products (category_id, slug, name, short_description, description, base_price, is_featured)
select id, 'control-remoto-universal', 'Control Remoto Universal',
  'Control remoto universal compatible con motores de cortinas y portones.',
  'Control remoto universal compatible con la mayoría de los motores de cortinas y portones automatizados.',
  1800, false
from public.categories where slug = 'accesorios';

-- ===================== VARIANTES =====================

insert into public.product_variants (product_id, name, price, is_default)
select id, '2.00m x 2.10m', 9200, true from public.products where slug = 'cortina-enrollar-tradicional';
insert into public.product_variants (product_id, name, price)
select id, '2.50m x 2.10m', 10800 from public.products where slug = 'cortina-enrollar-tradicional';

insert into public.product_variants (product_id, name, price, is_default)
select id, '1.50m x 1.80m', 11500, true from public.products where slug = 'cortina-enrollar-sin-albanileria';
insert into public.product_variants (product_id, name, price)
select id, '2.00m x 2.10m', 13200 from public.products where slug = 'cortina-enrollar-sin-albanileria';

insert into public.product_variants (product_id, name, price, is_default)
select id, '2.00m x 2.10m con motor', 18900, true from public.products where slug = 'cortina-enrollar-motorizada';

insert into public.product_variants (product_id, name, price, is_default)
select id, '1.20m x 1.50m', 4200, true from public.products where slug = 'cortina-roller-blackout';
insert into public.product_variants (product_id, name, price)
select id, '1.50m x 1.80m', 5100 from public.products where slug = 'cortina-roller-blackout';
insert into public.product_variants (product_id, name, price)
select id, '2.00m x 2.10m', 6800 from public.products where slug = 'cortina-roller-blackout';

insert into public.product_variants (product_id, name, price, is_default)
select id, '1.20m x 1.50m', 3800, true from public.products where slug = 'cortina-veneciana-aluminio';
insert into public.product_variants (product_id, name, price)
select id, '1.50m x 1.80m', 4600 from public.products where slug = 'cortina-veneciana-aluminio';

insert into public.product_variants (product_id, name, price, is_default)
select id, '2.00m x 2.10m', 7200, true from public.products where slug = 'cortina-bandas-verticales';
insert into public.product_variants (product_id, name, price)
select id, '2.50m x 2.40m', 8900 from public.products where slug = 'cortina-bandas-verticales';

insert into public.product_variants (product_id, name, price, is_default)
select id, '0.80m x 2.00m', 5400, true from public.products where slug = 'puerta-plegable-pvc';
insert into public.product_variants (product_id, name, price)
select id, '1.00m x 2.00m', 6100 from public.products where slug = 'puerta-plegable-pvc';

insert into public.product_variants (product_id, name, price, is_default)
select id, '0.80m x 2.00m', 8200, true from public.products where slug = 'puerta-plegable-aluminio';
insert into public.product_variants (product_id, name, price)
select id, '1.00m x 2.00m', 9400 from public.products where slug = 'puerta-plegable-aluminio';

insert into public.product_variants (product_id, name, price, is_default)
select id, '1.20m x 1.90m', 12500, true from public.products where slug = 'mampara-corrediza';
insert into public.product_variants (product_id, name, price)
select id, '1.50m x 1.90m', 14200 from public.products where slug = 'mampara-corrediza';

insert into public.product_variants (product_id, name, price, is_default)
select id, '1.40m x 1.90m', 15800, true from public.products where slug = 'mampara-fija-puerta-batiente';

insert into public.product_variants (product_id, name, price, is_default)
select id, 'Motor 20Nm', 6200, true from public.products where slug = 'motor-tubular-cortina-enrollar';
insert into public.product_variants (product_id, name, price)
select id, 'Motor 35Nm', 7400 from public.products where slug = 'motor-tubular-cortina-enrollar';

insert into public.product_variants (product_id, name, price, is_default)
select id, 'Kit estándar', 9800, true from public.products where slug = 'kit-automatizacion-control-remoto';

insert into public.product_variants (product_id, name, price, is_default)
select id, 'Manija estándar', 450, true from public.products where slug = 'manija-cortina-enrollar';

insert into public.product_variants (product_id, name, price, is_default)
select id, '2.00m', 1200, true from public.products where slug = 'riel-bandas-verticales';
insert into public.product_variants (product_id, name, price)
select id, '2.50m', 1450 from public.products where slug = 'riel-bandas-verticales';

insert into public.product_variants (product_id, name, price, is_default)
select id, '1 canal', 1800, true from public.products where slug = 'control-remoto-universal';
insert into public.product_variants (product_id, name, price)
select id, '4 canales', 2600 from public.products where slug = 'control-remoto-universal';

-- ===================== IMÁGENES (placeholder) =====================

insert into public.product_images (product_id, storage_path, alt_text, sort_order)
select id, 'placeholder/' || slug || '-01.jpg', name, 1 from public.products;

-- ===================== AGENTES RE/MAX =====================

insert into public.remax_agents (full_name, email, phone, office, referral_code, is_active) values
  ('Lucía Fernández', 'lucia.fernandez@remax-uy.example', '+598 99 111 222', 'RE/MAX Prime', 'LFERNANDEZ', true),
  ('Martín Sosa', 'martin.sosa@remax-uy.example', '+598 99 333 444', 'RE/MAX Costa', 'MSOSA', true),
  ('Valentina Pérez', 'valentina.perez@remax-uy.example', '+598 99 555 666', 'RE/MAX Center', 'VPEREZ', false);

-- ===================== LEADS DE SERVICIOS (ficticios) =====================

insert into public.service_requests (
  service_type, full_name, phone, email, address, department,
  product_category_id, message, status, is_remax_referral, remax_agent_id
)
select 'instalacion', 'Ana Rodríguez', '+598 98 111 222', 'ana.rodriguez@example.com',
  'Av. Italia 1234', 'Montevideo', c.id,
  'Necesito instalar cortinas de enrollar en 3 ventanas.', 'nuevo', false, null
from public.categories c where c.slug = 'cortinas-enrollar';

insert into public.service_requests (
  service_type, full_name, phone, email, address, department,
  product_category_id, message, status, is_remax_referral, remax_agent_id
)
select 'reparacion', 'Carlos Gómez', '+598 98 333 444', null,
  'Bvar. Artigas 567', 'Canelones', c.id,
  'La cortina del living quedó trabada a mitad de camino.', 'contactado', false, null
from public.categories c where c.slug = 'cortinas-interiores';

insert into public.service_requests (
  service_type, full_name, phone, email, address, department,
  product_category_id, message, status, is_remax_referral, remax_agent_id
)
select 'mantenimiento', 'Florencia Silva', '+598 98 555 666', 'florencia.silva@example.com',
  'Ruta 8 km 19.500', 'Canelones', null,
  'Cliente referido por agente RE/MAX, casa recién comprada.', 'agendado', true, a.id
from public.remax_agents a where a.referral_code = 'LFERNANDEZ';

insert into public.service_requests (
  service_type, full_name, phone, email, address, department,
  product_category_id, message, status, is_remax_referral, remax_agent_id
)
select 'instalacion', 'Diego Martínez', '+598 98 777 888', null,
  'Camino Maldonado 4321', 'Montevideo', c.id,
  'Presupuesto para mampara de baño corrediza.', 'resuelto', false, null
from public.categories c where c.slug = 'mamparas-bano';

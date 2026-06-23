// Las imágenes seedeadas en Etapa 1 usan storage_path con prefijo 'placeholder/' porque
// todavía no hay contenido real subido al bucket. Para esos casos devolvemos null y el
// componente que llama renderiza un placeholder visual en vez de una URL rota.
//
// El prefijo 'local/' lo usa el seed de Etapa 8 para fotos de stock (Unsplash) guardadas
// en public/images/ mientras no hay fotos reales de producto subidas al bucket.
export function getProductImageUrl(storagePath: string): string | null {
  if (storagePath.startsWith("placeholder/")) return null;
  if (storagePath.startsWith("local/")) return `/images/${storagePath.slice("local/".length)}`;

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${baseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
}

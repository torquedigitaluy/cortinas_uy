// Las imágenes seedeadas en Etapa 1 usan storage_path con prefijo 'placeholder/' porque
// todavía no hay contenido real subido al bucket. Para esos casos devolvemos null y el
// componente que llama renderiza un placeholder visual en vez de una URL rota.
export function getProductImageUrl(storagePath: string): string | null {
  if (storagePath.startsWith("placeholder/")) return null;

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${baseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
}

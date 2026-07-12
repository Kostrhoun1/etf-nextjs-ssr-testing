/**
 * URL dynamického OG obrázku (viz src/app/api/og/route.tsx).
 *
 * Použití v metadata stránky – DŮLEŽITÉ: openGraph definované na stránce přepíše
 * CELÝ openGraph blok z layoutu (Next.js merguje jen první úroveň klíčů), takže
 * stránka s vlastním openGraph MUSÍ uvést i images, jinak přijde o og:image:
 *
 *   openGraph: { title, description, url, type: 'article', images: [ogImage({ title })] }
 */
export function ogImage(params: {
  title: string
  eyebrow?: string
  stat?: string
  statLabel?: string
}): { url: string; width: number; height: number } {
  const q = new URLSearchParams({ title: params.title })
  if (params.eyebrow) q.set('eyebrow', params.eyebrow)
  if (params.stat) q.set('stat', params.stat)
  if (params.statLabel) q.set('statLabel', params.statLabel)
  return { url: `/api/og?${q.toString()}`, width: 1200, height: 630 }
}

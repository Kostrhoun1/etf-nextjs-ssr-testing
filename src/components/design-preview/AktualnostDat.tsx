import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { datumVynosu, type SDatemVynosu } from '@/lib/datumVynosu';

/**
 * Štítek „Data k …“ – u žebříčků a přehledů fondů. Jen datum (18. 10. 2026, majitel: dovětek
 * „aktualizujeme každý den“ na mobilu rozbíjel řádkování a datum samo stačí).
 *
 * PROČ: čísla v žebříčcích (výnos za rok, velikost, TER) bez data nic neříkají a denní
 * aktualizace je naše silná stránka – má být vidět (požadavek majitele 17. 10. 2026).
 * Datum = skutečné datum scrapu (`scraping_date`), NE `updated_at`: ten do 17. 10. 2026
 * přepisoval i nahrávání starých dubnových dat, takže hlásil „dnes“ i u zamrzlých fondů.
 *
 * `nejstarsi`: když má některý fond v seznamu starší data než ostatní (o 2+ dny), řekneme to.
 */
const fmt = (d: Date) => d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });

export default function AktualnostDat({
  datum,
  nejstarsi,
  tmavy = false,
  className = '',
}: {
  datum: Date;
  nejstarsi?: Date | null;
  tmavy?: boolean;
  className?: string;
}) {
  const starsi = nejstarsi && datum.getTime() - nejstarsi.getTime() > 2 * 864e5 ? nejstarsi : null;
  const barvy = tmavy
    ? 'border-white/15 bg-white/5 text-slate-200'
    : 'border-teal-200 bg-teal-50/60 text-teal-900';
  return (
    <p className={`inline-flex items-start gap-1.5 rounded-xl border px-2.5 py-0.5 text-xs leading-5 ${barvy} ${className}`}>
      <RefreshCw className="w-3.5 h-3.5 mt-[3px] shrink-0" aria-hidden="true" />
      <span>
        {/* Odkaz na metodiku (SEO audit 20. 10. 2026): co „Data k …“ znamená a jak často se obnovují. Vzhled beze změny. */}
        <Link href="/metodika#datum" prefetch={false} title="Co znamená „Data k …“ – metodika" className="whitespace-nowrap hover:underline underline-offset-2">Data k <strong className="font-semibold">{fmt(datum)}</strong></Link>
        {starsi && <> · u některých fondů starší (nejstarší {fmt(starsi)})</>}
      </span>
    </p>
  );
}

/** Nejstarší den výnosů ze seznamu fondů (pro `nejstarsi`): returns_as_of, u starších dat den cen ze scraping_date
 *  (src/lib/datumVynosu.ts). 21. 10. 2026: fondy se zpožděnou řadou u zdroje (ESEA 16. 10. vs. většina 19. 10.). */
export function nejstarsiDatum(etfs: SDatemVynosu[]): Date | null {
  let min: Date | null = null;
  for (const e of etfs) {
    const d = datumVynosu(e);
    if (d && (min == null || d < min)) min = d;
  }
  return min;
}

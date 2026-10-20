import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HLAVNI_DVOJICE, POPISKY_DVOJIC } from '@/lib/pairs';

/** Odkazy na ostatní hlavní kurátorské dvojice – dřív 13 z 20 dvojic ze sitemapy nemělo žádný interní odkaz (SEO audit
 *  20. 10. 2026). prefetch={false}: /srovnani/* jde přes middleware – 13 prefetchů na zobrazení by pálilo CPU free tieru. */
export default function DalsiSrovnani({ aktualni, nadpis = 'Další srovnání fondů' }: { aktualni?: string; nadpis?: string }) {
  const ostatni = HLAVNI_DVOJICE.filter((s) => s !== aktualni);
  return (
    <section data-sekce="dalsi-srovnani" className="pb-8">
      <h2 className="text-lg font-bold tracking-tight text-slate-900">{nadpis}</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {ostatni.map((s) => (
          <li key={s}>
            <Link href={`/srovnani/${s}`} prefetch={false} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm hover:border-teal-300">
              <span className="min-w-0">
                <span className="font-semibold text-slate-900 uppercase">{s.replace('-vs-', ' vs ')}</span>
                {POPISKY_DVOJIC[s] && <span className="block text-xs text-slate-500">{POPISKY_DVOJIC[s]}</span>}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}


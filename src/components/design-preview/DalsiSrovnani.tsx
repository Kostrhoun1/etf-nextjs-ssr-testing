import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HLAVNI_DVOJICE, KURATORSKE, POPISKY_DVOJIC } from '@/lib/pairs';

/** „VWCE vs CSPX“ – tickery verzálkami, „vs“ malými (jednotně na celém webu, kolo 6b). */
export const nazevDvojice = (slug: string) => slug.split('-vs-').map((t) => t.toUpperCase()).join(' vs ');

/**
 * JEDNA komponenta „další srovnání“ pro detail fondu, stránky dvojic i /srovnani/vwce-vs-cspx (kolo 6b; dřív tři podoby:
 * „VWCE VS CSPX“ s → vs. „VWCE vs IWDA“ s ↗ a jiným písmem). Jen hlavní kurátorské dvojice (src/lib/pairs.ts – indexované,
 * v sitemapě). Nejvýš `max` karet, nejdřív ty se stejnými fondy (relevance), sudý počet (žádná osamělá karta v mřížce
 * o dvou sloupcích) a odkaz na všechna srovnání. Dřív 13 karet pod sebou.
 * Každá hlavní dvojice zůstává odkázaná: z dvojic se společným fondem (relevance) a ze stránky všech srovnání.
 * prefetch={false}: /srovnani/* jde přes middleware – prefetch každé karty by pálil CPU free tieru.
 */
export default function DalsiSrovnani({ aktualni, isiny = [], nadpis = 'Další srovnání fondů', max = 8, jenSouvisejici = false }: {
  /** Slug aktuální dvojice (nezobrazí se; její fondy určují relevanci). */
  aktualni?: string;
  /** ISINy, ke kterým hledat související dvojice (detail fondu). */
  isiny?: string[];
  nadpis?: string;
  max?: number;
  /** Jen dvojice se společným fondem (detail); doplní se nanejvýš jednou další kvůli sudému počtu. */
  jenSouvisejici?: boolean;
}) {
  const fondy = new Set([...isiny, ...(aktualni && KURATORSKE[aktualni] ? KURATORSKE[aktualni] : [])]);
  const skore = (s: string) => new Set(KURATORSKE[s].filter((i) => fondy.has(i))).size;
  const kandidati = HLAVNI_DVOJICE.filter((s) => s !== aktualni)
    .map((s, i) => ({ s, i, k: skore(s) }))
    .sort((a, b) => b.k - a.k || a.i - b.i);
  const souvisejici = kandidati.filter((x) => x.k > 0);
  let vyber = (jenSouvisejici ? souvisejici : kandidati).slice(0, max);
  // Sudý počet: doplnit další dvojicí (je-li a vejde-li se), jinak poslední vynechat.
  if (vyber.length % 2 === 1) {
    const dalsi = kandidati.find((x) => !vyber.includes(x));
    vyber = dalsi && vyber.length < max ? [...vyber, dalsi] : vyber.length > 1 ? vyber.slice(0, -1) : vyber;
  }
  if (!vyber.length) return null;
  const vse = HLAVNI_DVOJICE.length;
  return (
    <section data-sekce="dalsi-srovnani" className="pb-8">
      <h2 className="text-lg font-bold tracking-tight text-slate-900">{nadpis}</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {vyber.map(({ s }) => (
          <li key={s}>
            <Link href={`/srovnani/${s}`} prefetch={false} className="flex h-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm hover:border-teal-300">
              <span className="min-w-0">
                <span className="block font-semibold text-slate-900">{nazevDvojice(s)}</span>
                {POPISKY_DVOJIC[s] && <span className="block text-xs text-slate-500">{POPISKY_DVOJIC[s]}</span>}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      {vse - (aktualni ? 1 : 0) > vyber.length && (
        <Link href="/srovnani/porovnani" className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
          Všechna srovnání ({vse}) <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </section>
  );
}

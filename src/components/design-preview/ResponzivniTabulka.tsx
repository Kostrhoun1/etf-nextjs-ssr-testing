import type { ReactNode } from 'react';

/* JEDNA sdílená responzivní tabulka článků (kolo 8, 22. 10. 2026). Testeři na mobilu (390 px) viděli uříznuté sloupce
   („Cílová částka“ na /fire, „Pokles přes 20 %“ na /jak-dlouho-v-minusu, „Distribuční“, „Za 30 let“, vratka na /dip…),
   každá stránka to řešila jinak (overflow, skryté sloupce, min-w-[46rem]). Teď:
   - pod 640 px (sm) KARTY: první sloupec = titulek karty, ostatní sloupce jako „název: hodnota“ pod sebou,
   - od 640 px běžná tabulka (s vodorovným posunem jen jako pojistka).
   Žádný sloupec se na mobilu neskrývá – karta ukáže všechno. Komponenta je serverová (bez JS). */

export type SloupecTabulky = {
  /** Záhlaví sloupce (v tabulce i jako popisek v kartě). */
  nazev: ReactNode;
  /** Zarovnání v tabulce; čísla doprava. */
  zarovnani?: 'left' | 'right' | 'center';
  /** Popisek v kartě, když se má lišit od záhlaví (např. kratší). */
  nazevKarta?: ReactNode;
};

export type RadekTabulky = {
  key: string;
  bunky: ReactNode[];
  /** Zvýrazněný řádek (např. „váš případ“, rok s nejhorším výsledkem). */
  zvyraznit?: boolean;
};

/** Buňky řádku: `bunky: bunky(<a>…</a>, '12 %', …)`. Buňky se vykreslují uvnitř <td key>/<dt key>, klíče nepotřebují
 *  (variadický helper místo literálu pole – jinak lint react/jsx-key žádá klíč u každé buňky). */
export const bunky = (...b: ReactNode[]): ReactNode[] => b;

const ZAROVNANI = { left: 'text-left', right: 'text-right', center: 'text-center' } as const;

export default function ResponzivniTabulka({
  sloupce, radky, popis, className = '', tabulkaClassName = '', dataSekce,
}: {
  sloupce: SloupecTabulky[];
  radky: RadekTabulky[];
  /** Popis tabulky pro čtečky obrazovky (caption, vizuálně skrytý). */
  popis?: string;
  className?: string;
  tabulkaClassName?: string;
  dataSekce?: string;
}) {
  return (
    <div className={className} data-sekce={dataSekce} data-responzivni-tabulka="">
      {/* Mobil: karty */}
      <ul className="space-y-2.5 sm:hidden" aria-label={popis}>
        {radky.map((r) => (
          <li key={r.key} className={`rounded-xl border p-4 ${r.zvyraznit ? 'border-teal-300 bg-teal-50/60' : 'border-slate-200 bg-white'}`}>
            <div className="font-semibold leading-snug text-slate-900">{r.bunky[0]}</div>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {sloupce.slice(1).map((s, i) => (
                <div key={i} className="contents">
                  <dt className="text-slate-500">{s.nazevKarta ?? s.nazev}</dt>
                  <dd className="text-right tabular-nums font-medium text-slate-800">{r.bunky[i + 1]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      {/* Od 640 px: tabulka */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white sm:block">
        <table className={`w-full text-sm ${tabulkaClassName}`}>
          {popis && <caption className="sr-only">{popis}</caption>}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              {sloupce.map((s, i) => (
                <th key={i} scope="col" className={`px-4 py-3 font-medium ${ZAROVNANI[s.zarovnani ?? (i === 0 ? 'left' : 'right')]}`}>{s.nazev}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {radky.map((r) => (
              <tr key={r.key} className={`border-b border-slate-100 last:border-0 ${r.zvyraznit ? 'bg-teal-50/60' : ''}`}>
                {r.bunky.map((b, i) => (
                  i === 0
                    ? <th key={i} scope="row" className={`px-4 py-3 font-medium text-slate-800 ${ZAROVNANI[sloupce[i]?.zarovnani ?? 'left']}`}>{b}</th>
                    : <td key={i} className={`px-4 py-3 tabular-nums text-slate-700 ${ZAROVNANI[sloupce[i]?.zarovnani ?? 'right']}`}>{b}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

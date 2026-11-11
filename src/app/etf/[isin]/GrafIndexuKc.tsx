import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cislo, NBSP } from '@/lib/formatyCisel';
import type { VyvojIndexu } from '@/lib/vyvojIndexu';
import { cestaCary, kontrolniBody, osaY, poziceX, rokyOsyX } from '@/lib/vyvojIndexuGraf';

/* GRAF VÝVOJE INDEXU V KČ (úkol 3.3, varianta A – majitel 11. 11. 2026). Serverová komponenta: čisté SVG + popisky
   v HTML, žádný JavaScript v prohlížeči. Jen u fondů se shodou indexu 'stejny' (src/lib/vyvojIndexu.ts).
   Označení musí být jednoznačné – index (zdrojový fond dat backtestu), NE cena tohoto fondu; žádné procento výnosu.
   data-graf-indexu / data-oznaceni / data-do / data-kontrola čte denní kontrola (check-fund-data.mjs, blok „graf indexu“)
   a nezávislé ověření (scripts/overeni-graf-indexu.py). */

const SIRKA = 1000;
const VYSKA = 300;
/** 2. pád („od prosince 1999“). */
const MESICE = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
/** „10. 11. 2026“ přímo z YYYY-MM-DD (bez časového pásma). */
const den = (iso: string) => `${Number(iso.slice(8, 10))}.${NBSP}${Number(iso.slice(5, 7))}.${NBSP}${iso.slice(0, 4)}`;
const mesic = (iso: string) => `${MESICE[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;

export default function GrafIndexuKc({ vyvoj, odkazBacktestu }: { vyvoj: VyvojIndexu; odkazBacktestu?: string }) {
  const { body } = vyvoj;
  const prvni = body[0].d;
  const posledni = body[body.length - 1].d;
  const hodnoty = body.map((b) => b.v);
  const osa = osaY(Math.min(...hodnoty), Math.max(...hodnoty));
  const rozsah = osa.do - osa.od;
  const desetinna = osa.dilky.length > 1 && osa.dilky[1] - osa.dilky[0] < 1 ? 1 : 0;
  const popis = vyvoj.jeZdrojovyFond
    ? `Z cen tohoto fondu na burze (${vyvoj.zdrojTicker}, zdroj dat backtestu) přepočtených na koruny.`
    : `Podle fondu ${vyvoj.zdrojTicker} (zdroj dat backtestu), ne cena tohoto fondu; poplatky fondů se liší.`;

  return (
    <figure
      data-graf-indexu={vyvoj.indexCode}
      data-oznaceni={vyvoj.jeZdrojovyFond ? 'zdrojovy-fond' : 'index'}
      data-od={prvni}
      data-do={posledni}
      data-kontrola={kontrolniBody(body)}
      className="rounded-xl border border-slate-200 bg-white p-4 md:p-6"
    >
      <h3 className="text-sm font-semibold text-slate-900">{vyvoj.nadpis.replace(/ v Kč$/, `${NBSP}v${NBSP}Kč`)}</h3>
      <p className="mt-1 text-xs text-slate-500 leading-relaxed">{popis}</p>
      <div className="mt-4 flex">
        <div className="relative w-12 shrink-0 h-44 md:h-56 text-[11px] tabular-nums text-slate-500" aria-hidden="true">
          {osa.dilky.map((v) => (
            <span key={v} className="absolute right-2 -translate-y-1/2 whitespace-nowrap" style={{ top: `${(1 - (v - osa.od) / rozsah) * 100}%` }}>
              {cislo(v, desetinna)}
            </span>
          ))}
        </div>
        <div className="relative flex-1 min-w-0 h-44 md:h-56">
          <svg
            viewBox={`0 0 ${SIRKA} ${VYSKA}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            role="img"
            aria-label={`${vyvoj.nadpis}: čárový graf od ${mesic(prvni)} do ${den(posledni)}`}
          >
            {osa.dilky.map((v) => {
              const y = Math.round((VYSKA - ((v - osa.od) / rozsah) * VYSKA) * 10) / 10;
              return <line key={v} x1="0" x2={SIRKA} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" vectorEffect="non-scaling-stroke" />;
            })}
            <path d={cestaCary(body, osa, SIRKA, VYSKA)} fill="none" stroke="#0f766e" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
      <div className="relative ml-12 h-5 text-[11px] tabular-nums text-slate-500" aria-hidden="true">
        {rokyOsyX(prvni, posledni).map((r) => (
          <span key={r} className="absolute top-1 -translate-x-1/2" style={{ left: `${poziceX(`${r}-01-01`, prvni, posledni) * 100}%` }}>{r}</span>
        ))}
      </div>
      <figcaption className="mt-3 text-xs text-slate-500 leading-relaxed">
        Osa: Kč za 1 podíl fondu {vyvoj.zdrojTicker}{vyvoj.bezVyplat ? '' : ' včetně vyplacených výnosů'}, převedeno denním kurzem ECB; konce měsíců od {mesic(prvni)}.{' '}
        <span data-graf-datum>Data k {den(posledni)}.</span>
      </figcaption>
      {odkazBacktestu && (
        <Link href={odkazBacktestu} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
          Vyzkoušet v backtestu <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </figure>
  );
}

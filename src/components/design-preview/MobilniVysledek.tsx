import { ArrowDown } from 'lucide-react';

/* Výsledek nahoře na mobilu (3.2, 11. 11. 2026). Kalkulačky mají na mobilu vstupy v jednom sloupci a hlavní
   výsledek byl 900–2 000 px pod začátkem kalkulačky. Tenhle pruh ukáže hlavní číslo NAD vstupy (jen < md)
   a odkáže na celý výsledek níž. Čísla dostává hotová od widgetu – stejné proměnné jako hlavní panel, žádný
   vlastní výpočet. Záměrně bez data-qa a s jiným popiskem než hlavní panel (zlaté případy čtou hlavní panel). */
export default function MobilniVysledek({ stitek, hodnota, doplnek, cil }: {
  stitek: string;
  hodnota: React.ReactNode;
  doplnek?: React.ReactNode;
  /** id prvku s celým výsledkem */
  cil: string;
}) {
  return (
    <div className="md:hidden rounded-xl border border-teal-200 bg-teal-50 px-4 py-3" data-mobilni-vysledek>
      <p className="text-xs font-medium text-teal-900">{stitek}</p>
      <p className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums text-slate-900">{hodnota}</p>
      {doplnek && <p className="mt-0.5 text-xs text-slate-600 leading-snug">{doplnek}</p>}
      <a href={`#${cil}`} className="inline-flex min-h-[44px] items-center gap-1 text-xs font-medium text-teal-800 hover:underline">
        Celý výsledek <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
    </div>
  );
}

import Link from 'next/link';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import PatickaSloupec from '@/components/design-preview/PatickaSloupec';

/* Sdílená patička webu – vkládá se GLOBÁLNĚ v layout.tsx, takže ji má každá
   stránka konzistentně (dřív si ji každá kopírovala sama a na klíčových
   stránkách jako /srovnani nebo žebříčcích úplně chyběla). Přidává i důvěru
   (nezávislost, autor, disclaimer) a interní prolinky pro SEO. */
const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Průvodce ETF',
    links: [
      { href: '/pruvodce', label: 'Co jsou ETF' },
      { href: '/jak-zacit', label: 'Jak začít investovat' },
      { href: '/svetove-etf-indexy', label: 'Který světový index' },
      { href: '/jaky-sp500-etf', label: 'Který S&P 500 ETF' },
      { href: '/dane-z-etf', label: 'Daně z ETF' },
      { href: '/vyber-etf', label: 'Který ETF vybrat (4 otázky)' },
    ],
  },
  {
    heading: 'Nástroje',
    links: [
      { href: '/srovnani', label: 'Srovnávač ETF' },
      { href: '/backtest', label: 'Backtest portfolia' },
      { href: '/zebricky', label: 'Žebříčky ETF' },
      { href: '/portfolio-strategie', label: 'Modelová portfolia' },
      { href: '/kalkulacky', label: 'Kalkulačky' },
      { href: '/kde-koupit', label: 'Kde koupit ETF' },
    ],
  },
  {
    // SEO audit 6b (21. 10. 2026): hlavní žebříčky měly jen 1–2 vnitřní odkazy (z rozcestníku) → patička na každé stránce.
    heading: 'Žebříčky ETF',
    links: [
      { href: '/nejlepsi-etf/nejlepsi-etf-2026', label: 'Největší ETF 2026' },
      { href: '/nejlepsi-etf/nejlepsi-sp500-etf', label: 'S&P 500 ETF' },
      { href: '/nejlepsi-etf/nejlepsi-msci-world-etf', label: 'MSCI World ETF' },
      { href: '/nejlepsi-etf/nejlepsi-celosvetove-etf', label: 'ETF na celý svět' },
      { href: '/nejlepsi-etf/nejlevnejsi-etf', label: 'Nejlevnější ETF' },
      { href: '/nejlepsi-etf/nejlepsi-dividendove-etf', label: 'Dividendové ETF' },
    ],
  },
  {
    // SEO audit 20. 10. 2026: datové články (Kolik vydělaly ETF, Stroj času) měly málo interních odkazů → patička;
    // „O nás“ a „Metodika“ jsou ve spodní liště.
    heading: 'Data a plánování',
    links: [
      { href: '/co-rikaji-data', label: 'Co říkají data' },
      { href: '/kolik-vydelaly-etf', label: 'Kolik vydělaly ETF' },
      { href: '/stroj-casu', label: 'Korunový stroj času' },
      { href: '/fire', label: 'FIRE a nezávislost' },
      { href: '/kolik-investovat-mesicne', label: 'Kolik investovat měsíčně' },
      { href: '/investicni-kalkulacka', label: 'Investiční kalkulačka' },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Mobil (3.8, 11. 11. 2026): odkazové sloupce sbalené do řádků s tlačítkem (PatickaSloupec) – patička
            842 px → ~500 px bez ořezání obsahu. Dřív po dvou sloupcích (a ještě dřív pod sebou → 978 px). */}
        <div className="grid grid-cols-1 gap-y-4 md:gap-x-6 md:gap-y-8 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          {/* Brand + USP */}
          <div className="min-w-0">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-slate-900">
              <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
              ETF průvodce.cz
            </Link>
            <p className="mt-2 md:mt-3 text-sm text-slate-500 leading-relaxed max-w-xs">
              Nezávislý průvodce ETF pro české investory. Výnosy přepočtené do korun, srovnání, kalkulačky a vzdělávací obsah.
            </p>
            <p className="mt-2 md:mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-teal-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční — bez provizí a reklam
            </p>
          </div>

          {/* Odkazové sloupce (mobil: sbalitelné řádky v jednom bloku) */}
          <div className="border-t border-slate-100 md:contents md:border-0">
            {COLUMNS.map((col) => <PatickaSloupec key={col.heading} nadpis={col.heading} odkazy={col.links} />)}
          </div>
        </div>

        {/* Spodní lišta: copyright + disclaimer */}
        <div className="mt-5 md:mt-10 pt-4 md:pt-6 md:border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>© {year} ETF průvodce.cz</span>
            <Link href="/o-nas" className="hover:text-teal-700">O nás</Link>
            <Link href="/metodika" className="hover:text-teal-700">Metodika a zdroje dat</Link>
          </p>
          <p className="max-w-xl text-center sm:text-right leading-relaxed">
            Obsah má vzdělávací charakter a nepředstavuje investiční ani daňové doporučení. Minulá výkonnost nezaručuje budoucí výnosy.
          </p>
        </div>
      </div>
    </footer>
  );
}

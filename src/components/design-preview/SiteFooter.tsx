import Link from 'next/link';
import { TrendingUp, ShieldCheck } from 'lucide-react';

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
    ],
  },
  {
    heading: 'Nástroje',
    links: [
      { href: '/srovnani', label: 'Srovnávač ETF' },
      { href: '/zebricky', label: 'Žebříčky ETF' },
      { href: '/portfolio-strategie', label: 'Modelová portfolia' },
      { href: '/kalkulacky', label: 'Kalkulačky' },
      { href: '/kde-koupit', label: 'Kde koupit ETF' },
    ],
  },
  {
    heading: 'Plánování',
    links: [
      { href: '/fire', label: 'FIRE a nezávislost' },
      { href: '/kolik-investovat-mesicne', label: 'Kolik investovat měsíčně' },
      { href: '/investicni-kalkulacka', label: 'Investiční kalkulačka' },
      { href: '/o-nas', label: 'O nás' },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + USP */}
          <div className="min-w-0">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-slate-900">
              <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
              ETF průvodce.cz
            </Link>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-xs">
              Nezávislý průvodce ETF pro české investory. Výnosy přepočtené do korun, srovnání, kalkulačky a vzdělávací obsah.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-teal-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční — bez provizí a reklam
            </p>
          </div>

          {/* Odkazové sloupce */}
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{col.heading}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-600 hover:text-teal-700">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Spodní lišta: copyright + disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {year} ETF průvodce.cz</p>
          <p className="max-w-xl text-center sm:text-right leading-relaxed">
            Obsah má vzdělávací charakter a nepředstavuje investiční ani daňové doporučení. Minulá výkonnost nezaručuje budoucí výnosy.
          </p>
        </div>
      </div>
    </footer>
  );
}

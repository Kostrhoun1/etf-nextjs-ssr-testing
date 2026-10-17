'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Hlavní navigace – JEDNO místo pro celý web (dřív zkopírovaná ve 43 stránkách).
 * Odkazy sdílí i MobileMenu. Backtest a „Co říkají data" přidány 17. 10. 2026: nejsilnější
 * obsah webu (výsledky v Kč) nebyl z navigace dostupný vůbec (deep dive, UX audit).
 *
 * Bod zlomu `lg` = stejný jako HeaderSearch; pod ním je MobileMenu (s hledáním). Dřív byla
 * navigace od `md`, takže mezi 768 a 1024 px nebylo hledání nikde.
 */
export const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/pruvodce', label: 'Co jsou ETF' },
  { href: '/zebricky', label: 'Žebříčky' },
  { href: '/srovnani', label: 'Srovnání' },
  { href: '/backtest', label: 'Backtest' },
  { href: '/co-rikaji-data', label: 'Co říkají data' },
  { href: '/portfolio-strategie', label: 'Portfolia' },
  { href: '/kalkulacky', label: 'Kalkulačky' },
  { href: '/kde-koupit', label: 'Kde koupit' },
];

export default function SiteNav() {
  const path = usePathname() || '';
  return (
    <nav className="hidden lg:flex items-center gap-2.5 xl:gap-5 mx-3 text-sm text-slate-600">
      {NAV_LINKS.map((l) => {
        const aktivni = path === l.href || path.startsWith(l.href + '/');
        return (
          <Link key={l.href} href={l.href} aria-current={aktivni ? 'page' : undefined}
            className={`whitespace-nowrap ${aktivni ? 'text-teal-700 font-medium' : 'hover:text-slate-900'}`}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

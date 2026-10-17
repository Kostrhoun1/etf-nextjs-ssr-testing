'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Hlavní navigace – JEDNO místo pro celý web (dřív zkopírovaná ve 43 stránkách).
 * Odkazy sdílí i MobileMenu.
 *
 * 17. 10. 2026 (rozhodnutí majitele): 6 položek místo 8 – osm bylo přeplácané (doporučení 5–7)
 * a při 1024 px se nevešlo. „Co jsou ETF“, „Co říkají data“ a „Portfolia“ jsou pod „Průvodce“
 * (rozcestník nahoře na /pruvodce); Backtest zůstal samostatně – nejnavštěvovanější stránka.
 * `takyAktivni` = další cesty, na kterých se položka zvýrazní.
 *
 * Bod zlomu `lg` = stejný jako HeaderSearch; pod ním je MobileMenu (s hledáním).
 */
export const NAV_LINKS: { href: string; label: string; takyAktivni?: string[] }[] = [
  { href: '/zebricky', label: 'Žebříčky', takyAktivni: ['/nejlepsi-etf'] },
  { href: '/srovnani', label: 'Srovnání' },
  { href: '/backtest', label: 'Backtest' },
  { href: '/kalkulacky', label: 'Kalkulačky' },
  { href: '/pruvodce', label: 'Průvodce', takyAktivni: ['/co-rikaji-data', '/portfolio-strategie'] },
  { href: '/kde-koupit', label: 'Kde koupit', takyAktivni: ['/recenze', '/srovnani-brokeru'] },
];

export default function SiteNav() {
  const path = usePathname() || '';
  return (
    <nav className="hidden lg:flex items-center gap-4 xl:gap-6 mx-3 text-sm text-slate-600">
      {NAV_LINKS.map((l) => {
        const aktivni = [l.href, ...(l.takyAktivni ?? [])].some((h) => path === h || path.startsWith(h + '/'));
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

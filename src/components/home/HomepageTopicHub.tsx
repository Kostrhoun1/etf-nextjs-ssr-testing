import React from 'react';
import Link from 'next/link';

/**
 * Rozcestník na homepage – husté interní prolinkování do indexovatelných sekcí.
 *
 * Homepage je nejsilnější stránka domény; dříve odkazovala jen na pár stránek
 * a plýtvala link-equity na noindex /etf/[ISIN]. Tento blok předává autoritu
 * do kategorií, populárních srovnání a kalkulaček (= příčina č. 2 neindexace).
 */

const CATEGORIES: { href: string; label: string }[] = [
  { href: '/nejlepsi-etf/nejlepsi-celosvetove-etf', label: 'Celosvětové ETF' },
  { href: '/nejlepsi-etf/nejlepsi-sp500-etf', label: 'S&P 500 ETF' },
  { href: '/nejlepsi-etf/nejlepsi-americke-etf', label: 'Americké ETF' },
  { href: '/nejlepsi-etf/nejlepsi-evropske-etf', label: 'Evropské ETF' },
  { href: '/nejlepsi-etf/nejlepsi-nasdaq-etf', label: 'Nasdaq 100 ETF' },
  { href: '/nejlepsi-etf/nejlepsi-emerging-markets-etf', label: 'Rozvíjející se trhy' },
  { href: '/nejlepsi-etf/nejlepsi-dividendove-etf', label: 'Dividendové ETF' },
  { href: '/nejlepsi-etf/nejlepsi-dluhopisove-etf', label: 'Dluhopisové ETF' },
  { href: '/nejlepsi-etf/nejlepsi-technologicke-etf', label: 'Technologické ETF' },
  { href: '/nejlepsi-etf/nejlepsi-esg-etf', label: 'ESG / udržitelné ETF' },
  { href: '/nejlepsi-etf/nejlevnejsi-etf', label: 'Nejlevnější ETF' },
  { href: '/nejlepsi-etf', label: 'Všechny kategorie →' },
];

const COMPARISONS: { href: string; label: string }[] = [
  { href: '/srovnani-etf/vwce-vs-cspx', label: 'VWCE vs CSPX' },
  { href: '/srovnani-etf/iwda-vs-cspx', label: 'IWDA vs CSPX' },
  { href: '/srovnani-etf/vwce-vs-iwda', label: 'VWCE vs IWDA' },
  { href: '/srovnani-etf/swrd-vs-iwda', label: 'SWRD vs IWDA' },
  { href: '/srovnani-etf/cspx-vs-vuaa', label: 'CSPX vs VUAA' },
  { href: '/srovnani-etf/vwce-vs-vwrl', label: 'VWCE vs VWRL' },
  { href: '/srovnani-etf', label: 'Srovnat libovolné ETF →' },
];

const CALCULATORS: { href: string; label: string }[] = [
  { href: '/kalkulacky/investicni-kalkulacka', label: 'Investiční kalkulačka' },
  { href: '/kalkulacky/kalkulacka-poplatku-etf', label: 'Kalkulačka poplatků' },
  { href: '/kalkulacky/fire-kalkulacka', label: 'FIRE kalkulačka' },
  { href: '/kalkulacky/backtest-portfolia', label: 'Backtest portfolia' },
  { href: '/kalkulacky/monte-carlo-simulator', label: 'Monte Carlo simulátor' },
  { href: '/kalkulacky', label: 'Všechny kalkulačky →' },
];

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-gray-600 hover:text-violet-700 transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomepageTopicHub() {
  return (
    <section className="bg-white rounded-lg border border-gray-100 p-8" aria-label="Rozcestník obsahu">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Prozkoumejte ETF podle toho, co hledáte
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <LinkColumn title="Žebříčky ETF" links={CATEGORIES} />
        <LinkColumn title="Populární srovnání" links={COMPARISONS} />
        <LinkColumn title="Kalkulačky" links={CALCULATORS} />
      </div>
    </section>
  );
}

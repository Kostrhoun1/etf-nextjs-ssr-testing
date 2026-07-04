import Link from 'next/link';
import type { ComparisonETF } from '@/lib/etf-data';
import { Check, Minus } from 'lucide-react';
import { ter, money, pct, dist, repl, domicile } from '@/components/design-preview/CategoryUI';
import { pickReturn, curLabel, type Currency } from '@/components/design-preview/currency';

/* ------------------------------------------------------------------ *
 * Pomocné komponenty SPECIFICKÉ pro stránku "Srovnání dvou ETF".
 * Prefix "Srovnani", aby nekolidovaly s jinými pody.
 * Helpery ter/money/pct/dist/repl/domicile se importují z CategoryUI.
 * ------------------------------------------------------------------ */

/* Přepočet stáří fondu z inception_date (řetězec typu "23 July 2019"). */
export function fundAge(inception: string | null): string {
  if (!inception) return '—';
  const t = Date.parse(inception);
  if (Number.isNaN(t)) return '—';
  const years = (Date.now() - t) / (365.25 * 24 * 3600 * 1000);
  if (years < 1) return 'méně než rok';
  return `${Math.floor(years)} let na trhu`;
}

/* Karta jednoho fondu v souboji v HERO panelu (na tmavém pozadí). */
export function SrovnaniSoubojKarta({
  etf,
  podtitul,
  accent,
}: {
  etf: ComparisonETF;
  podtitul: string;
  accent: 'teal' | 'sky';
}) {
  const ring = accent === 'teal' ? 'border-teal-500/40' : 'border-slate-500/40';
  const chip = accent === 'teal' ? 'text-teal-300' : 'text-slate-300';
  return (
    <div className={`flex-1 rounded-xl bg-white/5 border ${ring} px-5 py-4`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${chip}`}>{podtitul}</p>
      <p className="mt-1 text-xl font-bold text-white">{etf.primary_ticker ?? '—'}</p>
      <p className="text-xs text-slate-400 leading-snug">{etf.name}</p>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-400">Poplatek (TER)</dt>
          <dd className="tabular-nums font-medium text-white">{ter(etf.ter_numeric)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-400">Velikost fondu</dt>
          <dd className="tabular-nums font-medium text-white">{money(etf.fund_size_numeric)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-400">Počet firem</dt>
          <dd className="tabular-nums font-medium text-white">
            {etf.total_holdings ? etf.total_holdings.toLocaleString('cs-CZ') : '—'}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/* Řádek srovnávací tabulky parametrů – vítěz se zvýrazní. */
type RadekProps = {
  label: string;
  hint?: string;
  v1: React.ReactNode;
  v2: React.ReactNode;
  /** 1 = vyhrává fond 1, 2 = fond 2, 0 = remíza / nehodnotí se */
  winner?: 0 | 1 | 2;
};

function CellMark({ win }: { win: boolean }) {
  return win ? (
    <Check className="inline-block w-3.5 h-3.5 text-emerald-600 ml-1 -mt-0.5" />
  ) : null;
}

/* Desktopová tabulka parametrů (≥ md). */
export function SrovnaniParamTabulka({
  ticker1,
  ticker2,
  rows,
}: {
  ticker1: string;
  ticker2: string;
  rows: RadekProps[];
}) {
  return (
    <div className="hidden md:block rounded-lg border border-slate-200 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-600 text-left">
            <th className="py-3 px-4 font-medium w-2/5">Parametr</th>
            <th className="py-3 px-4 font-medium text-right">{ticker1}</th>
            <th className="py-3 px-4 font-medium text-right">{ticker2}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {rows.map((r) => (
            <tr key={r.label} className="hover:bg-slate-50/60">
              <td className="py-3 px-4">
                <span className="font-medium text-slate-800">{r.label}</span>
                {r.hint && <span className="block text-xs text-slate-400 mt-0.5">{r.hint}</span>}
              </td>
              <td className={`py-3 px-4 text-right tabular-nums ${r.winner === 1 ? 'bg-emerald-50/60 font-semibold text-slate-900' : ''}`}>
                {r.v1}
                <CellMark win={r.winner === 1} />
              </td>
              <td className={`py-3 px-4 text-right tabular-nums ${r.winner === 2 ? 'bg-emerald-50/60 font-semibold text-slate-900' : ''}`}>
                {r.v2}
                <CellMark win={r.winner === 2} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Mobilní varianta tabulky parametrů – stacked karty (< md). */
export function SrovnaniParamKarty({
  ticker1,
  ticker2,
  rows,
}: {
  ticker1: string;
  ticker2: string;
  rows: RadekProps[];
}) {
  return (
    <div className="md:hidden space-y-2">
      {rows.map((r) => (
        <div key={r.label} className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-800">{r.label}</p>
          {r.hint && <p className="text-xs text-slate-400 mt-0.5">{r.hint}</p>}
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div className={`rounded-md px-3 py-2 ${r.winner === 1 ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'}`}>
              <p className="text-xs text-slate-500">{ticker1}</p>
              <p className="tabular-nums font-medium text-slate-900 flex items-center">
                {r.v1}
                <CellMark win={r.winner === 1} />
              </p>
            </div>
            <div className={`rounded-md px-3 py-2 ${r.winner === 2 ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'}`}>
              <p className="text-xs text-slate-500">{ticker2}</p>
              <p className="tabular-nums font-medium text-slate-900 flex items-center">
                {r.v2}
                <CellMark win={r.winner === 2} />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Sestaví řádky tabulky parametrů z dvojice fondů.
   Výnosy jsou přepočtené do korun (return_*_czk) – korunový úhel je USP webu. */
export function buildParamRows(etf1: ComparisonETF, etf2: ComparisonETF, cur: Currency = 'CZK'): RadekProps[] {
  const lowerTerWin = (a: number | null, b: number | null): 0 | 1 | 2 => {
    if (a == null || b == null || a === b) return 0;
    return a < b ? 1 : 2;
  };
  const higherWin = (a: number | null, b: number | null): 0 | 1 | 2 => {
    if (a == null || b == null || a === b) return 0;
    return a > b ? 1 : 2;
  };
  const o1 = etf1 as unknown as Record<string, unknown>;
  const o2 = etf2 as unknown as Record<string, unknown>;
  const r1 = (p: string) => pickReturn(o1, p, cur);
  const r2 = (p: string) => pickReturn(o2, p, cur);

  return [
    {
      label: 'Roční poplatek (TER)',
      hint: 'Kolik si fond ročně strhne ze spravovaného majetku',
      v1: ter(etf1.ter_numeric),
      v2: ter(etf2.ter_numeric),
      winner: lowerTerWin(etf1.ter_numeric, etf2.ter_numeric),
    },
    {
      label: 'Velikost fondu',
      hint: 'Vyšší majetek = lepší likvidita a nižší riziko zrušení',
      v1: money(etf1.fund_size_numeric),
      v2: money(etf2.fund_size_numeric),
      winner: higherWin(etf1.fund_size_numeric, etf2.fund_size_numeric),
    },
    {
      label: 'Počet firem v indexu',
      hint: 'Více firem = širší rozložení rizika (diverzifikace)',
      v1: etf1.total_holdings ? etf1.total_holdings.toLocaleString('cs-CZ') : '—',
      v2: etf2.total_holdings ? etf2.total_holdings.toLocaleString('cs-CZ') : '—',
      winner: 0, // víc/míň firem není „lepší/horší", je to jiná strategie
    },
    {
      label: 'Sledovaný index',
      v1: etf1.index_name ?? '—',
      v2: etf2.index_name ?? '—',
      winner: 0,
    },
    {
      label: `Výnos 1 rok (${curLabel[cur]})`,
      hint: cur === 'CZK' ? 'Přepočteno do korun kurzem ČNB – tak, jak výnos reálně pocítí český investor' : cur === 'USD' ? 'Původní výnos v dolarech (bez pohybu kurzu vůči koruně)' : 'Výnos v eurech (báze fondu, bez pohybu kurzu vůči koruně)',
      v1: pct(r1('1y')),
      v2: pct(r2('1y')),
      winner: higherWin(r1('1y'), r2('1y')),
    },
    {
      label: `Výnos 3 roky (${curLabel[cur]})`,
      v1: pct(r1('3y')),
      v2: pct(r2('3y')),
      winner: higherWin(r1('3y'), r2('3y')),
    },
    {
      label: `Výnos 5 let (${curLabel[cur]})`,
      v1: pct(r1('5y')),
      v2: pct(r2('5y')),
      winner: higherWin(r1('5y'), r2('5y')),
    },
    {
      label: 'Dividendový výnos',
      hint: 'Roční dividenda vůči ceně (u akumulačních fondů se reinvestuje uvnitř)',
      v1: etf1.current_dividend_yield_numeric != null ? `${etf1.current_dividend_yield_numeric.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} %` : '—',
      v2: etf2.current_dividend_yield_numeric != null ? `${etf2.current_dividend_yield_numeric.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} %` : '—',
      winner: 0,
    },
    {
      label: 'Kolísavost (1 rok)',
      hint: 'Roční volatilita ceny – nižší číslo znamená klidnější průběh',
      v1: etf1.volatility_1y != null ? `${etf1.volatility_1y.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %` : '—',
      v2: etf2.volatility_1y != null ? `${etf2.volatility_1y.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %` : '—',
      winner: lowerTerWin(etf1.volatility_1y, etf2.volatility_1y),
    },
    {
      label: 'Max. pokles (1 rok)',
      hint: 'Největší dočasný propad z vrcholu na dno – blíž k nule je lepší',
      v1: pct(etf1.max_drawdown_1y),
      v2: pct(etf2.max_drawdown_1y),
      winner: higherWin(etf1.max_drawdown_1y, etf2.max_drawdown_1y),
    },
    {
      label: 'Výplata dividend',
      v1: dist(etf1.distribution_policy),
      v2: dist(etf2.distribution_policy),
      winner: 0,
    },
    {
      label: 'Stáří fondu',
      hint: 'Delší historie = víc dat o chování fondu v různých obdobích',
      v1: fundAge(etf1.inception_date),
      v2: fundAge(etf2.inception_date),
      winner: 0,
    },
    {
      label: 'Způsob replikace',
      hint: 'Fyzická = drží reálné akcie; swap = syntetická přes protistranu',
      v1: repl(etf1.replication),
      v2: repl(etf2.replication),
      winner: 0,
    },
    {
      label: 'Domicil (sídlo fondu)',
      hint: 'Irský domicil = bez formuláře W-8BEN pro českého investora',
      v1: domicile(etf1.fund_domicile),
      v2: domicile(etf2.fund_domicile),
      winner: 0,
    },
    {
      label: 'Měna fondu',
      v1: etf1.fund_currency ?? '—',
      v2: etf2.fund_currency ?? '—',
      winner: 0,
    },
    {
      label: 'ISIN',
      v1: etf1.isin,
      v2: etf2.isin,
      winner: 0,
    },
  ];
}

/* Malý štítek „remíza/shodné" pro řádky, kde se fondy neliší. */
export function SrovnaniShodne() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
      <Minus className="w-3 h-3" /> shodné
    </span>
  );
}

/* Odkaz na detail fondu (teal, sjednocený jazyk). */
export function SrovnaniDetailLink({ isin, children }: { isin: string; children: React.ReactNode }) {
  return (
    <Link href={`/design-preview/etf/${isin}`} className="text-teal-700 hover:text-teal-800 font-medium">
      {children}
    </Link>
  );
}

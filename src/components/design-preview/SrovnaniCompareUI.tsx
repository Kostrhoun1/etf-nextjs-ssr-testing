import Link from 'next/link';
import type { ComparisonETF } from '@/lib/etf-data';
import { Check, Minus } from 'lucide-react';
import { repl, domicile } from '@/components/design-preview/CategoryUI';
import { terFmt, procenta, velikostFondu, celeCislo } from '@/lib/formatyCisel';
import { distKind } from '@/utils/distribution';
import { druhKomodity, VYPLATA_ACC, VYPLATA_DIST, DIV_VYNOS_ACC, DIV_VYNOS_ACC_TIP } from '@/lib/dividendyFondu';
import { indexFonduLabel } from '@/utils/indexNormalization';

// Jednotné formáty (kolo 5): „0,07 %“, „+12,5 %“ / „−15,9 %“, „139,4 mld. €“ – src/lib/formatyCisel.ts.
const ter = (v: number | null) => terFmt(v);
const pct = (v: number | null) => procenta(v);
const money = (v: number | null, _cur?: string | null) => velikostFondu(v);

/** Typ výplaty; komodita/krypto v akumulační třídě = „Nevyplácí (komodita)“ jako na detailu fondu. */
function vyplata(e: ComparisonETF): string {
  const k = druhKomodity(e.category, e.name);
  const kind = distKind(e.distribution_policy, e.distribution_frequency);
  if (k && kind === 'acc') return `Nevyplácí (${k})`;
  // Jednotné názvy (kolo 5): Reinvestuje / Vyplácí – jako detail, porovnání a srovnávač.
  return kind === 'acc' ? VYPLATA_ACC : kind === 'dist' ? VYPLATA_DIST : '—';
}

/* Dividendový výnos stejně jako porovnání (PorovnaniTable): „—“ = údaj chybí; akumulační fond a komodita
   dividendy nevyplácejí → slovy (revize kola 4: dvojice „—“, porovnání „nevyplácí“ u téhož fondu). */
function dividendovyVynos(e: ComparisonETF): React.ReactNode {
  const d = e.current_dividend_yield_numeric;
  if (d != null && d > 0) return procenta(d, 2, false);
  const kind = distKind(e.distribution_policy, e.distribution_frequency);
  if (druhKomodity(e.category, e.name) && kind !== 'dist') return <span className="text-slate-500">nevyplácí</span>;
  if (kind === 'acc') return <span className="whitespace-nowrap text-slate-500" title={DIV_VYNOS_ACC_TIP}>{DIV_VYNOS_ACC}</span>;
  return '—';
}
import { pickReturn, curLabel, type Currency } from '@/components/design-preview/currency';
import { platnyTicker } from '@/lib/ticker';
import EmitentLogo from '@/components/home/EmitentLogo';
import InfoTip from '@/components/design-preview/InfoTip';

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

/* Karta jednoho fondu v úvodu srovnání (na tmavém pozadí). Kolo 3 (18. 10. 2026): kompaktní, na mobilu
   dvě vedle sebe – první čísla (poplatek, výnos 5 let v Kč) nad zlomem. Barevná tečka = barva fondu
   v grafech (src/lib/barvyFondu.ts). */
export function SrovnaniSoubojKarta({
  etf,
  podtitul,
  barva,
  ticker,
  odlehly = false,
}: {
  etf: ComparisonETF;
  podtitul: string;
  /** Barva fondu z palety barvyFondu (stejná jako v grafu). */
  barva: string;
  /** Jméno fondu na stránce (ticker z XETRA), např. „SXR8“. */
  ticker?: string;
  /** Výnos fondu mimo trh (src/lib/trhy.ts) → výnos neukazovat. */
  odlehly?: boolean;
}) {
  const r5 = odlehly ? null : etf.return_5y_czk;
  const r3 = odlehly ? null : etf.return_3y_czk;
  const vynos = r5 != null ? { label: '5 let v Kč', v: r5 } : { label: '3 roky v Kč', v: r3 };
  return (
    <div className="min-w-0 flex-1 rounded-xl bg-white/[0.06] ring-1 ring-white/10 p-3 md:px-5 md:py-4">
      <div className="flex items-center gap-2 min-w-0">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: barva }} aria-hidden="true" />
        <p className="text-lg md:text-2xl font-bold text-white leading-tight">{ticker ?? platnyTicker(etf.primary_ticker) ?? '—'}</p>
        <span className="ml-auto hidden md:block"><EmitentLogo nazev={etf.name} size={28} /></span>
      </div>
      <p className="mt-0.5 text-[11px] md:text-xs text-slate-400 leading-snug line-clamp-2">{podtitul}</p>
      <dl className="mt-2.5 space-y-1 text-xs md:text-sm">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-slate-400">Poplatek</dt>
          <dd className="tabular-nums font-semibold text-white">{ter(etf.ter_numeric)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-slate-400">{vynos.label}</dt>
          <dd className={`tabular-nums font-semibold ${vynos.v == null ? 'text-slate-500' : vynos.v >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>{pct(vynos.v)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-slate-400">Firem</dt>
          <dd className="tabular-nums font-semibold text-white">{etf.total_holdings ? celeCislo(etf.total_holdings) : '—'}</dd>
        </div>
        <div className="hidden md:flex items-baseline justify-between gap-2">
          <dt className="text-slate-400">Velikost</dt>
          <dd className="tabular-nums font-semibold text-white">{money(etf.fund_size_numeric, etf.fund_currency)}</dd>
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
    // Bez overflow-hidden na obalu – jinak nefunguje plovoucí záhlaví (sticky top-14 pod hlavičkou webu, 16 řádků).
    <div className="hidden md:block rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-600 text-left [&>th]:sticky [&>th]:top-14 [&>th]:z-10 [&>th]:bg-slate-50 [&>th]:shadow-[inset_0_-1px_0_#e2e8f0]">
            <th className="py-3 px-4 font-medium w-2/5 rounded-tl-lg">Parametr</th>
            <th className="py-3 px-4 font-medium text-right">{ticker1}</th>
            <th className="py-3 px-4 font-medium text-right rounded-tr-lg">{ticker2}</th>
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

/* Mobilní varianta tabulky parametrů (< md). Kolo 3: kompaktní tabulka (parametr | fond 1 | fond 2)
   místo karet po řádcích – dřív 16 karet ≈ 1 800 px. Vysvětlivky v tooltipu. */
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
    <div className="md:hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full table-fixed text-[13px]">
        <thead>
          <tr className="text-xs text-slate-500 [&>th]:sticky [&>th]:top-14 [&>th]:z-10 [&>th]:bg-slate-50 [&>th]:shadow-[inset_0_-1px_0_#e2e8f0]">
            <th className="w-[38%] py-2 pl-3 pr-1 text-left font-medium rounded-tl-lg">Parametr</th>
            <th className="py-2 px-1 text-right font-semibold text-slate-700">{ticker1}</th>
            <th className="py-2 pl-1 pr-3 text-right font-semibold text-slate-700 rounded-tr-lg">{ticker2}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="py-2 pl-3 pr-1 align-top text-slate-600 leading-snug">{r.label}{r.hint && <> <InfoTip label={r.hint}><span className="sr-only">Vysvětlení</span></InfoTip></>}</td>
              <td className={`py-2 px-1 text-right align-top tabular-nums whitespace-nowrap ${r.winner === 1 ? 'font-semibold text-emerald-700' : ''}`}>{r.v1}<CellMark win={r.winner === 1} /></td>
              <td className={`py-2 pl-1 pr-3 text-right align-top tabular-nums whitespace-nowrap ${r.winner === 2 ? 'font-semibold text-emerald-700' : ''}`}>{r.v2}<CellMark win={r.winner === 2} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Sestaví řádky tabulky parametrů z dvojice fondů.
   Výnosy jsou přepočtené do korun (return_*_czk) – korunový úhel je USP webu. */
export function buildParamRows(etf1: ComparisonETF, etf2: ComparisonETF, cur: Currency = 'CZK'): RadekProps[] {
  // Vítěz jen při rozdílu, který je VIDĚT (po zaokrouhlení na zobrazená desetinná místa) – dřív SXR8 „vyhrál“
  // nad VUSA při +68,2 % vs +68,2 % (test s uživatelem 18. 10. 2026).
  const zaokr = (x: number, dp: number) => Math.round(x * 10 ** dp) / 10 ** dp;
  const lowerTerWin = (a: number | null, b: number | null, dp = 2): 0 | 1 | 2 => {
    if (a == null || b == null || zaokr(a, dp) === zaokr(b, dp)) return 0;
    return a < b ? 1 : 2;
  };
  const higherWin = (a: number | null, b: number | null, dp = 1): 0 | 1 | 2 => {
    if (a == null || b == null || zaokr(a, dp) === zaokr(b, dp)) return 0;
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
      v1: money(etf1.fund_size_numeric, etf1.fund_currency),
      v2: money(etf2.fund_size_numeric, etf2.fund_currency),
      winner: higherWin(etf1.fund_size_numeric, etf2.fund_size_numeric, -2),
    },
    {
      label: 'Počet pozic ve fondu',
      hint: 'Více firem = širší rozložení rizika (diverzifikace)',
      v1: etf1.total_holdings ? celeCislo(etf1.total_holdings) : '—',
      v2: etf2.total_holdings ? celeCislo(etf2.total_holdings) : '—',
      winner: 0, // víc/míň firem není „lepší/horší", je to jiná strategie
    },
    {
      label: 'Sledovaný index',
      // Stejná funkce jako porovnání (PorovnaniTable) a detail: index_name bývá prázdný řetězec (SPYI) → „—“ ne prázdno.
      v1: indexFonduLabel(etf1) ?? '—',
      v2: indexFonduLabel(etf2) ?? '—',
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
      hint: 'Kolik fond za rok vyplatil na dividendách vůči své ceně. Akumulační fondy dividendy nevyplácejí – reinvestují je uvnitř fondu.',
      v1: dividendovyVynos(etf1),
      v2: dividendovyVynos(etf2),
      winner: 0,
    },
    {
      label: 'Kolísavost (1 rok, v EUR)',
      hint: 'Roční volatilita ceny – nižší číslo znamená klidnější průběh',
      v1: procenta(etf1.volatility_1y, 1, false),
      v2: procenta(etf2.volatility_1y, 1, false),
      winner: lowerTerWin(etf1.volatility_1y, etf2.volatility_1y, 1),
    },
    {
      label: 'Max. pokles (1 rok, v EUR)',
      hint: 'Největší dočasný propad z vrcholu na dno – blíž k nule je lepší',
      v1: pct(etf1.max_drawdown_1y),
      v2: pct(etf2.max_drawdown_1y),
      winner: higherWin(etf1.max_drawdown_1y, etf2.max_drawdown_1y),
    },
    {
      label: 'Výplata dividend',
      v1: vyplata(etf1),
      v2: vyplata(etf2),
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
      v1: <span className="font-mono text-[11px] md:text-sm">{etf1.isin}</span>,
      v2: <span className="font-mono text-[11px] md:text-sm">{etf2.isin}</span>,
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
    <Link href={`/etf/${isin}`} className="text-teal-700 hover:text-teal-800 font-medium">
      {children}
    </Link>
  );
}

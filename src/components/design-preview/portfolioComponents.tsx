import Link from 'next/link';
import { ArrowRight, History } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import {
  barvaSlozky,
  backtestOdkaz,
  BEZ_HISTORIE,
  narocnost,
  RIZIKO_TECKY,
  type PortfolioModel,
  type PortfolioRisk,
} from '@/components/design-preview/portfolioData';

// Procento v české notaci (7,5 % místo 7.5 %), nezlomitelná mezera před %.
export const fmtPct = (v: number) =>
  `${Number.isInteger(v) ? v : v.toFixed(1).replace('.', ',')} %`;

// Mapa isin → korunový výnos za 1 rok (z DB).
export type ReturnsMap = Record<string, number | null | undefined>;

/** Historie z backtestu (předpočet na serveru): CAGR a max. pokles v Kč, desetinně. */
export interface HistoriePortfolia {
  cagr: number; maxPokles: number; od: string; do: string;
  /** Část složení je v backtestu nahrazená podobným indexem (proxyNote z PORTFOLIO_BACKTEST). */
  proxy?: string;
  /** Krátká viditelná věta, čím je historie počítaná (nahrada z PORTFOLIO_BACKTEST). */
  nahrada?: string;
  /** Odkaz do backtestu se stejnými vstupy včetně konce dat (backtestOdkaz(slug, do)). */
  odkaz?: string | null;
}
export type HistorieMap = Record<string, HistoriePortfolia | null | undefined>;

// Vážený korunový výnos portfolia za 1 rok – jen když mají data VŠECHNY složky (jinak „—“ místo
// renormalizovaného čísla, které by tiše vynechalo část portfolia; pravidlo č. 1, stejně jako homepage).
function weighted1yCzk(model: PortfolioModel, returns?: ReturnsMap): number | null {
  if (!returns) return null;
  let sum = 0;
  for (const a of model.allocations) {
    const v = returns[a.isin];
    if (v == null) return null;
    sum += v * a.percentage;
  }
  return sum / 100;
}

const pctZnam = (v: number, digits = 1) =>
  `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toLocaleString('cs-CZ', { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`;
const mesicRok = (iso: string) => { const [y, m] = iso.split('-'); return `${Number(m)}/${y}`; };

/* ---------- Riziko: 3 tečky + slovo (stejně jako homepage) ---------- */
export function RizikoTecky({ risk, inverse = false }: { risk: PortfolioRisk; inverse?: boolean }) {
  const n = RIZIKO_TECKY[risk];
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap text-xs ${inverse ? 'text-slate-300' : 'text-slate-600'}`} title={`Riziko: ${risk} (${n} ze 3)`}>
      {[1, 2, 3].map((d) => (
        <span key={d} className={`inline-block h-1.5 w-1.5 rounded-full ${d <= n ? (inverse ? 'bg-white' : 'bg-slate-700') : inverse ? 'bg-white/25' : 'bg-slate-200'}`} />
      ))}
      <span className="ml-0.5">{risk}</span>
    </span>
  );
}

/* ---------- Segmentovaný pruh složení z REÁLNÝCH procent ---------- */
export function PortfolioBar({ model, showLegend = true }: { model: PortfolioModel; showLegend?: boolean }) {
  return (
    <div>
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-white" role="img" aria-label={`Složení: ${model.allocations.map((a) => `${a.label} ${fmtPct(a.percentage)}`).join(', ')}`}>
        {model.allocations.map((a, i) => (
          <div key={i} style={{ width: `${a.percentage}%`, backgroundColor: barvaSlozky(a) }} title={`${a.label} ${fmtPct(a.percentage)}`} />
        ))}
      </div>
      {showLegend && (
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:flex sm:flex-wrap sm:gap-x-3.5">
          {model.allocations.map((a, i) => (
            <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: barvaSlozky(a) }} />
              <span className="font-medium text-slate-700 leading-tight">{a.label}</span>
              <span className="ml-auto tabular-nums text-slate-500 sm:ml-0">{fmtPct(a.percentage)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Metriky z backtestu (karta) ----------
   Proxy složení = „≈“ u čísla + VIDITELNÁ věta, čím je historie počítaná (revize kola 4: jen tooltip nestačil).
   Portfolio bez historie (BEZ_HISTORIE) = „—“ a jedna věta proč. */
function HistorieMetriky({ h, bezHistorie }: { h: HistoriePortfolia | null | undefined; bezHistorie?: string }) {
  const obdobi = h ? `${mesicRok(h.od)}–${mesicRok(h.do)}` : '';
  const ap = h?.proxy ? '≈\u00a0' : '';
  const pozn = h?.proxy ? ` ≈ orientační: ${h.proxy}` : '';
  const chybi = bezHistorie ?? 'Backtest se teď nepodařilo spočítat.';
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="block text-xs text-slate-500">
            <InfoTip label={h ? `Průměrné roční zhodnocení (CAGR) v backtestu ${obdobi}, v korunách, po poplatcích fondů, vyvažování jednou ročně. Historie nezaručuje budoucí výnosy.${pozn}` : chybi}>{h ? `Ročně od ${mesicRok(h.od)}` : 'Ročně v historii'}</InfoTip>
          </span>
          <span className={`tabular-nums text-lg font-bold ${h ? (h.cagr >= 0 ? 'text-slate-900' : 'text-red-700') : 'text-slate-400'}`}>{h ? `${ap}${pctZnam(h.cagr * 100)}` : '—'}</span>
        </div>
        <div>
          <span className="block text-xs text-slate-500">
            <InfoTip label={h ? `Největší propad hodnoty od vrcholu ke dnu kdykoli v témže backtestu (${obdobi}, v Kč).${pozn}` : chybi}>Max. pokles</InfoTip>
          </span>
          <span className={`tabular-nums text-lg font-bold ${h ? 'text-slate-900' : 'text-slate-400'}`}>{h ? `${ap}${pctZnam(h.maxPokles * 100)}` : '—'}</span>
        </div>
      </div>
      {h?.nahrada && <p className="mt-1.5 text-[11px] leading-snug text-slate-500">≈ {h.nahrada}</p>}
      {!h && bezHistorie && <p className="mt-1.5 text-[11px] leading-snug text-slate-500">{bezHistorie}</p>}
    </div>
  );
}

/* ---------- Jedna karta portfolia: jedno hlavní tlačítko (Detail), backtest jako vedlejší odkaz ---------- */
export function PortfolioCard({ model, returns, historie }: { model: PortfolioModel; returns?: ReturnsMap; historie?: HistoriePortfolia | null }) {
  const real1y = weighted1yCzk(model, returns);
  const bt = historie?.odkaz ?? backtestOdkaz(model.slug);
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5 transition-colors hover:border-teal-300"
      data-kontrola-backtest={historie?.odkaz ? `${historie.odkaz}|${historie.cagr}` : undefined}>
      <h3 className="text-base font-bold leading-tight text-slate-900">
        <Link href={`/portfolio-strategie/${model.slug}`} className="hover:text-teal-800">{model.name}</Link>
      </h3>
      <div className="mt-1 mb-2"><RizikoTecky risk={model.risk} /></div>
      <p className="mb-3 text-sm leading-snug text-slate-600">{model.forWhom}</p>
      <PortfolioBar model={model} />
      <p className="mt-3 text-xs text-slate-500">{narocnost(model)}</p>
      {/* KPI dole zarovnané napříč kartami v řadě (mt-auto) – dřív skákaly podle délky legendy. */}
      <div className="mt-auto pt-4">
        <div className="border-t border-slate-100 pt-3">
          <HistorieMetriky h={historie} bezHistorie={BEZ_HISTORIE[model.slug]} />
          <p className="mt-2 text-xs text-slate-500">
            <InfoTip label="Vážený průměr korunových výnosů ETF ve složení za posledních 12 měsíců, bez rebalancování. Když některému fondu data chybí, číslo neukazujeme.">Za 12 měs. v Kč</InfoTip>{' '}
            <span className={`font-semibold tabular-nums ${real1y == null ? 'text-slate-400' : real1y >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{real1y == null ? '—' : pctZnam(real1y)}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-4">
          <Link href={`/portfolio-strategie/${model.slug}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white hover:bg-teal-800">
            Detail <ArrowRight className="h-4 w-4" />
          </Link>
          {bt && (
            <Link href={bt} className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
              <History className="h-4 w-4" /> V backtestu
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

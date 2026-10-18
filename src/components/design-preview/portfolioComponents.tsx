import Link from 'next/link';
import { ArrowRight, History } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import {
  portfolioModels,
  barvaSlozky,
  backtestOdkaz,
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
export interface HistoriePortfolia { cagr: number; maxPokles: number; od: string; do: string }
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
        <ul className="mt-3 grid gap-y-1.5 sm:flex sm:flex-wrap sm:gap-x-3.5">
          {model.allocations.map((a, i) => (
            <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: barvaSlozky(a) }} />
              <span className="font-medium text-slate-700">{a.label}</span>
              <span className="ml-auto tabular-nums text-slate-500 sm:ml-0">{fmtPct(a.percentage)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Metriky z backtestu (karta i detail) ---------- */
function HistorieMetriky({ h }: { h: HistoriePortfolia | null | undefined }) {
  const obdobi = h ? `${mesicRok(h.od)}–${mesicRok(h.do)}` : '';
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <span className="block text-xs text-slate-500">
          <InfoTip label={h ? `Průměrné roční zhodnocení (CAGR) v backtestu ${obdobi}, přepočteno do korun, po poplatcích fondů, rebalancování jednou ročně. Historie nezaručuje budoucí výnosy.` : 'Backtest se teď nepodařilo spočítat.'}>Ročně od {h ? h.od.slice(0, 4) : '—'}</InfoTip>
        </span>
        <span className={`tabular-nums text-lg font-bold ${h ? (h.cagr >= 0 ? 'text-slate-900' : 'text-red-700') : 'text-slate-400'}`}>{h ? pctZnam(h.cagr * 100) : '—'}</span>
      </div>
      <div>
        <span className="block text-xs text-slate-500">
          <InfoTip label={h ? `Největší propad hodnoty od vrcholu ke dnu v témže backtestu (${obdobi}, v Kč).` : 'Backtest se teď nepodařilo spočítat.'}>Max. pokles</InfoTip>
        </span>
        <span className={`tabular-nums text-lg font-bold ${h ? 'text-slate-900' : 'text-slate-400'}`}>{h ? pctZnam(h.maxPokles * 100, 0) : '—'}</span>
      </div>
    </div>
  );
}

/* ---------- Jedna karta portfolia ---------- */
export function PortfolioCard({ model, returns, historie, siroka = false, className = '' }: { model: PortfolioModel; returns?: ReturnsMap; historie?: HistoriePortfolia | null; siroka?: boolean; className?: string }) {
  const real1y = weighted1yCzk(model, returns);
  const bt = backtestOdkaz(model.slug);
  return (
    <div className={`${className} flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-teal-300 ${siroka ? 'lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-8 lg:items-start' : ''}`}>
      <div>
        <div className="mb-1.5 flex items-start justify-between gap-3">
          <h3 className="text-base font-bold leading-tight text-slate-900">
            <Link href={`/portfolio-strategie/${model.slug}`} className="hover:text-teal-800">{model.name}</Link>
          </h3>
          <RizikoTecky risk={model.risk} />
        </div>
        <p className="mb-4 text-sm leading-snug text-slate-500">{model.tagline}</p>
      </div>

      <div className={siroka ? 'lg:pt-1' : ''}>
        <PortfolioBar model={model} />
      </div>

      <div className={`flex flex-1 flex-col ${siroka ? 'mt-4 lg:mt-0' : 'mt-4'}`}>
        <div className={`border-t border-slate-100 pt-4 ${siroka ? 'lg:border-0 lg:pt-0' : ''}`}>
          <HistorieMetriky h={historie} />
          <p className="mt-2 text-xs text-slate-500">
            <InfoTip label="Vážený průměr korunových výnosů ETF ve složení za posledních 12 měsíců, bez rebalancování. Když některému fondu data chybí, číslo neukazujeme.">Za 12 měs. v Kč</InfoTip>{' '}
            <span className={`font-semibold tabular-nums ${real1y == null ? 'text-slate-400' : real1y >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{real1y == null ? '—' : pctZnam(real1y)}</span>
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
          {bt && (
            <Link href={bt} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 text-sm font-medium text-white hover:bg-teal-800">
              <History className="h-4 w-4" /> Otestovat v backtestu
            </Link>
          )}
          <Link href={`/portfolio-strategie/${model.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
            Detail a konkrétní ETF <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mřížka karet: 6 ve třech sloupcích, sedmé (pro pokročilé) přes celou šířku ---------- */
export function PortfolioGrid({ returns, historie }: { returns?: ReturnsMap; historie?: HistorieMap } = {}) {
  const posledni = portfolioModels.length - 1;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {portfolioModels.map((m, i) => {
        const siroka = i === posledni && portfolioModels.length % 3 === 1;
        return <PortfolioCard key={m.id} model={m} returns={returns} historie={historie?.[m.slug]} siroka={siroka} className={siroka ? 'sm:col-span-2 lg:col-span-3' : ''} />;
      })}
    </div>
  );
}

/* ---------- Verdikt „pro koho" – tabulka (desktop) / karty (mobil) ---------- */
export function PortfolioVerdictTable() {
  return (
    <div>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
              <th className="px-4 py-3 font-medium">Portfolio</th>
              <th className="px-4 py-3 font-medium">Riziko</th>
              <th className="px-4 py-3 font-medium">Pro koho</th>
              <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Akcie</th>
              <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Horizont</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {portfolioModels.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link href={`/portfolio-strategie/${m.slug}`} className="font-medium text-teal-700 hover:text-teal-800">{m.kratkyNazev}</Link>
                </td>
                <td className="px-4 py-3"><RizikoTecky risk={m.risk} /></td>
                <td className="px-4 py-3 text-slate-600">{m.forWhom}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{fmtPct(m.stocksPct)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-600 whitespace-nowrap">{m.horizon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2.5 md:hidden">
        {portfolioModels.map((m) => (
          <Link key={m.id} href={`/portfolio-strategie/${m.slug}`} className="block rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal-300">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-900">{m.kratkyNazev}</span>
              <RizikoTecky risk={m.risk} />
            </div>
            <p className="mb-2 text-sm text-slate-600">{m.forWhom}</p>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Akcie <span className="tabular-nums font-medium text-slate-800">{fmtPct(m.stocksPct)}</span></span>
              <span>Horizont <span className="tabular-nums font-medium text-slate-800">{m.horizon}</span></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

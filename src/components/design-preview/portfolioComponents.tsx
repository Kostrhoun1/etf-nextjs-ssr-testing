import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import {
  portfolioModels,
  ASSET_COLORS,
  RISK_PILL,
  type PortfolioModel,
  type AssetClass,
} from '@/components/design-preview/portfolioData';

// Procento v české notaci (7,5 % místo 7.5 %).
const fmtPct = (v: number) =>
  Number.isInteger(v) ? `${v} %` : `${v.toFixed(1).replace('.', ',')} %`;

// Mapa isin → korunový výnos za 1 rok (z DB). Umožňuje kartám ukázat REÁLNÝ výnos.
export type ReturnsMap = Record<string, number | null | undefined>;

// Vážený korunový výnos portfolia za 1 rok – renormalizovaný na dostupné složky
// (počítáme jen z ETF, u kterých máme data; váhy se přepočtou na 100 %).
function weighted1yCzk(model: PortfolioModel, returns?: ReturnsMap): number | null {
  if (!returns) return null;
  let sum = 0;
  let w = 0;
  for (const a of model.allocations) {
    const v = returns[a.isin];
    if (v != null) {
      sum += v * a.percentage;
      w += a.percentage;
    }
  }
  return w > 0 ? sum / w : null;
}

const fmtCzkReturn = (v: number) =>
  `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;

/* ---------- Segmentovaný pruh složení z REÁLNÝCH procent ---------- */
export function PortfolioBar({ model, showLegend = true }: { model: PortfolioModel; showLegend?: boolean }) {
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        {model.allocations.map((a, i) => (
          <div
            key={i}
            className={ASSET_COLORS[a.cls].bar}
            style={{ width: `${a.percentage}%` }}
            title={`${a.label} ${fmtPct(a.percentage)}`}
          />
        ))}
      </div>
      {showLegend && (
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
          {model.allocations.map((a, i) => (
            <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${ASSET_COLORS[a.cls].dot}`} />
              <span className="font-medium text-slate-700">{a.label}</span>
              <span className="tabular-nums text-slate-500">{fmtPct(a.percentage)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Jedna karta portfolia (jádro stránky) ---------- */
export function PortfolioCard({ model, returns }: { model: PortfolioModel; returns?: ReturnsMap }) {
  const real1y = weighted1yCzk(model, returns);
  return (
    <div className="group flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition-all hover:border-teal-300 hover:shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-base font-bold leading-tight text-slate-900">{model.name}</h3>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_PILL[model.risk]}`}>
          {model.risk}
        </span>
      </div>

      <p className="mb-4 text-sm leading-snug text-slate-500">{model.tagline}</p>

      <PortfolioBar model={model} />

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <span className="block text-xs text-slate-400">
            <InfoTip label="Nominální odhad před inflací a daněmi. Reálný (kupní síla) výnos je zhruba o inflaci nižší – při 2–3 % inflaci tedy o 2–3 p.b. méně.">Očekávaný výnos</InfoTip>
          </span>
          <span className="tabular-nums font-semibold text-slate-900">{model.expectedReturn}</span>
        </div>
        <div>
          <span className="block text-xs text-slate-400">
            <InfoTip label="Největší historický propad hodnoty od vrcholu ke dnu.">Max. pokles</InfoTip>
          </span>
          <span className="tabular-nums font-semibold text-slate-900">{model.maxDrawdown}</span>
        </div>
      </div>

      {real1y != null && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <span className="text-xs text-slate-500">
            <InfoTip label="Vážený průměr korunových výnosů jednotlivých ETF složek za poslední rok podle jejich váhy v portfoliu, z naší databáze. Bez rebalancingu. Minulá výkonnost nezaručuje budoucí výnosy.">
              Reálný výnos za 1 rok (Kč)
            </InfoTip>
          </span>
          <span className={`tabular-nums text-sm font-bold ${real1y >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {fmtCzkReturn(real1y)}
          </span>
        </div>
      )}

      <Link
        href={`/portfolio-strategie/${model.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800"
      >
        Zobrazit detail a konkrétní ETF <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* ---------- Mřížka 5 karet ---------- */
export function PortfolioGrid({ returns }: { returns?: ReturnsMap } = {}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {portfolioModels.map((m) => (
        <PortfolioCard key={m.id} model={m} returns={returns} />
      ))}
    </div>
  );
}

/* ---------- Verdikt „pro koho" – tabulka (desktop) / karty (mobil) ---------- */
export function PortfolioVerdictTable() {
  return (
    <div>
      {/* Desktop: tabulka */}
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Portfolio</th>
              <th className="px-4 py-3 font-medium">Riziko</th>
              <th className="px-4 py-3 font-medium">Pro koho</th>
              <th className="px-4 py-3 text-right font-medium">Akcie</th>
              <th className="px-4 py-3 text-right font-medium">Horizont</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {portfolioModels.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/portfolio-strategie/${m.slug}`} className="font-medium text-teal-700 hover:text-teal-800">
                    {m.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_PILL[m.risk]}`}>
                    {m.risk}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{m.forWhom}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900">{fmtPct(m.stocksPct)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-600">{m.horizon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil: karty */}
      <div className="space-y-3 md:hidden">
        {portfolioModels.map((m) => (
          <Link
            key={m.id}
            href={`/portfolio-strategie/${m.slug}`}
            className="block rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-teal-300"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-900">{m.name}</span>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_PILL[m.risk]}`}>
                {m.risk}
              </span>
            </div>
            <p className="mb-3 text-sm text-slate-600">{m.forWhom}</p>
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

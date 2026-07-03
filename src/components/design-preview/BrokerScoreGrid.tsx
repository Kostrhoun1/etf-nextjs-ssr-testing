import { degiroScores, degiroOverall } from './BrokerScore';

/**
 * Vizualizace dílčích skóre, ze kterých se počítá celkové hodnocení.
 * Číslo nahoře (degiroOverall) je vážený průměr řádků – žádný rozpor s herem.
 */
export default function BrokerScoreGrid() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-900">Celkové hodnocení DEGIRO</p>
          <p className="text-xs text-slate-500 mt-0.5">Vážený průměr šesti kritérií podle naší jednotné metodiky.</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-3xl font-bold tabular-nums text-slate-900 leading-none">
            {degiroOverall}<span className="text-base font-medium text-slate-400">/100</span>
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {degiroScores.map((r) => (
          <li key={r.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-800">{r.label}</span>
              <span className="tabular-nums text-slate-500 shrink-0">
                <span className="font-semibold text-slate-900">{r.score}</span>
                <span className="text-slate-400"> · váha {Math.round(r.weight * 100)} %</span>
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-teal-600" style={{ width: `${r.score}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-snug">{r.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

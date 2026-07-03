import Link from 'next/link';
import type { ETFBasicInfo } from '@/lib/etf-data';
import { pct, ter, money, dist, repl, domicile, shortName } from './CategoryUI';

type Currency = 'czk' | 'eur';

function ret(etf: ETFBasicInfo, years: '1y' | '3y', cur: Currency): number | null {
  if (years === '1y') return cur === 'czk' ? etf.return_1y_czk : etf.return_1y;
  return cur === 'czk' ? etf.return_3y_czk : etf.return_3y;
}

function PerfCell({ v }: { v: number | null }) {
  if (v == null) return <span className="text-slate-400">—</span>;
  const pos = v >= 0;
  return (
    <span className={`tabular-nums font-medium ${pos ? 'text-emerald-600' : 'text-red-600'}`}>{pct(v)}</span>
  );
}

/** Segmented control měny – funguje bez JS přes odkazy s ?mena= (SSR, default CZK). */
function CurrencySwitch({ cur }: { cur: Currency }) {
  const base = 'px-3 py-1.5 text-sm font-medium rounded-md transition-colors';
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
      <Link
        href="?mena=czk#srovnani"
        scroll={false}
        className={`${base} ${cur === 'czk' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        CZK
      </Link>
      <Link
        href="?mena=eur#srovnani"
        scroll={false}
        className={`${base} ${cur === 'eur' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        EUR
      </Link>
    </div>
  );
}

export default function CompareTable({ etfs, cur }: { etfs: ETFBasicInfo[]; cur: Currency }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">Výnosy v měně:</p>
        <CurrencySwitch cur={cur} />
      </div>

      {/* Desktop tabulka */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-left">
              <th className="py-3 px-4 font-medium">Fond</th>
              <th className="py-3 px-4 font-medium text-right">TER</th>
              <th className="py-3 px-4 font-medium text-right">Velikost</th>
              <th className="py-3 px-4 font-medium text-right">Výnos 1R</th>
              <th className="py-3 px-4 font-medium text-right">Výnos 3R</th>
              <th className="py-3 px-4 font-medium">Replikace</th>
              <th className="py-3 px-4 font-medium">Politika</th>
              <th className="py-3 px-4 font-medium">Domicil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {etfs.map((etf) => (
              <tr key={etf.isin} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <Link href={`/design-preview/etf/${etf.isin}`} className="group inline-flex flex-col">
                    <span className="font-medium text-slate-900 group-hover:text-teal-700">{shortName(etf.name)}</span>
                    <span className="text-xs text-slate-400">{etf.primary_ticker} · {etf.isin}</span>
                  </Link>
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-700">{ter(etf.ter_numeric)}</td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-700">{money(etf.fund_size_numeric)}</td>
                <td className="py-3 px-4 text-right"><PerfCell v={ret(etf, '1y', cur)} /></td>
                <td className="py-3 px-4 text-right"><PerfCell v={ret(etf, '3y', cur)} /></td>
                <td className="py-3 px-4 text-slate-600">{repl(etf.replication)}</td>
                <td className="py-3 px-4 text-slate-600">{dist(etf.distribution_policy)}</td>
                <td className="py-3 px-4 text-slate-600">{domicile(etf.fund_domicile)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil karty */}
      <div className="md:hidden space-y-2">
        {etfs.map((etf) => (
          <Link
            key={etf.isin}
            href={`/design-preview/etf/${etf.isin}`}
            className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-slate-900 leading-tight">{shortName(etf.name)}</p>
                <p className="text-xs text-slate-400 mt-0.5">{etf.primary_ticker} · {etf.isin}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-400">Výnos 1R</p>
                <PerfCell v={ret(etf, '1y', cur)} />
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-slate-400">TER</dt>
                <dd className="tabular-nums font-medium text-slate-700">{ter(etf.ter_numeric)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Velikost</dt>
                <dd className="tabular-nums font-medium text-slate-700">{money(etf.fund_size_numeric)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Výnos 3R</dt>
                <dd><PerfCell v={ret(etf, '3y', cur)} /></dd>
              </div>
              <div>
                <dt className="text-slate-400">Replikace</dt>
                <dd className="font-medium text-slate-700">{repl(etf.replication)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Politika</dt>
                <dd className="font-medium text-slate-700">{dist(etf.distribution_policy)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Domicil</dt>
                <dd className="font-medium text-slate-700">{domicile(etf.fund_domicile)}</dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>
    </div>
  );
}

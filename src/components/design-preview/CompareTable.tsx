import Link from 'next/link';
import type { ETFBasicInfo } from '@/lib/etf-data';
import { ter, money, dist, repl, domicile, shortName } from './CategoryUI';
import ReturnValue, { ReturnCurLabel } from '@/components/design-preview/ReturnValue';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';

export default function CompareTable({ etfs }: { etfs: ETFBasicInfo[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">Výnosy v měně:</p>
        <CurrencyToggle showLabel={false} />
      </div>

      {/* Desktop tabulka */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-left">
              <th className="py-3 px-4 font-medium">Fond</th>
              <th className="py-3 px-4 font-medium text-right">TER</th>
              <th className="py-3 px-4 font-medium text-right">Velikost</th>
              <th className="py-3 px-4 font-medium text-right">Výnos 1R (<ReturnCurLabel />)</th>
              <th className="py-3 px-4 font-medium text-right">Výnos 3R (<ReturnCurLabel />)</th>
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
                <td className="py-3 px-4 text-right"><ReturnValue etf={etf} period="1y" className="font-medium" /></td>
                <td className="py-3 px-4 text-right"><ReturnValue etf={etf} period="3y" className="font-medium" /></td>
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
                <p className="text-xs text-slate-400">Výnos 1R (<ReturnCurLabel />)</p>
                <ReturnValue etf={etf} period="1y" className="font-medium" />
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
                <dt className="text-slate-400">Výnos 3R (<ReturnCurLabel />)</dt>
                <dd><ReturnValue etf={etf} period="3y" className="font-medium" /></dd>
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

import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { TrendingUp, ArrowLeft, Search, Scale } from 'lucide-react';
import { getComparisonETFsByIsins, type ComparisonETF } from '@/lib/etf-data';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Porovnání ETF vedle sebe | ETF průvodce',
  description: 'Detailní porovnání vybraných ETF fondů vedle sebe – poplatky, výnosy v Kč, riziko, typ a daně.',
  robots: { index: false, follow: false },
};

const num = (v: number | null | undefined) => (v == null || Number.isNaN(v) ? null : Number(v));
const ter = (v: number | null) => (v == null ? '—' : `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`);
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`);
const money = (v: number | null) => (v == null ? '—' : v >= 1000 ? `${(v / 1000).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mld. €` : `${Math.round(v).toLocaleString('cs-CZ')} mil. €`);
const isAcc = (p: string | null) => !/distribut/i.test(p || '');
const replLabel = (r: string | null) => { const s = (r || '').toLowerCase(); if (s.includes('synth') || s.includes('swap')) return 'Syntetická'; if (s) return 'Fyzická'; return '—'; };
const DOM: Record<string, string> = { Ireland: 'Irsko', Luxembourg: 'Lucembursko', Germany: 'Německo', France: 'Francie' };

function Head() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
          ETF průvodce
        </Link>
        <MobileMenu />
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
          <Link href="/design-preview/zebricky" className="hover:text-slate-900">Žebříčky</Link>
          <Link href="/design-preview/srovnani" className="text-teal-700 font-medium">Srovnání</Link>
          <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
          <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
          <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
        </nav>
        <HeaderSearch />
        <Link href="/design-preview/srovnani" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnávač</Link>
      </div>
    </header>
  );
}

export default async function PorovnaniPreview(
  { searchParams }: { searchParams: Promise<{ isins?: string }> },
) {
  const { isins } = await searchParams;
  const list = (isins ?? '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const etfs = await getComparisonETFsByIsins(list);

  if (etfs.length < 2) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Head />
        <main className="max-w-6xl mx-auto px-4 py-16 text-center">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-700 mb-4"><Scale className="w-6 h-6" /></span>
          <h1 className="text-xl font-bold text-slate-900">Vyberte fondy k porovnání</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">Přidejte alespoň dva fondy tlačítkem „Do porovnání" ve srovnávači nebo na detailu fondu. Vybrané fondy se pak zobrazí tady vedle sebe.</p>
          <Link href="/design-preview/srovnani" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"><Search className="w-4 h-4" /> Otevřít srovnávač</Link>
        </main>
      </div>
    );
  }

  // Nejlepší hodnoty pro zvýraznění.
  const bestLowTer = Math.min(...etfs.map((e) => num(e.ter_numeric) ?? Infinity));
  const bestR1 = Math.max(...etfs.map((e) => num(e.return_1y_czk) ?? -Infinity));

  const rows: { label: string; cell: (e: ComparisonETF) => React.ReactNode; best?: (e: ComparisonETF) => boolean }[] = [
    { label: 'Ticker', cell: (e) => e.primary_ticker ?? '—' },
    { label: 'Poplatek (TER)', cell: (e) => ter(num(e.ter_numeric)), best: (e) => num(e.ter_numeric) === bestLowTer },
    { label: 'Velikost fondu', cell: (e) => money(num(e.fund_size_numeric)) },
    { label: 'Výnos 1 rok (Kč)', cell: (e) => pct(num(e.return_1y_czk)), best: (e) => num(e.return_1y_czk) === bestR1 },
    { label: 'Výnos 3 roky (Kč)', cell: (e) => pct(num(e.return_3y_czk)) },
    { label: 'Výnos 5 let (Kč)', cell: (e) => pct(num(e.return_5y_czk)) },
    { label: 'Dividendový výnos', cell: (e) => (e.current_dividend_yield_numeric != null ? `${Number(e.current_dividend_yield_numeric).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %` : '—') },
    { label: 'Kolísavost 1 rok', cell: (e) => (num(e.volatility_1y) != null ? `${num(e.volatility_1y)!.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %` : '—') },
    { label: 'Typ výplaty', cell: (e) => (isAcc(e.distribution_policy) ? 'Akumulační' : 'Distribuční') },
    { label: 'Replikace', cell: (e) => replLabel(e.replication) },
    { label: 'Domicil', cell: (e) => (e.fund_domicile ? DOM[e.fund_domicile] ?? e.fund_domicile : '—') },
    { label: 'Index', cell: (e) => e.index_name ?? '—' },
    { label: 'Počet firem', cell: (e) => (e.total_holdings != null ? e.total_holdings.toLocaleString('cs-CZ') : '—') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Head />
      <main className="max-w-6xl mx-auto px-4 pb-24">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-700">Domů</Link><span>/</span>
          <Link href="/design-preview/srovnani" className="hover:text-slate-700">Srovnávač</Link><span>/</span>
          <span className="text-slate-700">Porovnání</span>
        </nav>

        <section className="pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Porovnání {etfs.length} fondů</h1>
          <p className="mt-1 text-sm text-slate-500">Parametry vedle sebe. Zelené zvýraznění = nejlepší hodnota (nejnižší poplatek, nejvyšší roční výnos).</p>
        </section>

        <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400 bg-slate-50">Parametr</th>
                {etfs.map((e) => (
                  <th key={e.isin} className="py-3 px-4 text-left align-top bg-slate-50">
                    <Link href={`/design-preview/etf/${e.isin}`} className="font-semibold text-teal-700 hover:text-teal-800 leading-tight block">{e.name.length > 34 ? e.name.slice(0, 34) + '…' : e.name}</Link>
                    <span className="text-xs text-slate-400 font-normal">{e.primary_ticker ?? e.isin}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2.5 px-4 text-slate-500 font-medium">{r.label}</td>
                  {etfs.map((e) => (
                    <td key={e.isin} className={`py-2.5 px-4 tabular-nums ${r.best?.(e) ? 'font-bold text-emerald-700' : 'text-slate-800'}`}>{r.cell(e)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/design-preview/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"><ArrowLeft className="w-4 h-4" /> Zpět do srovnávače</Link>
        </div>
      </main>
    </div>
  );
}

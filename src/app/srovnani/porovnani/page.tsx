import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { TrendingUp, ArrowLeft, Search, Scale } from 'lucide-react';
import { getComparisonETFsByIsins } from '@/lib/etf-data';
import PorovnaniTable from '@/components/design-preview/PorovnaniTable';
import PorovnaniGraf from '@/components/design-preview/PorovnaniGraf';
import UpravitVyber from '@/components/design-preview/UpravitVyber';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import { platnyTicker } from '@/lib/ticker';
import { datumCen } from '@/lib/datumCen';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Porovnání ETF vedle sebe',
  description: 'Detailní porovnání vybraných ETF fondů vedle sebe – poplatky, výnosy v Kč, riziko, typ a daně.',
  robots: { index: false, follow: false },
};

function Head() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
          ETF průvodce.cz
        </Link>
        <MobileMenu />
        <SiteNav />
        <HeaderSearch />
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

  // Každé číslo má datum (pravidlo č. 1): nejstarší datum stažení dat mezi porovnávanými fondy.
  const nejstarsi = etfs.map((e) => (e as unknown as { scraping_date?: string | null }).scraping_date).filter(Boolean).sort()[0];
  // „Data k“ = den CEN (předchozí obchodní den před stažením), stejně jako srovnávač – ne den stažení (src/lib/datumCen.ts).
  const datumDat = nejstarsi ? datumCen(new Date(nejstarsi)) : null;
  // Rok dat: letošní (YTD) sloupec grafu a posledních 5 dokončených roků se počítají od data dat, ne od dneška.
  const rokDat = (datumDat ?? new Date()).getFullYear();
  const fondy = etfs.map((e) => ({ isin: e.isin, label: platnyTicker(e.primary_ticker) ?? e.isin.slice(0, 8) }));

  if (etfs.length < 2) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Head />
        <main id="obsah" className="max-w-6xl mx-auto px-4 py-16 text-center">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-700 mb-4"><Scale className="w-6 h-6" /></span>
          <h1 className="text-xl font-bold text-slate-900">Vyberte fondy k porovnání</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">Přidejte aspoň dva fondy tlačítkem „Porovnat“ ve srovnávači nebo na detailu fondu (nejvýš 4). Vybrané fondy se pak zobrazí tady vedle sebe.</p>
          <Link href="/srovnani" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"><Search className="w-4 h-4" /> Otevřít srovnávač</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Head />
      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-24">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <Link href="/srovnani" className="hover:text-slate-700">Srovnávač</Link><span>/</span>
          <span className="text-slate-700">Porovnání</span>
        </nav>

        <section className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Porovnání {etfs.length} fondů</h1>
            <div className="flex items-center gap-3">
              {datumDat && <AktualnostDat datum={datumDat} />}
              <CurrencyToggle size="sm" showLabel={false} />
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <UpravitVyber fondy={fondy} />
          <PorovnaniGraf rokDat={rokDat} fondy={etfs.map((e, i) => ({ ...fondy[i], data: Object.fromEntries(Object.entries(e).filter(([k]) => k.startsWith("return_"))) }))} />
          <PorovnaniTable etfs={etfs} rokDat={rokDat} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"><ArrowLeft className="w-4 h-4" /> Zpět do srovnávače</Link>
        </div>
      </main>
    </div>
  );
}

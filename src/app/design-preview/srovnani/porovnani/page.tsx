import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { TrendingUp, ArrowLeft, Search, Scale } from 'lucide-react';
import { getComparisonETFsByIsins } from '@/lib/etf-data';
import PorovnaniTable from '@/components/design-preview/PorovnaniTable';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Porovnání ETF vedle sebe | ETF průvodce',
  description: 'Detailní porovnání vybraných ETF fondů vedle sebe – poplatky, výnosy v Kč, riziko, typ a daně.',
  robots: { index: false, follow: false },
};

function Head() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
          ETF průvodce.cz
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
          <p className="mt-1 text-sm text-slate-500">Parametry vedle sebe. Výnosy přepočtené do zvolené měny (výchozí koruny).</p>
        </section>

        <PorovnaniTable etfs={etfs} />

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/design-preview/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"><ArrowLeft className="w-4 h-4" /> Zpět do srovnávače</Link>
        </div>
      </main>
    </div>
  );
}

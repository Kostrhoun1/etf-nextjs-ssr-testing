import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { TrendingUp, ArrowRight, Wallet, Database, CalendarDays, Swords } from 'lucide-react';
import { getScreenerETFData } from '@/lib/etf-data';
import ScreenerUI from '@/components/design-preview/ScreenerUI';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Srovnávač ETF: filtrujte a porovnejte 4 300+ fondů | ETF průvodce',
  description:
    'Interaktivní srovnávač ETF pro české investory. Filtrujte podle TER, typu, replikace a regionu, řaďte podle výnosu v Kč a proklikněte se na detail fondu.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/srovnani-etf' },
};

export default async function SrovnaniScreenerPreview(
  { searchParams }: { searchParams: Promise<{ q?: string }> },
) {
  const { q } = await searchParams;
  const etfs = await getScreenerETFData();
  const today = new Date();
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Header */}
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
          <Link href="#screener" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Filtrovat</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-14">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <span className="text-slate-700">Srovnávač ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-6">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Srovnávač ETF</h1>
            <p className="mt-2 max-w-2xl text-slate-300 text-sm md:text-base leading-relaxed">
              Projděte a porovnejte největší ETF fondy dostupné pro české investory. Filtrujte podle poplatku (TER),
              typu, replikace a regionu, řaďte podle výnosu <strong className="text-white">přepočteného do korun</strong> a
              proklikněte se na detail každého fondu.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Výnosy v Kč</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroj: justETF / vlastní databáze</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* Ukázkový souboj – featured */}
        <section className="pb-6">
          <Link href="/design-preview/srovnani/vwce-vs-cspx" className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
            <span className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Swords className="w-4 h-4" /></span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">Souboj fondů: VWCE vs CSPX</span>
                <span className="block text-xs text-slate-500">Detailní porovnání dvou nejoblíbenějších fondů – celý svět vs S&amp;P 500.</span>
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 shrink-0" />
          </Link>
        </section>

        {/* SCREENER */}
        <section id="screener" className="scroll-mt-16">
          <ScreenerUI etfs={etfs} initialQ={q ?? ''} />
        </section>
      </main>
    </div>
  );
}

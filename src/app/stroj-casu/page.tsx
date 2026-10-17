import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import StrojCasuWidget from '@/components/design-preview/StrojCasuWidget';
import { nactiStrojCasu } from '@/lib/strojCasu';

/* Korunový stroj času (Vlna 6). Řady se počítají při ISR renderu (1× denně) stejným enginem
   jako backtest; prohlížeč jen násobí – žádný výpočet na serveru při každé návštěvě. */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Korunový stroj času: kolik byste dnes měli, kdybyste investovali od roku…',
  description: 'Kdybyste od roku 2010 posílali 5 000 Kč měsíčně do akcií celého světa, kolik byste měli dnes? Spočítejte si svůj případ v korunách – na skutečných historických datech.',
  alternates: { canonical: '/stroj-casu' },
};

export default async function StrojCasuStranka() {
  const rady = await nactiStrojCasu();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-20">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <Link href="/co-rikaji-data" className="hover:text-slate-700">Co říkají data</Link><span>/</span>
          <span className="text-slate-700">Korunový stroj času</span>
        </nav>

        <section className="py-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Korunový stroj času</h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Kolik byste měli dnes, kdybyste začali investovat dřív? Vyberte, do čeho, kolik měsíčně a od kterého roku –
            výsledek je v korunách, na skutečných historických datech včetně krizí a pohybu kurzu koruny.
          </p>
        </section>

        <StrojCasuWidget rady={rady} />

        <section className="mt-10 grid gap-4 md:grid-cols-2 max-w-4xl">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Proč v korunách</h2>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Zahraniční kalkulačky počítají v dolarech. Českému investorovi ale výsledek mění i kurz koruny – v krizích ho
              většinou tlumí, dlouhodobě koruna posilovala.{' '}
              <Link href="/menove-riziko-etf" className="font-medium text-teal-700 hover:underline">Víc o měnovém riziku</Link>
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Naráz, nebo postupně?</h2>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Zkuste stejnou částku vložit jednorázově na začátku místo po měsících – a podívejte se, co říkají data.{' '}
              <Link href="/dca-vs-jednorazova" className="font-medium text-teal-700 hover:underline">Jednorázově vs. pravidelně</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

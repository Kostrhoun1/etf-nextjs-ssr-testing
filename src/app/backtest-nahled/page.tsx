import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import MobileMenu from '@/components/design-preview/MobileMenu';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import InfoTip from '@/components/design-preview/InfoTip';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import BacktestWidget from '@/components/design-preview/BacktestWidget';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { simulateAndSerialize } from '@/lib/backtest/simulate';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'NÁHLED: Backtest result-first | ETF průvodce.cz',
  description: 'Testovací náhled result-first podoby backtestu.',
  robots: { index: false, follow: false }, // TEST STRÁNKA – neindexovat
};

const DEFAULT_START = '2002-07-01';
const DEFAULT_AMOUNT = 1000000;

export default async function BacktestNahled() {
  let initialBacktest = null;
  try {
    initialBacktest = await simulateAndSerialize({
      portfolio: [
        { isin: 'IE00B5BMR087', name: 'iShares Core S&P 500', weight: 0.9, ter: 0.0007, indexCode: 'sp500' },
        { isin: 'IE00BYXPSP02', name: 'iShares USD Treasury Bond 1-3yr', weight: 0.1, ter: 0.0007, indexCode: 'us_treasury_1_3y' },
      ],
      startDate: DEFAULT_START,
      endDate: new Date().toISOString().split('T')[0],
      initialAmount: DEFAULT_AMOUNT,
      rebalancingStrategy: 'yearly',
      currency: 'CZK',
    });
  } catch {
    initialBacktest = null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/kalkulacky" className="text-teal-700 font-medium">Kalkulačky</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link><span>/</span>
          <Link href="/kalkulacky" className="hover:text-slate-600">Kalkulačky</Link><span>/</span>
          <span className="text-slate-600">Backtest portfolia (náhled)</span>
        </nav>

        {/* Slim hero */}
        <section className="pb-6">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-6 md:px-8 md:py-7">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Backtest portfolia ETF</h1>
            <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Otestujte portfolio na reálných datech od roku 2000 (
              <InfoTip label="Backtest = historický test strategie. Ukáže, jak by se portfolio chovalo v minulosti – kolik vydělalo, jak kolísalo a jak hluboko klesalo.">backtest</InfoTip>
              ) – výnos, propady i kolísavost, v korunách.
            </p>
          </div>
        </section>

        {/* NÁSTROJ – example mode (result-first + badge PŘÍKLAD → TVŮJ VÝPOČET) */}
        <section className="pb-10">
          <BacktestWidget initial={initialBacktest ? {
            presetId: 'buffett-90-10',
            startDate: DEFAULT_START,
            initialAmount: DEFAULT_AMOUNT,
            contribution: 'none',
            currency: 'CZK',
            result: initialBacktest,
          } : undefined} />
        </section>

        {/* Edukace POD nástrojem */}
        <section className="pb-10">
          <SectionHead title="Co vám backtest ukáže" desc="Tři čísla, která rozhodují, jestli s portfoliem vydržíte i ve špatných letech." />
          <div className="grid sm:grid-cols-3 gap-3">
            {([
              [TrendingUp, 'Roční zhodnocení', 'Průměrné roční tempo růstu se složeným úročením (CAGR). Jak rychle portfolio dlouhodobě rostlo.'],
              [TrendingDown, 'Největší pokles', 'Nejhlubší propad od vrcholu po dno (drawdown). Kolik nervů strategie vyžaduje.'],
              [Activity, 'Kolísavost', 'Jak silně hodnota kmitá nahoru a dolů (volatilita). Vyšší číslo = divočejší jízda.'],
            ] as [typeof TrendingUp, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 mb-3"><Icon className="w-4 h-4" /></span>
                <p className="font-medium text-slate-900 text-sm">{t}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="pb-10"><InvestmentDisclaimer /></div>
      </main>
    </div>
  );
}

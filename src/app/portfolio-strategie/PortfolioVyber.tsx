'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, ArrowRight } from 'lucide-react';
import { PortfolioCard, type HistorieMap, type ReturnsMap } from '@/components/design-preview/portfolioComponents';
import { portfolioModels, type PortfolioRisk } from '@/components/design-preview/portfolioData';

/* „Pro koho je která strategie“ jako výběr nad kartami (revize 18. 10. 2026: dřív samostatná tabulka pod
   kartami, na mobilu opakovala všech 7 portfolií podruhé). Každá karta nese svůj „pro koho“. */
const VOLBY: { id: 'vse' | PortfolioRisk; label: string }[] = [
  { id: 'vse', label: 'Všechna' },
  { id: 'Konzervativní', label: 'Chci hlavně klid' },
  { id: 'Umírněné', label: 'Střední cesta' },
  { id: 'Agresivní', label: 'Chci co nejvíc růst' },
];

export default function PortfolioVyber({ returns, historie }: { returns?: ReturnsMap; historie?: HistorieMap }) {
  const [volba, setVolba] = useState<'vse' | PortfolioRisk>('vse');
  // ?povaha=klid|stred|rust – odkaz z průvodce /vyber-etf („Nechci velké propady“ → portfolia s dluhopisy).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('povaha');
    const m: Record<string, PortfolioRisk> = { klid: 'Konzervativní', stred: 'Umírněné', rust: 'Agresivní' };
    if (p && m[p]) setVolba(m[p]);
  }, []);
  /* Pořadí = největší historický propad z backtestu, od nejmělčího (revize kola 4: text „od nejklidnějšího“ stál nad
     řazením podle podílu akcií a 60/40 −18 % bylo za Permanentním −20 %). Shoda → méně akcií první; bez historie na konec. */
  const pokles = (slug: string) => historie?.[slug]?.maxPokles ?? -Infinity;
  const vybrane = portfolioModels
    .filter((m) => volba === 'vse' || m.risk === volba)
    .sort((a, b) => (Math.abs(pokles(b.slug) - pokles(a.slug)) > 0.0005 ? pokles(b.slug) - pokles(a.slug) : a.stocksPct - b.stocksPct));
  return (
    <div>
      <div role="group" aria-label="Vyberte podle povahy" className="-mx-4 px-4 mb-4 flex gap-1.5 overflow-x-auto pb-1 sm:mx-0 sm:px-0 sm:flex-wrap">
        {VOLBY.map((v) => {
          const n = v.id === 'vse' ? portfolioModels.length : portfolioModels.filter((m) => m.risk === v.id).length;
          const on = volba === v.id;
          return (
            <button key={v.id} type="button" aria-pressed={on} onClick={() => setVolba(v.id)} data-track={`portfolia-filtr:${v.id}`}
              className={`shrink-0 rounded-full border px-3.5 min-h-[40px] text-sm font-medium whitespace-nowrap transition-colors ${on ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'}`}>
              {v.label} <span className={on ? 'text-teal-100' : 'text-slate-400'}>{n}</span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {vybrane.map((m) => <PortfolioCard key={m.id} model={m} returns={returns} historie={historie?.[m.slug]} />)}
        {volba === 'vse' && (
          <Link href="/backtest" className="group flex flex-col justify-between rounded-xl border border-dashed border-slate-300 bg-white/60 p-5 hover:border-teal-300">
            <span>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><History className="h-5 w-5" /></span>
              <span className="mt-3 block text-base font-bold text-slate-900">Vlastní složení</span>
              <span className="mt-1 block text-sm leading-snug text-slate-600">Žádné nesedí? Poskládejte si vlastní poměr akcií, dluhopisů a zlata a otestujte ho na historii v korunách.</span>
            </span>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700">Otevřít backtest <ArrowRight className="h-4 w-4" /></span>
          </Link>
        )}
      </div>
    </div>
  );
}

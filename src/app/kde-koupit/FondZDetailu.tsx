'use client';

/* „Kde koupit SXR8“ – když návštěvník přijde z detailu fondu (?isin=…), stránka si fond pamatuje (Markéta, kolo 4).
   Kolo 5: kontext fondu je PŘÍMO V HERO (dřív samostatný box nad obecným hero → dvě hlavičky nad sebou a kalkulačka
   na mobilu až na ~783 px). Kalkulačka ho čte z kontextu: u DEGIRO nevíme, zda je fond ve výběru ETF Selection,
   proto ukazuje obě sazby rovnocenně (NakladyKalkulacka).
   Ukazujeme JEN to, co máme v datech: název, ticker a zda má fond listing na Xetře (náklady počítají nákup na Xetře).
   Zda konkrétní broker fond nabízí, v datech nemáme → věta, ať si to návštěvník ověří v aplikaci brokera.
   Fond drží FondProvider (src/components/design-preview/FondKontext.tsx). */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useFond } from '@/components/design-preview/FondKontext';

/** Levá část hero: bez fondu obecný nadpis (children ze serveru), s fondem „Kde koupit SXR8“ + identita fondu. */
export function FondHero({ children }: { children: ReactNode }) {
  const fond = useFond();
  if (!fond) return <>{children}</>;
  const jmeno = fond.ticker ?? fond.isin;
  return (
    <div data-sekce="fond">
      <Link href={`/etf/${fond.isin}`} className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" /> Zpět na {jmeno}
      </Link>
      <h1 className="mt-1.5 text-2xl md:text-3xl font-bold tracking-tight leading-tight">Kde koupit {jmeno}</h1>
      <p className="mt-1.5 text-sm md:text-base text-slate-200">
        {fond.name}
        <span className="text-slate-500"> · </span>
        <span className="whitespace-nowrap tabular-nums text-slate-400">ISIN {fond.isin}</span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        {fond.xetra && fond.ticker
          ? `Na burze Xetra se obchoduje pod tickerem ${fond.ticker}; náklady níže počítáme pro nákup na Xetře. `
          : 'V našich datech fond nemá listing na Xetře – náklady níže počítáme pro nákup na Xetře, jinde se mohou lišit. '}
        Zda konkrétní broker tento fond nabízí, si ověřte v jeho aplikaci – nabídky se mění.
      </p>
    </div>
  );
}

/** Obsah, který s fondem nedává smysl (obecné „nejlevnější nad X Kč: DEGIRO (ETF Selection)“ – u konkrétního fondu
 *  nevíme, zda je ve výběru). */
export function BezFondu({ children }: { children: ReactNode }) {
  return useFond() ? null : <>{children}</>;
}

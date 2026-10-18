'use client';

/* „Kde koupit SXR8“ – když návštěvník přijde z detailu fondu (?isin=…), stránka si fond pamatuje (Markéta, kolo 4).
   Ukazujeme JEN to, co máme v datech: název, ticker a zda má fond listing na Xetře (náklady níže počítají nákup
   na Xetře). Zda konkrétní broker fond nabízí, v datech nemáme ověřené → obecná věta, nic nevymýšlíme. */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Info } from 'lucide-react';

type Fond = { isin: string; name: string; ticker: string | null; xetra: boolean };

export default function FondZDetailu() {
  const isin = (useSearchParams().get('isin') ?? '').trim().toUpperCase();
  const platny = /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin);
  const [fond, setFond] = useState<Fond | null>(null);

  useEffect(() => {
    if (!platny) return;
    let zruseno = false;
    fetch(`/kde-koupit/fond?isin=${encodeURIComponent(isin)}`)
      .then((r) => (r.ok ? r.json() : { fond: null }))
      .then((d: { fond: Fond | null }) => { if (!zruseno) setFond(d.fond); })
      .catch(() => { /* bez fondu = obecná stránka */ });
    return () => { zruseno = true; };
  }, [isin, platny]);

  if (!platny || !fond) return null;
  const jmeno = fond.ticker ?? fond.isin;
  return (
    <section data-sekce="fond" aria-label={`Kde koupit ${jmeno}`} className="mb-4 rounded-xl border border-teal-200 bg-white p-4 md:px-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="min-w-0">
          <p className="text-lg font-semibold tracking-tight text-slate-900">Kde koupit {jmeno}</p>
          <p className="mt-0.5 text-sm text-slate-600">
            <span className="font-medium text-slate-800">{fond.name}</span>
            <span className="text-slate-400"> · </span>
            <span className="tabular-nums">ISIN {fond.isin}</span>
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-xs leading-snug text-slate-500">
            <Info className="mt-px h-3.5 w-3.5 shrink-0" />
            <span>
              {fond.xetra && fond.ticker
                ? `Na burze Xetra se obchoduje pod tickerem ${fond.ticker}. `
                : 'V našich datech fond nemá listing na Xetře – náklady níže počítáme pro nákup na Xetře, u jiné burzy se mohou lišit. '}
              Zda fond konkrétní broker nabízí, ověřte vyhledáním ISIN v jeho aplikaci – nabídku brokerů neověřujeme.
            </span>
          </p>
        </div>
        <Link href={`/etf/${fond.isin}`} className="inline-flex h-10 shrink-0 items-center gap-1.5 self-start rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 md:self-center">
          <ArrowLeft className="h-4 w-4" /> Zpět na {jmeno}
        </Link>
      </div>
    </section>
  );
}

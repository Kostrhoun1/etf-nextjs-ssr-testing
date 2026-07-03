'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ChevronDown, Star } from 'lucide-react';
import { brokers, comparisonData } from '@/data/brokerData';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';

/* Krátké profilové štítky pod jméno brokera (vzájemně odlišné osy). */
const profileBadge: Record<string, string> = {
  portu: 'Bez starostí',
  xtb: 'Pro začátečníky',
  trading212: 'Pro začátečníky',
  ibkr: 'Pro zkušené',
  degiro: 'Pro zkušené',
  fio: 'České dividendy',
};

/* Pořadí dle skóre (sestupně). */
const ordered = [...brokers].sort((a, b) => b.rating - a.rating);

/* Ano/Ne hodnoty v tabulce vykreslit ikonou, ne textem. */
function YesNo({ value }: { value: string }) {
  const v = value.trim().toLowerCase();
  if (v === 'ne' || v.startsWith('ne ') || v === 'nevztahuje se') {
    return (
      <span className="inline-flex items-center gap-1 text-slate-500">
        <X className="w-4 h-4 text-red-500 shrink-0" strokeWidth={2.5} />
        <span>{value}</span>
      </span>
    );
  }
  if (v.startsWith('ano')) {
    return (
      <span className="inline-flex items-center gap-1 text-slate-700">
        <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
        <span>{value}</span>
      </span>
    );
  }
  return <span>{value}</span>;
}

/* Tenký teal pruh skóre 0–100 vedle čísla – jediný vizuál z reálných dat. */
function ScoreBar({ score, size = 'sm' }: { score: number; size?: 'sm' | 'lg' }) {
  return (
    <div className={`flex items-center gap-2 ${size === 'lg' ? 'w-full' : ''}`}>
      <span
        className={`tabular-nums font-bold text-slate-900 ${
          size === 'lg' ? 'text-2xl' : 'text-sm'
        }`}
      >
        {score}
        <span className="text-slate-400 font-medium text-xs">/100</span>
      </span>
      <div
        className={`${
          size === 'lg' ? 'flex-1' : 'hidden sm:block w-16'
        } h-1.5 rounded-full bg-slate-100 overflow-hidden`}
      >
        <div
          className="h-full rounded-full bg-teal-600"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

/* Které řádky comparisonData obsahují Ano/Ne hodnoty. */
const yesNoFeatures = new Set(['Frakční ETF', 'Česká podpora', 'AutoInvest/DCA']);

export default function SrovnaniBrokeruClient() {
  return (
    <>
      {/* DESKTOP – jedna datová tabulka */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left font-medium px-4 py-3 sticky left-0 bg-slate-50">
                  Parametr
                </th>
                {ordered.map((b) => (
                  <th key={b.id} className="text-left font-medium px-4 py-3 min-w-[150px]">
                    <Link
                      href={reviewHref[b.id]}
                      className="font-semibold text-slate-900 hover:text-teal-700"
                    >
                      {b.name}
                    </Link>
                    <span className="block text-xs font-normal text-slate-400 mt-0.5">
                      {profileBadge[b.id]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {/* Skóre – první řádek s pruhem */}
              <tr className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900 sticky left-0 bg-white">
                  Skóre
                </td>
                {ordered.map((b) => (
                  <td key={b.id} className="px-4 py-3">
                    <ScoreBar score={b.rating} />
                  </td>
                ))}
              </tr>
              {comparisonData.map((row) => (
                <tr key={row.feature} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700 sticky left-0 bg-white">
                    {row.feature}
                  </td>
                  {ordered.map((b) => {
                    const val = (row as unknown as Record<string, string>)[b.id] ?? '—';
                    return (
                      <td key={b.id} className="px-4 py-3 text-slate-600 align-top">
                        {yesNoFeatures.has(row.feature) ? <YesNo value={val} /> : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Recenze – CTA řádek */}
              <tr className="border-t border-slate-100 bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-700 sticky left-0 bg-slate-50/60">
                  Recenze
                </td>
                {ordered.map((b) => (
                  <td key={b.id} className="px-4 py-3">
                    <Link
                      href={reviewHref[b.id]}
                      className="text-teal-700 hover:text-teal-800 font-medium"
                    >
                      Detail →
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBIL – karty na brokera */}
      <div className="md:hidden space-y-3">
        {ordered.map((b) => (
          <MobileBrokerCard key={b.id} id={b.id} />
        ))}
      </div>
    </>
  );
}

function MobileBrokerCard({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const broker = brokers.find((b) => b.id === id)!;

  /* 5 klíčových parametrů z comparisonData. */
  const keyFeatures = [
    'Poplatek nákup ETF',
    'Konverze měn',
    'Frakční ETF',
    'Zdanění CZ dividend',
    'Min. vklad',
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={reviewHref[id]}
            className="font-semibold text-slate-900 hover:text-teal-700"
          >
            {broker.name}
          </Link>
          <span className="mt-1 inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
            {profileBadge[id]}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <ScoreBar score={broker.rating} size="lg" />
      </div>

      <dl className="mt-3 divide-y divide-slate-100 text-sm">
        {keyFeatures.map((f) => {
          const row = comparisonData.find((r) => r.feature === f);
          const val = row ? (row as unknown as Record<string, string>)[id] : '—';
          return (
            <div key={f} className="flex items-start justify-between gap-3 py-2">
              <dt className="text-slate-500 shrink-0">{f}</dt>
              <dd className="text-right text-slate-800 tabular-nums">
                {yesNoFeatures.has(f) ? <YesNo value={val} /> : val}
              </dd>
            </div>
          );
        })}
      </dl>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-teal-700"
      >
        Klady a zápory
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-2 grid gap-3 text-sm">
          <ul className="space-y-1">
            {broker.pros.slice(0, 4).map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-1">
            {broker.cons.slice(0, 3).map((c) => (
              <li key={c} className="flex items-start gap-1.5 text-slate-500">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href={reviewHref[id]}
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"
      >
        <Star className="w-4 h-4" />
        Recenze {broker.name}
      </Link>
    </div>
  );
}

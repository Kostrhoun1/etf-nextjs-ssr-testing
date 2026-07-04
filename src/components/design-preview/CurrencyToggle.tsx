'use client';

import { Coins } from 'lucide-react';
import { CURRENCIES, useCurrency } from '@/components/design-preview/currencyStore';

/* Přepínač měny pro zobrazení výkonnosti (CZK default). Drží se přes localStorage
   napříč stránkami. `label` lze vypnout u kompaktních umístění. */
export default function CurrencyToggle({ size = 'md', showLabel = true }: { size?: 'sm' | 'md'; showLabel?: boolean }) {
  const [cur, setCur] = useCurrency();
  const pad = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <div className="inline-flex items-center gap-2">
      {showLabel && (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
          <Coins className="w-3.5 h-3.5" /> Výnosy v
        </span>
      )}
      <div role="group" aria-label="Měna výnosů" className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
        {CURRENCIES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cur === c}
            onClick={() => setCur(c)}
            className={`rounded-md font-medium tabular-nums transition-colors ${pad} ${cur === c ? 'bg-teal-700 text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

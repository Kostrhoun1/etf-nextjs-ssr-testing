/**
 * Poplatková tabulka DEGIRO – desktop jako tabulka, mobil jako karty
 * (žádný horizontální scroll na 360px). Data z brokerData (DEGIRO).
 */
type FeeRow = { type: string; fee: string; note: string };

const rows: FeeRow[] = [
  { type: 'Vklad / výběr (CZK)', fee: 'Zdarma', note: 'Bankovním převodem v korunách, bez minima.' },
  { type: 'ETF z Core Selection', fee: '1 EUR', note: '~200+ zvýhodněných ETF s nižším manipulačním poplatkem.' },
  { type: 'ETF mimo Core Selection', fee: '3 EUR', note: 'Ostatní ETF – jednorázový manipulační poplatek za pokyn.' },
  { type: 'Americké akcie', fee: '1 EUR + 1 USD', note: 'Manipulační poplatek a poplatek za zpracování.' },
  { type: 'Evropské akcie', fee: '~2–3 EUR', note: 'Podle burzy (3,90 EUR pro hlavní evropské burzy).' },
  { type: 'České akcie (BCPP)', fee: '~3 EUR', note: 'Plus 35% srážka z dividend – viz sekce o daních.' },
  { type: 'Konverze měn CZK/EUR', fee: 'Zdarma', note: 'AutoFX zdarma; ostatní měny 0,25 %.' },
  { type: 'Roční poplatek za burzu', fee: '2,50 EUR', note: 'Za každou cizí burzu, kde v daném roce obchodujete.' },
  { type: 'Vedení účtu', fee: '0 EUR', note: 'Žádný měsíční ani vstupní poplatek.' },
  { type: 'Minimální vklad', fee: '0 EUR', note: 'Začít můžete s libovolnou částkou.' },
];

export default function BrokerFeeTable() {
  return (
    <>
      {/* Desktop: tabulka */}
      <div className="hidden md:block rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-left">
              <th className="py-3 px-4 font-medium">Typ transakce</th>
              <th className="py-3 px-4 font-medium">Poplatek</th>
              <th className="py-3 px-4 font-medium">Poznámka</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.map((r) => (
              <tr key={r.type}>
                <td className="py-3 px-4 font-medium text-slate-900">{r.type}</td>
                <td className="py-3 px-4 tabular-nums whitespace-nowrap">{r.fee}</td>
                <td className="py-3 px-4 text-slate-600">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil: karty */}
      <div className="md:hidden space-y-2.5">
        {rows.map((r) => (
          <div key={r.type} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="font-medium text-slate-900 text-sm">{r.type}</span>
              <span className="tabular-nums text-sm font-semibold text-teal-700 shrink-0">{r.fee}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-snug">{r.note}</p>
          </div>
        ))}
      </div>
    </>
  );
}

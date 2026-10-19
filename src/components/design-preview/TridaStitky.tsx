import type { TridaFondu } from '@/lib/nazevFondu';

/* Štítky třídy fondu ve výsledcích hledání (kolo 5, 19. 10. 2026): oříznutý název schoval Acc/Dist
   a 8 tříd „iShares Core S&P 500 UCITS …“ nešlo rozlišit. Výplata, měna a zajištění zvlášť, vždy vidět. */
export default function TridaStitky({ t }: { t?: TridaFondu | null }) {
  if (!t || (!t.vyplata && !t.mena && !t.zajisteni)) return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium leading-none">
      {t.vyplata && (
        <span title={t.vyplata === 'Acc' ? 'Akumulační – dividendy reinvestuje' : 'Distribuční – dividendy vyplácí'}
          className={`rounded px-1 py-0.5 ${t.vyplata === 'Acc' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>{t.vyplata}</span>
      )}
      {t.mena && <span className="rounded bg-slate-100 px-1 py-0.5 text-slate-600">{t.mena}</span>}
      {t.zajisteni && (
        <span className="rounded bg-amber-50 px-1 py-0.5 text-amber-800 ring-1 ring-amber-200">
          zajištěno{t.zajisteni !== 'ano' ? ` ${t.zajisteni}` : ''}
        </span>
      )}
    </span>
  );
}

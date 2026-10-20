import Link from 'next/link';
import { User } from 'lucide-react';
import { dataClanku, datumUpravy, denCesky } from '@/lib/redakce';

/**
 * Viditelný autor a data stránky (SEO audit 20. 10. 2026, E-E-A-T) – sdílená komponenta redakčních stránek.
 * Data ze src/lib/clanky.ts (git historie, u stránek z dat den dat) – stejná jako v JSON-LD Article.
 */
export default function AutorBox({ cesta, denDat, text }: { cesta: string; denDat?: string | Date | null; text?: React.ReactNode }) {
  const d = dataClanku(cesta);
  const upraveno = d ? datumUpravy(cesta, denDat) : null;
  return (
    <section data-sekce="autor" className="pb-8">
      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-start gap-4">
        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-100 text-slate-500 border border-slate-200 shrink-0"><User className="w-5 h-5" aria-hidden="true" /></span>
        <div className="min-w-0 text-sm text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
          <p className="mt-1">
            {text ?? <>Autor ETF průvodce.cz, 12+ let praxe v českém bankovnictví. Čísla počítáme z dat přepočtených do korun – jde o vzdělávací materiál, ne investiční doporučení.</>}{' '}
            <Link href="/o-nas" className="text-teal-700 hover:underline">O autorovi</Link>
            {' · '}
            <Link href="/metodika" className="text-teal-700 hover:underline">Metodika a zdroje dat</Link>
          </p>
          {d && upraveno && (
            <p className="mt-1.5 text-xs text-slate-500">
              Zveřejněno <time dateTime={d.publikovano}>{denCesky(d.publikovano)}</time>
              {upraveno !== d.publikovano && <> · aktualizováno <time dateTime={upraveno}>{denCesky(upraveno)}</time></>}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

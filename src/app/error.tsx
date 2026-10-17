'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { reportClientError } from '@/lib/client-error';

/**
 * Chyba při vykreslení stránky. Dřív tu nebylo nic a návštěvník viděl výchozí anglickou
 * stránku Next.js – a my jsme se o chybě nedozvěděli. Teď se chyba ohlásí do logů
 * (src/lib/client-error.ts) a člověk dostane srozumitelnou cestu dál.
 */
export default function Chyba({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportClientError({ kind: 'boundary', message: error.message, stack: error.stack, digest: error.digest });
  }, [error]);

  return (
    <main id="obsah" className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Něco se pokazilo</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Tuhle stránku se nepodařilo zobrazit</h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Chyba je na naší straně a už o ní víme. Zkuste stránku načíst znovu – často to pomůže.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
        >
          Zkusit znovu
        </button>
        <Link href="/" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Na úvodní stránku
        </Link>
      </div>
    </main>
  );
}

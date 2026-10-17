import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Stránka 404. Dřív tu nebyla a návštěvník viděl výchozí anglickou stránku Next.js
 * („404: This page could not be found."). Sem vedou i nesmyslné adresy, které zastaví
 * middleware (neplatný ISIN, neplatná dvojice srovnání), a fondy, které v databázi nejsou.
 * Statická – nevolá databázi.
 */
export const metadata: Metadata = {
  title: 'Stránka nenalezena',
  robots: { index: false, follow: true },
};

export default function Nenalezeno() {
  return (
    <main id="obsah" className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Chyba 404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Tuhle stránku jsme nenašli</h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Adresa je buď překlep, nebo fond už v naší databázi není. Fond najdete podle názvu,
        tickeru nebo ISINu ve srovnávači.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/srovnani" className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800">
          Najít fond ve srovnávači
        </Link>
        <Link href="/" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Na úvodní stránku
        </Link>
      </div>
    </main>
  );
}

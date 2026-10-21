/**
 * „Klíčová čísla k [datum]“ – krátká citovatelná tabulka na pilířových stránkách (SEO/GEO audit 6b, 21. 10. 2026).
 * Čísla jsou VŽDY ze stejných dat jako zbytek stránky (žádný samostatný zdroj) a nesou datum. Pod tabulkou primární
 * zdroje (ČNB, ČSÚ, zákon, emitent) – ať si je čtenář i AI vyhledávač ověří.
 */
export interface KlicoveCislo { co: string; hodnota: string; pozn?: string }

export default function KlicovaCisla({ nadpis, datum, radky, zdroje, className = 'pb-8' }: {
  nadpis?: string;
  /** „19. 10. 2026“ – den, ke kterému čísla platí. */
  datum: string;
  radky: KlicoveCislo[];
  zdroje?: { href: string; text: string }[];
  className?: string;
}) {
  if (!radky.length) return null;
  return (
    <section data-sekce="klicova-cisla" className={className} aria-labelledby="klicova-cisla-h">
      <h2 id="klicova-cisla-h" className="text-lg font-bold tracking-tight text-slate-900">{nadpis ?? 'Klíčová čísla'} k {datum}</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            {radky.map((r) => (
              <tr key={r.co}>
                <th scope="row" className="px-4 py-2.5 text-left font-medium text-slate-700 align-top">{r.co}</th>
                <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-slate-900 whitespace-nowrap align-top">{r.hodnota}</td>
                {radky.some((x) => x.pozn) && <td className="hidden sm:table-cell px-4 py-2.5 text-xs text-slate-500 align-top">{r.pozn ?? ''}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {zdroje && zdroje.length > 0 && (
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          Primární zdroje:{' '}
          {zdroje.map((z, i) => (
            <span key={z.href}>
              {i > 0 && ' · '}
              <a href={z.href} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline underline-offset-2 hover:text-teal-800">{z.text}</a>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}

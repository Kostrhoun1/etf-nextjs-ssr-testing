import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { nazevZebricku } from '@/lib/zebrickySouvisejici';

/**
 * Řádek odkazů na žebříčky (SEO audit 6b): „Související žebříčky“ na žebříčcích a „Žebříčky k tématu“ v článcích.
 * Jen odkazy (chipy), žádný výklad – stejný vzhled na celém webu.
 */
export default function SouvisejiciZebricky({ slugy, nadpis = 'Související žebříčky', className = 'pb-8' }: { slugy: string[]; nadpis?: string; className?: string }) {
  if (!slugy.length) return null;
  return (
    <nav aria-label={nadpis} data-sekce="souvisejici-zebricky" className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{nadpis}</p>
      <ul className="mt-2.5 flex flex-wrap gap-2">
        {slugy.map((s) => (
          <li key={s}>
            <Link href={`/nejlepsi-etf/${s}`} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-teal-300 hover:text-teal-800">
              {nazevZebricku(s)} <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

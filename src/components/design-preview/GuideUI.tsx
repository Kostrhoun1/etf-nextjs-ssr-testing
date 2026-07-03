import type { LucideIcon } from 'lucide-react';
import { ArrowRight, ChevronRight, HelpCircle } from 'lucide-react';

/* =========================================================================
   GuideUI – pomocné komponenty pro edukační stránku „Co jsou ETF".
   Prefix komponent: Guide* (ať nekolidují s ostatními pody).
   Vizuální jazyk 1:1 dle schválené kategorie (teal/slate, lucide,
   sentence case, žádné gradienty/emoji/fialová).
   ========================================================================= */

/* ---------- GuideSection: obal sekce s kotvou + scroll-mt ---------- */
export function GuideSection({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`pb-10 scroll-mt-16 ${className}`}>
      {children}
    </section>
  );
}

/* ---------- GuideCallout: zvýrazněný edukační box ---------- */
export function GuideCallout({
  icon: Icon,
  title,
  children,
  tone = 'teal',
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  tone?: 'teal' | 'amber' | 'slate';
}) {
  const tones = {
    teal: 'bg-teal-50 border-teal-200 text-teal-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    slate: 'bg-slate-50 border-slate-200 text-slate-800',
  } as const;
  const iconTone = {
    teal: 'text-teal-700',
    amber: 'text-amber-700',
    slate: 'text-slate-600',
  } as const;
  return (
    <div className={`rounded-lg border p-4 md:p-5 ${tones[tone]}`}>
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Icon className={`w-4 h-4 shrink-0 ${iconTone[tone]}`} /> {title}
      </p>
      <div className="mt-1.5 text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

/* ---------- GuideTermCard: karta pojmu (definice + proč + příklad) ---------- */
export function GuideTermCard({
  icon: Icon,
  term,
  abbr,
  definition,
  why,
  example,
}: {
  icon: LucideIcon;
  term: string;
  abbr?: string;
  definition: React.ReactNode;
  why: React.ReactNode;
  example: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 h-full flex flex-col">
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0">
          <Icon className="w-4 h-4" />
        </span>
        <div>
          <h3 className="font-semibold text-slate-900 leading-tight">{term}</h3>
          {abbr && <p className="text-xs text-slate-400 leading-tight">{abbr}</p>}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{definition}</p>
      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
        <p className="text-sm text-slate-600 leading-relaxed">
          <span className="font-medium text-slate-800">Proč na tom záleží: </span>
          {why}
        </p>
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="font-medium text-slate-600">Příklad: </span>
          {example}
        </p>
      </div>
    </div>
  );
}

/* ---------- GuideTOC: obsah / kotvy (na mobilu sbalitelné) ---------- */
export function GuideTOC({ items }: { items: { href: string; label: string }[] }) {
  return (
    <details className="group rounded-lg border border-slate-200 bg-white open:pb-1 md:open:pb-2" open>
      <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none md:cursor-default">
        <span className="text-sm font-semibold text-slate-900">Obsah průvodce</span>
        <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform md:hidden" />
      </summary>
      <nav className="px-2 pb-2 md:pb-3">
        <ul className="grid sm:grid-cols-2 gap-x-4">
          {items.map((it, i) => (
            <li key={it.href}>
              <a
                href={it.href}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-700 transition-colors"
              >
                <span className="text-xs text-slate-400 tabular-nums w-4 shrink-0">{i + 1}.</span>
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}

/* ---------- GuideFAQ: akordeon (stejný vzor jako kategorie) ---------- */
export function GuideFAQ({ faqs }: { faqs: { q: string; a: React.ReactNode }[] }) {
  return (
    <div className="space-y-2">
      {faqs.map((f, i) => (
        <details key={i} className="group rounded-lg border border-slate-200 bg-white">
          <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <HelpCircle className="w-4 h-4 text-teal-700 shrink-0" /> {f.q}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

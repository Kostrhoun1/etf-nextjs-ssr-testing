import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import { notFound } from 'next/navigation';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, Star, CalendarDays, Check, X, ExternalLink, ChevronDown,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import { brokers, nakladNakupu, cenikyOverenyIso, cenikyOverenyStr } from '@/data/brokerData';
import { getBrokerContent } from '@/components/design-preview/brokerContent';
import { BrokerLogo, FaqSeznam, CASTKY_NAKUPU } from '@/components/design-preview/brokerUI';
import { nactiKurzCnb, datumKurzu } from '@/lib/kurzCnb';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

/* Recenze brokera: vlevo text (úvod, náklady jako tabulka, klady/zápory, verdikt, FAQ), vpravo sticky karta
   s klíčovými fakty z brokerData (revize 18. 10. 2026: dřív úzký sloupec textu a prázdná pravá třetina). */

export const revalidate = 86400;

export function generateStaticParams() {
  return brokers.map((b) => ({ broker: b.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ broker: string }> },
): Promise<Metadata> {
  const { broker } = await params;
  const b = brokers.find((x) => x.id === broker);
  if (!b) return { title: 'Recenze brokera', robots: { index: false, follow: false } };
  return {
    title: `${b.name} recenze ${new Date().getFullYear()} – poplatky, ETF, daně`,
    description: `Recenze ${b.robo ? 'robo-poradce' : 'brokera'} ${b.name} pro investování do ETF: poplatky, směna měn, zdanění dividend, ochrana hotovosti a cenných papírů a pro koho se hodí.`,
    alternates: { canonical: `https://etfpruvodce.cz/recenze/${b.id}` },
  };
}

const kc = (v: number) =>
  `${v < 10 ? v.toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) : Math.round(v).toLocaleString('cs-CZ')} Kč`;

export default async function BrokerReview(
  { params }: { params: Promise<{ broker: string }> },
) {
  const { broker } = await params;
  const b = brokers.find((x) => x.id === broker);
  if (!b) notFound();
  const c = getBrokerContent(b.id);
  const kurzy = await nactiKurzCnb();

  const pros = c?.pros ?? b.pros;
  const cons = c?.cons ?? b.cons;

  /* Náklady jako tabulka – hodnoty z brokerData, spočítané částky z ceníku (ne natvrdo). */
  const naklady: { k: string; v: string; tip?: string }[] = b.robo
    ? [
        { k: 'Roční poplatek za správu', v: b.managementFee, tip: 'Platí se každý rok z celé hodnoty portfolia; zahrnuje nákupy, rebalancování i směnu měn.' },
        { k: 'Směna měn', v: b.fxFee },
        { k: 'Minimální vklad', v: b.minDeposit },
        { k: 'Daň z českých dividend', v: b.czDividends },
      ]
    : [
        { k: 'Poplatek za nákup ETF', v: b.etfFee },
        { k: 'Směna CZK → EUR', v: b.fxFee },
        ...CASTKY_NAKUPU.map((castka) => {
          const n = kurzy ? nakladNakupu(b, castka, kurzy) : null;
          const v = !n ? '—'
            : n.celkemKc == null ? `${kc(n.provizeKc)} + kurz banky (výši neznáme)`
            : `${kc(n.celkemKc)}${n.plusBurza ? ' + poplatky burzy' : ''} (${((n.celkemKc / castka) * 100).toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} %)`;
          return {
            k: `Nákup ETF za ${castka.toLocaleString('cs-CZ')} Kč celkem`,
            v,
            tip: kurzy ? `Poplatek za nákup + směna korun na eura, nákup evropského ETF na Xetře. Kurz ČNB k ${datumKurzu(kurzy)}.` : 'Kurz ČNB se nepodařilo načíst – částku teď neukazujeme.',
          };
        }),
        { k: 'Vedení účtu', v: b.managementFee },
        { k: 'Minimální vklad', v: b.minDeposit },
        { k: 'Daň z českých dividend', v: b.czDividends },
      ];

  /* Klíčová fakta do pravé karty. */
  const fakta: { k: string; v: string }[] = [
    ...(b.robo ? [{ k: 'Roční poplatek', v: b.managementFee }] : [{ k: 'Nákup ETF', v: b.etfFee }, { k: 'Směna měny', v: b.fxFee }]),
    { k: 'Hotovost na účtu', v: b.ochrana?.hotovost ?? '—' },
    { k: 'Cenné papíry (při krachu)', v: b.ochrana?.cennePapiry ?? '—' },
    { k: 'Regulace', v: b.regulation },
    { k: 'Česká podpora', v: b.czSupport ? b.customerSupport : 'Ne, jen anglicky' },
  ];

  const faqSchema = c ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-14">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <Link href="/srovnani-brokeru" className="hover:text-slate-700">Srovnání brokerů</Link>
          <span>/</span>
          <span className="text-slate-700">{b.name}</span>
        </nav>

        {/* HERO */}
        <section data-sekce="hero" className="pb-6">
          <div className="rounded-2xl bg-slate-900 text-white px-5 py-6 md:px-9 md:py-8">
            <div className="flex items-center gap-3">
              <BrokerLogo id={b.id} size="lg" />
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{b.name} – recenze</h1>
                <p className="mt-0.5 text-xs text-slate-400">{b.robo ? 'Robo-poradce' : 'Broker'} · <CalendarDays className="inline w-3.5 h-3.5 -mt-0.5" /> ceník ověřen {cenikyOverenyStr}</p>
              </div>
              {b.rating != null ? (
                <span className="ml-auto hidden sm:inline-flex items-center gap-1 rounded-full bg-teal-600/20 border border-teal-500/30 px-3 py-1 text-sm font-semibold text-teal-100"><Star className="w-3.5 h-3.5" /> {b.rating}/100</span>
              ) : (
                <span className="ml-auto hidden sm:inline-flex rounded-full border border-white/20 px-3 py-1 text-xs text-slate-300">jiná kategorie – bez skóre brokerů</span>
              )}
            </div>
            {c?.tagline && <p className="mt-4 max-w-3xl text-slate-300 text-sm md:text-base leading-relaxed">{c.tagline}</p>}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {/* PRAVÁ KARTA – klíčová fakta (na mobilu hned pod hero) */}
          <aside data-sekce="fakta" className="lg:order-2 lg:sticky lg:top-20">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <BrokerLogo id={b.id} />
                <span className="font-semibold text-slate-900">{b.name}</span>
                <span className="ml-auto text-sm">
                  {b.rating != null
                    ? <InfoTip label="Redakční skóre 0–100, stejná metodika pro všechny brokery."><span className="font-bold tabular-nums text-slate-900">{b.rating}<span className="text-xs font-medium text-slate-400">/100</span></span></InfoTip>
                    : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">robo-poradce</span>}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 text-sm lg:grid-cols-1">
                {fakta.map((f) => (
                  <div key={f.k} className="border-t border-slate-100 py-2.5">
                    <dt className="text-xs text-slate-500">{f.k}</dt>
                    <dd className="mt-0.5 text-slate-900 leading-snug">{f.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-slate-500">Ceník ověřen <time dateTime={cenikyOverenyIso}>{cenikyOverenyStr}</time></p>
              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
                {b.web && (
                  <a href={b.web} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-3 text-sm font-medium text-white hover:bg-teal-800">
                    Web brokera <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <Link href="/srovnani-brokeru" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">
                  Srovnat <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="mt-3 text-[11px] leading-snug text-slate-400">Odkaz bez provize – na brokerech nevyděláváme.</p>
            </div>
          </aside>

          {/* LEVÝ SLOUPEC – obsah */}
          <div className="lg:order-1 lg:col-span-2 min-w-0 space-y-8">
            {c && (
              <section data-sekce="uvod" className="space-y-3 text-[15px] text-slate-700 leading-relaxed">
                {c.intro.map((p, i) => <p key={i}>{p}</p>)}
              </section>
            )}

            <section data-sekce="naklady">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Kolik vás {b.name} stojí</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* Řádky jako dl: na mobilu popisek nad hodnotou (tabulka se dvěma sloupci hodnotu mačkala do úzkého sloupce). */}
                <dl className="divide-y divide-slate-100 text-sm">
                  {naklady.map((r) => (
                    <div key={r.k} className="grid gap-0.5 px-4 py-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
                      <dt className="font-medium text-slate-500 sm:text-slate-600">{r.tip ? <InfoTip label={r.tip}>{r.k}</InfoTip> : r.k}</dt>
                      <dd className="text-slate-900 tabular-nums">{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {c && c.feesText.length > 0 && (
                <details className="group mt-3 rounded-xl border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-800">
                    Podrobně k nákladům a daním
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="space-y-3 px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                    {c.feesText.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </details>
              )}
            </section>

            <section data-sekce="klady-zapory" className="grid sm:grid-cols-2 gap-4">
              <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">Výhody</h2>
                <ul className="space-y-2">
                  {pros.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" /> <span>{p}</span></li>)}
                </ul>
              </div>
              <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">Nevýhody</h2>
                <ul className="space-y-2">
                  {cons.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><X className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" /> <span>{p}</span></li>)}
                </ul>
              </div>
            </section>

            {c && c.verdict.length > 0 && (
              <section data-sekce="verdikt" className="rounded-xl border border-teal-200 bg-teal-50/60 p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-teal-900 mb-2"><Star className="w-4 h-4" /> Verdikt</h2>
                <div className="space-y-2 text-sm text-teal-950/80 leading-relaxed">{c.verdict.map((p, i) => <p key={i}>{p}</p>)}</div>
                {c.forWhom && <p className="mt-3 text-sm text-teal-950/80 leading-relaxed"><span className="font-medium text-teal-900">Pro koho: </span>{c.forWhom}</p>}
              </section>
            )}

            {c && c.faqs.length > 0 && (
              <section data-sekce="faq">
                <h2 className="mb-4 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Časté otázky</h2>
                <FaqSeznam items={c.faqs} />
              </section>
            )}

            <p className="text-xs text-slate-500 leading-relaxed">
              Zdroj dat: veřejný ceník {b.name} (ověřen <time dateTime={cenikyOverenyIso}>{cenikyOverenyStr}</time>){kurzy ? `, kurz ČNB k ${datumKurzu(kurzy)}` : ''}.
              Broker může ceník změnit kdykoli – před založením účtu si podmínky ověřte na jeho webu.
            </p>
            <InvestmentDisclaimer variant="box" />
          </div>
        </div>
      </main>
    </div>
  );
}

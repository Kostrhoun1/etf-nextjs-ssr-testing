import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import { notFound } from 'next/navigation';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, CalendarDays, Check, X, ExternalLink, ChevronDown, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import StickyKdyzSeVejde from './StickyKdyzSeVejde';
import {
  brokers, nakladNakupu, popisPoplatku, popisSmeny, popisMinVkladu, popisRegulace, popisVedeniUctu, popisDaneDividend, popisPodpory, ochranaHotovosti, ochranaPapiru,
  cenikyOverenyIso, cenikyOverenyStr,
} from '@/data/brokerData';
import { getBrokerContent } from '@/components/design-preview/brokerContent';
import { BrokerLogo, FaqSeznam, AutorBox, TipZaTextem, CASTKA_PRIKLAD } from '@/components/design-preview/brokerUI';
import { nactiKurzCnb, datumKurzu } from '@/lib/kurzCnb';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

/* Recenze brokera (revize kola 2): každý údaj JEDNOU – podtitulek bez čísel, fakta jen v kartě „Kolik vás stojí“
   (na desktopu vpravo, na mobilu hned pod rychlým „Pro koho / Pro koho ne“). Dlouhé odstavce sbalené.
   Bez „verdiktu“ – web je srovnávač, ne poradce. */

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
    description: `Recenze ${b.robo ? 'robo-poradce' : 'brokera'} ${b.name} pro investování do ETF: poplatky, směna měn, zdanění dividend, ochrana hotovosti a cenných papírů, pro koho se hodí a jak založit účet.`,
    alternates: { canonical: `https://etfpruvodce.cz/recenze/${b.id}` },
  };
}

const kc = (v: number) =>
  `${v < 10 ? v.toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) : Math.round(v).toLocaleString('cs-CZ')} Kč`;
const proc = (v: number) => `${v.toLocaleString('cs-CZ', { maximumFractionDigits: v < 1 ? 2 : 1 })} %`;

type Fakt = { k: string; v: string; pozn?: string; tip?: string; data?: Record<string, string> };

export default async function BrokerReview(
  { params }: { params: Promise<{ broker: string }> },
) {
  const { broker } = await params;
  const b = brokers.find((x) => x.id === broker);
  if (!b) notFound();
  const c = getBrokerContent(b.id);
  const kurzy = await nactiKurzCnb();


  /* Příkladový nákup – spočítaný z ceníku a kurzu ČNB (ne natvrdo). „od“ = část nákladu neznáme. */
  const n = kurzy && !b.robo ? nakladNakupu(b, CASTKA_PRIKLAD, kurzy) : null;
  const priklad = !n ? '—'
    : n.celkemKc == null ? `od ${kc(n.provizeKc)}`
    : `${n.plusBurza ? 'od ' : ''}${kc(n.celkemKc)} (${proc((n.celkemKc / CASTKA_PRIKLAD) * 100)})`;
  const prikladPozn = !n ? undefined
    : n.celkemKc == null ? `poplatek ${kc(n.provizeKc)} + směna v kurzu banky (výši neznáme)`
    : `poplatek ${kc(n.provizeKc)} + směna ${kc(n.smenaKc ?? 0)}${n.plusBurza ? ' + poplatky burzy (výši neznáme)' : ''}`;

  /* JEDINÉ místo s fakty o brokerovi na stránce (dřív 3× – podtitulek, boční karta, tabulka). */
  const hot = ochranaHotovosti(b);
  const cp = ochranaPapiru(b);
  const fakta: Fakt[] = b.robo
    ? [
        { k: 'Roční poplatek za správu', v: b.managementFee, tip: 'Platí se každý rok z celé hodnoty portfolia; zahrnuje nákupy, rebalancování i směnu měn.' },
        { k: 'Směna měn', v: b.fxFee },
        { k: 'Minimální vklad', v: popisMinVkladu(b) },
        { k: 'Daň z českých dividend', ...popisDaneDividend(b) },
      ]
    : [
        { k: 'Nákup ETF (Xetra)', v: popisPoplatku(b) ?? '—', pozn: b.nakup?.pozn, data: { 'data-poplatek': popisPoplatku(b) ?? '' } },
        { k: 'Směna CZK → EUR', v: popisSmeny(b) ?? '—', pozn: b.nakup?.smenaPozn, data: { 'data-smena': popisSmeny(b) ?? '' } },
        {
          k: `Nákup za ${CASTKA_PRIKLAD.toLocaleString('cs-CZ')} Kč celkem`, v: priklad, pozn: prikladPozn,
          tip: kurzy ? `Poplatek za nákup + směna korun na eura, nákup evropského ETF na Xetře. Kurz ČNB k ${datumKurzu(kurzy)}.` : 'Kurz ČNB se nepodařilo načíst – částku teď neukazujeme.',
        },
        { k: 'Vedení účtu', ...popisVedeniUctu(b) },
        { k: 'Minimální vklad', v: popisMinVkladu(b) },
        { k: 'Daň z českých dividend', ...popisDaneDividend(b), tip: 'Srážka z dividend českých akcií. U akumulačních ETF se vás přímo netýká.' },
      ];
  fakta.push(
    { k: 'Hotovost na účtu', v: hot.v, pozn: hot.pozn },
    // Bez vysvětlivky: vysvětlení je přímo v hodnotě („Vracejí se vám“ + kdy nastupuje náhrada); bublina na mobilu
    // překrývala právě tento řádek (revize kola 5).
    { k: 'Cenné papíry při krachu', v: cp.v, pozn: cp.pozn },
    { k: 'Regulace', ...popisRegulace(b) },
    { k: 'Česká podpora', ...(b.czSupport ? { v: b.customerSupport } : { v: `Ne, ${popisPodpory(b).pozn}` }) },
  );

  const faqSchema = c ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Srovnání brokerů', item: 'https://etfpruvodce.cz/srovnani-brokeru' },
      { '@type': 'ListItem', position: 3, name: `${b.name} recenze`, item: `https://etfpruvodce.cz/recenze/${b.id}` },
    ],
  };

  const kartaFakt = (
    <aside data-sekce="fakta" data-broker={b.id} className="rounded-xl border border-slate-200 bg-white">
      <h2 className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3 text-base font-semibold text-slate-900">
        <BrokerLogo id={b.id} size="sm" /> Kolik vás {b.name} stojí
      </h2>
      <dl className="divide-y divide-slate-100 text-sm">
        {fakta.map((f) => (
          <div key={f.k} className="grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-3 px-4 py-2">
            <dt className="text-slate-500">{f.tip ? <TipZaTextem text={f.k} tip={f.tip} /> : f.k}</dt>
            <dd className="min-w-0 tabular-nums" {...f.data}>
              <span className="block font-medium text-slate-900 leading-snug">{f.v}</span>
              {f.pozn && f.pozn !== f.v && <span className="mt-0.5 block text-xs leading-snug text-slate-500">{f.pozn}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <div className="space-y-1.5 border-t border-slate-100 px-4 py-3 text-sm">
        {!b.robo && (
          <Link href="/kde-koupit#naklady" className="flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">
            Spočítat pro vaši částku <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        <Link href="/srovnani-brokeru" className="flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">
          Srovnat s ostatními brokery <ArrowRight className="h-4 w-4" />
        </Link>
        {b.web && (
          <a href={b.web} target="_blank" rel="nofollow noopener noreferrer" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
            Web {b.name} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        <p className="pt-1 text-xs text-slate-500">
          Ceník ověřen <time dateTime={cenikyOverenyIso}>{cenikyOverenyStr}</time>{kurzy && !b.robo ? `, kurz ČNB k ${datumKurzu(kurzy)}` : ''}. Odkazy bez provize.
        </p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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

        {/* HERO – logo, název, skóre, jedna věta bez čísel. Žádné tlačítko (ani na mobilu). */}
        <section data-sekce="hero" className="pb-6">
          <div className="rounded-2xl bg-slate-900 text-white px-5 py-6 md:px-9 md:py-8">
            <div className="flex items-start gap-3.5">
              <BrokerLogo id={b.id} size="lg" />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{b.name}: recenze</h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                  <span>{b.robo ? 'Robo-poradce' : 'Broker'}</span>
                  {b.rating != null
                    ? <span className="text-slate-200">Skóre <span className="font-semibold text-white tabular-nums">{b.rating}</span>/100 (<Link href="/kde-koupit#metodika" className="underline underline-offset-2 hover:text-white">metodika</Link>)</span>
                    : <span>bez skóre brokerů – jiná kategorie</span>}
                  <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> ceník ověřen {cenikyOverenyStr}</span>
                </p>
              </div>
            </div>
            {c?.tagline && <p className="mt-4 max-w-3xl text-slate-300 text-sm md:text-base leading-relaxed">{c.tagline}</p>}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 1. RYCHLE: pro koho / pro koho ne */}
          {c && (
            <section data-sekce="pro-koho" className="grid gap-3 sm:grid-cols-2 lg:col-span-2 lg:row-start-1">
              <h2 className="sr-only">Pro koho se {b.name} hodí</h2>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900"><ThumbsUp className="h-4 w-4 text-emerald-600" /> Hodí se, když…</h3>
                <ul className="mt-2.5 space-y-2">
                  {c.proKoho.map((t) => <li key={t} className="flex items-start gap-2 text-sm leading-snug text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} /><span>{t}</span></li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900"><ThumbsDown className="h-4 w-4 text-slate-500" /> Nehodí se, když…</h3>
                <ul className="mt-2.5 space-y-2">
                  {c.proKohoNe.map((t) => <li key={t} className="flex items-start gap-2 text-sm leading-snug text-slate-700"><X className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={2.5} /><span>{t}</span></li>)}
                </ul>
              </div>
            </section>
          )}

          {/* 2. FAKTA – na desktopu vpravo přes celou výšku, na mobilu hned pod „pro koho“ */}
          <div className="lg:col-start-3 lg:row-start-1 lg:row-span-2"><StickyKdyzSeVejde>{kartaFakt}</StickyKdyzSeVejde></div>

          {/* 3. ZBYTEK OBSAHU */}
          <div className="min-w-0 space-y-8 lg:col-span-2 lg:row-start-2">
            {c && c.zalozeni.length > 0 && (
              <section data-sekce="zalozeni">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Jak založit účet ve 3 krocích</h2>
                <ol className="mt-4 grid gap-3 sm:grid-cols-3">
                  {c.zalozeni.map((k, i) => (
                    <li key={k.t} className="rounded-xl border border-slate-200 bg-white p-4">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">{i + 1}</span>
                      <p className="mt-2.5 text-sm font-medium text-slate-900">{k.t}</p>
                      <p className="mt-1 text-sm leading-snug text-slate-500">{k.d}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-2 text-xs text-slate-500">
                  Podle <a href={c.zalozeniZdroj} target="_blank" rel="nofollow noopener noreferrer" className="underline underline-offset-2 hover:text-slate-700">oficiálního postupu {b.name}</a> (ověřeno {cenikyOverenyStr}). Podrobnosti se mohou měnit, řiďte se pokyny při registraci.
                </p>
              </section>
            )}


            {/* Dlouhé texty sbalené – stejný vzhled jako FAQ */}
            {c && (c.intro.length > 0 || c.feesText.length > 0) && (
              <section data-sekce="podrobne">
                <h2 className="mb-4 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Podrobně</h2>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                  {[
                    { t: `Kdo je ${b.name}`, p: c.intro },
                    { t: 'Náklady a daně podrobně', p: c.feesText },
                  ].filter((x) => x.p.length > 0).map((x) => (
                    <details key={x.t} className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[15px] font-medium text-slate-900 hover:bg-slate-50">
                        <h3 className="font-medium">{x.t}</h3>
                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="space-y-3 px-4 pb-4 text-sm leading-relaxed text-slate-600">
                        {x.p.map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {c && c.faqs.length > 0 && (
              <section data-sekce="faq">
                <h2 className="mb-4 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Časté otázky</h2>
                <FaqSeznam items={c.faqs} />
              </section>
            )}

            <section data-sekce="autor" className="space-y-3">
              <AutorBox />
              <p className="text-xs text-slate-500 leading-relaxed">
                <span>
                  Zdroj dat: veřejný ceník {b.name} (ověřen <time dateTime={cenikyOverenyIso}>{cenikyOverenyStr}</time>){kurzy && !b.robo ? `, kurz ČNB k ${datumKurzu(kurzy)}` : ''}.
                  Broker může ceník změnit kdykoli – před založením účtu si podmínky ověřte na jeho webu.
                </span>
              </p>
              <InvestmentDisclaimer variant="inline" />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

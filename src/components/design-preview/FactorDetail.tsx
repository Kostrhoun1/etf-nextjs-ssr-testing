/**
 * Sdílená šablona detailní stránky faktoru (/faktorove-etf/<faktor>).
 *
 * KOLO 8 (22. 10. 2026, pravidlo č. 1): ŽÁDNÉ číslo natvrdo. Dřív config nesl karty, klouzavá okna, krize
 * i DCA ručně opsané z 13. 7. 2026 – před opravou dvojího TER, takže se lišily od živého grafu na téže stránce.
 * Teď se VŠE počítá z backtest enginu (src/lib/faktory/vypocet.ts, ISR 1 den) a stránka ukazuje přesné okno
 * („26. 5. 2000 – 21. 10. 2026“) a den dat. Config stránky dodává jen texty; čísla dostává přes `Kontext`.
 * Tvrzení s porovnáním (porazil index, nejrychlejší z faktorů, kolikrát vyhrál) se odvozují z dat.
 * Kontrola: scripts/check-fund-data.mjs, blok „kolo8 faktory“ (statická i živá).
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import AutorBox from '@/components/design-preview/AutorBox';
import { clanekSchema, upravenoDlouze } from '@/lib/redakce';
import {
  TrendingUp, Database, Calculator, Wallet, Scale, ShieldCheck,
  AlertTriangle, BookOpen, History, LineChart, Zap,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { ogImage } from '@/lib/ogImage';
import { INDEX_BY_CODE } from '@/lib/backtest/indexes';
import { nactiFaktory, FAKTORY_DEF, POCATECNI, MESICNI_VKLAD, PRODLOUZENI, type Bod, type FaktorSlug, type FaktorVysledek, type FaktoryVysledek, type Rocenka } from '@/lib/faktory/vypocet';
import { nactiFondyFaktoru, nactiTerSp500, type FondyFaktoru, type FaktorFond } from '@/lib/faktory/fondy';
import { pct, pctBez, pb, kc, kcKratce, den, mesic, mesicu, let_, ter, NBSP } from '@/lib/faktory/format';

/** Všechny rozbory faktorů – pro vzájemné odkazy a rozcestník /faktorove-etf (SEO audit 20. 10. 2026). */
export const FAKTORY: { slug: string; nazev: string; popis: string }[] = [
  { slug: 'value', nazev: 'Value', popis: 'Levné firmy vůči ziskům a účetní hodnotě' },
  { slug: 'small-cap', nazev: 'Malé firmy (small cap)', popis: 'Menší firmy – vyšší potenciál i riziko' },
  { slug: 'quality', nazev: 'Kvalita (quality)', popis: 'Ziskové firmy s nízkým dluhem' },
  { slug: 'momentum', nazev: 'Momentum', popis: 'Akcie, kterým se v posledním roce dařilo' },
  { slug: 'minimalni-volatilita', nazev: 'Minimální volatilita', popis: 'Akcie s nejmenším kolísáním' },
  { slug: 'dividendove-akcie', nazev: 'Dividendové akcie', popis: 'Firmy s vysokou dividendou' },
];

/** Vše, co texty stránky smějí použít – čísla jen odsud (nikdy natvrdo v configu). */
export interface Kontext {
  f: FaktorVysledek;
  vse: FaktoryVysledek;
  rocenka: Rocenka | null;
  /** Roky, kdy byl faktor v ročence nejlepší / nejhorší ze šesti. */
  vyhry: number[] | null;
  prohry: number[] | null;
  fondy: FondyFaktoru | null;
  /** TER největšího UCITS ETF na tentýž index (v procentech), jinak nejbližšího. */
  terFondu: number | null;
  terSp: { ter: number; nazev: string } | null;
  /** Celé roky okna (zaokrouhleno). */
  roku: number;
}

type Text = string | ((k: Kontext) => string);

export interface FactorConfig {
  slug: FaktorSlug;
  badge: string;                       // „Faktorová analýza 3/6 · value“
  /** H1 a metadata se mohou lišit podle dat (např. „jediný faktor, který porazil index“ jen když to platí). */
  h1: (k: Kontext | null) => string;
  meta: (k: Kontext | null) => { title: string | { absolute: string }; description: string; ogTitle: string; ogDescription: string; stat?: string; statLabel?: string };
  lead: (k: Kontext) => React.ReactNode;
  howTitle: string;
  howParagraphs: React.ReactNode[] | ((k: Kontext | null) => React.ReactNode[]);
  /** Doplňující věta k popisu čísel (bez čísel), např. „Pozor: start = vrchol dot-com bubliny.“ */
  numbersNote?: string;
  /** Kvalitativní poznámka ke krizi (klíč z STRESS_WINDOWS) – BEZ čísel a bez srovnání s jinými faktory (to dělá šablona z dat). */
  krizePoznamky: Partial<Record<'dotcom' | 'gfc' | 'covid' | 'bear2022', string>>;
  riskTitle: string;
  riskDesc: string;
  riskBody: (k: Kontext) => React.ReactNode;
  /** Doplňující poznámka k datům/fondům (bez čísel). Zdrojový fond a prodloužení řady dopíše šablona. */
  dataNote?: React.ReactNode;
  faqs: { q: string; a: Text }[];
  related: [string, string][];
}

async function nactiKontext(slug: FaktorSlug): Promise<Kontext | null> {
  const [vse, fondyVse, terSp] = await Promise.all([
    nactiFaktory(),
    nactiFondyFaktoru(),
    nactiTerSp500().catch(() => null),
  ]);
  // Výpadek DB = výjimka, ne hláška „nepodařilo se načíst“: Next při ISR ponechá poslední dobrou verzi
  // (9. 11. 2026 se hláška uložila do cache na den u 3 detailů). ZAMERNA-ROZHODNUTI.md „Články z dat“.
  if (!fondyVse) throw new Error('[faktory] fondy se nenačetly – ponechávám předchozí verzi stránky');
  const f = vse.faktory[slug];
  if (!f) return null;
  const fondy = fondyVse?.[slug] ?? null;
  const hlavni = fondy ? (fondy.stejny[0] ?? fondy.nejblizsi[0] ?? null) : null;
  return {
    f, vse, rocenka: vse.rocenka,
    vyhry: vse.rocenka ? vse.rocenka.vyhry[slug] : null,
    prohry: vse.rocenka ? vse.rocenka.prohry[slug] : null,
    fondy,
    terFondu: hlavni?.ter ?? null,
    terSp,
    roku: Math.round(f.roku),
  };
}

/** Metadata stránky faktoru z dat (title/description/OG se nesmí rozejít s čísly na stránce). */
export async function faktorMetadata(cfg: FactorConfig): Promise<Metadata> {
  const k = await nactiKontext(cfg.slug).catch(() => null);
  const m = cfg.meta(k);
  const url = `https://etfpruvodce.cz/faktorove-etf/${cfg.slug}`;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/faktorove-etf/${cfg.slug}` },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url,
      images: [ogImage({ title: m.ogTitle, eyebrow: 'Faktorová analýza · v korunách', ...(m.stat ? { stat: m.stat, statLabel: m.statLabel } : {}) })],
      type: 'article',
    },
  };
}

/** Jednoduchý dvouřadý čárový graf (SVG) – faktor teal, S&P 500 šedě. */
function EquityChart({ fac, spx, shortName }: { fac: Bod[]; spx: Bod[]; shortName: string }) {
  const W = 900, H = 320, PAD = { l: 56, r: 8, t: 12, b: 26 };
  const all = [...fac, ...spx].map((p) => p.hodnota);
  const minV = Math.min(...all), maxV = Math.max(...all);
  const t = (s: string) => new Date(s).getTime();
  const t0 = t(fac[0].datum), t1 = t(fac[fac.length - 1].datum);
  const x = (d: string) => PAD.l + ((t(d) - t0) / (t1 - t0)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - minV) / (maxV - minV)) * (H - PAD.t - PAD.b);
  const path = (pts: Bod[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.datum).toFixed(1)},${y(p.hodnota).toFixed(1)}`).join(' ');
  const y0 = Number(fac[0].datum.slice(0, 4)), y1 = Number(fac[fac.length - 1].datum.slice(0, 4));
  const years: number[] = [];
  for (let yr = y0 + 1; yr <= y1; yr += Math.ceil((y1 - y0) / 8)) years.push(yr);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Vývoj ${kc(POCATECNI)}: ${shortName} vs. S&P 500`}>
      {[minV, (minV + maxV) / 2, maxV].map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" fontSize="15" fill="#64748b">{kcKratce(v).replace(`${NBSP}Kč`, '')}</text>
        </g>
      ))}
      {years.map((yr) => <text key={yr} x={x(`${yr}-01-01`)} y={H - 8} textAnchor="middle" fontSize="15" fill="#94a3b8">{yr}</text>)}
      <path d={path(spx)} fill="none" stroke="#94a3b8" strokeWidth="2" />
      <path d={path(fac)} fill="none" stroke="#0d9488" strokeWidth="2.5" />
    </svg>
  );
}

/** Poměr faktor / S&P 500 (start = 1). Nad čarou faktor vede, pod čarou zaostává. */
function RatioChart({ fac, spx, shortName }: { fac: Bod[]; spx: Bod[]; shortName: string }) {
  const W = 900, H = 220, PAD = { l: 56, r: 8, t: 12, b: 26 };
  const sPodle = new Map(spx.map((p) => [p.datum, p.hodnota]));
  const raw = fac.filter((p) => sPodle.has(p.datum)).map((p) => ({ datum: p.datum, hodnota: p.hodnota / sPodle.get(p.datum)! }));
  const pts = raw.map((p) => ({ datum: p.datum, hodnota: p.hodnota / raw[0].hodnota }));
  const minV = Math.min(...pts.map((p) => p.hodnota), 1), maxV = Math.max(...pts.map((p) => p.hodnota), 1);
  const t = (s: string) => new Date(s).getTime();
  const t0 = t(pts[0].datum), t1 = t(pts[pts.length - 1].datum);
  const x = (d: string) => PAD.l + ((t(d) - t0) / (t1 - t0)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - minV) / (maxV - minV)) * (H - PAD.t - PAD.b);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.datum).toFixed(1)},${y(p.hodnota).toFixed(1)}`).join(' ');
  const y0 = Number(pts[0].datum.slice(0, 4)), y1 = Number(pts[pts.length - 1].datum.slice(0, 4));
  const years: number[] = [];
  for (let yr = y0 + 1; yr <= y1; yr += Math.ceil((y1 - y0) / 8)) years.push(yr);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Relativní síla: ${shortName} vs. S&P 500`}>
      {[minV, 1, maxV].map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke={v === 1 ? '#cbd5e1' : '#e2e8f0'} strokeWidth={v === 1 ? 1.5 : 1} strokeDasharray={v === 1 ? '4 3' : undefined} />
          <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" fontSize="15" fill="#64748b">{v.toFixed(2).replace('.', ',')}×</text>
        </g>
      ))}
      {years.map((yr) => <text key={yr} x={x(`${yr}-01-01`)} y={H - 8} textAnchor="middle" fontSize="15" fill="#94a3b8">{yr}</text>)}
      <path d={path} fill="none" stroke="#0d9488" strokeWidth="2.5" />
    </svg>
  );
}

/** „ze šesti faktorů“, „z pěti faktorů“ (2. pád). */
const zFaktoru = (n: number) => ({ 3: 'ze tří faktorů', 4: 'ze čtyř faktorů', 5: 'z pěti faktorů', 6: 'ze šesti faktorů' } as Record<number, string>)[n] ?? 'z faktorů';

/** Seznam let „2019, 2021 a 2023“. */
export const vyctiRoky = (r: number[]) => (r.length <= 1 ? r.join('') : `${r.slice(0, -1).join(', ')} a ${r[r.length - 1]}`);

/** Řádek fondu (karta na mobilu i na desktopu – žádné skryté sloupce). */
function FondRadek({ f, poznamka }: { f: FaktorFond; poznamka?: string }) {
  return (
    <li className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
      <div className="min-w-0">
        <Link href={`/etf/${f.isin}`} className="font-medium text-teal-700 hover:underline">{f.nazev}</Link>
        <p className="text-xs text-slate-500 mt-0.5 tabular-nums">{f.isin}{f.akumulacni != null ? ` · ${f.akumulacni ? 'akumulační' : 'distribuční'}` : ''}{f.index ? ` · index ${f.index}` : ''}{poznamka ? ` · ${poznamka}` : ''}</p>
      </div>
      <p className="text-sm text-slate-700 tabular-nums whitespace-nowrap">TER {ter(f.ter)} · {f.velikost != null ? `${Math.round(f.velikost).toLocaleString('cs-CZ')}${NBSP}mil.${NBSP}€` : '—'}</p>
    </li>
  );
}

export function FondyBlok({ fondy, indexDat, kratce }: { fondy: FondyFaktoru | null; indexDat: string; kratce: string }) {
  if (!fondy) return <p className="text-sm text-slate-500">Údaje o fondech se teď nepodařilo načíst – zkuste <Link href="/srovnani" className="text-teal-700 underline">srovnávač</Link>.</p>;
  const stazeno = [...fondy.stejny, ...fondy.nejblizsi, ...fondy.svetove].map((f) => f.stazeno).filter((d): d is string => !!d).sort().at(-1);
  return (
    <div className="grid gap-4 max-w-3xl" data-sekce="faktor-fondy">
      <div className="rounded-lg border border-teal-200 bg-white p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Na stejný index jako data výše ({indexDat})</p>
        {fondy.stejny.length ? (
          <ul className="mt-3 divide-y divide-slate-100">{fondy.stejny.map((f) => <FondRadek key={f.isin} f={f} poznamka={f.poznamka} />)}</ul>
        ) : (
          <>
            <p className="mt-2 text-sm text-slate-600">UCITS ETF na přesně tento americký index v naší databázi není. Nejbližší americké fondy s <strong>jinou metodikou výběru</strong> (výsledky se budou lišit):</p>
            {fondy.nejblizsi.length ? <ul className="mt-3 divide-y divide-slate-100">{fondy.nejblizsi.map((f) => <FondRadek key={f.isin} f={f} />)}</ul> : <p className="mt-2 text-sm text-slate-500">—</p>}
          </>
        )}
      </div>
      {fondy.svetove.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Světová verze – jiný index, jiný výsledek</p>
          <p className="mt-1 text-sm text-slate-600">Drží {kratce.toLowerCase()} firmy z vyspělých trhů celého světa, ne jen z USA. Čísla na této stránce pro ni neplatí.</p>
          <ul className="mt-3 divide-y divide-slate-100">{fondy.svetove.map((f) => <FondRadek key={f.isin} f={f} />)}</ul>
        </div>
      )}
      {stazeno && <p className="text-xs text-slate-500">TER a velikost fondů podle dat k {den(stazeno)} (zdroj justETF, srovnávač ETF průvodce).</p>}
    </div>
  );
}

export default async function FactorDetail({ cfg }: { cfg: FactorConfig }) {
  const k = await nactiKontext(cfg.slug).catch((e) => { console.error('[faktory] kontext selhal:', e); return null; });
  const def = FAKTORY_DEF.find((d) => d.slug === cfg.slug)!;
  const upraveno = upravenoDlouze(`/faktorove-etf/${cfg.slug}`);
  const h1 = cfg.h1(k);
  const f = k?.f ?? null;
  const stara = f ? (Date.now() - new Date(f.do).getTime()) / 864e5 > 7 : false;
  const faqs = cfg.faqs.flatMap((q) => (typeof q.a === 'string' ? [{ q: q.q, a: q.a }] : k ? [{ q: q.q, a: q.a(k) }] : []));
  const prodl = PRODLOUZENI[cfg.slug];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Faktorové ETF', item: 'https://etfpruvodce.cz/faktorove-etf' },
      { '@type': 'ListItem', position: 3, name: h1, item: `https://etfpruvodce.cz/faktorove-etf/${cfg.slug}` },
    ],
  };
  const celeRoky = f ? f.rocni.filter((r) => r.cely && r.s != null) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clanekSchema({ cesta: `/faktorove-etf/${cfg.slug}`, nadpis: h1 })) }} />

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/faktorove-etf" className="hover:text-slate-600">Faktorové ETF</Link>
          <span>/</span>
          <span className="text-slate-600">{h1}</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Zap className="w-3.5 h-3.5" /> {cfg.badge}
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">{h1}</h1>
            {k && <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">{cfg.lead(k)}</p>}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
                <Scale className="w-4 h-4" /> Otestovat v backtestu
              </Link>
              <Link href="/faktorove-etf" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <BookOpen className="w-4 h-4" /> Přehled všech faktorů
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              {f && <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Denní data {den(f.od)} – {den(f.do)}, v Kč, americký index {def.indexDat}</span>}
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Vzdělávací a nezávislé</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Text upraven {upraveno}</span>
              {f && <span className="inline-flex items-center gap-1.5" data-faktor-data-k={f.do}>Data k {den(f.do)}</span>}
            </div>
          </div>
        </section>

        {!f && (
          <section className="pb-10">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 max-w-3xl text-sm text-slate-700">
              Čísla tohoto faktoru se teď nepodařilo spočítat z dat. Raději je neukazujeme, než abychom ukázali stará – zkuste to prosím později, nebo si faktor spočítejte v <Link href="/backtest" className="text-teal-700 underline">backtestu</Link>.
            </div>
          </section>
        )}
        {stara && f && (
          <section className="pb-6">
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 max-w-3xl text-sm text-amber-900">Pozor: poslední data jsou k {den(f.do)} – starší než týden. Čísla níže platí k tomuto dni.</p>
          </section>
        )}

        {/* JAK FUNGUJE */}
        <section className="pb-10">
          <SectionHead title={cfg.howTitle} desc="Pravidlo, podle kterého index vybírá akcie – a proč by mělo fungovat." />
          <div className="rounded-lg border border-slate-200 bg-white p-6 max-w-3xl">
            {(typeof cfg.howParagraphs === 'function' ? cfg.howParagraphs(k) : cfg.howParagraphs).map((p, i) => (
              <p key={i} className={`text-sm text-slate-700 leading-relaxed${i > 0 ? ' mt-3' : ''}`}>{p}</p>
            ))}
          </div>
        </section>

        {f && k && (
          <>
            {/* ČÍSLA */}
            <section className="pb-10" data-sekce="faktor-cisla" data-faktor={cfg.slug} data-od={f.od} data-do={f.do} data-konecna={Math.round(f.konecna)} data-sp-konecna={Math.round(f.spKonecna)} data-porazil={f.porazil ? '1' : '0'} data-vysledek={f.vysledek}>
              <SectionHead
                title={`${def.kratce} v korunách (${den(f.od)} – ${den(f.do)})`}
                desc={`Jednorázových ${kc(POCATECNI)}, kurz den po dni, poplatek fondu v ceně (data jsou kurz reálného ETF). S&P 500 vždy na přesně stejném okně.${cfg.numbersNote ? ` ${cfg.numbersNote}` : ''}`}
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 mb-3"><LineChart className="w-4.5 h-4.5" /></span>
                  <p className="text-2xl font-bold text-teal-700 tabular-nums">{kc(f.konecna)}</p>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    ze {kc(POCATECNI)} za {let_(k.roku)} ({pct(f.cagr)} ročně). S&P 500 na stejném okně: {kc(f.spKonecna)} ({pct(f.spCagr)} ročně) –{' '}
                    {f.vysledek === 'nerozhodne'
                      ? <><strong className="text-slate-800">prakticky stejně jako index</strong> (rozdíl {pb(f.cagr - f.spCagr)} ročně je menší než nejistota prodloužené řady).</>
                      : <><strong className="text-slate-800">{def.kratce} index {f.vysledek === 'porazil' ? 'porazil' : 'neporazil'}</strong>{f.vysledek === 'porazil' ? ', o ' : ', zaostal o '}{pb(f.cagr - f.spCagr)} ročně.</>}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 mb-3"><Zap className="w-4.5 h-4.5" /></span>
                  <p className="text-2xl font-bold text-teal-700 tabular-nums">{f.nejlepsiRok ? pct(f.nejlepsiRok.vynos) : '—'}</p>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    nejlepší celý kalendářní rok{f.nejlepsiRok ? ` (${f.nejlepsiRok.rok})` : ''}; nejhorší {f.nejhorsiRok ? `${pct(f.nejhorsiRok.vynos)} (${f.nejhorsiRok.rok})` : '—'}.
                    {k.rocenka && k.vyhry && <> V ročence faktorů {k.rocenka.odRoku}–{k.rocenka.doRoku} byl nejlepší ze šesti {k.vyhry.length ? <>{k.vyhry.length}× z {k.rocenka.roky.length} let ({vyctiRoky(k.vyhry)})</> : <>ani jednou z {k.rocenka.roky.length} let</>}.</>}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 mb-3"><History className="w-4.5 h-4.5" /></span>
                  <p className="text-2xl font-bold text-rose-600 tabular-nums">{pct(f.maxPropad.hloubka)}</p>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    nejhlubší propad (vrchol {den(f.maxPropad.vrchol)}, dno {den(f.maxPropad.dno)}). Od vrcholu zpět na vrchol {f.maxPropad.navrat ? `to trvalo ${mesicu(f.maxPropad.mesicuOdVrcholu)}` : `se do ${den(f.do)} nevrátil`}. S&P 500 na stejném okně: {pct(f.spMaxPropad.hloubka)}.
                  </p>
                </div>
              </div>
              {f.dca && (
                <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50/40 p-5 max-w-3xl">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">S pravidelnými vklady:</strong> kdo {den(f.od)} vložil {kc(POCATECNI)} a pak každý měsíc přidával {kc(MESICNI_VKLAD)}, vložil celkem {kc(f.dca.vlozeno)} – a k {den(f.do)} měl{' '}
                    <strong className="text-slate-900">{kc(f.dca.konecna)}</strong>. Stejné vklady do S&P 500: {kc(f.dca.spKonecna)}.
                  </p>
                </div>
              )}
            </section>

            {/* GRAF VÝVOJE VS S&P 500 */}
            <section className="pb-10">
              <SectionHead
                title={`Vývoj v čase: ${def.kratce} vs. S&P 500 (${mesic(f.od)} – ${mesic(f.do)})`}
                desc={`Jednorázových ${kc(POCATECNI)} na stejném období, v korunách. Počítáno naším backtest enginem, data k ${den(f.do)}.`}
              />
              <div className="rounded-lg border border-slate-200 bg-white p-4 md:p-6">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm mb-2">
                  <span className="inline-flex items-center gap-2"><span className="w-5 h-1 rounded bg-teal-600 inline-block" /> {def.kratce}: <strong className="tabular-nums">{kcKratce(f.konecna)}</strong></span>
                  <span className="inline-flex items-center gap-2 text-slate-500"><span className="w-5 h-1 rounded bg-slate-400 inline-block" /> S&P 500: <strong className="tabular-nums">{kcKratce(f.spKonecna)}</strong></span>
                </div>
                <EquityChart fac={f.graf.fac} spx={f.graf.spx} shortName={def.kratce} />
              </div>
            </section>

            {/* RELATIVNÍ SÍLA */}
            <section className="pb-10">
              <SectionHead title="Kdy faktor vedl a kdy zaostával" desc={`Poměr hodnoty ${def.kratce.toLowerCase()} / S&P 500 (start = 1×). Stoupá = faktor index poráží, klesá = zaostává.`} />
              <div className="rounded-lg border border-slate-200 bg-white p-4 md:p-6">
                <RatioChart fac={f.graf.fac} spx={f.graf.spx} shortName={def.kratce} />
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Faktor nevede plynule, ale ve vlnách po letech. Konec čáry {f.porazil ? 'nad' : 'pod'} 1× znamená, že za celé období
                  skončil {f.porazil ? 'výš' : 'níž'} než index{f.vysledek === 'nerozhodne' ? ' – rozdíl je ale menší než nejistota prodloužené řady, berte ho jako remízu' : ''}.
                </p>
              </div>
            </section>

            {/* ROK PO ROCE */}
            <section className="pb-10">
              <SectionHead title="Rok po roce vs. S&P 500" desc="Roční výnosy v Kč. Zeleně roky, kdy faktor index porazil." />
              <div className="rounded-lg border border-slate-200 bg-white max-w-3xl">
                <table className="w-full text-[13px] sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-2 sm:px-4 py-3">Rok</th>
                      <th className="px-2 sm:px-4 py-3 text-right">{def.kratce}</th>
                      <th className="px-2 sm:px-4 py-3 text-right">S&P 500</th>
                      <th className="px-2 sm:px-4 py-3 text-right">Rozdíl</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {f.rocni.map((a) => {
                      const diff = a.s == null ? null : a.f - a.s;
                      return (
                        <tr key={a.rok} className="border-b border-slate-100 last:border-0">
                          <td className="px-2 sm:px-4 py-2 font-medium text-slate-700">{a.rok}{!a.cely && <span className="ml-1 text-xs font-normal text-slate-400">(část)</span>}</td>
                          <td className={`px-2 sm:px-4 py-2 text-right ${a.f < 0 ? 'text-rose-600' : 'text-slate-800'}`}>{pct(a.f)}</td>
                          <td className={`px-2 sm:px-4 py-2 text-right ${a.s != null && a.s < 0 ? 'text-rose-500' : 'text-slate-500'}`}>{pct(a.s)}</td>
                          <td className={`px-2 sm:px-4 py-2 text-right font-medium ${diff == null ? '' : diff >= 0 ? 'text-teal-700 bg-teal-50/60' : 'text-rose-600'}`}>{diff == null ? '—' : `${diff >= 0 ? '+' : '−'}${pb(diff)}`}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
                V celých kalendářních letech faktor index porazil {celeRoky.filter((a) => a.f > a.s!).length}× z {celeRoky.length}.
                Roky označené „(část)“ jsou neúplné (od {den(f.od)}, resp. do {den(f.do)}).
              </p>
            </section>

            {/* ROLLING */}
            {f.klouzave.length > 0 && (
              <section className="pb-10">
                <SectionHead title="Klouzavá okna: jak stabilní ten výnos je" desc="Všechna možná období dané délky v našich datech (po měsících) – průměr, nejhorší a nejlepší období, ročně." />
                <div className="hidden sm:block rounded-lg border border-slate-200 bg-white max-w-4xl">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-4 py-3">Délka držení</th>
                        <th className="px-4 py-3 text-right">Průměr ročně</th>
                        <th className="px-4 py-3 text-right">Nejhorší období</th>
                        <th className="px-4 py-3 text-right">Nejlepší období</th>
                        <th className="px-4 py-3 text-right">Kladných období</th>
                      </tr>
                    </thead>
                    <tbody className="tabular-nums">
                      {f.klouzave.map((r) => (
                        <tr key={r.roky} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-2.5 font-medium text-slate-900">{let_(r.roky)}</td>
                          <td className="px-4 py-2.5 text-right text-slate-700">{pct(r.prumer)}</td>
                          <td className="px-4 py-2.5 text-right text-rose-600">{pct(r.nejhorsi)}</td>
                          <td className="px-4 py-2.5 text-right text-teal-700">{pct(r.nejlepsi)}</td>
                          <td className="px-4 py-2.5 text-right font-medium text-slate-900">{pctBez(r.podilKladnych, 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ul className="sm:hidden grid gap-2">
                  {f.klouzave.map((r) => (
                    <li key={r.roky} className="rounded-lg border border-slate-200 bg-white p-4 tabular-nums">
                      <p className="font-semibold text-slate-900">{let_(r.roky)}</p>
                      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                        <dt className="text-slate-500">Průměr ročně</dt><dd className="text-right text-slate-700">{pct(r.prumer)}</dd>
                        <dt className="text-slate-500">Nejhorší období</dt><dd className="text-right text-rose-600">{pct(r.nejhorsi)}</dd>
                        <dt className="text-slate-500">Nejlepší období</dt><dd className="text-right text-teal-700">{pct(r.nejlepsi)}</dd>
                        <dt className="text-slate-500">Kladných období</dt><dd className="text-right font-medium text-slate-900">{pctBez(r.podilKladnych, 0)}</dd>
                      </dl>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
                  {(() => {
                    const jeden = f.klouzave.find((r) => r.roky === 1);
                    const jista = f.klouzave.find((r) => r.nejhorsi > 0);
                    return (
                      <>
                        {jeden && <>Jeden rok je loterie: od {pct(jeden.nejhorsi)} do {pct(jeden.nejlepsi)}. </>}
                        {jista
                          ? <>Všechna okna kladná měl až horizont {let_(jista.roky)} (nejhorší období {pct(jista.nejhorsi)} ročně).</>
                          : <>Ani nejdelší horizont v datech neměl všechna okna kladná.</>}
                      </>
                    );
                  })()}
                </p>
              </section>
            )}

            {/* KRIZE */}
            {f.krize.length > 0 && (
              <section className="pb-10">
                <SectionHead title="Jak faktor snášel krize" desc="Velké propady v našem období – v korunách, od vrcholu ke dnu, a doba návratu od dna zpět na předchozí vrchol. Pro srovnání S&P 500 ve stejném okně." />
                <div className={`grid gap-3 ${f.krize.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : f.krize.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 max-w-3xl'}`}>
                  {f.krize.map((c) => {
                    const pozn = cfg.krizePoznamky[c.key as keyof FactorConfig['krizePoznamky']];
                    const mezi = c.mezi;
                    const srovnani = mezi ? [
                      mezi.nejmelci ? `nejmělčí propad ${zFaktoru(mezi.pocet)}` : mezi.nejhlubsi ? `nejhlubší propad ${zFaktoru(mezi.pocet)}` : null,
                      mezi.nejrychlejsi ? 'nejrychlejší návrat' : mezi.nejpomalejsi ? 'nejpomalejší návrat' : null,
                    ].filter(Boolean).join(', ') : '';
                    return (
                      <div key={c.key} className="rounded-lg border border-slate-200 bg-white p-5">
                        <p className="font-semibold text-slate-900 text-sm">{c.nazev}</p>
                        <p className="text-2xl font-bold text-rose-600 tabular-nums mt-1">{pct(c.pokles)}</p>
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                          {c.navratMesicu != null ? `návrat ${mesicu(c.navratMesicu)} od dna` : `od dna se do ${den(f.do)} nevrátil`}
                          {srovnani ? ` – ${srovnani}` : ''}.
                          {c.sp && <> S&P 500: {pct(c.sp.pokles)}, {c.sp.navratMesicu != null ? `návrat ${mesicu(c.sp.navratMesicu)}` : 'dosud bez návratu'}.</>}
                          {pozn && <> {pozn}</>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* RIZIKO */}
            <section className="pb-10">
              <SectionHead title={cfg.riskTitle} desc={cfg.riskDesc} />
              <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-6 max-w-3xl">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <AlertTriangle className="inline w-4 h-4 text-amber-600 mr-1 -mt-0.5" />
                  {cfg.riskBody(k)}
                </p>
              </div>
            </section>
          </>
        )}

        {/* JAK KOUPIT */}
        <section className="pb-10">
          <SectionHead title="Jak faktor koupit v Česku" desc="Nejdřív UCITS ETF na tentýž americký index, na kterém běží čísla výše; světová verze až potom." />
          <FondyBlok fondy={k?.fondy ?? null} indexDat={def.indexDat} kratce={def.kratce} />
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Čísla výše běží na kurzech amerického ETF {INDEX_BY_CODE[def.indexCode]?.ticker} (index {def.indexDat}) s reinvestovanými dividendami a s jeho poplatkem v ceně.
            UCITS fond na tentýž index se může mírně lišit poplatkem a zdaněním dividend uvnitř fondu.{cfg.dataNote ? <> {cfg.dataNote}</> : null}
            {prodl && f?.etfOd && <> Před {den(f.etfOd)} je řada prodloužená akademickým denním portfoliem z Kenneth R. French Data Library ({prodl.portfolio}), napojeným na ETF; {prodl.kalibrace}. Korelace denních výnosů v překryvu {prodl.korelace}.</>}
          </p>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" desc="Prakticky a bez marketingu." />
          <div className="grid gap-3 max-w-3xl">
            {faqs.map((x) => (
              <details key={x.q} className="group rounded-lg border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-medium text-slate-900 text-sm flex items-center justify-between">
                  {x.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{x.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA + pokračování */}
        <section className="pb-12">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">Otestujte si to na vlastní čísla</p>
              <p className="text-sm text-slate-300 mt-1">V backtestu najdete faktor v kategorii „Akcie – faktory“ – zkuste ho i v kombinaci s indexem.</p>
            </div>
            <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-medium text-white hover:bg-teal-800 transition-colors whitespace-nowrap">
              <Calculator className="w-4 h-4" /> Spustit backtest
            </Link>
          </div>
          <Link href="/portfolio-strategie/globalni-jadro-small-cap-value" className="mt-4 block rounded-xl border border-teal-200 bg-teal-50 px-5 py-4 text-sm hover:border-teal-300 transition-colors">
            <span className="font-semibold text-teal-900">Jak faktor reálně zapojit do portfolia?</span>{' '}
            <span className="text-teal-800">Podívejte se na <b>ETF průvodce portfolio</b> — světové jádro plus jediný faktor, který přežije náklady (small-cap value).</span>
          </Link>
          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Rozbory dalších faktorů</h2>
          <ul data-sekce="dalsi-faktory" className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            {FAKTORY.filter((x) => x.slug !== cfg.slug).map((x) => (
              <li key={x.slug}>
                <Link href={`/faktorove-etf/${x.slug}`} className="block h-full rounded-lg border border-slate-200 bg-white p-3 hover:border-teal-300 transition-colors">
                  <span className="block font-semibold text-slate-900">{x.nazev}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{x.popis}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
            {cfg.related.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors flex items-center justify-between gap-2">
                <span className="text-slate-700">{label}</span>
                <TrendingUp className="w-4 h-4 text-teal-600 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <AutorBox cesta={`/faktorove-etf/${cfg.slug}`} />
        <div className="pb-10">
          <InvestmentDisclaimer />
        </div>
      </main>
    </div>
  );
}

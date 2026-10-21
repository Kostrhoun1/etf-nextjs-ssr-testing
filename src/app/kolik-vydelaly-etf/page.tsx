import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import AutorBox from '@/components/design-preview/AutorBox';
import { clanekSchema, drobeckySchema } from '@/lib/redakce';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, Database, Calculator, Wallet, ShieldCheck,
  Clock, AlertTriangle, TrendingDown, LineChart, CheckCircle2, Flame,
  Sprout, Timer, Receipt, Target, Repeat, Percent, ChevronDown,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import SouvisejiciZebricky from '@/components/design-preview/SouvisejiciZebricky';
import KlicovaCisla from '@/components/design-preview/KlicovaCisla';
import { spoctiKolikVydelaly, type KolikVydelaly } from '@/lib/clanky/kolikVydelaly';
import { titulek } from '@/lib/seoTitulek';

/*
 * SEO audit 6b (21. 10. 2026): VŠECHNA čísla stránky se počítají z dat (src/lib/clanky/kolikVydelaly.ts) – stejný
 * engine a start (začátek července 2008, Kč) jako ověřený /sp500-nebo-cely-svet. Dřív byla napevno a z doby před opravou kurzové
 * vrstvy: „čtyřnásobek, 8–9 % ročně, propad −50 %“, roční výnosy ve skutečnosti v dolarech (2017 +24 % místo +3 % v Kč).
 * Chybí-li data, stránka vyhodí výjimku – ISR ponechá poslední dobrou verzi (ZAMERNA-ROZHODNUTI.md, články z dat).
 */
export const revalidate = 86400;

const NB = ' ';
const cz = (n: number, d = 0) => n.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (x: number, d = 1) => `${x < 0 ? '−' : x > 0 ? '+' : ''}${cz(Math.abs(x * 100), d)}${NB}%`;
const pctBez = (x: number, d = 1) => `${x < 0 ? '−' : ''}${cz(Math.abs(x * 100), d)}${NB}%`;
const kc = (n: number) => `${cz(Math.round(n / 1000) * 1000)}${NB}Kč`;
const MESICE = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
const mesRok = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${MESICE[m - 1]} ${y}`; };
const denText = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return `${d}. ${m}. ${y}`; };
const nasobekText = (x: number) => `${cz(x, 1)}×`;

/** Souvislost propadu podle měsíce dna (jen známé epizody; jinak bez popisu). */
function pricina(dno: string): string {
  const y = Number(dno.slice(0, 4)), m = Number(dno.slice(5, 7));
  if (y === 2008 || (y === 2009 && m <= 6)) return 'finanční krize';
  if (y === 2020 && m <= 6) return 'covidový krach';
  if (y === 2022 || (y === 2023 && m <= 6)) return 'inflace a růst sazeb';
  if (y === 2011) return 'dluhová krize eurozóny';
  if (y === 2015 || (y === 2016 && m <= 3)) return 'zpomalení Číny';
  if (y === 2018 || (y === 2019 && m <= 1)) return 'obchodní války a sazby';
  if (y === 2025 && m <= 6) return 'cla USA a posílení koruny';
  return '—';
}

export async function generateMetadata(): Promise<Metadata> {
  const d = await spoctiKolikVydelaly();
  const title = 'Kolik vydělaly ETF a akcie: datový rozbor v korunách';
  const description = 'Kolik vydělaly světové akcie v korunách od roku 2008: rok po roce, klouzavá okna 1–15 let, největší propady, pravidelné vklady i regiony. Po poplatcích fondů.';
  const stat = d ? `100 000 → ${kc(d.svet.konec).replace(NB, ' ')}` : undefined;
  return {
    title: titulek(title),
    description,
    alternates: { canonical: '/kolik-vydelaly-etf' },
    openGraph: {
      title, description, url: 'https://etfpruvodce.cz/kolik-vydelaly-etf', type: 'article',
      images: [ogImage({ title, eyebrow: 'Datový rozbor', stat, statLabel: stat && d ? `celý svět v Kč od 7/2008 (data k ${denText(d.posledniDen)})` : undefined })],
    },
  };
}

function GrafHodnoty({ d }: { d: KolikVydelaly }) {
  const W = 720, H = 300, padL = 8, padR = 14, padT = 18, padB = 30;
  const body = d.graf.map((p) => ({ t: new Date(p.datum).getTime(), v: p.hodnota }));
  const t0 = body[0].t, t1 = body[body.length - 1].t;
  const yMin = Math.min(...body.map((p) => p.v), 100000) * 0.9;
  const yMax = Math.max(...body.map((p) => p.v)) * 1.06;
  const px = (t: number) => padL + ((t - t0) / (t1 - t0 || 1)) * (W - padL - padR);
  const py = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB);
  const line = body.map((p, i) => `${i ? 'L' : 'M'}${px(p.t).toFixed(1)},${py(p.v).toFixed(1)}`).join(' ');
  const area = `${line} L${px(t1).toFixed(1)},${py(yMin).toFixed(1)} L${px(t0).toFixed(1)},${py(yMin).toFixed(1)} Z`;
  const r0 = new Date(t0).getUTCFullYear(), r1 = new Date(t1).getUTCFullYear();
  const roky: number[] = [];
  for (let y = Math.ceil((r0 + 1) / 4) * 4; y <= r1; y += 4) roky.push(y);
  // Značky: tři nejhlubší propady (dno = měsíc z dat; bod grafu = konec téhož měsíce)
  const dna = d.propady.slice(0, 3).map((p) => {
    const cil = new Date(`${p.dno}-15T00:00:00Z`).getTime();
    const bod = body.reduce((a, b) => (Math.abs(b.t - cil) < Math.abs(a.t - cil) ? b : a));
    return { x: px(bod.t), y: py(bod.v), label: pctBez(p.hloubka, 0), key: p.dno };
  });
  const konec = body[body.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[520px]" role="img" aria-label={`Vývoj hodnoty 100 000 Kč v akciích celého světa (fond VT) v korunách od července 2008 do ${denText(d.posledniDen)}: ${kc(d.svet.konec)}.`}>
      <defs>
        <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
        </linearGradient>
      </defs>
      {roky.map((y) => {
        const xx = px(Date.UTC(y, 0, 1));
        return (
          <g key={y}>
            <line x1={xx} y1={padT} x2={xx} y2={H - 30} stroke="#f1f5f9" strokeWidth="1" />
            <text x={xx} y={H - 11} textAnchor="middle" fontSize="11" fill="#94a3b8">{y}</text>
          </g>
        );
      })}
      <line x1={padL} y1={py(100000)} x2={W - padR} y2={py(100000)} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
      <text x={padL + 2} y={py(100000) - 4} fontSize="10.5" fill="#94a3b8">vklad 100 000 Kč</text>
      <path d={area} fill="url(#eqFill)" />
      <path d={line} fill="none" stroke="#0d9488" strokeWidth="2" strokeLinejoin="round" />
      {dna.map((t) => (
        <g key={t.key}>
          <circle cx={t.x} cy={t.y} r="3.5" fill="#e11d48" />
          <text x={t.x} y={t.y + 16} textAnchor="middle" fontSize="11" fontWeight="600" fill="#e11d48">{t.label}</text>
        </g>
      ))}
      <circle cx={px(konec.t)} cy={py(konec.v)} r="3.5" fill="#0d9488" />
      <text x={px(konec.t) - 6} y={py(konec.v) - 7} textAnchor="end" fontSize="12" fontWeight="700" fill="#0f766e">{kc(konec.v).replace(NB, ' ')}</text>
      <text x={W - 2} y="12" textAnchor="end" fontSize="11" fontWeight="600" fill="#94a3b8">Zdroj: etfpruvodce.cz</text>
    </svg>
  );
}

function GrafRoku({ d }: { d: KolikVydelaly }) {
  const W = 720, H = 320, padL = 30, padR = 10, padT = 24, padB = 46;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const hodnoty = d.rocne.map((r) => r.vynos * 100);
  const vMax = Math.max(10, Math.ceil((Math.max(...hodnoty) + 4) / 10) * 10);
  const vMin = Math.min(-10, Math.floor((Math.min(...hodnoty) - 4) / 10) * 10);
  const py = (v: number) => padT + (1 - (v - vMin) / (vMax - vMin)) * plotH;
  const n = d.rocne.length, slot = plotW / n, bw = slot * 0.6;
  const bx = (i: number) => padL + i * slot + (slot - bw) / 2;
  const zero = py(0);
  const mrizka = [vMax - 10, 0, vMin + 10].filter((g, i, a) => a.indexOf(g) === i);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[560px]" role="img" aria-label={`Roční zhodnocení akcií celého světa (fond VT) v korunách za roky ${d.rocne[0].rok}–${d.rocne[n - 1].rok}.`}>
      {mrizka.map((g) => (
        <g key={g}>
          <line x1={padL} y1={py(g)} x2={W - padR} y2={py(g)} stroke={g === 0 ? '#cbd5e1' : '#f1f5f9'} strokeWidth="1" />
          <text x={padL - 6} y={py(g) + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{g > 0 ? `+${g}` : g}%</text>
        </g>
      ))}
      {d.rocne.map((r, i) => {
        const v = r.vynos * 100;
        const rectY = v >= 0 ? py(v) : zero;
        const rectH = Math.max(Math.abs(py(v) - zero), 1);
        return (
          <g key={r.rok}>
            <rect x={bx(i)} y={rectY} width={bw} height={rectH} rx="2" fill={v >= 0 ? '#0d9488' : '#e11d48'} opacity={r.neuplny ? 0.55 : 1} />
            <text x={bx(i) + bw / 2} y={v >= 0 ? rectY - 4 : rectY + rectH + 11} textAnchor="middle" fontSize="9.5" fontWeight="600" fill={v >= 0 ? '#0f766e' : '#e11d48'}>{`${v >= 0 ? '+' : '−'}${Math.round(Math.abs(v))}`}</text>
            <text x={bx(i) + bw / 2} y={H - 8} textAnchor="middle" fontSize="9.5" fill="#94a3b8">{`’${String(r.rok).slice(2)}${r.neuplny ? '*' : ''}`}</text>
          </g>
        );
      })}
      <text x={W - 2} y="12" textAnchor="end" fontSize="11" fontWeight="600" fill="#94a3b8">Zdroj: etfpruvodce.cz</text>
    </svg>
  );
}

export default async function KolikVydelalyEtf() {
  const d = await spoctiKolikVydelaly();
  if (!d) throw new Error('kolik-vydelaly-etf: data se nenačetla');
  const datum = denText(d.posledniDen);
  const start = denText(d.prvniDen); // skutečný první den řady (2. 7. 2008), ne předpoklad
  const vkladu = Math.round(d.dca.vlozeno / 5000);
  const roky = Math.round(d.svet.roky);
  const okno = (r: number) => d.okna.find((o) => o.roky === r) ?? null;
  const o1 = okno(1), o10 = okno(10);
  const plneRoky = d.rocne.filter((r) => !r.neuplny);
  const kladne = plneRoky.filter((r) => r.vynos > 0).length;
  const nejhorsiRok = plneRoky.reduce((a, b) => (b.vynos < a.vynos ? b : a), plneRoky[0]);
  const nejlepsiRok = plneRoky.reduce((a, b) => (b.vynos > a.vynos ? b : a), plneRoky[0]);
  const hlubokych = d.propady.filter((p) => p.hloubka <= -0.2).length;
  const poradi = [...d.regiony].sort((a, b) => b.cagr - a.cagr);
  const vitez = poradi[0], posledni = poradi[poradi.length - 1];
  const sp = d.regiony.find((r) => r.id === 'sp500')!;
  const dcaNasobek = d.dca.vlozeno > 0 ? d.dca.hodnota / d.dca.vlozeno : 0;
  const pod = d.sp2000.posledniMesicPodVkladem;
  const rokuPod = Math.floor(d.sp2000.mesicuPodVkladem / 12);
  const prvniPropad = d.propady[0];
  const navraty = d.propady.filter((p) => p.mesicuNaVrchol != null).map((p) => p.mesicuNaVrchol!);

  const faqs = [
    {
      q: `Kolik vydělaly světové akcie za posledních zhruba ${roky} let?`,
      a: `Podle našich historických dat zhodnotil fond VT (index FTSE Global All Cap, akcie celého světa) od ${start} do ${datum} v korunách ${pctBez(d.svet.cagr)} ročně – ze 100 000 Kč se stalo zhruba ${kc(d.svet.konec)}, tedy ${nasobekText(d.svet.nasobek)} vkladu. Výpočet je po poplatcích fondu, před daní, z minulých dat – není to příslib budoucnosti.`,
    },
    {
      q: 'Znamená to, že investování do širokých akciových ETF je bez rizika?',
      a: `Ne. Stejný fond cestou prošel hlubokými propady – nejhlubší v korunách byl ${pctBez(d.svet.maxPokles, 0)} (${mesRok(prvniPropad.od)} → ${mesRok(prvniPropad.dno)}). Kdo by prodal na dně, ztrátu si zafixoval. Zhodnocení dostal ten, kdo propady vydržel. V dolarech byly propady hlubší – v korunách část ztráty vyrovnalo oslabení koruny.`,
    },
    ...(navraty.length ? [{
      q: 'Jak dlouho trvalo, než se trh po propadu vzpamatoval?',
      a: `V našich datech od ${Math.min(...navraty)} do ${Math.max(...navraty)} měsíců od vrcholu zpět na vrchol (v korunách). Delší historie amerických akcií ukazuje i mnohem delší období pod vkladem – proto se akcie hodí na peníze, které nebudete potřebovat řadu let.`,
    }] : []),
    ...(o1 && o10 ? [{
      q: 'Proč se říká, že čas snižuje riziko?',
      a: `V našich datech skončilo na horizontu jednoho roku v plusu ${cz(o1.vPlusu * 100)} % období, na horizontu deseti let ${cz(o10.vPlusu * 100)} % a nejhorší desetiletka vydělala ${pctBez(o10.nejhorsi)} ročně. Data ale pokrývají jen zhruba ${roky} let, takže desetiletých období je omezený počet – berte to jako ilustraci, ne záruku.`,
    }] : []),
    {
      q: 'Jak si to můžu spočítat pro své vlastní portfolio?',
      a: 'V našem backtestu si můžete složit vlastní portfolio, zvolit období i pravidelné vklady a uvidíte zhodnocení, nejhlubší propad i dobu zotavení – vše v korunách. Výsledek je orientační a vychází z minulých dat.',
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const odkaz = 'text-teal-700 hover:underline';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(drobeckySchema([['Co říkají data', '/co-rikaji-data'], ['Kolik vydělaly ETF', '/kolik-vydelaly-etf']])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clanekSchema({ cesta: '/kolik-vydelaly-etf', nadpis: 'Kolik reálně vydělaly ETF a světové akcie v korunách', denDat: d.posledniDen, obrazek: ogImage({ title: 'Kolik vydělaly ETF a akcie: datový rozbor v korunách', eyebrow: 'Datový rozbor' }).url })) }} />

      {/* Header */}
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
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <Link href="/co-rikaji-data" className="hover:text-slate-700">Co říkají data</Link>
          <span>/</span>
          <span className="text-slate-700">Kolik vydělaly ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <LineChart className="w-3.5 h-3.5" /> Datový pohled · reálná čísla v korunách
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Kolik reálně vydělaly ETF a světové akcie v korunách
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Ze <strong className="text-white">100 000 Kč zhruba {kc(d.svet.konec)}</strong> za {roky}{NB}let ({nasobekText(d.svet.nasobek)} vkladu,
              {' '}{pctBez(d.svet.cagr)} ročně). Cesta k tomu ale vedla přes {hlubokych > 1 ? `${hlubokych} propadů hlubších než 20 %` : 'hluboké propady'} – a právě ony
              rozhodly, kdo výnos nakonec dostal. Akcie celého světa (fond VT) v číslech: kolik vydělaly, o kolik cestou spadly
              a co z toho plyne pro váš horizont.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
                <Calculator className="w-4 h-4" /> Otestovat vlastní portfolio
              </Link>
              <Link href="/pruvodce" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <TrendingUp className="w-4 h-4" /> Co jsou vlastně ETF
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Vše v Kč</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Data k {datum}</span>
            </div>

            {/* Klíčová čísla v hero */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 max-w-2xl">
              <div className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><Sprout className="w-3.5 h-3.5" /> Ze 100 000 Kč</span>
                <p className="mt-1 text-lg md:text-xl font-bold tabular-nums text-emerald-400">{kc(d.svet.konec)}</p>
                <p className="text-xs text-slate-400 mt-0.5">za {roky} let ({pctBez(d.svet.cagr)} ročně)</p>
              </div>
              <div className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><TrendingDown className="w-3.5 h-3.5" /> Nejhlubší propad</span>
                <p className="mt-1 text-lg md:text-xl font-bold tabular-nums text-rose-300">{pctBez(d.svet.maxPokles, 0)}</p>
                <p className="text-xs text-slate-400 mt-0.5">{mesRok(prvniPropad.od)} → {mesRok(prvniPropad.dno)}</p>
              </div>
              <div className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><Timer className="w-3.5 h-3.5" /> Na 10 letech</span>
                <p className="mt-1 text-lg md:text-xl font-bold tabular-nums text-white">{o10 ? `${cz(o10.vPlusu * 100)} %` : '—'}</p>
                <p className="text-xs text-slate-400 mt-0.5">období skončilo v plusu</p>
              </div>
            </div>
          </div>
        </section>

        {/* KLÍČOVÁ ČÍSLA – citovatelná tabulka s datem a primárními zdroji (SEO/GEO audit 6b) */}
        <KlicovaCisla
          datum={datum}
          radky={[
            { co: `Akcie celého světa (fond VT) – roční zhodnocení od ${start}`, hodnota: pctBez(d.svet.cagr), pozn: 'v Kč, po poplatcích fondu, před daní' },
            { co: `100 000 Kč vložených ${start}`, hodnota: kc(d.svet.konec), pozn: `${nasobekText(d.svet.nasobek)} vkladu` },
            { co: 'Nejhlubší propad v korunách', hodnota: pctBez(d.svet.maxPokles), pozn: `${mesRok(prvniPropad.od)} → ${mesRok(prvniPropad.dno)}` },
            { co: `5 000 Kč měsíčně (${vkladu} vkladů od srpna 2008)`, hodnota: kc(d.dca.hodnota), pozn: `vloženo ${kc(d.dca.vlozeno)}` },
            { co: `S&P 500 (USA) – roční zhodnocení od ${start}`, hodnota: pctBez(sp.cagr), pozn: 'v Kč, fond SPY' },
          ]}
          zdroje={[
            { href: 'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/', text: 'kurzy devizového trhu ČNB' },
            { href: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html', text: 'referenční kurzy ECB' },
            { href: 'https://investor.vanguard.com/investment-products/etfs/profile/vt', text: 'Vanguard Total World Stock ETF (VT)' },
          ]}
        />

        {/* UPOZORNĚNÍ */}
        <section className="pb-8">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>Pohled do historie, ne příslib budoucnosti.</strong> Čísla vycházejí z denních cen fondu Vanguard VT
              (index FTSE Global All Cap) přepočtených do korun denními kurzy ECB, od {start} do {datum}, po poplatcích
              fondu a před daní. Minulé výnosy nezaručují ty budoucí a skutečný výsledek závisí na konkrétním fondu, poplatcích,
              daních i době, kdy nakoupíte a prodáte. Jak počítáme: <Link href="/metodika" className="underline underline-offset-2">metodika</Link>.
            </p>
          </div>
        </section>

        {/* 1. KOLIK VYDĚLALO 100k */}
        <section className="pb-10">
          <SectionHead title={`Ze 100 000 Kč zhruba ${kc(d.svet.konec)}`} desc={`Kdo v červenci 2008 vložil 100 000 Kč do akcií celého světa a nechal je být, měl by k ${datum} ${nasobekText(d.svet.nasobek)} vkladu.`} />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0"><Sprout className="w-5 h-5" /></span>
              <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
                <p>
                  Fond VT sleduje index FTSE Global All Cap – tisíce velkých, středních i malých firem z vyspělých
                  i rozvíjejících se trhů. Kdo do něj vložil <strong className="text-slate-900">100 000 Kč</strong> {start},
                  měl by k {datum} v korunách <strong className="text-emerald-700">zhruba {kc(d.svet.konec)}</strong>. To odpovídá
                  průměrnému zhodnocení <strong className="text-slate-900">{pctBez(d.svet.cagr)} ročně</strong>.
                </p>
                <p>
                  A to i přesto, že start v roce 2008 padl těsně před jednu z největších finančních krizí v historii.
                  Kdo začal později, měl cestu klidnější. To je první důležitý poznatek: <strong className="text-slate-900">u
                  dlouhého horizontu rozhoduje víc vytrvalost než dokonalé načasování.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CESTA NEBYLA KLIDNÁ */}
        <section className="pb-10">
          <SectionHead title="Cesta ale zdaleka nebyla klidná" desc="Zhodnocení nevzniklo v přímé linii. Investor cestou zažil několik hlubokých propadů – a právě ty rozhodují, kdo výnos nakonec dostane." />
          <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <p className="text-sm font-medium text-slate-900 mb-2">Hodnota 100 000 Kč v akciích celého světa (7/2008 – {datum}, v Kč)</p>
            <div className="overflow-x-auto"><GrafHodnoty d={d} /></div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">Fond Vanguard VT (index FTSE Global All Cap) přepočtený do korun, hodnoty ke konci měsíců; červeně tři nejhlubší propady v korunách (hloubka z denních cen, proto je bod na křivce mělčí). Minulé výnosy nezaručují ty budoucí.</p>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Vidět na papíře &bdquo;{pctBez(d.svet.maxPokles, 0)}&ldquo; je jiné než to zažít na vlastním účtu. Právě proto skončí spousta lidí ve ztrátě –
            ne proto, že by trh nevydělal, ale proto, že <strong className="text-slate-700">prodali ve chvíli největšího
            strachu</strong>. Zhodnocení výše dostal ten, kdo propady přečkal. V dolarech byly propady ještě hlubší – v krizích
            obvykle oslabila koruna a část ztráty v korunách vyrovnala. Jak hluboký propad by uneslo vaše portfolio,
            si můžete osahat v <Link href="/backtest" className={odkaz}>backtestu</Link>.
          </p>
        </section>

        {/* 3. PROČ ČAS MĚNÍ VŠECHNO */}
        {o1 && o10 && (
          <section className="pb-10">
            <SectionHead title="Proč čas mění všechno" desc="Stejná investice vypadá úplně jinak podle toho, jak dlouhý úsek si vezmete. Tady je rozdíl mezi jedním rokem a deseti lety." />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 mb-3"><Clock className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">Na horizontu 1 roku</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{cz(o1.vPlusu * 100)} %<span className="text-base font-medium text-slate-500"> období v plusu</span></p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Jednotlivý rok skončil kdekoli mezi {pct(o1.nejhorsi, 0)} a {pct(o1.nejlepsi, 0)}. Na krátký horizont akcie nepatří.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 mb-3"><CheckCircle2 className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">Na horizontu 10 let</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">{cz(o10.vPlusu * 100)} %<span className="text-base font-medium text-emerald-600/70"> období v plusu</span></p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Nejhorší desetileté období v datech vydělalo {pctBez(o10.nejhorsi)} ročně, nejlepší {pctBez(o10.nejlepsi)}.
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Tohle je jádro celého příběhu: akcie nejsou nástroj na příští rok, ale na příští dekádu. Data ale pokrývají jen
              zhruba {roky} let, takže desetiletých období je jen {o10.pocet} (začátky po měsících) a všechna začínají v letech 2008–2016 –
              čísla proto berte jako ilustraci síly času, ne jako záruku.
            </p>
          </section>
        )}

        {/* ROK PO ROCE – sloupcový graf */}
        <section className="pb-10">
          <SectionHead title={`Rok po roce (${d.rocne[0].rok}–${d.rocne[d.rocne.length - 1].rok})`} desc={`Průměr ${pctBez(d.svet.cagr)} ročně skrývá velké rozdíly mezi jednotlivými roky – od ${pct(nejhorsiRok.vynos, 0)} v roce ${nejhorsiRok.rok} po ${pct(nejlepsiRok.vynos, 0)} v roce ${nejlepsiRok.rok}.`} />
          <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <div className="overflow-x-auto"><GrafRoku d={d} /></div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">Roční zhodnocení fondu Vanguard VT (index FTSE Global All Cap) v korunách, po poplatcích. * = neúplný rok ({d.rocne[0].rok} od 1. 7., {d.rocne[d.rocne.length - 1].rok} do {datum}).</p>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Z {plneRoky.length} celých kalendářních let bylo <strong className="text-slate-700">{kladne} kladných a {plneRoky.length - kladne} ztrátových</strong>. Výnos v korunách ovlivňuje i kurz koruny: v roce 2017 vydělal fond v dolarech přes 20 %, v korunách jen pár procent, protože koruna výrazně posílila. Silné a slabé roky se střídaly nepravidelně – a přesně proto se nedá &bdquo;počkat si na ten správný rok&ldquo;.</p>
        </section>

        {/* ROLLING – tabulka oken */}
        <section className="pb-10">
          <SectionHead title="Záleželo, kdy jste začali – ale čím dýl, tím míň" desc="Vzali jsme všechna období dané délky (začátky po měsících) a spočítali nejhorší, nejlepší a průměrný roční výnos. Čím delší okno, tím užší rozpětí." />
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-medium">Držel jsem</th>
                  <th className="px-4 py-3 font-medium text-right">Nejhorší p.a.</th>
                  <th className="px-4 py-3 font-medium text-right">Nejlepší p.a.</th>
                  <th className="px-4 py-3 font-medium text-right">Průměr p.a.</th>
                  <th className="px-4 py-3 font-medium text-right">Období v plusu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {d.okna.map((r) => (
                  <tr key={r.roky}>
                    <td className="px-4 py-3 font-medium text-slate-900">{r.roky === 1 ? '1 rok' : `${r.roky} let`} <span className="text-xs font-normal text-slate-500">({r.pocet} období)</span></td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${r.nejhorsi < 0 ? 'text-rose-600' : 'text-slate-700'}`}>{pct(r.nejhorsi)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{pct(r.nejlepsi)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{pct(r.prumer)}</td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${r.vPlusu === 1 ? 'text-emerald-600' : 'text-slate-700'}`}>{cz(r.vPlusu * 100)} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Hodnoty ke konci měsíců, v korunách, k {datum}. Data pokrývají ~{roky} let, delších oken je proto málo a překrývají se – berte je jako ilustraci síly času.</p>
        </section>

        {/* KRIZE DO HLOUBKY */}
        <section className="pb-10">
          <SectionHead title="Největší propady v korunách" desc="Od vrcholu ke dnu a jak dlouho trvalo, než se hodnota vrátila na předchozí vrchol." />
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-medium">Vrchol → dno</th>
                  <th className="px-4 py-3 font-medium">Souvislost</th>
                  <th className="px-4 py-3 font-medium text-right">Propad</th>
                  <th className="px-4 py-3 font-medium text-right">Zpět na vrcholu za</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {d.propady.map((p) => (
                  <tr key={p.od}>
                    <td className="px-4 py-3 font-medium text-slate-900">{mesRok(p.od)} → {mesRok(p.dno)}</td>
                    <td className="px-4 py-3 text-slate-600">{pricina(p.dno)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-rose-600">{pct(p.hloubka)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">{p.mesicuNaVrchol != null ? `${p.mesicuNaVrchol} měs.` : 'zatím ne'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Propady jsou u akcií <strong className="text-slate-700">normální, ne výjimka</strong>. V korunách byly v krizích obvykle mělčí než v dolarech, protože oslabila koruna. Platí to i obráceně – posílení koruny umí výnos v korunách ubrat.</p>
        </section>

        {/* NEJHORŠÍ NAČASOVÁNÍ */}
        <section className="pb-10">
          <SectionHead title="A co nejhorší možné načasování?" desc="Výpočet začíná v červenci 2008 – tedy těsně před krachem. Byl to jeden z nejhorších možných okamžiků na nákup." />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 flex items-start gap-3">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 shrink-0"><Target className="w-5 h-5" /></span>
            <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
              <p>Kdo vložil 100 000 Kč právě tehdy, viděl je během krize spadnout o <strong className="text-rose-600">{pctBez(Math.abs(prvniPropad.hloubka), 0)}</strong> od vrcholu. A přesto – kdo vydržel – měl k {datum} <strong className="text-emerald-700">{nasobekText(d.svet.nasobek)} vkladu</strong>.</p>
              <p>I špatný vstup nakonec fungoval, pokud investor nepanikařil. Ne proto, že by na trhu neexistovalo riziko – ale proto, že dost dlouhý horizont ho historicky přebil. Delší historie amerických akcií níže ukazuje, že to může trvat i přes deset let.</p>
            </div>
          </div>
        </section>

        {/* DCA – pravidelně vs jednorázově */}
        <section className="pb-10">
          <SectionHead title="Pravidelně, nebo jednorázově?" desc="Většina lidí nemá statisíce na hromadě. Co když místo toho posíláte 5 000 Kč měsíčně? Spočítali jsme i to." />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Repeat className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-slate-500">Celkem vloženo</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{kc(d.dca.vlozeno)}</p>
              <p className="text-sm text-slate-500 mt-0.5">{vkladu}× 5 000 Kč, měsíčně od srpna 2008</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 mb-3"><Sprout className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-emerald-700/80">Hodnota k {datum}</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-emerald-700">{kc(d.dca.hodnota)}</p>
              <p className="text-sm text-slate-600 mt-0.5">{nasobekText(dcaNasobek)} vložených peněz</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><TrendingUp className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-slate-500">Z toho zisk</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{kc(d.dca.hodnota - d.dca.vlozeno)}</p>
              <p className="text-sm text-slate-500 mt-0.5">nad rámec vložených peněz</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Pravidelné investování (DCA) má výhodu: v propadech nakupujete levněji, takže špatné načasování bolí míň. Peníze vložené později jsou ale v trhu kratší dobu, proto je násobek vkladu nižší než u jednorázové investice na začátku. Obě cesty srovnává <Link href="/dca-vs-jednorazova" className={odkaz}>DCA vs. jednorázová investice</Link>.</p>
        </section>

        {/* PO DANÍCH A POPLATCÍCH */}
        <section className="pb-10">
          <SectionHead title="Kolik z toho zůstane po daních a poplatcích" desc="Výnosy výše už jsou po ročních poplatcích fondu (TER). A dobrá zpráva pro české investory: po třech letech držby se zisk z prodeje nedaní." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 mb-3"><CheckCircle2 className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Daň: po 3 letech nula</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Když ETF držíte déle než 3 roky (časový test, § 4 odst. 1 písm. u) zákona o daních z příjmů), je zisk z prodeje osvobozen od daně z příjmů.{' '}
                <Link href="/dane-z-etf" className={odkaz}>Jak to funguje →</Link>
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Percent className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Poplatky: už jsou v čísle</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">Čísla v tomto rozboru vycházejí z cen fondu, takže jeho roční poplatek (TER) už obsahují. Poplatky brokera a daň z dividend (u distribučních fondů) v nich nejsou.</p>
            </div>
          </div>
        </section>

        {/* SVĚT vs USA vs REGIONY */}
        <section className="pb-10">
          <SectionHead title="Svět, USA, nebo rozvíjející se trhy?" desc="Stejných 100 000 Kč, stejné období (od začátku července 2008) – ale jiný region. Rozdíly jsou velké a hodně napoví o riziku koncentrace." />
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-medium">Trh</th>
                  <th className="px-4 py-3 font-medium text-right">Zhodnocení p.a.</th>
                  <th className="px-4 py-3 font-medium text-right">Ze 100 000 Kč</th>
                  <th className="px-4 py-3 font-medium text-right">Nejhlubší propad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {d.regiony.map((r) => (
                  <tr key={r.id} className={r.id === 'svet' ? 'bg-teal-50/40' : undefined}>
                    <td className="px-4 py-3 font-medium text-slate-900">{r.nazev}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">{pctBez(r.cagr)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{kc(r.konec)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-rose-600">{pct(r.maxPokles)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">V korunách, po poplatcích fondů (SPY, VT, EFA, EEM), k {datum}. Za toto období nejvíc vydělal trh {vitez.nazev} – ze 100 000 Kč {kc(vitez.konec)}, nejméně {posledni.nazev}. Pozor ale: <strong className="text-slate-700">minulý vítěz nemusí být ten budoucí</strong>. Sázka na jediný region je koncentrace rizika; celý svět drží kus všeho. Podrobně: <Link href="/sp500-nebo-cely-svet" className={odkaz}>S&amp;P 500, nebo celý svět?</Link></p>
        </section>

        {/* DELŠÍ POHLED – S&P 500 od roku 2000 */}
        <section className="pb-10">
          <SectionHead title="A co delší historie? Americké akcie od roku 2000" desc="Rozbor výše začíná v roce 2008. Pro americké akcie (S&P 500) máme data v korunách od ledna 2000 – a ukazují drsnější lekci o trpělivosti." />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 mb-3"><Sprout className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-emerald-700/80">Leden 2000 → {datum}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">{kc(d.sp2000.konec)}</p>
              <p className="text-sm text-slate-600 mt-0.5">ze 100 000 Kč, {pctBez(d.sp2000.cagr)} ročně</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 mb-3"><TrendingDown className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-slate-500">Nejhlubší propad v Kč</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-rose-600">{pctBez(d.sp2000.maxPokles, 0)}</p>
              <p className="text-sm text-slate-600 mt-0.5">pád akcií a k tomu silná koruna</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><Timer className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-slate-500">Pod vkladem</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{pod ? `${rokuPod} let` : '—'}</p>
              <p className="text-sm text-slate-600 mt-0.5">{pod ? `naposledy pod vkladem ${mesRok(pod)}` : 'bez dat'}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Kdo koupil americké akcie v lednu 2000, byl v korunách pod vloženou částkou naposledy {pod ? mesRok(pod) : '—'} – k pádu akcií se přidalo silné posílení koruny vůči dolaru. Extrémní příklad, proč horizont u akcií znamená klidně 15 let, ne pět. Podrobně: <Link href="/jak-dlouho-v-minusu" className={odkaz}>Jak dlouho můžete být v minusu</Link>. (Kurzy koruny máme v datech od roku 2000.)</p>
        </section>

        {/* 4. CO SI Z TOHO VZÍT */}
        <section className="pb-10">
          <SectionHead title="Co si z toho vzít" desc="Tři závěry, které z těchto čísel plynou pro obyčejného investora." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [Timer, 'Investujte na roky, ne na měsíce', 'Peníze, které možná budete potřebovat za rok nebo dva, do akcií nepatří. Síla ETF se projeví až na dlouhém horizontu.'],
              [Flame, 'Nejtěžší je nic nedělat', 'Největší nepřítel výnosu není krize, ale prodej v panice. Kdo v roce 2008 vydržel, vydělal. Kdo prodal na dně, ztratil.'],
              [Receipt, 'Náklady, daně a kurz rozhodují taky', 'Nízké poplatky (TER), tříletý daňový test a pohyb koruny mají na výsledek v korunách reálný vliv. Vyplatí se je znát předem.'],
            ] as [typeof Timer, string, string][]).map(([Icon, t, popis]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{popis}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA – vyzkoušet na svých číslech */}
        <section className="pb-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Spočítejte si to na svých číslech</h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              V backtestu složíte vlastní portfolio, přidáte pravidelné vklady a uvidíte zhodnocení, nejhlubší propad
              i dobu zotavení – vše v korunách. Orientačně, na reálných historických datech.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
                <Calculator className="w-4 h-4" /> Otevřít backtest
              </Link>
              <Link href="/stroj-casu" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <TrendingUp className="w-4 h-4" /> Korunový stroj času
              </Link>
            </div>
          </div>
        </section>

        {/* Žebříčky k tématu (SEO audit 6b – prolinkování článků a žebříčků) */}
        <SouvisejiciZebricky nadpis="Žebříčky k tématu" slugy={['nejlepsi-celosvetove-etf', 'nejlepsi-sp500-etf', 'nejlepsi-msci-world-etf', 'nejlepsi-emerging-markets-etf']} />

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" desc="Krátké odpovědi na to, co k těmto číslům lidi nejčastěji napadne." />
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium text-slate-900 list-none">
                  {f.q}
                  <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* POKRAČUJTE DÁL */}
        <section className="pb-10">
          <SectionHead title="Pokračujte dál" desc="Kam se vydat, když vás příběh v číslech zaujal." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([
              [Calculator, 'Backtest portfolia', 'Otestujte vlastní ETF na historii.', '/backtest'],
              [Flame, 'FIRE kalkulačka', 'Za jak dlouho k finanční nezávislosti.', '/fire-kalkulacka'],
              [Receipt, 'Daně z ETF', 'Kdy z výnosu platíte a kdy ne.', '/dane-z-etf'],
              [TrendingUp, 'Modelová portfolia', 'Hotové strategie podle rizika.', '/portfolio-strategie'],
            ] as [typeof Calculator, string, string, string][]).map(([Icon, t, popis, href]) => (
              <Link key={href} href={href} className="group rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900 flex items-center gap-1">{t}<ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{popis}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* AUTOR / E-E-A-T */}
        <AutorBox cesta="/kolik-vydelaly-etf" denDat={d.posledniDen} text={<>Autor ETF průvodce.cz s více než 12 lety praxe v českém bankovnictví. Čísla počítáme z denních cen fondů
          přepočtených do korun – jde o vzdělávací materiál, nikoli investiční doporučení. Pro výpočet
          na vlastních číslech použijte <Link href="/backtest" className={odkaz}>backtest</Link>.</>} />

        <div className="pb-10"><InvestmentDisclaimer /></div>
      </main>
    </div>
  );
}

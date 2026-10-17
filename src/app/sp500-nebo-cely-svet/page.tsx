import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, ArrowRight, HelpCircle } from 'lucide-react';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import { spoctiSp500NeboSvet } from '@/lib/clanky/sp500NeboSvet';
import { spoctiSp500NeboSvetHloubka, type Krize, type Okna } from '@/lib/clanky/sp500NeboSvetHloubka';
import { ogImage } from '@/lib/ogImage';

/* Vlna 7 – obsah z dat v korunách. Česky hledaná otázka („s&p 500 nebo msci world", našeptávač
   17. 10. 2026). Čísla se počítají při ISR (1× denně) stejným enginem jako backtest a jsou ověřená
   proti S&P DJI, publikovaným výnosům VT a kurzům ČNB (viz src/lib/clanky/sp500NeboSvet.ts). */
export const revalidate = 86400;

/* Vlastní OG: bez něj se dědí og:url homepage → Facebook by sdílel titulní stranu. */
export async function generateMetadata(): Promise<Metadata> {
  const title = 'S&P 500, nebo celý svět? Co vydělalo víc v korunách';
  const description = 'S&P 500 proti akciím celého světa v korunách: výnosy od roku 2008, propady, klouzavá desetiletá období a dekáda 2000–2009, kdy USA prohrávaly. Data, ne názory.';
  const d = await spoctiSp500NeboSvet();
  const sp = d?.od2008.find((x) => x.id === 'sp500');
  const sv = d?.od2008.find((x) => x.id === 'svet');
  const stat = sp && sv ? `${pct(sp.cagr)} vs. ${pct(sv.cagr)}` : undefined;
  return {
    title, description,
    alternates: { canonical: '/sp500-nebo-cely-svet' },
    openGraph: {
      title, description, url: '/sp500-nebo-cely-svet', type: 'article',
      images: [ogImage({ title, eyebrow: 'Co říkají data', stat, statLabel: stat ? 'ročně v Kč od 2008: S&P 500 vs. celý svět' : undefined })],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const pct = (v: number, d = 1) => `${v >= 0 ? '' : '−'}${Math.abs(v * 100).toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d })} %`;
const pctZ = (v: number, d = 1) => `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d })} %`;
/** Rozdíl výnosů v procentních bodech (ne v procentech). */
const pb = (v: number, znam = false) => `${znam ? (v >= 0 ? '+' : '−') : v < 0 ? '−' : ''}${Math.abs(v * 100).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} p. b.`;
const kc = (v: number) => `${Math.round(v).toLocaleString('cs-CZ')} Kč`;

const MESICE1 = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
const mesicRok = (iso: string) => `${MESICE1[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
const tvar = (n: number, a: string, b: string, c: string) => (n === 1 ? a : n >= 2 && n <= 4 ? b : c);
const dobaMes = (m: number | null) => {
  if (m === null) return 'dosud ne';
  if (m < 1) return 'do měsíce';
  const r = Math.floor(m / 12), mm = m % 12;
  return [r ? `${r} ${tvar(r, 'rok', 'roky', 'let')}` : '', mm ? `${mm} ${tvar(mm, 'měsíc', 'měsíce', 'měsíců')}` : ''].filter(Boolean).join(' ');
};
const SEKTORY_CS: Record<string, string> = { Technology: 'Technologie', Finance: 'Finance', Financials: 'Finance', 'Health Care': 'Zdravotnictví', Healthcare: 'Zdravotnictví', 'Consumer Discretionary': 'Zbytné spotřební zboží', 'Consumer Staples': 'Základní spotřeba', Industrials: 'Průmysl', Industry: 'Průmysl', Telecommunication: 'Telekomunikace', 'Communication Services': 'Komunikace', Energy: 'Energie', 'Basic Materials': 'Materiály', 'Consumer Non-Cyclicals': 'Základní spotřeba', 'Consumer Cyclicals': 'Zbytné spotřební zboží', Telecommunications: 'Telekomunikace', Materials: 'Materiály', Utilities: 'Utility', 'Real Estate': 'Nemovitosti' };
const ZEME_CS: Record<string, string> = { 'United States': 'USA', Japan: 'Japonsko', 'United Kingdom': 'Velká Británie', China: 'Čína', Taiwan: 'Tchaj-wan', Canada: 'Kanada', France: 'Francie', Germany: 'Německo', Switzerland: 'Švýcarsko', India: 'Indie', Ireland: 'Irsko' };

function KrizeRadek({ k }: { k: Krize }) {
  const r = (id: string, mena: 'CZK' | 'USD') => k.rady.find((x) => x.id === id && x.mena === mena);
  const bunka = (x?: Krize['rady'][number]) => x ? (
    <span><span className="text-red-700 tabular-nums">{pct(x.hloubka, 0)}</span><span className="block text-xs text-slate-500">návrat {dobaMes(x.mesicuDoNavratu)}</span></span>
  ) : <span className="text-slate-400">—</span>;
  return (
    <tr className="align-top">
      <td className="px-3 py-2.5"><span className="font-medium text-slate-900">{k.nazev}</span><span className="block text-xs text-slate-500">{k.popis}</span></td>
      <td className="px-3 py-2.5">{bunka(r('sp', 'CZK'))}</td>
      <td className="px-3 py-2.5">{bunka(r('sp', 'USD'))}</td>
      <td className="px-3 py-2.5">{bunka(r('svet', 'CZK'))}</td>
      <td className="px-3 py-2.5">{bunka(r('mimousa', 'CZK'))}</td>
    </tr>
  );
}

/** Rozdíl desetiletých výnosů S&P 500 − svět mimo USA podle měsíce startu (sloupce nad/pod nulou). */
function GrafRozdilu({ rada }: { rada: { start: string; rozdil: number }[] }) {
  if (rada.length < 12) return null;
  const W = 720, H = 240, L = 52, B = 28, T = 10;
  const m = Math.max(0.05, ...rada.map((x) => Math.abs(x.rozdil)));
  const lim = Math.ceil(m * 50) / 50;
  const y = (v: number) => T + (H - T - B) * (1 - (v + lim) / (2 * lim));
  const bw = (W - L) / rada.length;
  const roky = rada.map((x, i) => [x.start, i] as const).filter(([st]) => st.endsWith('-01') && Number(st.slice(0, 4)) % 4 === 0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Graf: o kolik procentních bodů ročně byl S&P 500 v desetiletých obdobích lepší nebo horší než svět mimo USA, podle roku začátku">
      {[-lim, -lim / 2, 0, lim / 2, lim].map((v) => (
        <g key={v}>
          <line x1={L} x2={W} y1={y(v)} y2={y(v)} stroke={v === 0 ? '#64748b' : '#e2e8f0'} />
          <text x={L - 6} y={y(v) + 5} textAnchor="end" fontSize={14} fill="#64748b">{v > 0 ? '+' : v < 0 ? '−' : ''}{Math.abs(Math.round(v * 100))}</text>
        </g>
      ))}
      {rada.map((x, i) => (
        <rect key={x.start} x={L + i * bw} width={Math.max(bw, 1)} y={x.rozdil >= 0 ? y(x.rozdil) : y(0)} height={Math.abs(y(x.rozdil) - y(0))} fill={x.rozdil >= 0 ? '#0f766e' : '#b45309'} />
      ))}
      {roky.map(([st, i]) => <text key={st} x={L + i * bw} y={H - 8} textAnchor="middle" fontSize={14} fill="#64748b">{st.slice(0, 4)}</text>)}
    </svg>
  );
}

function OknaTabulka({ okna, souper }: { okna: Okna[]; souper: string }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm tabular-nums">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr><th className="px-3 py-2.5">Délka období</th><th className="px-3 py-2.5 text-right">S&amp;P 500 lepší</th><th className="px-3 py-2.5 text-right">Typický rozdíl</th><th className="px-3 py-2.5 text-right">8 z 10 období</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {okna.map((o) => (
            <tr key={o.roky}>
              <td className="px-3 py-2">{o.roky} {tvar(o.roky, 'rok', 'roky', 'let')} <span className="text-xs text-slate-500">({o.celkem} období)</span></td>
              <td className="px-3 py-2 text-right">{Math.round((100 * o.vyhraSp) / o.celkem)} %</td>
              <td className="px-3 py-2 text-right">{pb(o.median, true)} ročně</td>
              <td className="px-3 py-2 text-right text-slate-600">{pb(o.p10, true)} až {pb(o.p90, true)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-3 py-2 text-xs text-slate-500 border-t border-slate-100">Rozdíl = roční výnos S&amp;P 500 minus roční výnos {souper}, v korunách. „8 z 10 období“ = rozpětí bez nejlepší a nejhorší desetiny.</p>
    </div>
  );
}

export default async function Sp500NeboSvet() {
  const d = await spoctiSp500NeboSvet();
  const h = await spoctiSp500NeboSvetHloubka();
  const usaPodil = h?.slozeni.find((f) => f.isin === 'IE00BK5BQT80')?.zeme.find(([n]) => n === 'United States')?.[1].toLocaleString('cs-CZ', { maximumFractionDigits: 0 });
  // Chybějící data = výjimka: Next pak při ISR ponechá poslední dobrou verzi stránky (místo
  // „nepodařilo se načíst“ na celý den). Při buildu selže build – raději než nasadit prázdnou stránku.
  if (!d) throw new Error('sp500-nebo-cely-svet: data se nenačetla');
  const sp = d?.od2008.find((x) => x.id === 'sp500');
  const sv = d?.od2008.find((x) => x.id === 'svet');

  const faqs = d && sp && sv ? [
    { q: 'Je lepší investovat do S&P 500, nebo do celého světa?', a: `${sp.cagr > sv.cagr ? 'Od poloviny roku 2008 vyhrál S&P 500' : 'Od poloviny roku 2008 vyhrály akcie celého světa'}: S&P 500 vydělal v korunách ${pct(sp.cagr)} ročně, akcie celého světa ${pct(sv.cagr)}. ${sp.cagr > sv.cagr ? 'Neplatí to ale vždy' : 'A neplatilo to jen teď'} – v dekádě 2000–2009 ztrácel S&P 500 v korunách ${pct(Math.abs(d.dekada2000.sp500))} ročně a zbytek světa dopadl lépe (${pct(d.dekada2000.mimoUsa)} ročně). Kdo neumí předpovědět, který region povede příště, drží celý svět.` },
    { q: 'Proč byl propad v roce 2008 v korunách menší než v dolarech?', a: `Protože koruna v krizi oslabila – dolarová aktiva v Kč tím ztratila méně. Od poloviny 2008 byl nejhlubší propad S&P 500 v dolarech ${pct(d.usdPropad.sp500)}, v korunách jen ${pct(sp.maxPokles)}. Neplatí to vždy: když koruna posiluje, výsledek v Kč naopak zhorší.` },
    { q: 'Kolik z celého světa tvoří USA?', a: `V indexech celého světa (FTSE All-World, MSCI ACWI) tvoří americké firmy zhruba ${usaPodil ?? 60} % – kdo drží celý svět, má tedy USA stejně jako hlavní část portfolia, jen ne celé.` },
  ] : [];
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
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

      <main id="obsah" className="max-w-3xl mx-auto px-4 pb-20">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <Link href="/co-rikaji-data" className="hover:text-slate-700">Co říkají data</Link><span>/</span>
          <span className="text-slate-700">S&amp;P 500, nebo celý svět?</span>
        </nav>

        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-balance">S&amp;P 500, nebo celý svět? Co vydělalo víc v korunách</h1>

        {!d || !sp || !sv ? (
          <p className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">Data pro tento rozbor se teď nepodařilo načíst. Zkuste to prosím později.</p>
        ) : (
          <>
            <AktualnostDat datum={new Date(d.posledniDen)} className="mt-3" />

            {/* Krátká odpověď */}
            <section className="mt-6 rounded-xl border border-teal-200 bg-teal-50/60 p-5 text-[15px] leading-relaxed text-slate-800">
              <p className="font-semibold text-slate-900">Krátká odpověď</p>
              <p className="mt-1.5">
                Od poloviny roku 2008 vydělal S&amp;P 500 v korunách <strong>{pct(sp.cagr)} ročně</strong>, akcie celého světa{' '}
                <strong>{pct(sv.cagr)} ročně</strong>. Ze 100 000 Kč by bylo {kc(sp.konec)} proti {kc(sv.konec)}.
                {sp.cagr > sv.cagr ? 'Jenže' : 'A'} v dekádě <strong>2000–2009 ztrácel S&amp;P 500 v korunách {pct(Math.abs(d.dekada2000.sp500))} ročně</strong> a zbytek světa
                na tom byl lépe. Která část světa povede příště, dopředu nikdo neví – proto evidence mluví spíš pro celý svět.
              </p>
            </section>

            {/* Tabulka od 2008 */}
            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Od roku 2008 v korunách</h2>
              <p className="mt-1.5 text-sm text-slate-600">Investice 100 000 Kč v červenci 2008 (od té doby existuje celosvětový fond VT). Po poplatcích ETF, před daní, s ročním vyvažováním.</p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-4 py-2.5">Co</th><th className="px-4 py-2.5 text-right">Ročně</th><th className="px-4 py-2.5 text-right">Ze 100 000 Kč</th><th className="px-4 py-2.5 text-right">Nejhorší propad</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 tabular-nums">
                    {d.od2008.map((r) => (
                      <tr key={r.id}>
                        <td className="px-4 py-2.5 font-medium text-slate-900">{r.nazev}</td>
                        <td className="px-4 py-2.5 text-right">{pct(r.cagr)}</td>
                        <td className="px-4 py-2.5 text-right">{kc(r.konec)}</td>
                        <td className="px-4 py-2.5 text-right text-red-700">{pct(r.maxPokles)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                Zajímavost pro českého investora: nejhorší propad S&amp;P 500 byl od roku 2008 v dolarech <strong>{pct(d.usdPropad.sp500)}</strong>,
                v korunách jen <strong>{pct(sp.maxPokles)}</strong>. V krizi 2008–2009 koruna oslabila, a tím ztrátu zmírnila.{' '}
                <Link href="/menove-riziko-etf" className="font-medium text-teal-700 hover:underline">Víc o měnovém riziku</Link>
              </p>
            </section>

            {/* Klouzavá okna */}
            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Záleží na tom, kdy začnete</h2>
              <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">
                Jedno období nestačí. Proto jsme porovnali všechna desetiletá období (začátek každý měsíc):
              </p>
              <ul className="mt-3 space-y-2 text-[15px] text-slate-700 leading-relaxed">
                <li className="rounded-lg border border-slate-200 bg-white p-4">
                  <strong>S&amp;P 500 proti celému světu (od 2008):</strong> S&amp;P 500 byl lepší{' '}
                  <strong>{d.okna10Svet.vyhra === d.okna10Svet.celkem ? `ve všech ${d.okna10Svet.celkem}` : `v ${d.okna10Svet.vyhra} z ${d.okna10Svet.celkem}`}</strong> desetiletých obdobích,
                  {d.okna10Svet.min > 0 ? <> o {pb(d.okna10Svet.min)} až {pb(d.okna10Svet.max)} ročně.</> : <> rozdíl od {pb(d.okna10Svet.min, true)} do {pb(d.okna10Svet.max, true)} ročně.</>}
                  {d.okna10Svet.vyhra > d.okna10Svet.celkem / 2 && 'Tohle je ale jedna éra – éra amerických technologických firem.'}
                </li>
                <li className="rounded-lg border border-slate-200 bg-white p-4">
                  <strong>S&amp;P 500 proti světu mimo USA (od 2000):</strong> S&amp;P 500 byl lepší v{' '}
                  <strong>{d.okna10MimoUsa.vyhra} z {d.okna10MimoUsa.celkem}</strong> období ({Math.round((100 * d.okna10MimoUsa.vyhra) / d.okna10MimoUsa.celkem)} %).
                  Rozdíl ale kolísal od {pb(d.okna10MimoUsa.min, true)} do {pb(d.okna10MimoUsa.max, true)} ročně – kdo začal v roce 2000, dopadl s USA
                  hůř než se zbytkem světa ({pct(d.dekada2000.sp500)} vs. {pct(d.dekada2000.mimoUsa)} ročně za 2000–2009).
                </li>
              </ul>
            </section>

            {/* Rok po roce */}
            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Rok po roce v korunách</h2>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm tabular-nums">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-4 py-2">Rok</th><th className="px-4 py-2 text-right">S&amp;P 500</th><th className="px-4 py-2 text-right">Celý svět</th><th className="px-4 py-2 text-right">Lepší</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {d.rocne.map((r) => (
                      <tr key={r.rok}>
                        <td className="px-4 py-1.5">{r.rok}</td>
                        <td className={`px-4 py-1.5 text-right ${r.sp500 < 0 ? 'text-red-700' : ''}`}>{pctZ(r.sp500)}</td>
                        <td className={`px-4 py-1.5 text-right ${r.svet < 0 ? 'text-red-700' : ''}`}>{pctZ(r.svet)}</td>
                        <td className="px-4 py-1.5 text-right text-slate-600">{r.sp500 >= r.svet ? 'S&P 500' : 'svět'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>


            {h && (<>
            {/* ─── HLOUBKOVÝ ROZBOR ─── */}
            {h.slozeni.length === 2 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold tracking-tight">Co vlastně porovnáváme</h2>
                <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">
                  „S&amp;P 500“ je 500 největších amerických firem. „Celý svět“ jsou akcie z vyspělých i rozvíjejících se trhů vážené
                  podle velikosti – USA v nich tvoří většinu, ale ne všechno. Na dvou nejrozšířenějších fondech to vypadá takto:
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {h.slozeni.map((f) => (
                    <div key={f.isin} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                      <p className="font-semibold text-slate-900"><Link href={`/etf/${f.isin}`} className="hover:text-teal-700">{f.ticker}</Link> <span className="font-normal text-slate-500">· TER {pct(f.ter, 2)}</span></p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Země</p>
                      <ul className="mt-1 space-y-0.5 tabular-nums">{f.zeme.slice(0, 4).map(([n, w]) => <li key={n} className="flex justify-between"><span>{ZEME_CS[n] ?? n}</span><span>{w.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</span></li>)}</ul>
                      <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Odvětví</p>
                      <ul className="mt-1 space-y-0.5 tabular-nums">{f.sektory.slice(0, 4).map(([n, w]) => <li key={n} className="flex justify-between"><span>{SEKTORY_CS[n] ?? n}</span><span>{w.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</span></li>)}</ul>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">Zdroj složení: justETF, data k {new Date(h.slozeni[0].datum).toLocaleDateString('cs-CZ', { timeZone: 'UTC' })}. Odvětví podle klasifikace justETF.</p>
                <p className="mt-3 text-[15px] text-slate-700 leading-relaxed">
                  Volba tedy není „USA, nebo ne“. Kdo kupuje celý svět, má v USA zhruba {h.slozeni[1].zeme.find(([n]) => n === 'United States')?.[1].toLocaleString('cs-CZ', { maximumFractionDigits: 0 }) ?? '60'} % peněz.
                  Rozhoduje, jestli zbytek – Japonsko, Evropa, Tchaj-wan, Indie a další – chcete mít, nebo ne.
                </p>
              </section>
            )}

            <section className="mt-10">
              <h2 className="text-xl font-bold tracking-tight">Výnosy za různě dlouhá období</h2>
              <p className="mt-1.5 text-sm text-slate-600">Průměrný roční výnos do {new Date(h.posledniDen).toLocaleDateString('cs-CZ', { timeZone: 'UTC' })}. Po poplatcích fondů, před daní.</p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm tabular-nums">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-3 py-2.5">Posledních</th><th className="px-3 py-2.5 text-right">S&amp;P 500 v Kč</th><th className="px-3 py-2.5 text-right">Svět v Kč</th><th className="px-3 py-2.5 text-right">S&amp;P 500 v USD</th><th className="px-3 py-2.5 text-right">Svět v USD</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {h.obdobi.filter((o) => o.svet).map((o) => (
                      <tr key={o.roky}>
                        <td className="px-3 py-2">{o.roky} {tvar(o.roky, 'rok', 'roky', 'let')}</td>
                        <td className="px-3 py-2 text-right font-medium">{pct(o.sp.czk)}</td>
                        <td className="px-3 py-2 text-right font-medium">{pct(o.svet!.czk)}</td>
                        <td className="px-3 py-2 text-right text-slate-600">{pct(o.sp.usd)}</td>
                        <td className="px-3 py-2 text-right text-slate-600">{pct(o.svet!.usd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-10 text-[15px] text-slate-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Kolik z výsledku udělala koruna</h2>
              <p>
                Od poloviny roku 2008 vydělal S&amp;P 500 v dolarech {pct(h.menaOd2008.sp.usd)} ročně, v korunách {pct(h.menaOd2008.sp.czk)}.
                Rozdíl {pb(h.menaOd2008.kurzRocne, true)} ročně je pohyb kurzu koruny k dolaru{h.menaOd2008.kurzRocne > 0 ? ' – dolar za tu dobu zpevnil, a dolarové akcie tak v korunách vydělaly víc' : ' – koruna za tu dobu zpevnila, a dolarové akcie tak v korunách vydělaly méně'}.
                Celý svět je měnově pestřejší (dolar, jen, euro, libra…), takže na jediném kurzu závisí méně.
              </p>
              <p>
                Měnový vliv se v čase střídá: v letech 2000–2008 koruna k dolaru silně posílila a dolarové investice v ní ztrácely; v krizích
                naopak koruna obvykle oslabí a propady tlumí (viz krize níže – propad v Kč bývá menší než v USD).{' '}
                <Link href="/menove-riziko-etf" className="font-medium text-teal-700 hover:underline">Víc o měnovém riziku</Link>
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-bold tracking-tight">Krize jedna po druhé</h2>
              <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">
                Největší propad od vrcholu ke dnu a za jak dlouho se hodnota vrátila na původní vrchol. Celý svět (fond VT) má data až od poloviny
                roku 2008, pro starší krize proto ukazujeme i svět mimo USA.
              </p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-3 py-2.5">Krize</th><th className="px-3 py-2.5">S&amp;P 500 v Kč</th><th className="px-3 py-2.5">S&amp;P 500 v USD</th><th className="px-3 py-2.5">Svět v Kč</th><th className="px-3 py-2.5">Mimo USA v Kč</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {h.krize.map((k) => <KrizeRadek key={k.id} k={k} />)}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-500">Denní hodnoty s reinvesticí dividend. „Návrat“ = od vrcholu do dne, kdy hodnota poprvé znovu dosáhla vrcholu.</p>
              {(() => {
                const dot = h.krize.find((k) => k.id === 'dotcom')?.rady.find((x) => x.id === 'sp' && x.mena === 'CZK');
                const cov = h.krize.find((k) => k.id === 'covid');
                const covC = cov?.rady.find((x) => x.id === 'sp' && x.mena === 'CZK'), covU = cov?.rady.find((x) => x.id === 'sp' && x.mena === 'USD');
                return (
                  <div className="mt-3 text-[15px] text-slate-700 leading-relaxed space-y-2">
                    {dot && <p>Nejhůř dopadl S&amp;P 500 v korunách po splasknutí internetové bubliny: od vrcholu {mesicRok(dot.vrchol)} spadl o {pct(Math.abs(dot.hloubka), 0)} a na původní hodnotu se vrátil až {dot.navrat ? `v období ${mesicRok(dot.navrat)}` : '– dosud ne'}. Ke slabé americké burze se tehdy přidalo posilování koruny.</p>}
                    {covC && covU && <p>Při covidu to bylo naopak: v dolarech spadl S&amp;P 500 o {pct(Math.abs(covU.hloubka), 0)}, v korunách jen o {pct(Math.abs(covC.hloubka), 0)} – koruna v panice oslabila a pád zmírnila.</p>}
                  </div>
                );
              })()}
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-bold tracking-tight">Klouzavá období: jak často vyhrál S&amp;P 500</h2>
              <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">
                Místo jednoho období bereme všechna – start každý měsíc. Tím zjistíme, jak spolehlivě jedna varianta vedla a o kolik.
              </p>
              <h3 className="mt-4 font-semibold text-slate-900">S&amp;P 500 proti celému světu (od roku 2008)</h3>
              <OknaTabulka okna={h.oknaSvet} souper="celého světa" />
              <h3 className="mt-5 font-semibold text-slate-900">S&amp;P 500 proti světu mimo USA (od roku 2000)</h3>
              <OknaTabulka okna={h.oknaMimoUsa} souper="světa mimo USA" />
              {h.oknaMimoUsa.find((o) => o.roky === 10) && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                  <p className="px-1 text-sm font-medium text-slate-900">O kolik procentních bodů ročně byl S&amp;P 500 za 10 let lepší (zeleně) nebo horší (oranžově) než svět mimo USA – podle roku, kdy jste začali</p>
                  <GrafRozdilu rada={h.oknaMimoUsa.find((o) => o.roky === 10)!.rada} />
                  {(() => {
                    const r = h.oknaMimoUsa.find((o) => o.roky === 10)!.rada;
                    const horsi = r.filter((x) => x.rozdil < 0);
                    const rokyHorsi = [...new Set(horsi.map((x) => x.start.slice(0, 4)))];
                    return (
                      <p className="px-1 text-xs text-slate-500">
                        V korunách, start každý měsíc (poslední start {mesicRok(`${r.at(-1)!.start}-01`)}).{' '}
                        {horsi.length ? <>S&amp;P 500 byl za 10 let horší u {horsi.length} z {r.length} startů, a to z let {rokyHorsi[0]}–{rokyHorsi.at(-1)}.</> : <>S&amp;P 500 byl lepší u všech startů.</>}
                      </p>
                    );
                  })()}
                </div>
              )}
              <p className="mt-3 text-[15px] text-slate-700 leading-relaxed">
                {(() => { const o10 = h.oknaSvet.find((o) => o.roky === 10); return o10 ? <>V desetiletých obdobích od roku 2008 vedl S&amp;P 500 proti celému světu
                v {Math.round((100 * o10.vyhraSp) / o10.celkem)} % případů. Je to ale období, které začíná těsně před finanční krizí a pokrývá jedinou éru
                amerických technologických firem. </> : null; })()}
                {(() => { const o1 = h.oknaMimoUsa.find((o) => o.roky === 1), o10 = h.oknaMimoUsa.find((o) => o.roky === 10); return o1 && o10 ? <>Delší srovnání se světem mimo USA ukazuje, že rozdíl umí být velký oběma směry: v jednotlivých letech od {pb(o1.min, true)} do {pb(o1.max, true)},
                a i v desetiletých obdobích od {pb(o10.min, true)} do {pb(o10.max, true)} ročně.</> : null; })()}
              </p>
            </section>

            <section className="mt-10 text-[15px] text-slate-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Kolísavost a souvislost</h2>
              <p>
                Od poloviny roku 2008 kolísal S&amp;P 500 v korunách o {pct(h.kolisavost.sp)} ročně, celý svět o {pct(h.kolisavost.svet)} a svět mimo USA
                o {pct(h.kolisavost.mimoUsa)} (směrodatná odchylka denních výnosů přepočtená na rok).
                {Math.abs(h.kolisavost.svet - h.kolisavost.sp) < 0.01
                  ? ' V korunách tedy kolísaly prakticky stejně – širší rozložení samo o sobě výkyvy znatelně nesnížilo.'
                  : h.kolisavost.svet < h.kolisavost.sp ? ' Celý svět kolísal méně – víc firem a víc měn se navzájem vyrovnává.' : ' Celý svět přitom kolísal víc než S&P 500.'}
              </p>
              <p>
                Měsíční výnosy S&amp;P 500 a celého světa spolu souvisí velmi těsně (korelace {h.korelace.spSvet.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })}), se světem mimo USA
                o něco volněji ({h.korelace.spMimoUsa.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })}).{h.korelace.spSvet > 0.7 && <> Rozložení do celého světa tedy krize neodvrátí – když padá Amerika,
                padá většinou i zbytek. Pomáhá spíš v dlouhých obdobích, kdy jeden region zaostává (jako USA v letech 2000–2009).</>}
              </p>
            </section>
            {(h.levne.sp.length > 0 || h.levne.svet.length > 0) && (
              <section className="mt-10">
                <h2 className="text-xl font-bold tracking-tight">Čím to koupit: nejlevnější velké fondy</h2>
                <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">
                  Poplatek fondu (TER) se odečítá každý rok z výnosu. Rozdíl mezi nejlevnějším a dražším fondem na stejný index bývá desetiny procenta
                  ročně – za 20 let to dělá znatelnou částku. Fondy nad 500 mil. € bez měnového zajištění, data k dnešku:
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {([['S&P 500', h.levne.sp], ['Celý svět (FTSE All-World)', h.levne.svet]] as const).map(([nadpis, fondy]) => (
                    <div key={nadpis} className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="font-semibold text-slate-900">{nadpis}</p>
                      <ul className="mt-2 divide-y divide-slate-100 text-sm">
                        {fondy.map((f) => (
                          <li key={f.isin} className="flex items-baseline justify-between gap-3 py-1.5">
                            <Link href={`/etf/${f.isin}`} className="min-w-0 truncate text-slate-800 hover:text-teal-700"><span className="font-medium">{f.ticker || f.isin}</span> <span className="text-slate-500">{f.dist === 'Distributing' ? 'distribuční' : f.dist === 'Accumulating' ? 'akumulační' : ''}</span></Link>
                            <span className="shrink-0 tabular-nums text-slate-700">TER {pct(f.ter, 2)} · {f.velikostMld.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} mld €</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">Seřazeno podle TER. Fondy na stejný index se liší i způsobem replikace, daní z dividend a odchylkou od indexu – porovnejte je v <Link href="/srovnani" className="text-teal-700 hover:underline">srovnávači</Link>.</p>
              </section>
            )}
            </>)}

            {/* Co z toho plyne */}
            <section className="mt-8 text-[15px] text-slate-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Co si z toho vzít</h2>
              <p>
                <strong>Celý svět není sázka proti USA.</strong> Americké firmy tvoří v celosvětových indexech zhruba 60–65 %. Rozdíl je ve zbylých
                40 % – Evropa, Japonsko, rozvíjející se trhy. Ty v posledních letech brzdily, v dekádě 2000–2009 naopak táhly.
              </p>
              <p>
                <strong>Minulý vítěz není záruka.</strong> {sp.cagr > sv.cagr ? 'Poslední roky patřily USA; v dekádě 2000–2009 to bylo obráceně.' : 'Poslední roky ani dekáda 2000–2009 USA nepřály – ale ani to neříká nic o budoucnosti.'} Data neříkají,
                která varianta vyhraje příště – říkají, jak velký může být rozdíl, když se trefíte vedle.
              </p>
              <p>
                Vyzkoušejte si to sami v <Link href="/stroj-casu" className="font-medium text-teal-700 hover:underline">Korunovém stroji času</Link>{' '}
                (S&amp;P 500 proti celému světu od libovolného roku) nebo v{' '}
                <Link href="/backtest" className="font-medium text-teal-700 hover:underline">backtestu</Link>.
              </p>
            </section>

            <section className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ['/srovnani/vwce-vs-cspx', 'VWCE vs CSPX', 'Konkrétní fondy: celý svět proti S&P 500 vedle sebe.'],
                ['/svetove-etf-indexy', 'Který světový index', 'MSCI World, FTSE All-World, ACWI – v čem se liší.'],
                ['/jaky-sp500-etf', 'Který S&P 500 ETF', 'CSPX, VUAA, VUSA, SPYL – poplatky a výnos v Kč.'],
                ['/nejlepsi-etf/nejlepsi-celosvetove-etf', 'Nejlepší celosvětové ETF', 'Žebříček fondů na celý svět.'],
              ].map(([href, t, p]) => (
                <Link key={href} href={href} className="group rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300">
                  <span className="flex items-center justify-between text-sm font-semibold text-slate-900">{t}<ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700" /></span>
                  <span className="mt-1 block text-xs text-slate-500">{p}</span>
                </Link>
              ))}
            </section>

            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight"><HelpCircle className="w-5 h-5 text-teal-700" /> Časté dotazy</h2>
              <div className="mt-3 space-y-2">
                {faqs.map((f, i) => (
                  <details key={i} className="group rounded-lg border border-slate-200 bg-white p-4">
                    <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-slate-900 list-none">{f.q}<ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" /></summary>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-500 leading-relaxed">
              <p className="font-semibold text-slate-700">Metodika a zdroje</p>
              <p className="mt-1">
                Data: ETF SPY (S&amp;P 500), VT (celý svět, index FTSE Global All Cap, od 6/2008) a fond VGTSX (svět mimo USA) – denní ceny s reinvesticí dividend,
                po poplatcích fondů, před daní. Převod do korun denním kurzem. Ověřeno: roční výnosy S&amp;P 500 proti S&amp;P Dow Jones Indices
                (±0,3 p. b.), VT proti publikovaným výnosům fondu (±0,1 p. b.), kurzy proti ČNB; propady v krizích v USD proti S&amp;P Dow Jones
                Indices (2000–2002 −47 %, 2007–2009 −55 %, covid −34 %, 2022 −25 %). Kolísavost = směrodatná odchylka denních log-výnosů × √252,
                korelace z měsíčních výnosů v Kč. Klouzavá období začínají každý měsíc, poslední rozběhlý měsíc se jako konec nepočítá.
                Složení a poplatky fondů: justETF (náš denní scraper). Minulé výnosy nezaručují budoucí.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

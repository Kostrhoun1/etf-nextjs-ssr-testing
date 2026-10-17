import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, ArrowRight, HelpCircle } from 'lucide-react';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import { spoctiSp500NeboSvet } from '@/lib/clanky/sp500NeboSvet';
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

export default async function Sp500NeboSvet() {
  const d = await spoctiSp500NeboSvet();
  // Chybějící data = výjimka: Next pak při ISR ponechá poslední dobrou verzi stránky (místo
  // „nepodařilo se načíst“ na celý den). Při buildu selže build – raději než nasadit prázdnou stránku.
  if (!d) throw new Error('sp500-nebo-cely-svet: data se nenačetla');
  const sp = d?.od2008.find((x) => x.id === 'sp500');
  const sv = d?.od2008.find((x) => x.id === 'svet');

  const faqs = d && sp && sv ? [
    { q: 'Je lepší investovat do S&P 500, nebo do celého světa?', a: `${sp.cagr > sv.cagr ? 'Od poloviny roku 2008 vyhrál S&P 500' : 'Od poloviny roku 2008 vyhrály akcie celého světa'}: S&P 500 vydělal v korunách ${pct(sp.cagr)} ročně, akcie celého světa ${pct(sv.cagr)}. ${sp.cagr > sv.cagr ? 'Neplatí to ale vždy' : 'A neplatilo to jen teď'} – v dekádě 2000–2009 ztrácel S&P 500 v korunách ${pct(Math.abs(d.dekada2000.sp500))} ročně a zbytek světa dopadl lépe (${pct(d.dekada2000.mimoUsa)} ročně). Kdo neumí předpovědět, který region povede příště, drží celý svět.` },
    { q: 'Proč byl propad v roce 2008 v korunách menší než v dolarech?', a: `Protože koruna v krizi oslabila – dolarová aktiva v Kč tím ztratila méně. Od poloviny 2008 byl nejhlubší propad S&P 500 v dolarech ${pct(d.usdPropad.sp500)}, v korunách jen ${pct(sp.maxPokles)}. Neplatí to vždy: když koruna posiluje, výsledek v Kč naopak zhorší.` },
    { q: 'Kolik z celého světa tvoří USA?', a: 'V indexech celého světa (FTSE All-World, MSCI ACWI) tvoří americké firmy zhruba 60–65 % – kdo drží celý svět, má tedy USA stejně jako hlavní část portfolia, jen ne celé.' },
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
                (±0,3 p. b.), VT proti publikovaným výnosům fondu (±0,1 p. b.), kurzy proti ČNB. Minulé výnosy nezaručují budoucí.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

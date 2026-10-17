import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, ArrowRight, HelpCircle } from 'lucide-react';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import { CPI_LAST_MONTH } from '@/lib/backtest/inflation';
import { spoctiCtyriProcenta, type CtyriProcentaPreset, type VysledekVyberu } from '@/lib/clanky/ctyriProcenta';

/* Vlna 7 / 7.2 – pravidlo 4 % na českých datech. Čísla se počítají při ISR (1× denně) z řad
   Korunového stroje času + inflace ČSÚ; ověřeno nezávislým ročním přepočtem (S&P DJI, ČNB, ČSÚ) –
   viz hlavička src/lib/clanky/ctyriProcenta.ts. */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Pravidlo 4 % v korunách: vydrželo by od roku 2000?',
  description: 'Pravidlo 4 % na skutečných datech v korunách a po české inflaci: kdo začal vybírat v roce 2000, 2003 nebo 2008 – a kdy by mu peníze došly. S&P 500, celý svět i vyvážené portfolio.',
  alternates: { canonical: '/pravidlo-4-procent' },
};

const MESICE6 = ['lednu', 'únoru', 'březnu', 'dubnu', 'květnu', 'červnu', 'červenci', 'srpnu', 'září', 'říjnu', 'listopadu', 'prosinci'];
const vMesici = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `v ${MESICE6[m - 1]} ${y}`; };
/** [2000, 2001, 2002] → „2000, 2001 a 2002“ */
const vycet = (xs: (string | number)[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} a ${xs.at(-1)}`);
const krat = (v: number) => v > 0 && v < 0.1 ? 'méně než 0,1×' : `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}×`;
const tvar = (n: number, a: string, b: string, c: string) => (n === 1 ? a : n >= 2 && n <= 4 ? b : c);
/** Počet let od ledna `rok` do měsíce `ym` (celé roky). */
const letDo = (rok: number, ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  const r = Math.floor(((y - rok) * 12 + (m - 1)) / 12);
  return `${r} ${r === 1 ? 'roce' : 'letech'}`;
};

function Bunka({ v, rok }: { v: VysledekVyberu; rok: number }) {
  if (v.vycerpano) return <span className="text-red-700"><span className="font-medium"><span className="sm:hidden">došly {Number(v.vycerpano.slice(5))}/{v.vycerpano.slice(0, 4)}</span><span className="hidden sm:inline">došly {vMesici(v.vycerpano)}</span></span><span className="block whitespace-nowrap text-xs text-red-700/80">po {letDo(rok, v.vycerpano)}</span></span>;
  return (
    <span>
      <span className="text-slate-900">{krat(v.hodnota!)}</span>
      <span className={`block whitespace-nowrap text-xs ${v.realne! < 1 ? 'text-amber-700' : 'text-slate-500'}`}>reálně {krat(v.realne!)}</span>
    </span>
  );
}

const BARVY = ['#b91c1c', '#0f766e', '#7c3aed', '#64748b'];

/** Hodnota portfolia při výběru 4 % pro několik roků startu. */
function Graf({ p, roky }: { p: CtyriProcentaPreset; roky: number[] }) {
  const rady = roky.map((r) => p.starty.find((s) => s.rok === r)?.s4).filter((x): x is VysledekVyberu => !!x);
  if (!rady.length) return null;
  const W = 720, H = 280, L = 44, B = 30, T = 10;
  const prvni = Number(rady[0].prubeh[0].mesic.slice(0, 4));
  const posledni = Math.max(...rady.map((r) => Number(r.prubeh.at(-1)!.mesic.slice(0, 4)) + Number(r.prubeh.at(-1)!.mesic.slice(5, 7)) / 12));
  const max = Math.max(2, ...rady.flatMap((r) => r.prubeh.map((b) => b.hodnota)));
  const yMax = Math.ceil(max);
  const x = (ym: string) => L + ((Number(ym.slice(0, 4)) + Number(ym.slice(5, 7)) / 12 - prvni - 1 / 12) / (posledni - prvni)) * (W - L - 8);
  const y = (v: number) => T + (H - T - B) * (1 - v / yMax);
  const kroky = yMax <= 4 ? 1 : 2;
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label={`Graf hodnoty portfolia (${p.nazev}) při výběru 4 % ročně pro start v letech ${roky.join(', ')}`}>
        {Array.from({ length: Math.floor(yMax / kroky) + 1 }, (_, k) => k * kroky).map((v) => (
          <g key={v}>
            <line x1={L} x2={W} y1={y(v)} y2={y(v)} stroke="#e2e8f0" />
            <text x={L - 6} y={y(v) + 5} textAnchor="end" fontSize={15} fill="#64748b">{v}×</text>
          </g>
        ))}
        {Array.from({ length: Math.floor((posledni - Math.ceil(prvni / 5) * 5) / 5) + 1 }, (_, k) => Math.ceil(prvni / 5) * 5 + k * 5).map((r) => (
          <text key={r} x={x(`${r}-01`)} y={H - 8} textAnchor="middle" fontSize={15} fill="#64748b">{r}</text>
        ))}
        <line x1={L} x2={W} y1={y(1)} y2={y(1)} stroke="#94a3b8" strokeDasharray="4 3" />
        {rady.map((r, i) => (
          <path key={r.start} fill="none" stroke={BARVY[i]} strokeWidth={2}
            d={r.prubeh.map((b, k) => `${k ? 'L' : 'M'}${x(b.mesic).toFixed(1)},${y(b.hodnota).toFixed(1)}`).join(' ')} />
        ))}
      </svg>
      <figcaption className="mt-1 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-slate-600">
        {rady.map((r, i) => (
          <span key={r.start} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4" style={{ background: BARVY[i] }} /> start {r.start.slice(0, 4)}
            {r.vycerpano ? ` – došlo ${r.vycerpano.slice(0, 4)}` : ''}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 border-t border-dashed border-slate-400" /> počáteční částka</span>
      </figcaption>
    </figure>
  );
}

export default async function PravidloCtyriProcenta() {
  const d = await spoctiCtyriProcenta();
  // Chybějící data = výjimka: Next pak při ISR ponechá poslední dobrou verzi stránky (místo
  // „nepodařilo se načíst“ na celý den). Při buildu selže build – raději než nasadit prázdnou stránku.
  if (!d) throw new Error('pravidlo-4-procent: data se nenačetla');
  const sp = d?.presety.find((p) => p.id === 'sp500');
  const sv = d?.presety.find((p) => p.id === 'svet');
  const vy = d?.presety.find((p) => p.id === 'vyvazene');
  const ok = d && sp && sv && vy;

  const selhalo = (p: CtyriProcentaPreset, k: 's4' | 's35' | 's3' = 's4') => p.starty.filter((s) => s[k].vycerpano);
  const sp2000 = sp?.starty.find((s) => s.rok === 2000);
  const sv2000 = sv?.starty.find((s) => s.rok === 2000);
  const ROKY_TABULKA = Array.from({ length: 13 }, (_, i) => 2000 + i);
  const posledniSelhani = sp ? selhalo(sp).at(-1)?.rok : undefined;
  const spPozdejiOk = !!sp && posledniSelhani !== undefined && sp.starty.every((s) => s.rok <= posledniSelhani || !s.s4.vycerpano);
  const nejhorsi3 = sp && sv ? [sp, sv].flatMap((p) => p.starty.filter((s) => s.rok <= 2002)) : [];
  const trojkaSelhala = nejhorsi3.filter((s) => s.s3.vycerpano).length;
  const vyReal = vy ? vy.starty.filter((s) => !s.s4.vycerpano && s.s4.realne! < 1 && s.rok <= 2016) : [];

  const faqs = ok && sp2000 && sv2000 ? [
    { q: 'Funguje pravidlo 4 % v Česku?', a: `Na českých datech ne vždy. Kdo v lednu 2000 začal vybírat 4 % z akcií S&P 500 (a výběr navyšoval o českou inflaci), měl v korunách prázdné portfolio ${sp2000.s4.vycerpano ? vMesici(sp2000.s4.vycerpano) : '– nevyčerpal'}. U akcií celého světa ${sv2000.s4.vycerpano ? vMesici(sv2000.s4.vycerpano) : 'nevyčerpal'}. ${spPozdejiOk ? `Kdo začal v roce ${posledniSelhani! + 1} nebo později, tomu peníze zatím vydržely. ` : ''}Rozhodlo, jestli hned v prvních letech přišel velký propad.` },
    { q: 'Proč to v korunách dopadlo hůř než v amerických studiích?', a: 'Americké studie počítají v dolarech. Českému investorovi v letech 2000–2008 navíc výrazně posílila koruna (dolar z 36 Kč na zhruba 15 Kč), takže dolarové akcie v korunách ztrácely i ve chvílích, kdy v dolarech rostly – a výběry se přitom navyšovaly o českou inflaci.' },
    { q: 'Kolik tedy bezpečně vybírat?', a: `Data neumí říct, kolik je bezpečné pro budoucnost – jen co by vydrželo v minulosti. ${trojkaSelhala === nejhorsi3.length ? 'U nejhorších startů (2000–2002) by z čistě akciového portfolia nevydrželo ani 3 %.' : trojkaSelhala > 0 ? 'U nejhorších startů (2000–2002) by z čistě akciového portfolia v některých případech nevydrželo ani 3 %.' : 'U nejhorších startů (2000–2002) by 3 % z čistě akciového portfolia zatím vydržela.'} Proto se při dlouhé rentě obvykle kombinuje nižší výběr, část v dluhopisech nebo rezervě a ochota ve špatných letech vybírat méně.` },
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
          <Link href="/fire" className="hover:text-slate-700">FIRE</Link><span>/</span>
          <span className="text-slate-700">Pravidlo 4 % v korunách</span>
        </nav>

        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-balance">Pravidlo 4 % v korunách: vydrželo by od roku 2000?</h1>

        {!ok || !sp2000 || !sv2000 ? (
          <p className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">Data pro tento rozbor se teď nepodařilo načíst. Zkuste to prosím později.</p>
        ) : (
          <>
            <AktualnostDat datum={new Date(d.posledniDen)} className="mt-3" />

            <section className="mt-6 rounded-xl border border-teal-200 bg-teal-50/60 p-5 text-[15px] leading-relaxed text-slate-800">
              <p className="font-semibold text-slate-900">Krátká odpověď</p>
              <p className="mt-1.5">
                Ne vždy. Kdo v lednu 2000 začal z akcií S&amp;P 500 vybírat 4 % ročně (navyšovaných o českou inflaci), měl v korunách
                prázdné portfolio <strong>{sp2000.s4.vycerpano ? vMesici(sp2000.s4.vycerpano) : 'nikdy'}</strong> – po{' '}
                {sp2000.s4.vycerpano ? letDo(2000, sp2000.s4.vycerpano) : ''}. Došly peníze startům z {tvar(selhalo(sp).length, 'roku', 'let', 'let')} {vycet(selhalo(sp).map((s) => s.rok))}
                {spPozdejiOk && <>; kdo začal v roce {selhalo(sp).at(-1)!.rok + 1} a později, tomu zatím vydržely – často s velkou rezervou</>}. O výsledku rozhodlo hlavně to, jestli hned na začátku přišel velký propad.
              </p>
            </section>

            <section className="mt-8 text-[15px] text-slate-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Co je pravidlo 4 %</h2>
              <p>
                První rok vyberete 4 % portfolia (z 10 milionů tedy 400 000 Kč), další roky stejnou částku navýšenou o inflaci – bez ohledu na
                to, co dělají trhy. Pravidlo pochází z amerických studií (Bengen, Trinity Study), podle kterých takový výběr v historii
                USA obvykle vydržel 30 let. Na něm stojí i běžný cíl FIRE: <Link href="/fire" className="font-medium text-teal-700 hover:underline">25násobek ročních výdajů</Link>.
                My jsme ho přepočítali na data v korunách a s českou inflací.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Výběr 4 % podle roku startu</h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Kolik z portfolia zbývá dnes (násobek počáteční částky), nebo kdy došlo. „Reálně“ = v cenách roku startu, po české inflaci.
              </p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-2 sm:px-3 py-2.5">Start</th>
                      <th className="px-2 sm:px-3 py-2.5">{sp.nazev}</th>
                      <th className="px-2 sm:px-3 py-2.5">{sv.nazev}</th>
                      <th className="px-2 sm:px-3 py-2.5">{vy.nazev}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 tabular-nums">
                    {ROKY_TABULKA.map((rok) => {
                      const [a, b, c] = [sp, sv, vy].map((p) => p.starty.find((s) => s.rok === rok));
                      return (
                        <tr key={rok}>
                          <td className="px-2 sm:px-3 py-2 font-medium text-slate-900">{rok}</td>
                          <td className="px-2 sm:px-3 py-2">{a ? <Bunka v={a.s4} rok={rok} /> : '—'}</td>
                          <td className="px-2 sm:px-3 py-2">{b ? <Bunka v={b.s4} rok={rok} /> : '—'}</td>
                          <td className="px-2 sm:px-3 py-2">{c ? <Bunka v={c.s4} rok={rok} /> : <span className="text-slate-400" title={`Data dluhopisového fondu až od ${vy.od.slice(0, 4)}`}>—</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Celý svět = index FTSE All-World (fond VT); před 7/2008, kdy fond nebyl, aproximace 60 % USA + 40 % zbytek světa. Vyvážené = 60 % akcie celého světa, 40 % dluhopisy (data dluhopisového fondu od {vy.od.slice(0, 4)}).
                U pozdějších startů je období ještě krátké – rozhodující jsou první roky.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Jak to vypadalo v čase</h2>
              <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">
                {sv.nazev}, výběr 4 % ročně. Stejné pravidlo, jen jiný rok začátku – a úplně jiný výsledek.
              </p>
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                <Graf p={sv} roky={[2000, 2003, 2007, 2009]} />
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Pomohl by nižší výběr?</h2>
              <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">Nejhorší roky startu, čistě akciové portfolio:</p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-2 sm:px-3 py-2.5">Start</th><th className="px-2 sm:px-3 py-2.5">4 %</th><th className="px-2 sm:px-3 py-2.5">3,5 %</th><th className="px-2 sm:px-3 py-2.5">3 %</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 tabular-nums">
                    {[2000, 2001, 2002].flatMap((rok) => [sp, sv].map((p) => {
                      const s = p.starty.find((x) => x.rok === rok);
                      return s && (
                        <tr key={`${rok}-${p.id}`}>
                          <td className="px-2 sm:px-3 py-2"><span className="font-medium text-slate-900">{rok}</span><span className="block text-xs text-slate-500">{p.nazev}</span></td>
                          <td className="px-2 sm:px-3 py-2"><Bunka v={s.s4} rok={rok} /></td>
                          <td className="px-2 sm:px-3 py-2"><Bunka v={s.s35} rok={rok} /></td>
                          <td className="px-2 sm:px-3 py-2"><Bunka v={s.s3} rok={rok} /></td>
                        </tr>
                      );
                    }))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-8 text-[15px] text-slate-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Proč to v korunách dopadlo hůř</h2>
              <p>
                <strong>Špatný začátek.</strong> Kdo vybírá z portfolia, které hned na začátku spadne o polovinu, prodává levně a ztráta se už
                nedožene – ani když trh později roste. Startům z let 2000–2002 přišly během prvních let dva velké propady (2000–2002 a 2008).
              </p>
              <p>
                <strong>Silnější koruna.</strong> Mezi lety 2000 a 2008 posílila koruna k dolaru zhruba z 36 na 15 Kč. Dolarové akcie tím v korunách
                ztrácely, zatímco výběry rostly s českou inflací.{' '}
                <Link href="/menove-riziko-etf" className="font-medium text-teal-700 hover:underline">Víc o měnovém riziku</Link>
              </p>
              {vyReal.length > 0 && selhalo(vy).length === 0 && (
                <p>
                  <strong>Dluhopisy pomohly, ale ne zadarmo.</strong> Vyvážené portfolio nevyčerpal žádný start, který máme v datech. U startů{' '}
                  {vycet(vyReal.map((s) => s.rok))} je ale dnes reálně menší než na začátku – přispěla k tomu i vysoká inflace let 2022–2023.
                </p>
              )}
            </section>

            <section className="mt-8 text-[15px] text-slate-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Co si z toho vzít</h2>
              <p><strong>4 % není záruka.</strong> Je to pravidlo z amerických dat. V korunách a s nešťastným začátkem by v minulosti nevydrželo.</p>
              <p><strong>Rozhodují první roky.</strong> Rezerva na několik let výdajů nebo část v dluhopisech dovolí ve špatných letech z akcií neprodávat.</p>
              <p><strong>Pružnost pomáhá.</strong> Kdo ve špatném roce vybere méně, dává portfoliu šanci se vzpamatovat. Pevné pravidlo s inflací to neumí.</p>
              <p className="text-sm text-slate-500">Jde o vzdělávací rozbor historických dat, ne o investiční doporučení.</p>
            </section>

            <section className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ['/fire', 'FIRE v Česku', 'Kolik potřebujete na finanční nezávislost.'],
                ['/fire-kalkulacka', 'FIRE kalkulačka', 'V kolika letech dosáhnete svého cíle.'],
                ['/jak-dlouho-v-minusu', 'Jak dlouho můžete být v minusu?', 'Návrat po propadech v korunách i po inflaci.'],
                ['/stroj-casu', 'Korunový stroj času', 'Kolik byste měli, kdybyste začali dřív.'],
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
                Výběr každý měsíc (1/12 roční částky na začátku měsíce), navyšovaný o českou inflaci od startu (index spotřebitelských cen ČSÚ;
                poslední zveřejněný měsíc je {Number(CPI_LAST_MONTH.slice(5))}/{CPI_LAST_MONTH.slice(0, 4)}, za další měsíce výběr zatím nezvyšujeme). Výnosy: ETF SPY (S&amp;P 500), VT (celý svět od 7/2008, dříve
                aproximace 60 % S&amp;P 500 + 40 % fond VGTSX se světem mimo USA) a AGG (dluhopisy) s reinvesticí dividend, po poplatcích fondů, převedené do korun denním kurzem, roční vyvažování.
                Bez daní a poplatků brokera. Ověřeno nezávislým ročním přepočtem z výnosů S&amp;P 500 (S&amp;P Dow Jones Indices), kurzů ČNB
                a míry inflace ČSÚ – roky vyčerpání sedí. Minulé výnosy nezaručují budoucí.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

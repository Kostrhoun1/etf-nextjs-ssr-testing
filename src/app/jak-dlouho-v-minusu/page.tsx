import { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { TrendingUp, ArrowRight, HelpCircle } from 'lucide-react';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import { ogImage } from '@/lib/ogImage';
import { CPI_LAST_MONTH } from '@/lib/backtest/inflation';
import { spoctiPodVodou, type PodVodouPreset, type DlouhoNad } from '@/lib/clanky/podVodou';

/* Vlna 7 – obsah z dat v korunách. Otázka, kterou si začínající investor klade po prvním propadu.
   Čísla se počítají při ISR (1× denně) z řad Korunového stroje času + inflace ČSÚ; ověřeno
   nezávisle (S&P DJI, ČNB, ČSÚ) – viz hlavička src/lib/clanky/podVodou.ts. */
export const revalidate = 86400;

/* Vlastní OG: bez něj se dědí og:url homepage → Facebook by sdílel titulní stranu. */
export async function generateMetadata(): Promise<Metadata> {
  const title = 'Jak dlouho můžete být v minusu? Data v korunách i po inflaci';
  const description = 'Jak dlouho trvalo, než se investice do akcií po propadu vrátila nad vklad – v korunách a po české inflaci. Nejhorší případy od roku 2000, krize 2008, covid i rok 2022.';
  const d = await spoctiPodVodou();
  const s0 = d?.presety.find((p) => p.id === 'sp500')?.starty[0];
  const stat = s0 && s0.start === '2000-01' && s0.nominalne ? doba(s0.nominalne) : undefined;
  return {
    title, description,
    alternates: { canonical: '/jak-dlouho-v-minusu' },
    openGraph: {
      title, description, url: '/jak-dlouho-v-minusu', type: 'article',
      images: [ogImage({ title, eyebrow: 'Co říkají data', stat, statLabel: stat ? 'v minusu po nákupu S&P 500 v lednu 2000 (v Kč)' : undefined })],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const tvar = (n: number, a: string, b: string, c: string) => (n === 1 ? a : n >= 2 && n <= 4 ? b : c);
/** 175 → „14 let a 7 měsíců" */
function doba(m: number | null): string {
  if (m === null) return 'dosud';
  if (m === 0) return 'ani měsíc';
  const r = Math.floor(m / 12), mm = m % 12;
  const roky = r ? `${r} ${tvar(r, 'rok', 'roky', 'let')}` : '';
  const mes = mm ? `${mm} ${tvar(mm, 'měsíc', 'měsíce', 'měsíců')}` : '';
  return [roky, mes].filter(Boolean).join(' a ');
}
/** Do věty („byl v minusu …“): bez „ani měsíc“/„dosud“, které by větu rozbily. */
const dobaV = (m: number | null) => (m === null ? 'dosud – stále je pod vkladem' : m === 0 ? '0 měsíců' : doba(m));
const MESICE = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
const MESICE1 = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
const MESICE6 = ['lednu', 'únoru', 'březnu', 'dubnu', 'květnu', 'červnu', 'červenci', 'srpnu', 'září', 'říjnu', 'listopadu', 'prosinci'];
/** „v lednu 2000" */
const vMesici = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `v ${MESICE6[m - 1]} ${y}`; };
const plusMesicu = (ym: string, n: number) => { const [y, m] = ym.split('-').map(Number); return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7); };
const kdy = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${MESICE1[m - 1]} ${y}`; };
const od = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${MESICE[m - 1]} ${y}`; };
const pct = (v: number) => `${v < 0 ? '−' : ''}${Math.abs(Math.round(v * 100))} %`;

/** Události, u kterých čtenáře zajímá „kdybych koupil těsně před…". */
const UDALOSTI: [string, string][] = [
  ['2000-01', 'Těsně před splasknutím internetové bubliny'],
  ['2007-10', 'Na vrcholu před finanční krizí'],
  ['2015-04', 'Před propadem 2015–2016'],
  ['2020-02', 'Těsně před covidem'],
  ['2022-01', 'Před propadem a inflací 2022'],
];

const BARVY_P: Record<string, string> = { sp500: '#0f766e', svet: '#7c3aed', vyvazene: '#b45309' };
/** Čárový graf: podíl startů v minusu podle délky držení (nominálně). */
function GrafPoLetech({ presety }: { presety: PodVodouPreset[] }) {
  const W = 720, H = 260, L = 52, B = 30, T = 10, R = 16;
  const roky = [1, 2, 3, 5, 10, 15];
  const x = (r: number) => L + ((r - 1) / 14) * (W - L - R);
  const y = (v: number) => T + (H - T - B) * (1 - v / 0.5);
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Graf: podíl měsíců nákupu, kdy byla investice po daném počtu let v minusu, podle délky držení">
        {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => (
          <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#e2e8f0" /><text x={L - 6} y={y(v) + 5} textAnchor="end" fontSize={14} fill="#64748b">{Math.round(v * 100)} %</text></g>
        ))}
        {roky.map((r) => <text key={r} x={x(r)} y={H - 8} textAnchor="middle" fontSize={14} fill="#64748b">{r} {r === 1 ? 'rok' : r < 5 ? 'roky' : 'let'}</text>)}
        {presety.map((p) => (
          <g key={p.id}>
            <path fill="none" stroke={BARVY_P[p.id] ?? '#64748b'} strokeWidth={2.5}
              d={p.poLetech.map((q, i) => `${i ? 'L' : 'M'}${x(q.roky).toFixed(1)},${y(q.nom).toFixed(1)}`).join(' ')} />
            {p.poLetech.map((q) => <circle key={q.roky} cx={x(q.roky)} cy={y(q.nom)} r={3.5} fill={BARVY_P[p.id] ?? '#64748b'} />)}
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-slate-600">
        {presety.map((p) => <span key={p.id} className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4" style={{ background: BARVY_P[p.id] }} /> {p.nazev}</span>)}
      </figcaption>
    </figure>
  );
}

/** Sloupcový graf: pro každý měsíc startu délka v minusu (nominálně tmavě, po inflaci světle za ním). */
function Graf({ p }: { p: PodVodouPreset }) {
  const W = 720, H = 280, L = 52, B = 30, T = 8;
  const n = p.starty.length;
  const max = Math.max(...p.starty.map((s, i) => (s.realne ?? n - i)), 12);
  const yMax = Math.ceil(max / 60) * 60;
  const bw = (W - L) / n;
  const y = (m: number) => T + (H - T - B) * (1 - m / yMax);
  const roky = p.starty.map((s, i) => [s.start, i] as const).filter(([s]) => s.endsWith('-01') && Number(s.slice(0, 4)) % 5 === 0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
      aria-label={`Graf: jak dlouho byl v minusu ${p.nazev} podle měsíce nákupu, nominálně a po inflaci`}>
      {Array.from({ length: yMax / 60 + 1 }, (_, k) => k * 60).map((m) => (
        <g key={m}>
          <line x1={L} x2={W} y1={y(m)} y2={y(m)} stroke="#e2e8f0" strokeWidth={1} />
          <text x={L - 6} y={y(m) + 5} textAnchor="end" fontSize={15} fill="#64748b">{m / 12} let</text>
        </g>
      ))}
      {p.starty.map((s, i) => {
        const r = s.realne ?? n - i, nm = s.nominalne ?? n - i;
        const x = L + i * bw;
        return (
          <g key={s.start}>
            {r > 0 && <rect x={x} y={y(r)} width={Math.max(bw, 1)} height={y(0) - y(r)} fill="#99f6e4" />}
            {nm > 0 && <rect x={x} y={y(nm)} width={Math.max(bw, 1)} height={y(0) - y(nm)} fill="#0f766e" />}
          </g>
        );
      })}
      {roky.map(([s, i]) => (
        <text key={s} x={L + i * bw} y={H - 8} textAnchor="middle" fontSize={15} fill="#64748b">{s.slice(0, 4)}</text>
      ))}
    </svg>
  );
}

export default async function JakDlouhoVMinusu() {
  const d = await spoctiPodVodou();
  // Chybějící data = výjimka: Next pak při ISR ponechá poslední dobrou verzi stránky (místo
  // „nepodařilo se načíst“ na celý den). Při buildu selže build – raději než nasadit prázdnou stránku.
  if (!d) throw new Error('jak-dlouho-v-minusu: data se nenačetla');
  const sp = d?.presety.find((p) => p.id === 'sp500');
  const sv = d?.presety.find((p) => p.id === 'svet');
  const vy = d?.presety.find((p) => p.id === 'vyvazene');
  const spDca = sp?.pravidelne.find((x) => x.od === '2000-01');
  const jednorazove2007 = sp?.starty.find((x) => x.start === '2007-10');
  // „Nikdy pod vkladem“ jen u nákupů s aspoň 5 lety dat – u čerstvých nákupů to nic neříká (revize).
  const spS5 = sp ? sp.starty.filter((_, i) => sp.starty.length - i >= 60) : [];
  const spNikdy5 = spS5.filter((x) => x.nominalne === 0).length;

  // Poznámky k číslům, kde investice byla dlouho nad vkladem a pak pod něj krátce spadla (přísná doba pak působí přehnaně).
  const poznamky: { klic: string; p: PodVodouPreset; ym: string; co: string; d: DlouhoNad }[] = [];
  if (sp && sv && vy) {
    for (const [ym] of UDALOSTI) for (const p of [sp, sv, vy]) {
      const s = p.starty.find((x) => x.start === ym);
      if (s?.dlouhoNadNominalne) poznamky.push({ klic: `${p.id}-${ym}-n`, p, ym, co: 'v korunách', d: s.dlouhoNadNominalne });
      if (s?.dlouhoNadRealne) poznamky.push({ klic: `${p.id}-${ym}-r`, p, ym, co: 'po inflaci', d: s.dlouhoNadRealne });
    }
  }
  const znacka = (klic: string) => {
    const i = poznamky.findIndex((x) => x.klic === klic);
    return i < 0 ? null : <sup className="ml-0.5 text-teal-700"><a href={`#pozn-${i + 1}`}>{i + 1}</a></sup>;
  };

  const faqs = d && sp && sv && spDca ? [
    { q: 'Jak dlouho může trvat, než se investice do akcií vrátí nad vklad?', a: `Obvykle měsíce až pár let. Po nákupu na vrcholu v roce 2000 ale mnohem déle: kdo koupil S&P 500 ${vMesici(sp.starty[0].start)}, byl v korunách v minusu ${dobaV(sp.starty[0].nominalne)}, a po započtení české inflace ${dobaV(sp.starty[0].realne)}. Takové případy se týkaly nákupů na vrcholu internetové bubliny v letech 2000–2002.` },
    { q: 'Proč byl návrat v korunách delší než v dolarech?', a: `Protože koruna v letech 2000–2008 silně posílila (dolar z 36 Kč na zhruba 15 Kč) a dolarová aktiva tím v Kč ztrácela. S&P 500 od ledna 2000 byl v dolarech v minusu ${sp500UsdText(d.sp500Usd2000)}, v korunách ${dobaV(sp.starty[0].nominalne)}.` },
    { q: 'Pomůže pravidelné investování?', a: `Zkrátí to, ale nezruší. Kdo od ledna 2000 posílal do S&P 500 každý měsíc stejnou částku, byl v korunách pod součtem vkladů ${dobaV(spDca.nominalne)} – v nejhorší chvíli ${pct(spDca.nejhure)} (${kdy(spDca.nejhureKdy)}).` },
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
          <span className="text-slate-700">Jak dlouho v minusu</span>
        </nav>

        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-balance">Jak dlouho můžete být v minusu? Data v korunách i po inflaci</h1>

        {!d || !sp || !sv || !vy || !spDca ? (
          <p className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">Data pro tento rozbor se teď nepodařilo načíst. Zkuste to prosím později.</p>
        ) : (
          <>
            <AktualnostDat datum={new Date(d.posledniDen)} className="mt-3" />

            <section className="mt-6 rounded-xl border border-teal-200 bg-teal-50/60 p-5 text-[15px] leading-relaxed text-slate-800">
              <p className="font-semibold text-slate-900">Krátká odpověď</p>
              <p className="mt-1.5">
                Většinou měsíce až pár let. Nejdéle se čekalo po nákupech na vrcholu internetové bubliny: kdo vložil peníze do S&amp;P 500 {vMesici(sp.starty[0].start)},
                byl v korunách v minusu <strong>{dobaV(sp.starty[0].nominalne)}</strong> – a po započtení inflace{' '}
                <strong>{dobaV(sp.starty[0].realne)}</strong>. {sp.po10.nominalne.length > 0 && <> Ze všech nákupů S&amp;P 500 od roku 2000 byl po deseti letech pod vkladem jen ten, kdo nakoupil
                v období {kdy(sp.po10.nominalne[0])} – {kdy(sp.po10.nominalne.at(-1)!)}.</>}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Kdybyste koupili v nejhorší chvíli</h2>
              <p className="mt-1.5 text-sm text-slate-600">Jednorázová investice, počítáno v korunách. „V minusu“ = do posledního měsíce, kdy byla hodnota pod vkladem.</p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5">Do čeho</th>
                      <th className="px-4 py-2.5 text-right">V minusu v Kč</th>
                      <th className="px-4 py-2.5 text-right">Po inflaci</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UDALOSTI.map(([ym, popis]) => (
                      <Fragment key={ym}>
                        <tr className="bg-slate-50 border-t border-slate-200">
                          <th colSpan={3} scope="rowgroup" className="px-4 py-2 text-left font-normal">
                            <span className="font-semibold text-slate-900">Nákup {kdy(ym)}</span>
                            <span className="text-slate-500"> · {popis}</span>
                          </th>
                        </tr>
                        {[sp, sv, vy].map((p) => {
                          const s = p.starty.find((x) => x.start === ym);
                          return s && (
                            <tr key={p.id} className="border-t border-slate-100">
                              <td className="px-4 py-2 text-slate-700">{p.nazev}</td>
                              <td className="px-4 py-2 text-right tabular-nums">{doba(s.nominalne)}{znacka(`${p.id}-${ym}-n`)}</td>
                              <td className="px-4 py-2 text-right tabular-nums text-slate-600">{doba(s.realne)}{znacka(`${p.id}-${ym}-r`)}</td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              {poznamky.length > 0 && (
                <ol className="mt-2 space-y-1 text-xs text-slate-500 leading-relaxed">
                  {poznamky.map(({ klic, p, ym, co, d }, i) => (
                    <li key={klic} id={`pozn-${i + 1}`}>
                      <sup className="mr-0.5 text-teal-700">{i + 1}</sup>
                      {p.nazev}, nákup {vMesici(ym)}, {co}: investice byla nad vkladem už od {od(plusMesicu(ym, d.od))}, a to souvisle {doba(d.delka)}.
                      Pak pod vklad ještě klesla, celkem na {doba(d.znovuPodMesicu)} (nejvíc o {pct(-d.hloubka)}) – a „v minusu“ počítáme až do posledního
                      takového měsíce.
                    </li>
                  ))}
                </ol>
              )}
              <p className="mt-2 text-xs text-slate-500">Vyvážené portfolio (60 % akcie, 40 % dluhopisy) počítáme od {od(vy.od)} – dřívější data dluhopisového fondu nemáme.</p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Všechny měsíce nákupu najednou</h2>
              <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">
                {sp.nazev}: každý sloupec je jeden měsíc nákupu, výška ukazuje, jak dlouho pak byla investice v minusu.
                Tmavě v korunách, světle po inflaci.
              </p>
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                <Graf p={sp} />
                <div className="mt-1 flex gap-4 px-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-teal-700" /> v korunách</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-teal-200" /> po inflaci</span>
                </div>
              </div>
              <p className="mt-3 text-[15px] text-slate-700 leading-relaxed">
                Z {spS5.length} měsíců nákupu, po kterých máme aspoň pět let dat, nebyla u {spNikdy5} ({Math.round((100 * spNikdy5) / Math.max(1, spS5.length))} %)
                hodnota na konci žádného měsíce pod vkladem. Nejdelší čekání se týká nákupů v letech 2000–2003; kdo nakoupil od roku 2004, byl
                v korunách v minusu nejvýš {dobaV(Math.max(...sp.starty.filter((x) => x.start >= '2004-01').map((x) => x.nominalne ?? 0)))}.
              </p>
            </section>


            {/* ─── HLOUBKA: pravděpodobnosti, hloubka, doba ─── */}
            <section className="mt-10">
              <h2 className="text-xl font-bold tracking-tight">Jak velká je šance být v minusu</h2>
              <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">
                Vezmeme každý měsíc od roku 2000 jako možný den nákupu a podíváme se, jak často byla investice po daném počtu let pod vkladem.
                Počítáme jednorázový nákup i pravidelné investování stejné částky každý měsíc.
              </p>
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                <GrafPoLetech presety={[sp, sv, vy]} />
              </div>
              {[sp, sv, vy].map((p) => (
                <div key={p.id} className="mt-4">
                  <h3 className="font-semibold text-slate-900">{p.nazev}{p.id === 'vyvazene' ? <span className="font-normal text-slate-500"> (od {od(p.od)})</span> : null}</h3>
                  <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-sm tabular-nums">
                      <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr><th className="px-2 sm:px-3 py-2">Po</th><th className="px-2 sm:px-3 py-2 text-right">Naráz</th><th className="px-2 sm:px-3 py-2 text-right">Naráz, po inflaci</th><th className="px-2 sm:px-3 py-2 text-right">Pravidelně</th><th className="px-2 sm:px-3 py-2 text-right">Pravidelně, po inflaci</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {p.poLetech.map((q) => (
                          <tr key={q.roky}>
                            <td className="px-2 sm:px-3 py-1.5">{q.roky} {q.roky === 1 ? 'roce' : 'letech'} <span className="text-xs text-slate-500">({q.startu})</span></td>
                            <td className="px-2 sm:px-3 py-1.5 text-right">{pct(q.nom)}</td>
                            <td className="px-2 sm:px-3 py-1.5 text-right text-slate-600">{pct(q.real)}</td>
                            <td className="px-2 sm:px-3 py-1.5 text-right">{pct(q.dcaNom)}</td>
                            <td className="px-2 sm:px-3 py-1.5 text-right text-slate-600">{pct(q.dcaReal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              <p className="mt-2 text-xs text-slate-500">Podíl měsíců nákupu, kdy byla hodnota po daném počtu let (na konci měsíce) pod vloženou částkou. V závorce počet měsíců nákupu, pro které už tolik let dat máme.</p>
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-[15px] text-slate-800 leading-relaxed">
                <p className="font-semibold text-slate-900">Proč může být „po 5 letech“ horší než „po roce“</p>
                <p className="mt-1">
                  Naše data začínají v roce 2000 – těsně před dvěma velkými propady (2000–2002 a 2008) a v době, kdy koruna k dolaru silně posilovala.
                  {(() => {
                    const pod = sp.pet.filter(([, a]) => a > 0), poslRok = pod.at(-1)?.[0];
                    const v = pod.reduce((s2, [, a]) => s2 + a, 0), c = pod.reduce((s2, [, , b]) => s2 + b, 0);
                    return pod.length ? <>U S&amp;P 500 skončila po 5 letech v minusu {v} z {c} nákupů z let {pod[0][0]}–{poslRok}
                      {sp.pet.some(([y, a]) => y > poslRok! && a === 0) ? <> a žádný nákup z pozdějších let</> : null}. Tyhle starty táhnou celkový podíl nahoru.</> : null;
                  })()}
                  Neznamená to, že delší držení obecně škodí – po 15 letech {(sp.poLetech.find((q) => q.roky === 15)?.nom ?? 0) === 0 ? 'už nebyl v korunách v minusu žádný nákup S&P 500' : <>byl v korunách v minusu už jen {pct(sp.poLetech.find((q) => q.roky === 15)!.nom)} nákupů S&amp;P 500</>}.
                  Znamená to, že výsledek hodně záleží na tom, do jakého období se trefíte.
                </p>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-bold tracking-tight">Jak hluboko to cestou spadne</h2>
              <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">
                Doba v minusu je jedna věc, hloubka druhá. Pro každý měsíc nákupu jsme našli nejnižší hodnotu, na kterou investice kdykoli později klesla
                pod nákupní cenu (konce měsíců, v korunách):
              </p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm tabular-nums">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-3 py-2">Do čeho</th><th className="px-3 py-2 text-right">Typicky</th><th className="px-3 py-2 text-right">1 z 10 nákupů</th><th className="px-3 py-2 text-right">Nejhůř</th><th className="px-3 py-2 text-right">Pokles přes 20 %</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[sp, sv, vy].map((p) => (
                      <tr key={p.id}>
                        <td className="px-3 py-2">{p.nazev}</td>
                        <td className="px-3 py-2 text-right">{p.hloubka.median < 0 ? pct(p.hloubka.median) : 'nikdy pod'}</td>
                        <td className="px-3 py-2 text-right">{pct(p.hloubka.p90)}</td>
                        <td className="px-3 py-2 text-right text-red-700">{pct(p.hloubka.nejhorsi)} <span className="block text-xs text-slate-500">nákup {kdy(p.hloubka.nejhorsiStart)}</span></td>
                        <td className="px-3 py-2 text-right">{pct(p.hloubka.podil20)} nákupů</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-500">„Typicky“ = medián, „1 z 10 nákupů“ = hloubka, kterou překonala desetina nejhorších nákupů. Jen nákupy, po kterých máme aspoň 5 let dat.</p>
              <p className="mt-3 text-[15px] text-slate-700 leading-relaxed">
                Kdo do akcií vstupuje, měl by počítat s tím, že hodnota v nějaké chvíli spadne pod vklad – u S&amp;P 500 se to stalo
                u {pct(1 - sp.nikdyPod / Math.max(1, sp.starty.length))} nákupů a u {pct(sp.hloubka.podil20)} nákupů to bylo o víc než pětinu.
                Vyvážené portfolio padalo méně: typicky o {pct(Math.abs(vy.hloubka.median))}, v nejhorším případě o {pct(Math.abs(vy.hloubka.nejhorsi))}.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-bold tracking-tight">Typická doba v minusu</h2>
              <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed">Jak dlouho byla investice pod vkladem (do posledního měsíce pod vkladem) – přes všechny nákupy, po kterých máme aspoň 10 let dat:</p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-3 py-2">Do čeho</th><th className="px-3 py-2 text-right">Polovina nákupů nejvýš</th><th className="px-3 py-2 text-right">3 ze 4 nákupů nejvýš</th><th className="px-3 py-2 text-right">9 z 10 nákupů nejvýš</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[sp, sv, vy].map((p) => (
                      <tr key={p.id} className="align-top">
                        <td className="px-3 py-2">{p.nazev} <span className="block text-xs text-slate-500">{p.doba.startu} nákupů</span></td>
                        <td className="px-3 py-2 text-right">{doba(p.doba.median)}<span className="block text-xs text-slate-500">po inflaci {doba(p.doba.medianReal)}</span></td>
                        <td className="px-3 py-2 text-right">{doba(p.doba.p75)}<span className="block text-xs text-slate-500">po inflaci {doba(p.doba.p75Real)}</span></td>
                        <td className="px-3 py-2 text-right">{doba(p.doba.p90)}<span className="block text-xs text-slate-500">po inflaci {doba(p.doba.p90Real)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-8 text-[15px] text-slate-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Proč to v korunách trvalo déle</h2>
              <p>
                S&amp;P 500 od ledna 2000 byl v dolarech v minusu {sp500UsdText(d.sp500Usd2000)}, v korunách{' '}
                <strong>{dobaV(sp.starty[0].nominalne)}</strong>. Rozdíl udělal kurz: koruna v letech 2000–2008 silně posílila a dolarové investice
                v ní ztrácely. Funguje to i opačně – v krizi 2008 koruna oslabila a propad v Kč zmírnila.{' '}
                <Link href="/menove-riziko-etf" className="font-medium text-teal-700 hover:underline">Víc o měnovém riziku</Link>
              </p>
            </section>

            <section className="mt-8 text-[15px] text-slate-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Inflace prodlužuje čekání</h2>
              <p>
                Návrat nad vklad v korunách ještě neznamená, že si za peníze koupíte totéž co na začátku. Je to vidět na letech vysoké inflace
                2022–2023: kdo koupil {sp.nazev} {vMesici('2022-01')}, byl v korunách v minusu {dobaV(sp.starty.find((s) => s.start === '2022-01')?.nominalne ?? null)},
                po započtení inflace {dobaV(sp.starty.find((s) => s.start === '2022-01')?.realne ?? null)}. Kdo koupil těsně před covidem
                ({kdy('2020-02')}), byl v korunách v minusu {dobaV(sp.starty.find((s) => s.start === '2020-02')?.nominalne ?? null)}, po inflaci{' '}
                {dobaV(sp.starty.find((s) => s.start === '2020-02')?.realne ?? null)}.
              </p>
            </section>

            <section className="mt-8 text-[15px] text-slate-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">A když investujete pravidelně?</h2>
              <p>
                Pravidelná investice čekání zkrátí, ale nezruší. Kdo od {od('2000-01')} posílal do S&amp;P 500 každý měsíc stejnou částku, byl pod
                součtem svých vkladů <strong>{dobaV(spDca.nominalne)}</strong> (po inflaci {dobaV(spDca.realne)}). V nejhorší chvíli,{' '}
                {vMesici(spDca.nejhureKdy)}, měl o {pct(-spDca.nejhure)} méně, než vložil.
              </p>
              {sp.pravidelne.find((x) => x.od === '2007-10') && (() => {
                const x = sp.pravidelne.find((y) => y.od === '2007-10')!;
                return (
                  <p>
                    Kdo začal pravidelně investovat na vrcholu před finanční krizí ({kdy('2007-10')}), byl pod vklady {dobaV(x.nominalne)},
                    po inflaci {dobaV(x.realne)}.{jednorazove2007 && <> Při jednorázovém nákupu ve stejném měsíci to bylo {dobaV(jednorazove2007.nominalne)},
                    po inflaci {dobaV(jednorazove2007.realne)}.</>}
                  </p>
                );
              })()}
              <p>
                Vyzkoušejte si vlastní začátek v <Link href="/stroj-casu" className="font-medium text-teal-700 hover:underline">Korunovém stroji času</Link>.
              </p>
            </section>

            <section className="mt-8 text-[15px] text-slate-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Co si z toho vzít</h2>
              <p><strong>Akcie jsou na peníze, které nebudete potřebovat roky.</strong> I v historii, kterou známe, bylo možné být v minusu přes deset let.</p>
              <p><strong>Rezerva a dluhopisy kupují klid.</strong> Vyvážené portfolio padalo méně a z krize 2008 se vrátilo dřív. Peníze na příští rok patří do{' '}
                <Link href="/nouzova-rezerva" className="font-medium text-teal-700 hover:underline">rezervy</Link>, ne do akcií.</p>
              <p><strong>Nejhorší případy jsou vzácné, ale skutečné.</strong> Data neříkají, kdy přijde další – jen jak dlouho to v minulosti trvalo.</p>
            </section>

            <section className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ['/stroj-casu', 'Korunový stroj času', 'Kolik byste měli dnes, kdybyste začali dřív.'],
                ['/sp500-nebo-cely-svet', 'S&P 500, nebo celý svět?', 'Co vydělalo víc v korunách.'],
                ['/dca-vs-jednorazova', 'Naráz, nebo postupně?', 'Jednorázová investice proti pravidelné.'],
                ['/backtest', 'Backtest portfolia', 'Vlastní složení na historických datech v Kč.'],
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
                Měsíční hodnoty (konec měsíce) z ETF SPY (S&amp;P 500), VT (celý svět, index FTSE Global All Cap – od 7/2008; dříve, kdy fond nebyl,
                aproximace 60 % S&amp;P 500 + 40 % fond VGTSX se světem mimo USA) a AGG (dluhopisy) – s reinvesticí dividend, po poplatcích fondů, před daní, převedeno do korun denním kurzem, roční vyvažování.
                Nákup na začátku měsíce. Inflace: index spotřebitelských cen ČSÚ (měsíčně od 2015, dříve z ročních průměrů);
                poslední zveřejněný měsíc je {kdy(CPI_LAST_MONTH)}, za další měsíce inflaci zatím nezapočítáváme. Propady uvnitř měsíce se neprojeví.
                Ověřeno nezávisle z ročních výnosů S&amp;P 500 (S&amp;P Dow Jones Indices), kurzů ČNB a míry inflace ČSÚ.
                Minulé výnosy nezaručují budoucí.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function sp500UsdText(m: number | null) {
  return doba(m);
}

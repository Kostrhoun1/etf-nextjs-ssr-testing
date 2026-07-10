import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Globe,
  Landmark, Scale, ShieldCheck, HelpCircle, Building2, Sprout, Layers,
  CheckCircle2, BookOpen, MapPin,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Světové ETF: MSCI World vs FTSE All-World vs ACWI vs S&P 500',
  description:
    'Který světový index vybrat? Přehledně vysvětlíme, které indexy obsahují emerging markets a které jen rozvinuté trhy, kolik mají firem a jaký podíl USA – s příklady konkrétních ETF. Srozumitelně a v korunách.',
  alternates: { canonical: '/svetove-etf-indexy' },
  openGraph: {
    title: 'Světové ETF: MSCI World vs FTSE All-World vs ACWI vs S&P 500',
    description:
      'Které světové indexy obsahují emerging markets a které ne, kolik firem drží a jaký mají podíl USA – s příklady ETF. Vzdělávací a nezávislé.',
    url: 'https://etfpruvodce.cz/svetove-etf-indexy',
    type: 'article',
  },
};

/* Ověřeno u MSCI (index factsheets) a FTSE Russell/LSEG, stav 2026.
   Počty firem a podíl USA jsou orientační – v čase se mění. */
type Row = {
  index: string;
  dev: string;
  em: 'ano' | 'ne';
  emNote?: string;
  small: boolean;
  firms: string;
  usa: string;
  etf: string;
  filter?: string; // kanonický label pro proklik do /srovnani?index=… (musí odpovídat datům)
};
const ROWS: Row[] = [
  { index: 'S&P 500', dev: 'jen USA', em: 'ne', small: false, firms: '500', usa: '100 %', etf: 'CSPX, VUAA', filter: 'S&P 500' },
  { index: 'MSCI World', dev: '23 rozvinutých zemí', em: 'ne', small: false, firms: '~1 300', usa: '~71 %', etf: 'IWDA, SWDA', filter: 'MSCI World' },
  { index: 'FTSE Developed', dev: 'rozvinuté trhy', em: 'ne', small: false, firms: '~2 000', usa: '~70 %', etf: 'VHVG', filter: 'FTSE Developed World' },
  { index: 'MSCI ACWI', dev: '23 rozvinutých', em: 'ano', emNote: '~12 %', small: false, firms: '~2 500', usa: '~63 %', etf: 'SSAC, ISAC', filter: 'MSCI ACWI' },
  { index: 'FTSE All-World', dev: 'rozvinuté trhy', em: 'ano', emNote: '~10 %', small: false, firms: '~4 300', usa: '~60 %', etf: 'VWCE, VWRL', filter: 'FTSE All-World' },
  { index: 'FTSE Global All Cap', dev: 'rozvinuté trhy', em: 'ano', emNote: '~10 %', small: true, firms: '~9 000', usa: '~60 %', etf: 'prakticky VWCE' },
];

export default async function SvetoveEtfIndexy() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const faqs = [
    {
      q: 'Který světový index obsahuje emerging markets?',
      a: 'Rozvíjející se trhy (emerging markets) obsahují indexy MSCI ACWI, FTSE All-World a FTSE Global All Cap – u těch máte celý svět včetně Číny, Indie, Tchaj-wanu apod. Naopak MSCI World a FTSE Developed drží jen rozvinuté trhy (emerging markets v nich NEJSOU) a S&P 500 je pouze 500 amerických firem.',
    },
    {
      q: 'Jaký je rozdíl mezi MSCI World a FTSE All-World?',
      a: 'MSCI World obsahuje jen rozvinuté trhy (~23 zemí, ~1 300 firem, žádné emerging markets). FTSE All-World přidává i rozvíjející se trhy – drží zhruba 4 300 firem z rozvinutých i emerging trhů. Zjednodušeně: FTSE All-World = MSCI World + emerging markets. Nejznámější ETF na FTSE All-World je VWCE, na MSCI World třeba IWDA.',
    },
    {
      q: 'Je lepší MSCI ACWI, nebo FTSE All-World?',
      a: 'Oba pokrývají rozvinuté i rozvíjející se trhy a jsou si velmi podobné. Liší se detailem: FTSE All-World drží víc firem (~4 300 vs ~2 500) a zařazuje Jižní Koreu do emerging trhů, zatímco MSCI ji řadí mezi rozvinuté. V praxi jde o drobné rozdíly – důležitější je nízký poplatek konkrétního ETF.',
    },
    {
      q: 'Stačí mi jen S&P 500, nebo mám jít do celého světa?',
      a: 'S&P 500 je 500 amerických firem – historicky skvělá výkonnost, ale veškeré vejce v jednom (americkém) koši. Celosvětový index (MSCI World / FTSE All-World) rozloží riziko napříč zeměmi a měnami. Neexistuje jediná správná odpověď; celosvětový přístup je diverzifikovanější, S&P 500 sází na dominanci USA.',
    },
    {
      q: 'Mám do portfolia zařadit emerging markets?',
      a: 'Emerging markets přidávají diverzifikaci a expozici na rychle rostoucí ekonomiky, ale nesou vyšší riziko a v posledních letech zaostávaly za USA. V celosvětovém indexu tvoří jen ~10 %, takže portfoliem nezahýbou dramaticky. Kdo chce mít „celý svět", volí index s emerging markets (ACWI / All-World); kdo věří hlavně rozvinutým trhům, zůstane u MSCI World.',
    },
    {
      q: 'Poznám podle názvu ETF, jaký index sleduje?',
      a: 'Většinou ano – v názvu bývá přímo „MSCI World", „FTSE All-World", „MSCI ACWI" nebo „S&P 500". V našem srovnávači navíc u každého fondu vidíte sledovaný index a můžete podle něj filtrovat.',
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Světové ETF a jejich indexy', item: 'https://etfpruvodce.cz/svetove-etf-indexy' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <span className="text-slate-600">Světové ETF a jejich indexy</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Globe className="w-3.5 h-3.5" /> Vzdělávací pilíř
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Světové ETF: který index vybrat?
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              MSCI World, FTSE All-World, ACWI, S&amp;P 500 – „světový" znamená u každého něco jiného. Konečně{' '}
              <strong className="text-white">přehledně</strong>: které indexy obsahují emerging markets a které jen
              rozvinuté trhy, kolik drží firem a jaký mají podíl USA – s příklady konkrétních ETF.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="#tabulka" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Scale className="w-4 h-4" /> Srovnávací tabulka indexů
              </Link>
              <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <TrendingUp className="w-4 h-4" /> Filtrovat ETF podle indexu
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Data z MSCI a FTSE Russell</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* ÚVOD */}
        <section className="pb-9">
          <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed space-y-3">
            <p>
              Rozhodli jste se pro „jeden světový ETF" a najednou koukáte na džungli názvů. Háček je v tom, že{' '}
              <strong className="text-slate-900">slovo „světový" každý index chápe jinak</strong>: některé drží opravdu
              celý svět včetně Číny a Indie, jiné jen rozvinuté trhy a S&amp;P 500 vůbec není světový – je čistě americký.
            </p>
            <p>
              Nejčastější zádrhel: <strong className="text-slate-900">obsahuje ten index rozvíjející se trhy (emerging
              markets), nebo ne?</strong> Začneme přesně tím.
            </p>
          </div>
        </section>

        {/* 1. HLAVNÍ OTÁZKA: EMERGING MARKETS ANO/NE */}
        <section className="pb-10">
          <SectionHead title="Hlavní otázka: obsahuje to emerging markets?" desc="Podle tohoto se světové indexy dělí na dva tábory. Rozdíl je zhruba 10 % portfolia – expozice na Čínu, Indii, Tchaj-wan a další rozvíjející se ekonomiky." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 mb-3"><Globe className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Celý svět (s emerging markets)</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Rozvinuté <strong className="text-slate-800">i</strong> rozvíjející se trhy. Nejširší diverzifikace.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> MSCI ACWI</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> FTSE All-World <span className="text-xs text-slate-400">(VWCE)</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> FTSE Global All Cap <span className="text-xs text-slate-400">(i small caps)</span></li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 mb-3"><Building2 className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Jen rozvinuté trhy (bez emerging)</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Vyspělé ekonomiky (hlavně USA, Evropa, Japonsko). <strong className="text-slate-800">Emerging markets tu chybí.</strong>
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li className="flex items-center gap-2"><span className="w-4 text-center text-slate-400 shrink-0">•</span> MSCI World <span className="text-xs text-slate-400">(IWDA)</span></li>
                <li className="flex items-center gap-2"><span className="w-4 text-center text-slate-400 shrink-0">•</span> FTSE Developed</li>
                <li className="flex items-center gap-2"><span className="w-4 text-center text-slate-400 shrink-0">•</span> S&amp;P 500 <span className="text-xs text-slate-400">(jen USA – ani celé rozvinuté)</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. SROVNÁVACÍ TABULKA */}
        <section id="tabulka" className="pb-10 scroll-mt-16">
          <SectionHead title="Srovnávací tabulka indexů" desc="Od nejužšího (S&P 500) po nejširší (Global All Cap). Počty firem a podíl USA jsou orientační a v čase se mění." />
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Index</th>
                  <th className="py-3 px-4 text-left font-medium">Rozvinuté</th>
                  <th className="py-3 px-4 text-center font-medium">Emerging</th>
                  <th className="py-3 px-4 text-center font-medium">Small caps</th>
                  <th className="py-3 px-4 text-right font-medium">Firem</th>
                  <th className="py-3 px-4 text-right font-medium">Podíl USA</th>
                  <th className="py-3 px-4 text-left font-medium">Příklad ETF</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.index} className="border-b border-slate-100 last:border-0 align-top">
                    <td className="py-3 px-4 font-semibold">
                      {r.filter
                        ? <Link href={`/srovnani?index=${encodeURIComponent(r.filter)}`} className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 hover:underline" title={`Zobrazit ${r.index} fondy ve srovnávači`}>{r.index}<ArrowRight className="w-3.5 h-3.5 opacity-60" /></Link>
                        : <span className="text-slate-900">{r.index}</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.dev}</td>
                    <td className="py-3 px-4 text-center">
                      {r.em === 'ano'
                        ? <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">✓ {r.emNote && <span className="text-xs text-slate-400">{r.emNote}</span>}</span>
                        : <span className="text-slate-300">✗</span>}
                    </td>
                    <td className="py-3 px-4 text-center">{r.small ? <span className="text-emerald-700 font-medium">✓</span> : <span className="text-slate-300">✗</span>}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-700">{r.firms}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-700">{r.usa}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{r.etf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            <strong className="text-slate-700">Klikněte na název indexu</strong> → otevře se srovnávač s vyfiltrovanými
            fondy daného indexu (poplatky a výnosy v korunách). Tickery ETF jsou příklady nejznámějších fondů (existují i další).
          </p>
        </section>

        {/* 3. DEEP DIVE */}
        <section className="pb-10">
          <SectionHead title="Jednotlivé indexy podrobně" desc="Co přesně dostanete, když si vyberete kterýkoli z hlavních světových indexů." />
          <div className="space-y-3">
            {([
              [Landmark, 'S&P 500 – jen USA', '500 největších amerických firem. Není to světový index, ale nejsledovanější akciový benchmark světa. Skvělá historická výkonnost, tažená technologiemi, ale veškerá expozice v jedné zemi a jedné měně. Příklady: CSPX, VUAA.'],
              [Building2, 'MSCI World / FTSE Developed – rozvinuté trhy', 'Zhruba 23 vyspělých ekonomik (USA, Evropa, Japonsko, Kanada, Austrálie…), dohromady ~1 300–2 000 firem. Emerging markets NEobsahují. USA v nich váží kolem 70 %. Nejpopulárnější volba pro ty, kdo věří hlavně rozvinutému světu. Příklady: IWDA, SWDA, VHVG.'],
              [Globe, 'MSCI ACWI / FTSE All-World – celý svět', 'Rozvinuté i rozvíjející se trhy v jednom fondu (~2 500–4 300 firem). Emerging markets tvoří zhruba 10–12 %. „Kup jeden fond a máš celý svět." Nejčastější volba pro pasivního dlouhodobého investora. Příklady: VWCE, VWRL (FTSE), SSAC/ISAC (MSCI).'],
              [Layers, 'FTSE Global All Cap / MSCI ACWI IMI – úplně všechno', 'Rozvinuté + emerging + navíc malé firmy (small caps) – klidně přes 9 000 titulů. Nejúplnější záběr trhu. Rozdíl proti All-World je ale malý (small caps váží málo), proto většině stačí běžný all-world fond.'],
            ] as [typeof Globe, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 shrink-0"><Icon className="w-5 h-5" /></span>
                <div>
                  <p className="font-semibold text-slate-900">{t}</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. EMERGING MARKETS ANO/NE */}
        <section className="pb-10">
          <SectionHead title="Emerging markets: ano, nebo ne?" desc="Nejčastější dilema. Krátce a bez ideologie – argumenty pro obě strany." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="font-semibold text-slate-900 flex items-center gap-2"><Sprout className="w-4 h-4 text-emerald-600" /> Pro zařazení</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600 leading-relaxed list-disc pl-4">
                <li>Diverzifikace napříč více ekonomikami a měnami.</li>
                <li>Expozice na rychle rostoucí trhy (Indie, jihovýchodní Asie).</li>
                <li>„Celý svět" bez sázky na to, kdo poroste příště.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="font-semibold text-slate-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-600" /> Proti / na co pozor</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600 leading-relaxed list-disc pl-4">
                <li>Vyšší kolísavost a politické riziko.</li>
                <li>V posledních letech zaostávaly za USA.</li>
                <li>V celosvětovém indexu váží jen ~10 % – dopad je omezený.</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Neexistuje jediná správná odpověď. Kdo chce „celý svět" a nechce nic řešit, volí index s emerging markets
            (ACWI / All-World). Kdo věří hlavně rozvinutým trhům, zůstane u MSCI World.
          </p>
        </section>

        {/* 5. JAK SE ROZHODNOUT */}
        <section className="pb-10">
          <SectionHead title="Jak se rozhodnout (rychlé vodítko)" desc="Podle toho, co od jednoho fondu čekáte." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([
              ['Chci celý svět a klid', 'FTSE All-World nebo MSCI ACWI (VWCE, SSAC)'],
              ['Věřím hlavně rozvinutým trhům', 'MSCI World (IWDA, SWDA)'],
              ['Sázím na USA', 'S&P 500 (CSPX, VUAA)'],
              ['Maximální záběr včetně malých firem', 'FTSE Global All Cap / ACWI IMI'],
            ] as [string, string][]).map(([q, a]) => (
              <div key={q} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900 leading-snug">{q}</p>
                <p className="text-xs text-teal-700 mt-1.5 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Najděte konkrétní fond" desc="Filtrujte v srovnávači přímo podle sledovaného indexu a porovnejte poplatky i výnosy v korunách." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/srovnani', 'Srovnávač ETF', 'Filtr podle indexu, TER a výnosu v Kč', Scale],
              ['/nejlepsi-etf/nejlepsi-celosvetove-etf', 'Nejlepší celosvětové ETF', 'Vybrané all-world fondy', Globe],
              ['/nejlepsi-etf/nejlepsi-msci-world-etf', 'Nejlepší MSCI World ETF', 'Rozvinuté trhy', Building2],
              ['/nejlepsi-etf/nejlepsi-sp500-etf', 'Nejlepší S&P 500 ETF', 'Americké velké firmy', Landmark],
              ['/akumulacni-vs-distribucni-etf', 'Akumulační vs. distribuční', 'Který typ výplaty zvolit', TrendingUp],
              ['/kolik-vydelaly-etf', 'Kolik ETF reálně vydělaly', 'Výnos světového indexu v Kč přes krize', TrendingUp],
              ['/portfolio-strategie', 'Modelová portfolia', 'Jak fond zasadit do portfolia', BookOpen],
            ] as [string, string, string, typeof Wallet][]).map(([href, label, desc, Icon]) => (
              <Link key={href} href={href} className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0 group-hover:bg-teal-100 transition-colors"><Icon className="w-4 h-4" /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900 group-hover:text-teal-700">{label}</span>
                  <span className="block text-xs text-slate-500 leading-relaxed">{desc}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-700 shrink-0 ml-auto" />
              </Link>
            ))}
          </div>
        </section>

        {/* 7. FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky o světových indexech" />
          <div className="space-y-2">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-lg border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <HelpCircle className="w-4 h-4 text-teal-700 shrink-0" /> {f.q}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička */}
        <section className="pb-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Obsah tvoříme nezávisle a nekomerčně – bez provizí a placeného pořadí.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-start gap-1.5"><Database className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Zdroje: MSCI (index factsheets), FTSE Russell / LSEG. Počty firem a podíl USA jsou orientační a v čase se mění. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Vzdělávací obsah, není investičním doporučením.</p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="pb-12">
          <InvestmentDisclaimer />
        </section>
      </main>

    </div>
  );
}

import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Globe, Landmark, Scale, ShieldCheck, HelpCircle, Building2, Sprout, Layers, CheckCircle2, BookOpen, MapPin, ChevronDown } from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import ResponzivniTabulka, { bunky } from '@/components/design-preview/ResponzivniTabulka';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { titulek } from '@/lib/seoTitulek';
import { upravenoDlouze, clanekSchema, ogObrazek } from '@/lib/redakce';
import SouvisejiciZebricky from '@/components/design-preview/SouvisejiciZebricky';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: titulek('Světové ETF: MSCI World vs FTSE All-World vs ACWI vs S&P 500'),
  description:
    'Který světový index vybrat? Které indexy obsahují rozvíjející se trhy a které jen vyspělé, kolik mají firem a jaký podíl USA – s příklady konkrétních ETF.',
  alternates: { canonical: '/svetove-etf-indexy' },
  openGraph: {
    title: 'Světové ETF: MSCI World vs FTSE All-World vs ACWI vs S&P 500',
    description:
      'Které světové indexy obsahují emerging markets a které ne, kolik firem drží a jaký mají podíl USA – s příklady ETF. Vzdělávací a nezávislé.',
    url: 'https://etfpruvodce.cz/svetove-etf-indexy',
    images: [ogImage({ title: 'Světové ETF: MSCI World vs FTSE All-World vs ACWI vs S&P 500', eyebrow: 'Průvodce indexy' })],
    type: 'article',
  },
};

/* Počty firem, podíl USA a podíl EM = index factsheety k 30. 9. 2026 (ověřeno 22. 10. 2026):
   MSCI World a ACWI: msci.com/documents/10199/178e6643-… a …/a71b65b5-… (Constituents, Country weights;
   EM v ACWI = tržní kap. MSCI EM 12,28 bil. / ACWI 102,70 bil. USD). FTSE All-World (issueName=AWORLDS)
   a FTSE Global All Cap (issueName=GEISLMS) na research.ftserussell.com – tabulka zemí a Index Characteristics;
   FTSE Developed = sloupec „FTSE Developed“ ve factsheetu All-World (USA 65,90 / 95,22 bil. USD).
   Při změně čísel posunout DATUM_INDEXU. */
const DATUM_INDEXU = '30. 9. 2026';
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
  { index: 'S&P 500', dev: 'jen USA', em: 'ne', small: false, firms: '500', usa: '100 %¹', etf: 'CSPX, VUAA', filter: 'S&P 500' },
  { index: 'MSCI World', dev: '23 rozvinutých zemí', em: 'ne', small: false, firms: '1 249', usa: '72,9 %', etf: 'IWDA, SWDA', filter: 'MSCI World' },
  { index: 'FTSE Developed', dev: 'rozvinuté trhy', em: 'ne', small: false, firms: '1 904', usa: '69,2 %', etf: 'VHVG', filter: 'FTSE Developed World' },
  { index: 'MSCI ACWI', dev: '23 rozvinutých', em: 'ano', emNote: '12,0 %', small: false, firms: '2 414', usa: '64,2 %', etf: 'SSAC, ISAC', filter: 'MSCI ACWI' },
  { index: 'FTSE All-World', dev: 'rozvinuté trhy', em: 'ano', emNote: '10,0 %', small: false, firms: '4 204', usa: '62,3 %', etf: 'VWCE, VWRL', filter: 'FTSE All-World' },
  // VWCE NENÍ Global All Cap (je to FTSE All-World). UCITS fond na Global All Cap: Vanguard VALL/VGLA (IE000VAHT5T0)
  // od 18. 8. 2026 (factsheet Vanguard); v USA fond VT (pro drobné investory v EU obvykle nedostupný – chybí KID).
  { index: 'FTSE Global All Cap', dev: 'rozvinuté trhy', em: 'ano', small: true, firms: '10 222', usa: '62,4 %', etf: 'VALL/VGLA (od 8/2026), v USA VT' },
];

export default async function SvetoveEtfIndexy() {
  const upraveno = upravenoDlouze('/svetove-etf-indexy'); // datum úpravy TEXTU (redakce.ts), ne den dat fondů

  const faqs = [
    {
      q: 'Který světový index obsahuje emerging markets?',
      a: 'Rozvíjející se trhy (emerging markets) obsahují indexy MSCI ACWI, FTSE All-World a FTSE Global All Cap – u těch máte celý svět včetně Číny, Indie, Tchaj-wanu apod. Naopak MSCI World a FTSE Developed drží jen rozvinuté trhy (emerging markets v nich NEJSOU) a S&P 500 je pouze 500 amerických firem.',
    },
    {
      q: 'Jaký je rozdíl mezi MSCI World a FTSE All-World?',
      a: 'MSCI World obsahuje jen rozvinuté trhy (23 zemí, 1 249 firem k 30. 9. 2026, žádné emerging markets). FTSE All-World přidává i rozvíjející se trhy – drží 4 204 firem z rozvinutých i emerging trhů. Zjednodušeně: FTSE All-World = MSCI World + emerging markets. Nejznámější ETF na FTSE All-World je VWCE, na MSCI World třeba IWDA.',
    },
    {
      q: 'Je lepší MSCI ACWI, nebo FTSE All-World?',
      a: 'Oba pokrývají rozvinuté i rozvíjející se trhy a jsou si velmi podobné. Liší se detailem: FTSE All-World drží víc firem (4 204 vs 2 414 k 30. 9. 2026) a Jižní Koreu řadí FTSE mezi rozvinuté trhy, zatímco MSCI mezi rozvíjející se (emerging). V praxi jde o drobné rozdíly – důležitější je nízký poplatek konkrétního ETF.',
    },
    {
      q: 'Stačí mi jen S&P 500, nebo mám jít do celého světa?',
      a: 'S&P 500 je 500 amerických firem – historicky skvělá výkonnost, ale veškeré vejce v jednom (americkém) koši. Celosvětový index (MSCI World / FTSE All-World) rozloží riziko napříč zeměmi a měnami. Neexistuje jediná správná odpověď; celosvětový přístup je diverzifikovanější, S&P 500 sází na dominanci USA.',
    },
    {
      q: 'Mám do portfolia zařadit emerging markets?',
      a: 'Emerging markets přidávají diverzifikaci a expozici na rychle rostoucí ekonomiky, ale nesou vyšší riziko a v posledních letech zaostávaly za USA. V celosvětovém indexu tvoří jen 10–12 % (FTSE All-World 10,0 %, MSCI ACWI 12,0 % k 30. 9. 2026), takže portfoliem nezahýbou dramaticky. Kdo chce mít „celý svět“, volí index s emerging markets (ACWI / All-World); kdo věří hlavně rozvinutým trhům, zůstane u MSCI World.',
    },
    {
      q: 'Poznám podle názvu ETF, jaký index sleduje?',
      a: 'Většinou ano – v názvu bývá přímo „MSCI World“, „FTSE All-World“, „MSCI ACWI“ nebo „S&P 500“. V našem srovnávači navíc u každého fondu vidíte sledovaný index a můžete podle něj filtrovat.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clanekSchema({ cesta: '/svetove-etf-indexy', nadpis: 'Světové ETF: který index vybrat?', popis: typeof metadata.description === 'string' ? metadata.description : undefined, obrazek: ogObrazek(metadata) })) }} />

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
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
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
              MSCI World, FTSE All-World, ACWI, S&amp;P 500 – „světový“ znamená u každého něco jiného. Konečně{' '}
              <strong className="text-white">přehledně</strong>: které indexy obsahují emerging markets a které jen
              rozvinuté trhy, kolik drží firem a jaký mají podíl USA – s příklady konkrétních ETF.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="#tabulka" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
                <Scale className="w-4 h-4" /> Srovnávací tabulka indexů
              </Link>
              <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <TrendingUp className="w-4 h-4" /> Filtrovat ETF podle indexu
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Data z MSCI a FTSE Russell</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Aktualizováno {upraveno}</span>
            </div>
          </div>
        </section>

        {/* ÚVOD */}
        <section className="pb-9">
          <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed space-y-3">
            <p>
              Rozhodli jste se pro „jeden světový ETF“ a najednou koukáte na džungli názvů. Háček je v tom, že{' '}
              <strong className="text-slate-900">slovo „světový“ každý index chápe jinak</strong>: některé drží opravdu
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
          <SectionHead title="Srovnávací tabulka indexů" desc={`Od nejužšího (S&P 500) po nejširší (Global All Cap). Počty firem a podíly k ${DATUM_INDEXU} podle factsheetů MSCI a FTSE Russell – v čase se mění.`} />
          <ResponzivniTabulka
            popis="Srovnání světových akciových indexů"
            tabulkaClassName="min-w-[46rem]"
            sloupce={[
              { nazev: 'Index' }, { nazev: 'Rozvinuté', zarovnani: 'left' }, { nazev: 'Emerging', zarovnani: 'center', nazevKarta: 'Rozvíjející se trhy' },
              { nazev: 'Small caps', zarovnani: 'center', nazevKarta: 'Malé firmy' }, { nazev: 'Firem' }, { nazev: 'Podíl USA' }, { nazev: 'Příklad ETF', zarovnani: 'left' },
            ]}
            radky={ROWS.map((r) => ({
              key: r.index,
              bunky: bunky(
                r.filter
                  ? <Link href={`/srovnani?index=${encodeURIComponent(r.filter)}`} className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800 hover:underline" title={`Zobrazit ${r.index} fondy ve srovnávači`}>{r.index}<ArrowRight className="w-3.5 h-3.5 opacity-60" /></Link>
                  : <span className="font-semibold text-slate-900">{r.index}</span>,
                <span className="text-slate-600">{r.dev}</span>,
                r.em === 'ano'
                  ? <span className="inline-flex items-center gap-1 font-medium text-emerald-700">✓ {r.emNote && <span className="text-xs text-slate-400">{r.emNote}</span>}</span>
                  : <span className="text-slate-300">✗</span>,
                r.small ? <span className="font-medium text-emerald-700">✓</span> : <span className="text-slate-300">✗</span>,
                r.firms,
                r.usa,
                <span className="text-xs text-slate-500">{r.etf}</span>,
              ),
            }))}
          />
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            <strong className="text-slate-700">Klikněte na název indexu</strong> → otevře se srovnávač s vyfiltrovanými
            fondy daného indexu (poplatky a výnosy v korunách). Tickery ETF jsou příklady nejznámějších fondů (existují i další).
          </p>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-3xl">
            ¹ Podle pravidel S&amp;P jsou všechny firmy v indexu americké (hlavní kotace v USA, většina majetku a tržeb v USA).
            Několik z nich je ale právně registrovaných jinde – hlavně v Irsku (např. Linde, Accenture) –, proto data fondů
            podle země sídla uvádějí u S&amp;P 500 USA kolem 97 % (tak to ukazuje i srovnání VWCE vs CSPX).
          </p>
        </section>

        {/* 3. DEEP DIVE */}
        <section className="pb-10">
          <SectionHead title="Jednotlivé indexy podrobně" desc="Co přesně dostanete, když si vyberete kterýkoli z hlavních světových indexů." />
          <div className="space-y-3">
            {([
              [Landmark, 'S&P 500 – jen USA', '500 největších amerických firem. Není to světový index, ale nejsledovanější akciový benchmark světa. Skvělá historická výkonnost, tažená technologiemi, ale veškerá expozice v jedné zemi a jedné měně. Příklady: CSPX, VUAA.'],
              [Building2, 'MSCI World / FTSE Developed – rozvinuté trhy', 'Zhruba 23 vyspělých ekonomik (USA, Evropa, Japonsko, Kanada, Austrálie…), dohromady 1 249 (MSCI) a 1 904 (FTSE) firem. Emerging markets NEobsahují. USA v nich váží 69–73 % (k 30. 9. 2026). Nejpopulárnější volba pro ty, kdo věří hlavně rozvinutému světu. Příklady: IWDA, SWDA, VHVG.'],
              [Globe, 'MSCI ACWI / FTSE All-World – celý svět', 'Rozvinuté i rozvíjející se trhy v jednom fondu (2 414 firem MSCI ACWI, 4 204 FTSE All-World k 30. 9. 2026). Emerging markets tvoří 10–12 %. „Kup jeden fond a máš celý svět.“ Nejčastější volba pro pasivního dlouhodobého investora. Příklady: VWCE, VWRL (FTSE), SSAC/ISAC (MSCI).'],
              [Layers, 'FTSE Global All Cap / MSCI ACWI IMI – úplně všechno', 'Rozvinuté + emerging + navíc malé firmy (small caps) – FTSE Global All Cap 10 222 titulů k 30. 9. 2026, z toho malé firmy 8,7 % hodnoty indexu. Nejúplnější záběr trhu. Rozdíl proti All-World je ale malý, proto většině stačí běžný all-world fond. Příklady: VALL/VGLA (Vanguard, FTSE Global All Cap, od 8/2026), SPYI (MSCI ACWI IMI).'],
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
                <li>„Celý svět“ bez sázky na to, kdo poroste příště.</li>
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
            Neexistuje jediná správná odpověď. Kdo chce „celý svět“ a nechce nic řešit, volí index s emerging markets
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
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" aria-hidden="true" />
                </summary>
                <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Žebříčky k tématu (SEO audit 6b – prolinkování článků a žebříčků) */}
        <SouvisejiciZebricky nadpis="Žebříčky k tématu" slugy={['nejlepsi-celosvetove-etf', 'nejlepsi-msci-world-etf', 'nejlepsi-sp500-etf', 'nejlepsi-emerging-markets-etf', 'nejlepsi-etf-2026']} />

        {/* E-E-A-T patička */}
        <section className="pb-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s více než 12 lety praxe v českém bankovnictví. Obsah tvoříme nezávisle a nekomerčně – bez provizí a placeného pořadí.{' '}
                  <Link href="/o-nas" className="text-teal-700 hover:underline">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-start gap-1.5"><Database className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Zdroje: MSCI (index factsheets), FTSE Russell / LSEG. Počty firem a podíly k {DATUM_INDEXU}, v čase se mění. Aktualizováno {upraveno}.</p>
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

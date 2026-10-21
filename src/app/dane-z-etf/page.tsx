import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins, Landmark, Scale, ShieldCheck, HelpCircle, Clock, Receipt, Percent, PiggyBank, CheckCircle2, AlertTriangle, BookOpen, ChevronDown } from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { upravenoDlouze, clanekSchema, ogObrazek, denCesky, datumUpravy } from '@/lib/redakce';
import SouvisejiciZebricky from '@/components/design-preview/SouvisejiciZebricky';
import KlicovaCisla from '@/components/design-preview/KlicovaCisla';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Daně z ETF v Česku: kdy platíte a kdy ne (2026)',
  // SEO audit kola 6: popisek ≤ 160 znaků s ověřenými fakty ze stránky (časový test, hodnotový test, dividendy 15 %,
  // oznámení nad 5 mil. Kč). Zrušený strop 40 mil. Kč v popisku NENÍ – platí jen jako změna od 2026 (sekce „Další pravidla“).
  description:
    'Daně z ETF 2026: zisk po 3 letech držby bez daně (časový test), prodeje do 100 000 Kč ročně osvobozené, dividendy 15 %, oznámení příjmů nad 5 mil. Kč.',
  alternates: { canonical: '/dane-z-etf' },
  openGraph: {
    title: 'Daně z ETF v Česku: kdy platíte a kdy ne (2026)',
    description:
      'Časový test 3 roky, hodnotový test 100 000 Kč, zisk při prodeji do 3 let 15 %, dividendy 15 % a oznámení nad 5 mil. Kč – s příkladem v korunách.',
    url: 'https://etfpruvodce.cz/dane-z-etf',
    images: [ogImage({ title: 'Daně z ETF v Česku: kdy platíte a kdy ne (2026)', eyebrow: 'Daně · 2026', stat: '0 Kč', statLabel: 'daň při prodeji po 3 letech' })],
    type: 'article',
  },
};

export default async function DaneZEtf() {
  const upraveno = upravenoDlouze('/dane-z-etf'); // datum úpravy TEXTU (redakce.ts), ne den dat fondů

  /* Modelový příklad v korunách (kolo 6: hero sliboval „v korunách“, příklad chyběl). Počítá se tady, ne natvrdo. */
  const kc = (v: number) => `${Math.round(v).toLocaleString('cs-CZ')}\u00a0Kč`;
  const PRIKLAD = { nakup: 200_000, prodej: 260_000, sazba: 0.15 };
  const zisk = PRIKLAD.prodej - PRIKLAD.nakup;
  const danDo3Let = zisk * PRIKLAD.sazba;
  /** 23 % platí pro část základu daně nad 36násobek průměrné mzdy (pro rok 2026: 36 × 48 967 Kč, NV 365/2025 Sb.). */
  const HRANICE_23 = 36 * 48_967;

  const faqs = [
    {
      q: 'Musím danit zisk z prodeje ETF?',
      a: 'Záleží na době držby a objemu. Pokud podíly držíte déle než 3 roky (časový test), je zisk z prodeje za splnění zákonných podmínek osvobozen. Osvobozeny jsou také drobné prodeje do 100 000 Kč příjmu za rok (hodnotový test). Jinak se zisk daní 15 % (část základu daně nad 36násobek průměrné mzdy 23 %). Od roku 2026 osvobození po časovém testu neomezuje žádný horní limit (strop 40 mil. Kč z roku 2025 byl pro cenné papíry zrušen). Jde o obecné shrnutí – konkrétní situaci ověřte u daňového poradce.',
    },
    {
      q: 'Jak funguje časový test u ETF?',
      a: 'Časový test znamená, že pokud mezi nákupem a prodejem cenného papíru uplynou více než 3 roky, je zisk z prodeje osvobozen od daně z příjmu (za splnění zákonných podmínek). Počítá se od nabytí konkrétních podílů k jejich prodeji – proto se u dlouhodobého investora, který nakupuje a drží, na většinu zisku daň nevztahuje.',
    },
    {
      q: 'Kolik je daň z dividend u ETF?',
      a: 'Vyplácené dividendy podléhají dani 15 %. U zahraničních fondů se řeší v daňovém přiznání s ohledem na smlouvy o zamezení dvojího zdanění. Akumulační fondy dividendy reinvestují uvnitř fondu, takže je investor neřeší v přiznání každý rok – to je pro dlouhodobé zhodnocení daňově jednodušší.',
    },
    {
      q: 'Co je hodnotový test do 100 000 Kč?',
      a: 'Pokud je váš celkový příjem (ne zisk) z prodeje cenných papírů za kalendářní rok do 100 000 Kč, je osvobozen bez ohledu na dobu držby. Hodí se pro drobné prodeje. Pozor: jde o příjem (tržbu), nikoli jen o zisk.',
    },
    {
      q: 'Co je DIP a jak snižuje daně?',
      a: 'DIP (dlouhodobý investiční produkt) je od roku 2024 režim, ve kterém si příspěvky můžete odečíst od základu daně – až 48 000 Kč ročně (společný limit s penzijním spořením, životním pojištěním a pojištěním dlouhodobé péče). Podmínkou je, že DIP trvá nejméně 120 měsíců a peníze vyberete nejdříve v roce, kdy vám bude 60 let; při předčasném výběru se odečtené částky dodaňují. Konkrétní podmínky a nabídku DIP ověřte u svého poskytovatele a daňového poradce.',
    },
    {
      q: 'Musím hlásit velký osvobozený příjem?',
      a: 'Ano, pokud osvobozený příjem (například z prodeje ETF po 3 letech) přesáhne 5 000 000 Kč. Oznámení se podává finančnímu úřadu do konce lhůty pro podání daňového přiznání za daný rok (§ 38v zákona o daních z příjmů). Za neoznámení hrozí pokuta 0,1 až 15 % z neoznámené částky (§ 38w).',
    },
    {
      q: 'Můžu si odečíst ztrátu z prodeje ETF?',
      a: 'Jen částečně. Ztrátu z prodeje cenného papíru, u kterého neplatí osvobození, lze v tomtéž roce započíst proti zdanitelnému zisku z prodeje jiných cenných papírů. Do dalších let se nepřevádí a proti jiným příjmům (např. mzdě) ji uplatnit nejde. Ztráta z osvobozeného prodeje se nezapočítává.',
    },
    {
      q: 'Jakým kurzem přepočítat nákup v eurech nebo dolarech?',
      a: 'Buď denním kurzem ČNB ke dni nákupu a prodeje, nebo jednotným kurzem, který za celý rok vyhlašuje Finanční správa. Za jedno zdaňovací období se používá jeden způsob, metody se nekombinují.',
    },
    {
      q: 'Danit ETF je složité – kde si to ověřím?',
      a: 'Tato stránka je vzdělávací shrnutí, ne daňové poradenství. Daňová pravidla se mění a každá situace má svá specifika. Před podáním přiznání se vyplatí ověřit aktuální znění zákona a poradit se s daňovým poradcem.',
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
      { '@type': 'ListItem', position: 2, name: 'Daně z ETF', item: 'https://etfpruvodce.cz/dane-z-etf' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clanekSchema({ cesta: '/dane-z-etf', nadpis: 'Daně z ETF v Česku: kdy platíte a kdy ne', popis: typeof metadata.description === 'string' ? metadata.description : undefined, obrazek: ogObrazek(metadata) })) }} />

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
          <span className="text-slate-600">Daně z ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Receipt className="w-3.5 h-3.5" /> Vzdělávací pilíř · aktuální pro rok 2026
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Daně z ETF v Česku: kdy platíte a kdy ne
            </h1>
            {/* Odpověď nahoře (SEO/GEO, kolo 6) – stejná fakta jako FAQ a karty níž (ověřeno, dane-etf-fakta-2026). */}
            <p data-odpoved="dane" className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Zisk z prodeje ETF je <strong className="text-white">bez daně</strong>, když podíly držíte déle než 3{'\u00a0'}roky
              (časový test), nebo když příjem z prodeje cenných papírů za rok nepřesáhne 100{'\u00a0'}000{'\u00a0'}Kč (hodnotový test).
              Jinak se zisk daní 15{'\u00a0'}% (část základu daně nad 36násobek průměrné mzdy 23{'\u00a0'}%), vyplacené dividendy 15{'\u00a0'}%. Osvobozený příjem nad 5{'\u00a0'}mil.{'\u00a0'}Kč
              za rok se oznamuje finančnímu úřadu. Níže příklad v korunách a odečet přes DIP.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="#priklad" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
                <Calculator className="w-4 h-4" /> Příklad v korunách
              </Link>
              <Link href="/kde-koupit" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Landmark className="w-4 h-4" /> Kde koupit ETF
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Vše v Kč</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Aktualizováno {upraveno}</span>
            </div>

            {/* Klíčová čísla – tři pravidla, která rozhodují o dani. Mobil: řádky (kolo 6: „100 000 Kč“ se ve třetině
                šířky lámalo a ikona u „Hodnotový test“ se smrskla). */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 max-w-2xl">
              {([
                [Clock, 'Časový test', '3 roky', 'pak je zisk z prodeje bez daně', 'text-emerald-400'],
                [Scale, 'Hodnotový test', '100\u00a0000\u00a0Kč', 'roční prodeje do limitu bez daně', 'text-white'],
                [Percent, 'Daň z dividend', '15\u00a0%', 'u distribučních ETF', 'text-white'],
              ] as [typeof Clock, string, string, string, string][]).map(([Icon, nazev, hodnota, popis, barva]) => (
                <div key={nazev} className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:block">
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400"><Icon className="w-3.5 h-3.5 shrink-0" /> {nazev}</span>
                    <span className="block text-xs text-slate-400 mt-0.5 sm:hidden">{popis}</span>
                  </span>
                  <p className={`sm:mt-1 text-lg md:text-xl font-bold tabular-nums whitespace-nowrap ${barva}`}>{hodnota}</p>
                  <p className="hidden sm:block text-xs text-slate-400 mt-0.5">{popis}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Klíčová pravidla k datu poslední kontroly zákona (SEO/GEO audit 6b) – s odkazy na znění zákona. */}
        <KlicovaCisla
          nadpis="Klíčová pravidla"
          datum={denCesky(datumUpravy('/dane-z-etf'))}
          radky={[
            { co: 'Časový test – zisk z prodeje bez daně', hodnota: 'po 3 letech', pozn: '§ 4 odst. 1 písm. u) ZDP' },
            { co: 'Hodnotový test – roční příjem z prodeje cenných papírů bez daně', hodnota: 'do 100 000 Kč', pozn: '§ 4 odst. 1 písm. t) ZDP' },
            { co: 'Daň ze zisku jinak', hodnota: '15 % / 23 %', pozn: '23 % z části základu nad 36násobek průměrné mzdy' },
            { co: 'Vyplacené dividendy (distribuční ETF)', hodnota: '15 %', pozn: 'uvádějí se v daňovém přiznání' },
            { co: 'Oznámení osvobozených příjmů finančnímu úřadu', hodnota: 'nad 5 mil. Kč', pozn: '§ 38v ZDP' },
            { co: 'Odpočet vkladů do DIP (společný limit)', hodnota: 'až 48 000 Kč ročně', pozn: '§ 15 odst. 6 ZDP' },
          ]}
          zdroje={[
            { href: 'https://www.zakonyprolidi.cz/cs/1992-586#p4-1-t', text: 'ZDP § 4 odst. 1 písm. t)' },
            { href: 'https://www.zakonyprolidi.cz/cs/1992-586#p4-1-u', text: 'ZDP § 4 odst. 1 písm. u)' },
            { href: 'https://www.zakonyprolidi.cz/cs/1992-586#p38v', text: 'ZDP § 38v' },
            { href: 'https://www.zakonyprolidi.cz/cs/1992-586#p15-6', text: 'ZDP § 15 odst. 6' },
          ]}
        />

        {/* UPOZORNĚNÍ – orientační charakter */}
        <section className="pb-8">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>Orientační shrnutí, ne daňové poradenství.</strong> Daňová pravidla se mění a každá situace má svá
              specifika. Před podáním přiznání ověřte aktuální znění zákona a případně se poraďte s daňovým poradcem.
            </p>
          </div>
        </section>

        {/* 1. DVĚ SITUACE */}
        <section className="pb-10">
          <SectionHead title="Dvě situace, kdy se daň vůbec řeší" desc="U ETF přicházejí na řadu daně jen ve dvou okamžicích. Ve zbytku času vaše portfolio jen roste – bez ročního papírování." />
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              [Coins, 'Prodej podílů (kapitálový zisk)', 'Když ETF prodáte se ziskem. Tady rozhoduje doba držby a objem – a právě sem míří časový i hodnotový test.'],
              [PiggyBank, 'Výplata dividend', 'Když fond vyplácí dividendy v hotovosti. Ty se daní 15 %. Akumulační fondy je řeší za vás uvnitř fondu.'],
            ] as [typeof Coins, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. ČASOVÝ TEST */}
        <section className="pb-10">
          <SectionHead title="Časový test: držte 3 roky a zisk je osvobozen" desc="Nejdůležitější pravidlo pro dlouhodobého investora – a hlavní důvod, proč se ETF vyplatí držet, ne překlápět." />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0"><Clock className="w-5 h-5" /></span>
              <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
                <p>
                  Pokud mezi <strong className="text-slate-900">nákupem a prodejem</strong> podílů uplynou{' '}
                  <strong className="text-slate-900">více než 3 roky</strong>, je zisk z prodeje za splnění zákonných
                  podmínek <strong className="text-emerald-700">osvobozen od daně z příjmu</strong>. Počítá se od nabytí
                  konkrétních podílů k jejich prodeji.
                </p>
                <p>
                  Pro disciplinovaného investora, který nakoupí široké ETF a nechá ho ležet, to znamená, že se na většinu
                  zisku daň nevztahuje. Čím méně zbytečně překlápíte, tím čistší je daňový výsledek.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HODNOTOVÝ TEST + PRODEJ DO 3 LET */}
        <section className="pb-10">
          <SectionHead title="Když prodáte dřív než za 3 roky" desc="Osvobození pro drobné prodeje – a kolik se platí, když neplatí ani jeden z testů." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Scale className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Hodnotový test: do 100{'\u00a0'}000{'\u00a0'}Kč za rok</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Je-li váš celkový <strong className="text-slate-800">příjem</strong> (tržba, ne jen zisk) z prodeje
                všech cenných papírů za kalendářní rok nejvýše <strong className="text-slate-800">100{'\u00a0'}000{'\u00a0'}Kč</strong>,
                je osvobozen bez ohledu na dobu držby. Hodí se pro drobné prodeje.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 mb-3"><Percent className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Prodej do 3 let nad limit: 15{'\u00a0'}% ze zisku</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Nesplníte-li ani jeden test, zisk (příjem minus nákupní cena a poplatky) se daní jako ostatní příjem
                sazbou <strong className="text-slate-800">15{'\u00a0'}%</strong>. Sazbou <strong className="text-slate-800">23{'\u00a0'}%</strong> se
                daní jen část celkového základu daně nad 36násobek průměrné mzdy – pro rok 2026 nad {kc(HRANICE_23)}.
              </p>
            </div>
          </div>
        </section>

        {/* PŘÍKLAD V KORUNÁCH – čísla spočtená v kódu */}
        <section id="priklad" className="pb-10 scroll-mt-20">
          <SectionHead title="Příklad v korunách" desc={`ETF koupené za ${kc(PRIKLAD.nakup)} prodáte za ${kc(PRIKLAD.prodej)}. Zisk je ${kc(zisk)}. Kolik z něj zaplatíte na dani?`} />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              ['Držíte déle než 3 roky', '0\u00a0Kč', `Časový test splněn – celý zisk ${kc(zisk)} je váš.`, 'text-emerald-700'],
              ['Prodáte do 3 let', kc(danDo3Let), `15\u00a0% ze zisku ${kc(zisk)}. Příjem z prodeje ${kc(PRIKLAD.prodej)} je nad limitem hodnotového testu. Zůstane vám ${kc(zisk - danDo3Let)}.`, 'text-slate-900'],
              ['Prodáte do 3 let jen část', '0\u00a0Kč', `Když za celý rok prodáte cenné papíry nejvýše za 100\u00a0000\u00a0Kč (příjem, ne zisk), platí hodnotový test.`, 'text-emerald-700'],
            ] as [string, string, string, string][]).map(([t, v, d, barva]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm font-medium text-slate-600">{t}</p>
                <p className={`mt-1 text-2xl font-bold tabular-nums whitespace-nowrap ${barva}`}>{v}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">daň · {d}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Zjednodušeno: bez poplatků brokera, nákup i prodej v korunách, sazba 15{'\u00a0'}% (bez 23{'\u00a0'}% u vysokých příjmů). Nákupy v eurech či dolarech se přepočítávají kurzem – viz níže.
          </p>
        </section>

        {/* 5. DIVIDENDY */}
        <section className="pb-10">
          <SectionHead title="Dividendy: 15 % a proč je akumulace jednodušší" desc="Druhá situace, kdy se daň objeví. Volba mezi akumulačním a distribučním fondem tu má přímý daňový dopad." />
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              [CheckCircle2, 'Akumulační fond (Acc)', 'Dividendy reinvestuje uvnitř fondu. Neřešíte je v přiznání každý rok a celý výnos se schová pod tříletý časový test. Pro dlouhodobé zhodnocení daňově čistší.', 'text-emerald-600 bg-emerald-50 border-emerald-100'],
              [Percent, 'Distribuční fond (Dist)', 'Vyplácí dividendy v hotovosti na účet. Ty se daní 15 %; u zahraničních fondů se řeší v přiznání s ohledem na smlouvy o zamezení dvojího zdanění.', 'text-teal-700 bg-teal-50 border-slate-200'],
            ] as [typeof CheckCircle2, string, string, string][]).map(([Icon, t, d, cls]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className={`flex items-center justify-center w-10 h-10 rounded-lg border mb-3 ${cls}`}><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <Link href="/akumulacni-vs-distribucni-etf" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800">
            Podrobně: Akumulační vs. distribuční ETF – který zvolit <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* 6. DIP */}
        <section className="pb-10">
          <SectionHead title="DIP: daňový odečet až 48 000 Kč ročně" desc="Od roku 2024 lze do ETF investovat i v režimu dlouhodobého investičního produktu se státní daňovou podporou." />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 shrink-0"><Landmark className="w-5 h-5" /></span>
              <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
                <p>
                  <strong className="text-slate-900">DIP (dlouhodobý investiční produkt)</strong> umožňuje odečíst
                  příspěvky od základu daně – až <strong className="text-slate-900">48 000 Kč ročně</strong> (společný
                  limit s penzijním spořením, životním pojištěním a pojištěním dlouhodobé péče). Při 15% dani to znamená až 7 200 Kč zpět ročně.
                </p>
                <p>
                  Podmínkou je, že DIP trvá <strong className="text-slate-900">nejméně 120 měsíců</strong> a peníze vyberete
                  <strong className="text-slate-900"> nejdříve v roce, kdy vám bude 60 let</strong>; při předčasném výběru se odečtené částky dodaňují. Zda a jaké ETF lze v DIP držet, závisí na konkrétním
                  poskytovateli – ověřte si nabídku i podmínky předem.
                </p>
                <p>
                  Kolik reálně dostanete zpět, pravidlo 120/60, příspěvek zaměstnavatele i to, kdy je DIP výhodnější
                  než běžný účet s ETF, rozebírá samostatný průvodce{' '}
                  <Link href="/dip" className="text-teal-700 hover:underline">DIP: vyplatí se dlouhodobý investiční produkt?</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DALŠÍ PRAVIDLA – kurz, ztráty, oznámení, strop 40 mil. jen jako změna */}
        <section className="pb-10">
          <SectionHead title="Další pravidla, která se hodí znát" desc="Přepočet měn, ztráty, povinné oznámení velkých příjmů a jedna změna od roku 2026." />
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              [Coins, 'Přepočet z eur a dolarů', 'Příjmy i nákupní cenu v cizí měně přepočítáte na koruny buď denním kurzem ČNB ke dni obchodu, nebo jednotným (ročním) kurzem, který vyhlašuje Finanční správa. Za celý rok jedním způsobem – metody se nekombinují (§ 38 zákona o daních z příjmů).'],
              [Scale, 'Ztráty a zisky v jednom roce', 'Ztrátu z prodeje cenného papíru, který nesplnil časový test, lze započíst proti zdanitelnému zisku z prodeje jiných cenných papírů v tomtéž roce. Do dalších let se nepřevádí a proti mzdě ji odečíst nejde.'],
              [AlertTriangle, 'Osvobozený příjem nad 5 mil. Kč se musí oznámit', 'I osvobozený příjem (třeba z prodeje po 3 letech) nad 5\u00a0000\u00a0000\u00a0Kč musíte oznámit finančnímu úřadu do konce lhůty pro podání přiznání (§ 38v). Za neoznámení hrozí pokuta 0,1–15\u00a0% z částky (§ 38w); 15\u00a0% když nereagujete ani na výzvu.'],
              [CheckCircle2, 'Změna od 2026: strop 40 mil. Kč zrušen', 'V roce 2025 platil roční strop 40 milionů Kč na osvobozené příjmy z prodeje cenných papírů. Od 1. 1. 2026 byl pro cenné papíry a podíly zrušen – osvobození po časovém testu u ETF opět neomezuje horní limit.'],
            ] as [typeof Coins, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Spočítejte si to v korunách" desc="Než začnete řešit daně, vyplatí se vědět, o jaké částky vůbec jde. Naše kalkulačky počítají rovnou v korunách." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/investicni-kalkulacka', 'Investiční kalkulačka', 'Kolik naspoříte pravidelným vkladem', TrendingUp],
              ['/fire', 'Průvodce FIRE', 'Kolik potřebujete k finanční nezávislosti', TrendingUp],
              ['/kalkulacka', 'Kalkulačka poplatků', 'Dopad TER na výnos za desítky let', Percent],
              ['/srovnani', 'Srovnávač ETF', 'Akum. vs distr., TER a výnosy v Kč', Scale],
              ['/kde-koupit', 'Kde koupit ETF', 'Přehled brokerů a platforem', Landmark],
              ['/pruvodce', 'Co jsou ETF', 'Základy pro úplné začátečníky', BookOpen],
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

        {/* 8. FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky o daních z ETF" />
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
        <SouvisejiciZebricky nadpis="Žebříčky k tématu" slugy={['nejlepsi-akumulacni-etf', 'nejlepsi-distribucni-etf', 'nejlepsi-dividendove-etf']} />

        {/* E-E-A-T patička */}
        <section className="pb-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s více než 12 lety praxe v českém bankovnictví. Obsah tvoříme nezávisle a nekomerčně – bez provizí a placeného pořadí.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Vzdělávací shrnutí, není daňovým ani investičním poradenstvím. Uvedená pravidla jsou orientační a mohou se měnit. Aktualizováno {upraveno}.</p>
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

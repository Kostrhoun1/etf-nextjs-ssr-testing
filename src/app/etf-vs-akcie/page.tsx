import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Scale, ShieldCheck,
  HelpCircle, PieChart, Layers, LineChart, Landmark, Globe, Percent,
  TrendingDown, Building2, Calculator, Wallet, CheckCircle2, XCircle,
  Target, Clock, Sparkles,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate, getETFsByIsins, getTotalETFCount } from '@/lib/etf-data';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'ETF, nebo jednotlivé akcie? Srovnání pro začátečníka (data v Kč)',
  description:
    'Koupit ETF, nebo si vybírat vlastní akcie? Data ukazují, že jen menšina akcií dlouhodobě překoná i státní dluhopisy – a pouhá 4 % firem vytvořila veškerý čistý zisk trhu. Rozdíl v diverzifikaci, nákladech, daních a riziku srozumitelně a v korunách.',
  alternates: { canonical: '/etf-vs-akcie' },
  openGraph: {
    title: 'ETF, nebo jednotlivé akcie? Srovnání pro začátečníka (data v Kč)',
    description:
      'Proč většina jednotlivých akcií zaostává, kolik firem koupíte jedním ETF a kdy dávají vlastní akcie smysl. Nezávisle, s daty a v korunách.',
    url: 'https://etfpruvodce.cz/etf-vs-akcie',
    images: [
      ogImage({
        title: 'ETF, nebo jednotlivé akcie?',
        eyebrow: 'Vzdělávací pilíř',
        stat: '4 %',
        statLabel: 'firem vytvořilo veškerý čistý zisk akciového trhu (1926–2025)',
      }),
    ],
    type: 'article',
  },
};

const pct = (v: number | null) =>
  v == null ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(1).replace('.', ',')} %`;
const ter = (v: number | null) => (v == null ? '—' : `${v.toFixed(2).replace('.', ',')} %`);

/* Široké „koupíte celý trh" fondy – ukázka toho, co znamená ETF místo jedné akcie.
   Data se dotahují živě z naší DB, ISIN je stabilní identifikátor. */
const BROAD_ISINS = [
  'IE00BK5BQT80', // Vanguard FTSE All-World (VWCE) – celý svět
  'IE00B4L5Y983', // iShares Core MSCI World (SWDA) – rozvinuté trhy
  'IE00B5BMR087', // iShares Core S&P 500 (CSPX) – 500 firem USA
];

export default async function EtfVsAkciePage() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const [funds, totalCount] = await Promise.all([
    getETFsByIsins(BROAD_ISINS),
    getTotalETFCount(),
  ]);
  const totalStr = totalCount >= 100 ? `${(Math.floor(totalCount / 100) * 100).toLocaleString('cs-CZ')}+` : `${totalCount}`;

  const faqs = [
    {
      q: 'Je lepší koupit ETF, nebo jednotlivé akcie?',
      a: 'Pro naprostou většinu drobných investorů, kteří chtějí dlouhodobě zhodnotit úspory a nemají čas ani chuť studovat účetní výkazy firem, je jednodušší a spolehlivější cestou široký indexový ETF. Jedním nákupem získáte stovky až tisíce firem, takže vás nepoloží krach jedné z nich. Jednotlivé akcie mají smysl spíš jako menší, doplňková část portfolia pro toho, koho investování baví a bere ho jako koníček – ne jako základ, na kterém stojí spoření na důchod.',
    },
    {
      q: 'Proč většina jednotlivých akcií zaostává za indexem?',
      a: 'Výnos akciového trhu je extrémně nerovnoměrně rozdělený. Rozsáhlý výzkum profesora Hendrika Bessembindera nad americkými akciemi od roku 1926 ukázal, že za celou dobu své existence překonala jen necelá polovina akcií (kolem 41 %) výnos i těch nejbezpečnějších státních pokladničních poukázek, více než polovina skončila v celkové ztrátě a veškerý čistý zisk trhu vytvořila pouhá 4 % nejúspěšnějších firem. Když koupíte celý index, máte těch pár velkých vítězů automaticky uvnitř. Když sázíte na pár vybraných akcií, je velká šance, že je minete.',
    },
    {
      q: 'Kolik firem vlastně koupím jedním ETF?',
      a: 'Záleží na indexu. ETF na S&P 500 drží 500 největších amerických firem. ETF na MSCI World kolem 1 300 firem z rozvinutých zemí. A ETF na FTSE All-World přes 4 200 firem z rozvinutých i rozvíjejících se trhů. Jedním obchodem za pár set korun tak vlastníte malý kousek stovek nebo tisíců firem po celém světě – to samé byste jako jednotlivec pořizoval roky a za obrovské poplatky.',
    },
    {
      q: 'Nevydělám na akciích jako Apple nebo Nvidia víc než na nudném indexu?',
      a: 'Když trefíte budoucího vítěze na začátku, ano. Problém je, že tyhle firmy jsou „jasná volba" až zpětně – dopředu to jistota není a na každý Apple připadají desítky firem, které vypadaly stejně slibně a skončily neúspěchem (Kodak i Enron zkrachovaly úplně). Navíc: pokud takový vítěz vyroste do velikosti, je stejně automaticky velkou vahou v indexu, takže z jeho růstu těžíte i přes ETF – jen bez rizika, že vsadíte na špatného koně.',
    },
    {
      q: 'Kdy dávají jednotlivé akcie smysl?',
      a: 'Když vás investování opravdu baví, máte čas sledovat firmy a rozumíte tomu, co kupujete – a hlavně když jde o menší část portfolia, kterou si můžete dovolit ztratit, aniž to ohrozí vaše cíle. Osvědčený přístup je „jádro a satelit": pevné jádro tvoří široký ETF (klidně 80–90 % portfolia) a menší satelit jsou jednotlivé akcie nebo tematické sázky. Tak se necháte bavit stock pickingem, ale výsledek celého portfolia stojí na diverzifikaci.',
    },
    {
      q: 'Jak se liší daně u ETF a u jednotlivých akcií?',
      a: 'V Česku platí pro ETF i pro akcie stejná pravidla: zisk z prodeje je osvobozený, pokud cenný papír držíte déle než 3 roky (časový test), nebo když úhrn vašich prodejů za rok nepřekročí 100 000 Kč. Rozdíl je v praxi u dividend a rebalancování – u akumulačního ETF se dividendy reinvestují uvnitř fondu a nemusíte je danit ani hlídat, kdežto u portfolia jednotlivých akcií řešíte dividendy od každé firmy zvlášť. Detaily rozebírá průvodce daněmi z ETF.',
    },
    {
      q: 'Nejsou náklady na ETF vyšší kvůli poplatku fondu?',
      a: `ETF má roční poplatek (TER), u širokých indexových fondů typicky 0,05–0,22 % ročně – tedy pár desítek korun ročně z každých 10 000 Kč. Za to dostanete hotovou diverzifikaci a automatickou správu. U jednotlivých akcií sice roční poplatek fondu neplatíte, ale abyste dosáhli srovnatelného rozložení rizika, museli byste nakoupit desítky titulů a platit poplatek za každý obchod zvlášť – u malých částek se to nevyplatí. Poplatky si spočítáte v naší kalkulačce.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'ETF, nebo jednotlivé akcie?', item: 'https://etfpruvodce.cz/etf-vs-akcie' },
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
          <span className="text-slate-600">ETF, nebo jednotlivé akcie?</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Scale className="w-3.5 h-3.5" /> Vzdělávací pilíř · data v Kč
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              ETF, nebo jednotlivé akcie?
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Vypadá to jako férový souboj – vybrat si pár šikovných akcií, nebo koupit celý trh přes ETF.
              Jenže data mluví jasně: za posledních ~100 let vytvořila <strong className="text-white">veškerý čistý
              zisk akciového trhu pouhá 4 % firem</strong> a víc než polovina jednotlivých akcií skončila v celkové
              ztrátě. Když koupíte index, máte ty vzácné vítěze automaticky uvnitř. Ukážeme proč – s daty a v korunách.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="#data" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <TrendingDown className="w-4 h-4" /> Proč akcie zaostávají
              </Link>
              <Link href="#srovnani" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Scale className="w-4 h-4" /> Srovnání bod po bodu
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Výnosy v Kč</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* ÚVOD */}
        <section className="pb-9">
          <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed space-y-3">
            <p>
              „Proč bych platil poplatek fondu, když si můžu akcie vybrat sám?" To je jedna z nejčastějších otázek
              začínajícího investora – a je úplně na místě. Rozdíl mezi <strong className="text-slate-900">koupí
              jednotlivé akcie</strong> a <strong className="text-slate-900">koupí ETF</strong> ale není o poplatku.
              Je o tom, jak je rozložené riziko a jak vypadá skutečné rozdělení výnosů na burze.
            </p>
            <p>
              Akcie = podíl v jedné konkrétní firmě. Když se jí daří, vyděláte; když zkrachuje, přijdete o vše.
              ETF = jedním nákupem malý kousek stovek až tisíců firem najednou. Osud jedné z nich vás nepoloží.
              A jak uvidíte níž, právě tohle rozložení dělá v dlouhém běhu obrovský rozdíl – protože trh netáhne
              průměrná firma, ale hrstka výjimečných.
            </p>
          </div>
        </section>

        {/* 1. AKCIE vs ETF – co to je */}
        <section className="pb-10">
          <SectionHead
            title="Akcie vs. ETF: v čem je vlastně rozdíl"
            desc="Dvě cesty na stejnou burzu. Jedna sází na konkrétní firmu, druhá kupuje rovnou celý trh."
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><Building2 className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Jednotlivá akcie</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Kupujete podíl v jedné firmě. Výnos i riziko závisí na tom, jak se daří právě jí. Vyšší potenciál
                i vyšší riziko – a musíte sami vybírat, sledovat a rozhodovat, kdy prodat. Diverzifikaci si musíte
                poskládat sami z desítek titulů.
              </p>
            </div>
            <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-100 text-teal-700 border border-teal-200 mb-3"><Layers className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">ETF (indexový fond)</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Jedním nákupem získáte stovky až tisíce firem, které fond drží podle indexu. Diverzifikace je
                hotová, správa automatická, poplatek nízký. Nevsázíte na jednu firmu – vsázíte na to, že ekonomika
                jako celek dlouhodobě roste.
              </p>
            </div>
          </div>
        </section>

        {/* 2. DATA – proč většina akcií zaostává */}
        <section className="pb-10" id="data">
          <SectionHead
            title="Proč většina jednotlivých akcií zaostává"
            desc="Nejde o názor, ale o tvar dat. Výnos burzy je extrémně nerovnoměrný – táhne ho hrstka firem, zbytek zaostává. Čísla pocházejí z výzkumu prof. Hendrika Bessembindera nad americkými akciemi 1926–2025."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [Percent, 'jen ~41 %', 'akcií za celou dobu své existence překonalo výnos i těch nejbezpečnějších státních pokladničních poukázek. Zbytek na bezrizikové aktivum nedosáhl.'],
              [TrendingDown, 'přes 50 %', 'jednotlivých akcií skončilo za svůj život v celkové ztrátě. Náhodně vybraná akcie je tak spíš prodělečná sázka než výherní los.'],
              [Sparkles, 'pouhá 4 %', 'nejúspěšnějších firem vytvořila veškerý čistý zisk celého akciového trhu za ~100 let. Kdo je mine, mine i většinu výnosu.'],
            ] as [typeof Percent, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="text-2xl font-bold text-teal-700 tabular-nums">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-teal-100 bg-teal-50/50 p-4">
            <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              Klíčový důsledek: úspěch na burze <strong>nezáleží na průměrné firmě, ale na tom, jestli vlastníte
              ty vzácné vítěze</strong>. Index je má v sobě automaticky – když firma vyroste, roste i její váha
              v indexu. Kdo sází na pár vybraných akcií, má naopak velkou šanci, že se do těch 4 % netrefí. A není to
              jen americká zvláštnost: ve 55 z 57 světových trhů zaostala za pokladničními poukázkami většina akcií.
            </p>
          </div>
        </section>

        {/* 3. KOLIK FIREM KOUPÍTE – + živá data */}
        <section className="pb-10">
          <SectionHead
            title="Kolik firem koupíte jedním ETF"
            desc="„Koupit celý trh“ není fráze. Jedním obchodem za pár set korun vlastníte kousek stovek nebo tisíců firem – a jejich reálný výnos ukazujeme v korunách, ne jen v dolarech."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [LineChart, '500 firem', 'S&P 500', '500 největších firem USA – jádro světové ekonomiky, nejnižší poplatky.'],
              [Building2, '~1 300 firem', 'MSCI World', 'Firmy z rozvinutých zemí celého světa. Klasická a osvědčená volba.'],
              [Globe, '~4 200 firem', 'FTSE All-World', 'Rozvinuté i rozvíjející se trhy – nejširší rozložení jedním fondem.'],
            ] as [typeof Globe, string, string, string][]).map(([Icon, t, name, d]) => (
              <div key={name} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="text-xl font-bold text-slate-900 tabular-nums">{t}</p>
                <p className="text-xs font-medium text-teal-700 mt-0.5">{name}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          {funds.length > 0 && (
            <>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-x-auto">
                <table className="w-full min-w-[44rem] text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                      <th className="py-3 px-4 text-left font-medium">Fond (koupíte celý trh)</th>
                      <th className="py-3 px-4 text-left font-medium">Index</th>
                      <th className="py-3 px-4 text-right font-medium">TER</th>
                      <th className="py-3 px-4 text-right font-medium">5 let (Kč)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funds.map((f) => (
                      <tr key={f.isin} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 px-4">
                          <Link href={`/etf/${f.isin}`} className="font-medium text-slate-900 hover:text-teal-700">
                            {f.primary_ticker ?? f.name}
                          </Link>
                          <span className="block text-xs text-slate-400 leading-relaxed">{f.name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">{f.index_name ?? '—'}</td>
                        <td className="py-3 px-4 text-right tabular-nums text-slate-700">{ter(f.ter_numeric)}</td>
                        <td className="py-3 px-4 text-right tabular-nums font-medium text-teal-700">{pct(f.return_5y_czk)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
                <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
                Výnos je za 5 let přepočtený do korun (obsahuje i pohyb kurzu, který český investor reálně cítí).
                Není to doporučení konkrétního fondu ani záruka budoucího výnosu – minulé výsledky se nemusí opakovat.
                Rozdíl mezi indexy rozebírá{' '}
                <Link href="/svetove-etf-indexy" className="text-teal-700 hover:underline">Světové ETF indexy</Link>,
                všech {totalStr} fondů profiltrujete ve{' '}
                <Link href="/srovnani" className="text-teal-700 hover:underline">srovnávači</Link>.
              </p>
            </>
          )}
        </section>

        {/* 4. SROVNÁNÍ – tabulka */}
        <section className="pb-10" id="srovnani">
          <SectionHead
            title="ETF vs. jednotlivé akcie: bod po bodu"
            desc="Nejde o to, že by jedno bylo „správné“ a druhé „špatné“. Každá cesta má jinou cenu – v riziku, čase i pohodlí."
          />
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Vlastnost</th>
                  <th className="py-3 px-4 text-left font-medium">Široký ETF</th>
                  <th className="py-3 px-4 text-left font-medium">Jednotlivé akcie</th>
                </tr>
              </thead>
              <tbody className="[&_td]:py-3 [&_td]:px-4 [&_td]:align-top">
                {([
                  ['Diverzifikace', 'Hotová – stovky až tisíce firem v jednom nákupu', 'Musíte si ji poskládat sami z desítek titulů'],
                  ['Riziko krachu jedné firmy', 'Rozpuštěné, jeden bankrot skoro nepocítíte', 'Koncentrované, může smazat velkou část portfolia'],
                  ['Čas a znalosti', 'Minimální – kup a drž', 'Vysoké – analýza firem, sledování, rozhodování'],
                  ['Poplatky', 'Roční TER 0,05–0,22 % u širokých fondů', 'Bez TER, ale poplatek za každý obchod zvlášť'],
                  ['Daně v ČR', 'Časový test 3 roky nebo 100 000 Kč/rok', 'Stejná pravidla, ale dividendy řešíte u každé firmy'],
                  ['Šance překonat trh', 'Získáte přesně tržní výnos (mínus malý poplatek)', 'Vysoká šance zaostat – většina akcií zaostává'],
                  ['Emoce', 'Nuda pomáhá – míň důvodů panikařit', 'Velké výkyvy svádějí k prodeji ve špatnou chvíli'],
                ] as [string, string, string][]).map(([label, etf, stock]) => (
                  <tr key={label} className="border-b border-slate-100 last:border-0">
                    <td className="font-medium text-slate-900">{label}</td>
                    <td className="text-slate-600">{etf}</td>
                    <td className="text-slate-600">{stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Pravidla zdanění jsou pro ETF i akcie v Česku shodná – rozebírá je{' '}
            <Link href="/dane-z-etf" className="text-teal-700 hover:underline">Daně z ETF (2026)</Link>.
            Kolik vás sní roční poplatek za 30 let, spočítá{' '}
            <Link href="/kalkulacka" className="text-teal-700 hover:underline">kalkulačka poplatků</Link>.
          </p>
        </section>

        {/* 5. KDY DÁVAJÍ AKCIE SMYSL – fér obě strany */}
        <section className="pb-10">
          <SectionHead
            title="Kdy dávají jednotlivé akcie smysl"
            desc="Stock picking není hřích – jen patří na správné místo a ve správné velikosti. Férově obě strany."
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-100 text-teal-700 border border-teal-200 mb-3"><CheckCircle2 className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Akcie mají místo, když…</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Investování vás baví a máte čas firmy sledovat.</li>
                <li className="flex items-start gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Jde o menší „satelit" (klidně 10–20 %), ne o základ portfolia.</li>
                <li className="flex items-start gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Rozumíte tomu, co kupujete, a unesete výkyvy i ztrátu.</li>
                <li className="flex items-start gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Jádro už máte pokryté širokým ETF.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-700 border border-amber-200 mb-3"><XCircle className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Radši ETF, když…</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2 text-slate-600"><XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Chcete jednoduše a dlouhodobě zhodnotit úspory.</li>
                <li className="flex items-start gap-2 text-slate-600"><XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Nemáte čas ani chuť studovat účetní výkazy firem.</li>
                <li className="flex items-start gap-2 text-slate-600"><XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Jde o peníze na důchod nebo cíle, které nechcete riskovat.</li>
                <li className="flex items-start gap-2 text-slate-600"><XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Chcete spát klidně, i když jedna firma padne.</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Osvědčený kompromis je strategie <strong className="text-slate-700">„jádro a satelit"</strong>: pevné
            jádro tvoří široký ETF (80–90 % portfolia) a menší satelit jsou vlastní akcie nebo tematické sázky.
            Jak jádro poskládat, ukazují{' '}
            <Link href="/portfolio-strategie" className="text-teal-700 hover:underline">modelová portfolia</Link>.
          </p>
        </section>

        {/* 6. NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Spočítejte si to na svá čísla" desc="Data výše jsou modelová. Zadejte vlastní vklad, horizont i poplatek." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/kolik-vydelaly-etf', 'Kolik vydělaly ETF a akcie', 'Datový rozbor v Kč (2008–2026)', LineChart],
              ['/investicni-kalkulacka', 'Investiční kalkulačka', 'Budoucí hodnota investice v Kč', Calculator],
              ['/kalkulacka', 'Kalkulačka poplatků', 'Kolik vás stojí TER za 30 let', PieChart],
              ['/portfolio-strategie', 'Modelová portfolia', 'Jak poskládat jádro portfolia', Layers],
              ['/svetove-etf-indexy', 'Který světový ETF', 'MSCI World vs FTSE All-World', Globe],
              ['/dane-z-etf', 'Daně z ETF', 'Kdy platíte a kdy ne (2026)', Landmark],
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
          <SectionHead title="Časté otázky" />
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
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Statistiky o rozdělení výnosů akcií vycházejí z výzkumu prof. Hendrika Bessembindera (Do Stocks Outperform Treasury Bills?) nad americkými akciemi 1926–2025. Výnosy fondů jsou informativní, minulé výsledky nezaručují budoucí. Nejde o investiční ani daňové poradenství. Aktualizováno {dateStr}.</p>
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

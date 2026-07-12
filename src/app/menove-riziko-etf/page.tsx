import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins,
  Landmark, Scale, ShieldCheck, HelpCircle, Globe, RefreshCw, ArrowLeftRight,
  CheckCircle2, BookOpen, AlertTriangle,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Měnové riziko u ETF: potřebujete zajištěný (hedged) fond?',
  description:
    'Investujete do fondu v dolarech nebo eurech, ale žijete v korunách. Vysvětlíme, kde měnové riziko opravdu vzniká (a kde ne), rozdíl mezi zajištěným a nezajištěným ETF a kdy má hedging pro Čecha smysl.',
  alternates: { canonical: '/menove-riziko-etf' },
  openGraph: {
    title: 'Měnové riziko u ETF: potřebujete zajištěný (hedged) fond?',
    description:
      'Kde měnové riziko opravdu vzniká, rozdíl hedged vs unhedged a kdy má zajištění pro českého investora smysl. Vzdělávací a nezávislé.',
    url: 'https://etfpruvodce.cz/menove-riziko-etf',
    images: [ogImage({ title: 'Měnové riziko u ETF: potřebujete zajištěný (hedged) fond?', eyebrow: 'Měnové riziko' })],
    type: 'article',
  },
};

export default async function MenoveRizikoEtf() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const faqs = [
    {
      q: 'Když koupím ETF v dolarech, nesu dolarové riziko?',
      a: 'Ne nutně. Měna, ve které se ETF obchoduje (USD, EUR), není totéž co měnové riziko. Rozhoduje, v jakých měnách jsou aktiva uvnitř fondu. Celosvětový akciový ETF drží firmy v desítkách měn – ať už koupíte jeho dolarovou, nebo eurovou třídu, vaše měnová expozice je stejná. Liší se jen měna, ve které nakupujete.',
    },
    {
      q: 'Jaký je rozdíl mezi zajištěným (hedged) a nezajištěným (unhedged) ETF?',
      a: 'Nezajištěný (unhedged) fond nechává měnové pohyby působit – když koruna oslabí, vaše zahraniční investice v korunách posílí, a naopak. Zajištěný (hedged) fond aktivně odstiňuje pohyb měny vůči zvolené bázi (nejčastěji EUR nebo USD), takže výnos víc kopíruje samotná aktiva. Zajištění ale něco stojí a tuto cenu platíte každý rok.',
    },
    {
      q: 'Potřebuje český investor zajištěný ETF?',
      a: 'U dlouhodobého akciového portfolia obvykle ne. Měnové výkyvy se přes roky do velké míry vyrovnávají a jsou malé proti kolísání samotných akcií; zajištění navíc stojí peníze. Navíc drtivá většina ETF se zajišťuje do EUR nebo USD, ne do korun – takže vám měnové riziko koruny stejně nezajistí. Zajištění dává větší smysl u dluhopisů nebo krátkého investičního horizontu.',
    },
    {
      q: 'Zajistí mě EUR hedged ETF proti pohybu koruny?',
      a: 'Ne. „EUR hedged" znamená zajištění do eura, ne do koruny. Jako český investor pořád nesete riziko kurzu EUR/CZK. Fondy zajištěné přímo do koruny prakticky nejsou dostupné, takže Čech typicky drží nezajištěný globální fond a měnový pohyb bere jako součást hry.',
    },
    {
      q: 'Kolik zajištění stojí?',
      a: 'Náklady na zajištění se odvíjejí hlavně od rozdílu úrokových sazeb mezi měnami a projeví se ve výnosu (nad rámec poplatku TER). V některých obdobích může být zajištění výhodné, v jiných ukrojí z výnosu. Přesnou částku nikdy neznáte dopředu – proto se u dlouhodobých akcií většinou nevyplatí.',
    },
    {
      q: 'Jak poznám, jestli je ETF zajištěný?',
      a: 'V názvu bývá „EUR Hedged", „USD Hedged" nebo zkratka „H". V našem srovnávači navíc můžete filtrovat podle měnového zajištění (nezajištěné, EUR/USD/GBP/CHF zajištěné) a zvolený typ si ověřit.',
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
      { '@type': 'ListItem', position: 2, name: 'Měnové riziko u ETF', item: 'https://etfpruvodce.cz/menove-riziko-etf' },
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
          <span className="text-slate-600">Měnové riziko u ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <ArrowLeftRight className="w-3.5 h-3.5" /> Vzdělávací pilíř
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Měnové riziko u ETF: potřebujete zajištěný fond?
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Investujete do fondu v dolarech nebo eurech, ale žijete a utrácíte v korunách. Vysvětlíme, kde měnové
              riziko <strong className="text-white">opravdu vzniká</strong> (a kde ne), rozdíl mezi zajištěným
              a nezajištěným ETF a kdy má hedging pro Čecha smysl.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/kurzovy-dopad" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Calculator className="w-4 h-4" /> Spočítat kurzový dopad
              </Link>
              <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Scale className="w-4 h-4" /> Filtrovat podle zajištění
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Pohled českého investora (Kč)</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* ÚVOD */}
        <section className="pb-9">
          <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed space-y-3">
            <p>
              Skoro každý český investor do ETF řeší stejnou obavu: „Kupuju fond v dolarech – co když dolar spadne?"
              Je to logická otázka, ale skrývá <strong className="text-slate-900">jeden velký omyl</strong>, kvůli
              kterému lidé zbytečně platí za zajištění, které nepotřebují.
            </p>
            <p>Začneme tím omylem – ušetří vám to peníze i starosti.</p>
          </div>
        </section>

        {/* 1. KDE VZNIKÁ RIZIKO – mýtus měny fondu */}
        <section className="pb-10">
          <SectionHead title="Mýtus č. 1: „Fond v dolarech = dolarové riziko“" desc="Měna, ve které se ETF obchoduje, není totéž co vaše měnové riziko. To je klíč k celému tématu." />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 shrink-0"><AlertTriangle className="w-5 h-5" /></span>
              <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
                <p>
                  Celosvětový akciový ETF drží firmy v <strong className="text-slate-900">desítkách měn</strong> –
                  americké v dolarech, japonské v jenech, evropské v eurech. Vaše skutečné měnové riziko je tahle
                  směsice, <strong className="text-slate-900">ne měna, ve které fond nakupujete</strong>.
                </p>
                <p>
                  Praktický důsledek: koupit dolarovou, nebo eurovou třídu <em>téhož</em> fondu je z hlediska měnového
                  rizika <strong className="text-slate-900">úplně jedno</strong>. Liší se jen měna, ve které
                  obchodujete (a případný drobný poplatek za směnu u brokera). Podkladová aktiva – a tím i vaše
                  expozice – zůstávají stejná.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. HEDGED VS UNHEDGED */}
        <section className="pb-10">
          <SectionHead title="Zajištěný (hedged) vs. nezajištěný (unhedged)" desc="Skutečné rozhodnutí není o měně nákupu, ale o tom, jestli fond měnové pohyby aktivně odstiňuje." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Globe className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Nezajištěný (unhedged)</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Nechává měnové pohyby působit. Když koruna oslabí, vaše zahraniční investice v korunách posílí – a naopak.
                <strong className="text-slate-800"> Bez dodatečných nákladů</strong>. Standard pro dlouhodobé akciové portfolio.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><ShieldCheck className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Zajištěný (hedged)</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Aktivně odstiňuje pohyb měny vůči zvolené bázi (nejčastěji EUR nebo USD), takže výnos víc kopíruje samotná
                aktiva. <strong className="text-slate-800">Stojí to peníze</strong> – cenu platíte každý rok ve výnosu.
              </p>
            </div>
          </div>
        </section>

        {/* 3. POTŘEBUJE HO ČECH – hlavní odpověď */}
        <section className="pb-10">
          <SectionHead title="Potřebuje ho český investor? Většinou ne" desc="U dlouhodobého akciového portfolia hraje měna menší roli, než se zdá – a zajištění má tři háčky." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [TrendingUp, 'Měna se přes čas vyrovnává', 'U dlouhého horizontu jsou měnové výkyvy malé proti kolísání samotných akcií a v čase se do velké míry vyruší.'],
              [Coins, 'Zajištění stojí peníze', 'Náklady na hedging (podle rozdílu úrokových sazeb) ukrajují z výnosu každý rok – navíc k poplatku TER.'],
              [Landmark, 'Do korun se nezajišťuje', 'Fondy se zajišťují do EUR nebo USD, prakticky ne do CZK. „EUR hedged“ vás před pohybem koruny stejně neochrání.'],
            ] as [typeof TrendingUp, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Proto většina dlouhodobých investorů drží <strong className="text-slate-700">nezajištěný</strong> globální
            akciový fond a měnový pohyb bere jako součást hry. Naše výnosy jsou navíc přepočtené do korun, takže reálný
            dopad kurzu vidíte přímo.
          </p>
        </section>

        {/* 4. KDY DÁVÁ ZAJIŠTĚNÍ SMYSL */}
        <section className="pb-10">
          <SectionHead title="Kdy zajištění naopak smysl dává" desc="Nejde o to, že hedging je špatný – jen se hodí do jiných situací než k dlouhodobým akciím." />
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              [ShieldCheck, 'Dluhopisové ETF', 'U dluhopisů je vlastní výnos nízký, takže měnové výkyvy ho můžou snadno „přebít“. Zajištění tu má větší opodstatnění.'],
              [RefreshCw, 'Krátký horizont', 'Když peníze budete potřebovat za pár let, nemáte čas nechat měnové pohyby vyrovnat – větší jistota může být cennější.'],
            ] as [typeof ShieldCheck, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Ověřte si to na číslech" desc="Spočítejte kurzový dopad na vlastní investici a najděte fondy podle typu zajištění." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/kurzovy-dopad', 'Kalkulačka kurzového dopadu', 'Jak pohyb kurzu mění výnos v Kč', Calculator],
              ['/srovnani', 'Srovnávač ETF', 'Filtr podle měnového zajištění', Scale],
              ['/svetove-etf-indexy', 'Světové ETF: který index', 'MSCI World vs FTSE All-World', Globe],
              ['/akumulacni-vs-distribucni-etf', 'Akumulační vs. distribuční', 'Který typ výplaty zvolit', RefreshCw],
              ['/dane-z-etf', 'Daně z ETF', 'Časový test, dividendy, DIP', Landmark],
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

        {/* 6. FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky o měnovém riziku" />
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
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Vzdělávací obsah, není investičním doporučením. Měnový vývoj nelze předvídat. Aktualizováno {dateStr}.</p>
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

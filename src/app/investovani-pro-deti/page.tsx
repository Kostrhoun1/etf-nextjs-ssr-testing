import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins,
  Scale, ShieldCheck, HelpCircle, Target, PiggyBank, Clock, Gavel,
  LineChart, Landmark, AlertTriangle, Lock, Baby, Globe,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate, getETFsByIsins } from '@/lib/etf-data';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Investování pro děti: kolik naspoříte do 18 let (ETF, v Kč)',
  description:
    'Spoření a investování pro děti přes ETF – kolik reálně naspoříte do 18 let v korunách. Účet na jméno dítěte vs. na své jméno, souhlas soudu u výběru, daně a proč se dítěti nevyplatí DIP.',
  alternates: { canonical: '/investovani-pro-deti' },
  openGraph: {
    title: 'Investování pro děti: kolik naspoříte do 18 let (ETF, v Kč)',
    description:
      'Kolik naspoříte dítěti do 18 let přes ETF – v korunách. Účet na dítě vs. na sebe, právní háček s výběrem, daně a fondy. Nezávisle a česky.',
    url: 'https://etfpruvodce.cz/investovani-pro-deti',
    images: [
      ogImage({
        title: 'Investování pro děti: kolik naspoříte do 18 let',
        eyebrow: 'Vzdělávací pilíř',
        stat: '430 721 Kč',
        statLabel: '1 000 Kč měsíčně od narození do 18 let',
      }),
    ],
    type: 'article',
  },
};

/* Budoucí hodnota pravidelného měsíčního vkladu (spořicí anuita). */
const fv = (pmt: number, annual: number, years: number) => {
  const r = annual / 12, n = years * 12;
  return pmt * ((Math.pow(1 + r, n) - 1) / r);
};

const RATE = 0.07; // modelový nominální výnos p.a. (dlouhodobý průměr širokého akciového indexu)
const MONTHLY = [500, 1000, 2000, 3000];
/* Kdy začnete → kolik let do osmnáctin. */
const STARTS: { label: string; years: number }[] = [
  { label: 'Od narození', years: 18 },
  { label: 'Od 6 let', years: 12 },
  { label: 'Od 12 let', years: 6 },
];

const kc = (v: number) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mil. Kč`
    : `${Math.round(v).toLocaleString('cs-CZ')} Kč`;
const kcRound = (v: number) => `${Math.round(v).toLocaleString('cs-CZ')} Kč`;
const pct = (v: number | null) =>
  v == null ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(1).replace('.', ',')} %`;
const ter = (v: number | null) => (v == null ? '—' : `${v.toFixed(2).replace('.', ',')} %`);

/* Široké světové akumulační fondy – typická volba pro 18letý horizont dítěte.
   Data se dotahují živě z naší DB, ISIN je stabilní identifikátor. */
const KID_ISINS = [
  'IE00B4L5Y983', // iShares Core MSCI World (SWDA)
  'IE00BK5BQT80', // Vanguard FTSE All-World (VWCE)
  'IE00B6R52259', // iShares MSCI ACWI (SSAC)
  'IE00BJ0KDQ92', // Xtrackers MSCI World (XDWD)
  'IE00B60SX394', // Invesco MSCI World (MXWS)
];

export default async function InvestovaniProDeti() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const funds = await getETFsByIsins(KID_ISINS);

  const at18 = fv(1000, RATE, 18);
  const contributed18 = 1000 * 12 * 18;

  const faqs = [
    {
      q: 'Kolik naspořím dítěti do 18 let?',
      a: `Při modelovém výnosu 7 % ročně vyjde 1 000 Kč měsíčně od narození do osmnáctin zhruba na ${kcRound(at18)}. Sami přitom vložíte ${kcRound(contributed18)} – zbytek, tedy asi ${kcRound(at18 - contributed18)}, udělalo složené úročení. Při 2 000 Kč měsíčně je to kolem ${kc(fv(2000, RATE, 18))}, při 500 Kč měsíčně kolem ${kc(fv(500, RATE, 18))}. Jsou to nominální částky před inflací.`,
    },
    {
      q: 'Mám investovat na jméno dítěte, nebo na svoje?',
      a: 'Obojí má háček a jde o hlavní rozhodnutí, které musíte udělat na začátku. Účet na jméno dítěte znamená, že peníze jsou právně majetkem dítěte – nemůžete si je vzít zpátky a v osmnácti s nimi dítě naloží, jak samo chce. Účet na vaše jméno vám nechává plnou kontrolu i flexibilitu, ale je to váš majetek, vaše daňová povinnost a je na vaší disciplíně peníze skutečně předat. Pro většinu rodičů je praktičtější druhá varianta, pokud si dokážou peníze mentálně oddělit.',
    },
    {
      q: 'Můžu z investičního účtu dítěte vybrat peníze před jeho osmnáctinami?',
      a: 'Zpravidla ne bez souhlasu opatrovnického soudu. Podle § 898 občanského zákoníku potřebují rodiče souhlas soudu k jednání týkajícímu se jmění dítěte, pokud nejde o běžnou záležitost nebo o zanedbatelnou hodnotu. Prodej investic nebo výběr většího objemu peněz z účtu dítěte tak obvykle znamená jít k soudu a doložit, že je to v zájmu dítěte. Ukládat a nakupovat jde naopak volně. Počítejte s tím dopředu – tyto peníze nejsou vaše nouzová rezerva.',
    },
    {
      q: 'Co se stane s penězi, až bude dítěti 18?',
      a: 'Pokud je účet na jméno dítěte, dítě získá plnou dispozici a může si s celou částkou naložit libovolně – včetně toho, že ji celou utratí. Žádné právní omezení už nemáte. Jedinou pojistkou je finanční výchova a načasování: řada rodičů proto peníze nepředává naráz, ale investuje na vlastní jméno a předává postupně podle toho, jak dítě zvládá s penězi hospodařit.',
    },
    {
      q: 'Jak se daní investice na dítě?',
      a: 'Stejnými pravidly jako u dospělých – dítě je samostatný daňový poplatník. Zisk z prodeje je osvobozen, pokud cenné papíry držíte déle než 3 roky (časový test), nebo pokud úhrn prodejů za rok nepřesáhne 100 000 Kč hrubých příjmů (hodnotový test). U spoření pro dítě na 18 let se časový test splní prakticky vždy, takže se daň typicky vůbec neřeší. Nejde o daňové poradenství – konkrétní situaci proberte s daňovým poradcem.',
    },
    {
      q: 'Vyplatí se dítěti DIP?',
      a: 'Zpravidla ne. Hlavní výhoda DIP je odečet vkladů až 48 000 Kč ročně od základu daně – jenže dítě žádný zdanitelný příjem nemá, takže si nemá co odečíst, a jako rodič si můžete odečíst pouze vklady do svého vlastního DIP. Navíc platí pravidlo 120/60: peníze jdou vybrat nejdřív po 10 letech a zároveň nejdřív v 60 letech věku. Pro cíl „mít peníze v osmnácti" je to tedy naopak překážka – peníze by byly zamčené dalších přes 40 let.',
    },
    {
      q: 'Jaký ETF zvolit pro dítě?',
      a: 'Při horizontu 18 let dává smysl široký světový akciový index a akumulační třída fondu (Acc), která dividendy reinvestuje uvnitř fondu – nemusíte je ročně danit ani ručně reinvestovat. Rozhodujete se hlavně mezi indexem jen na vyspělé trhy (MSCI World) a celým světem včetně rozvíjejících se trhů (FTSE All-World, MSCI ACWI). Není to doporučení konkrétního fondu; srovnání parametrů najdete v tabulce výše a v našem srovnávači.',
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
      { '@type': 'ListItem', position: 2, name: 'Investování pro děti', item: 'https://etfpruvodce.cz/investovani-pro-deti' },
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
          <span className="text-slate-600">Investování pro děti</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Baby className="w-3.5 h-3.5" /> Vzdělávací pilíř · vše v Kč
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Investování pro děti: kolik naspoříte do 18 let?
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              <strong className="text-white">1 000 Kč měsíčně</strong> od narození do osmnáctin vyjde při modelovém
              výnosu 7 % ročně zhruba na <strong className="text-white">{kcRound(at18)}</strong>. Vložíte přitom{' '}
              {kcRound(contributed18)} – zbytek udělá čas. Jenže než pošlete první korunu, musíte vyřešit otázku,
              kterou většina rodičů přeskočí: <strong className="text-white">na čí jméno</strong> ten účet vlastně bude.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/investicni-kalkulacka" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Calculator className="w-4 h-4" /> Spočítat pro moje dítě
              </Link>
              <Link href="#na-cim-jmenu" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Scale className="w-4 h-4" /> Na čí jméno účet?
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
              Spoření pro dítě má jednu obrovskou výhodu, kterou u sebe samých už nikdy nezískáte:{' '}
              <strong className="text-slate-900">osmnáct let horizontu od prvního dne</strong>. To je doba, za kterou
              složené úročení stihne udělat víc práce než vy.
            </p>
            <p>
              Matematická část je jednoduchá a spočítáme ji níže. Zajímavější je ta část, o které se moc nepíše:
              peníze na účtu vedeném na jméno dítěte <strong className="text-slate-900">právně přestanou být vaše</strong>{' '}
              a zpátky se k nim bez soudu nedostanete. To není detail – to je rozhodnutí, které nejde vzít zpět.
            </p>
          </div>
        </section>

        {/* 1. TABULKA: kolik naspoříte */}
        <section className="pb-10">
          <SectionHead
            title="Kolik naspoříte do osmnáctin"
            desc="Budoucí hodnota pravidelného měsíčního vkladu při modelovém výnosu 7 % ročně, podle toho, kdy začnete. Nominálně, před inflací."
          />
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[38rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Měsíčně</th>
                  {STARTS.map((s) => (
                    <th key={s.label} className="py-3 px-4 text-right font-medium">{s.label}</th>
                  ))}
                  <th className="py-3 px-4 text-right font-medium">Vloženo (od narození)</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY.map((pmt) => (
                  <tr key={pmt} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4 font-semibold text-slate-900 tabular-nums">{pmt.toLocaleString('cs-CZ')} Kč</td>
                    {STARTS.map((s) => (
                      <td key={s.label} className="py-3 px-4 text-right tabular-nums font-medium text-teal-700">
                        {kc(fv(pmt, RATE, s.years))}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right tabular-nums text-slate-400">{kcRound(pmt * 216)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-teal-100 bg-teal-50/50 p-4">
            <Clock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              Odklad je drahý. Kdo posílá 1 000 Kč měsíčně <strong>od narození</strong>, má v osmnácti{' '}
              <strong>{kcRound(fv(1000, RATE, 18))}</strong>. Kdo se stejnou částkou začne{' '}
              <strong>až v devíti letech</strong>, má jen <strong>{kcRound(fv(1000, RATE, 9))}</strong> – polovina času,
              ale ani ne třetina výsledku. Vklad roste lineárně, výnos exponenciálně.
            </p>
          </div>
        </section>

        {/* 2. NA ČÍ JMÉNO – jádro pilíře */}
        <section className="pb-10" id="na-cim-jmenu">
          <SectionHead
            title="Na čí jméno účet vedete"
            desc="Hlavní rozhodnutí celého spoření pro dítě. Obě varianty mají cenu – jen ji platíte v jiné měně."
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 mb-3"><Baby className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Účet na jméno dítěte</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Majitelem je dítě, vy jako zákonný zástupce jen spravujete. Peníze jsou nezvratně dítěte.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2 text-slate-600"><ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Peníze jsou chráněné před vámi samotnými – neutratíte je za něco jiného.</li>
                <li className="flex items-start gap-2 text-slate-600"><ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Dítě má vlastní časový i hodnotový test – daňově je to čisté.</li>
                <li className="flex items-start gap-2 text-slate-600"><Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Výběr před 18. rokem zpravidla jen se souhlasem opatrovnického soudu.</li>
                <li className="flex items-start gap-2 text-slate-600"><Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> V osmnácti dostane dítě plnou dispozici – naráz a bez podmínek.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><User className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Účet na vaše jméno</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Běžný investiční účet, u kterého si jen v hlavě (nebo v tabulce) vedete, že je „dětský".
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2 text-slate-600"><ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Plná flexibilita – žádný soud, žádné schvalování.</li>
                <li className="flex items-start gap-2 text-slate-600"><ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Předáte, kdy uznáte za vhodné – klidně postupně, ne naráz v osmnácti.</li>
                <li className="flex items-start gap-2 text-slate-600"><AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Je to váš majetek a vaše daňová povinnost.</li>
                <li className="flex items-start gap-2 text-slate-600"><AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Stojí to disciplínu – peníze musíte skutečně nechat ležet.</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <Target className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Jak se rozhodnout:</strong> zeptejte se sami sebe, čeho se bojíte víc. Jestli toho, že peníze
              v mezičase sami použijete na něco jiného, dává smysl účet na dítě – ta nepřístupnost je vlastnost, ne chyba.
              Jestli spíš toho, že osmnáctiletý člověk dostane naráz půl milionu, který sám nevydělal, nechte účet
              na sebe a předávejte postupně.
            </p>
          </div>
        </section>

        {/* 3. PRÁVNÍ REALITA */}
        <section className="pb-10">
          <SectionHead
            title="Právní háček, o kterém se nemluví"
            desc="Nejčastější nemilé překvapení rodičů: peníze na jméno dítěte se z účtu nedostanou tak snadno, jak se tam dostaly."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [Gavel, 'Souhlas soudu', 'Podle § 898 občanského zákoníku potřebují rodiče souhlas soudu k jednání týkajícímu se jmění dítěte – kromě běžných záležitostí a zanedbatelných hodnot. Prodej investic dítěte sem typicky patří.'],
              [Lock, 'Vklad ano, výběr ne', 'Posílat peníze a nakupovat můžete volně. Problém nastane až u odkupu nebo výběru – ten obvykle znamená jít k opatrovnickému soudu a doložit zájem dítěte.'],
              [Baby, 'V 18 rozhoduje dítě', 'Osmnáctinami veškerá vaše kontrola končí. Dítě může celou částku použít, jak chce – včetně toho, že ji utratí. Právní pojistka neexistuje, jen výchova.'],
            ] as [typeof Gavel, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Praktický důsledek: <strong className="text-slate-700">peníze dítěte nikdy neplánujte jako svou nouzovou
            rezervu</strong>. Tu si držte odděleně a dostupnou – jak velkou, rozebírá{' '}
            <Link href="/nouzova-rezerva" className="text-teal-700 hover:underline">průvodce nouzovou rezervou</Link>.
            Nejde o právní poradenství; u větších částek se poraďte s advokátem.
          </p>
        </section>

        {/* 4. DANĚ */}
        <section className="pb-10">
          <SectionHead
            title="Jak se investice pro dítě daní"
            desc="Dobrá zpráva: dítě je samostatný daňový poplatník a při osmnáctiletém horizontu se daň typicky vůbec neřeší."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [Clock, 'Časový test: 3 roky', 'Držíte-li cenné papíry déle než 3 roky, je zisk z prodeje osvobozen. U spoření na 18 let se splní prakticky vždy – proto se daň u dětského portfolia obvykle neřeší vůbec.'],
              [Coins, 'Hodnotový test: 100 000 Kč', 'Nepřesáhne-li úhrn prodejů za rok 100 000 Kč hrubých příjmů (pozor: tržba, ne zisk), je příjem osvobozen bez ohledu na dobu držby. Dítě má tento limit vlastní.'],
              [PiggyBank, 'Akumulační fond = klid', 'Akumulační třída (Acc) reinvestuje dividendy uvnitř fondu. Nechodí vám tedy nic na účet, co byste museli rok co rok danit – u dětského portfolia velké zjednodušení.'],
            ] as [typeof Clock, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Kompletní pravidla včetně dividend a sazeb rozebírá průvodce{' '}
            <Link href="/dane-z-etf" className="text-teal-700 hover:underline">Daně z ETF (2026)</Link>. Rozdíl mezi
            akumulační a distribuční třídou vysvětluje{' '}
            <Link href="/akumulacni-vs-distribucni-etf" className="text-teal-700 hover:underline">Akumulační vs. distribuční ETF</Link>.
            Nejde o daňové poradenství.
          </p>
        </section>

        {/* 5. PROČ NE DIP */}
        <section className="pb-10">
          <SectionHead
            title="Proč dítěti nezakládat DIP"
            desc="Dlouhodobý investiční produkt zní jako logická volba pro dlouhý horizont. U dítěte ale jeho hlavní výhoda nefunguje a jeho hlavní omezení jde přímo proti cíli."
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><Landmark className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Daňový odečet dítě nevyužije</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Hlavní výhoda DIP je odečet vkladů až 48 000 Kč ročně od základu daně. Dítě ale nemá zdanitelný
                příjem, takže nemá co snižovat – a vy si jako rodič můžete odečíst pouze vklady do svého vlastního DIP,
                ne do dětského.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 mb-3"><Lock className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Pravidlo 120/60 jde proti cíli</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Aby daňová výhoda nepropadla, musí peníze zůstat ležet nejméně 10 let (120 měsíců) a zároveň
                do 60 let věku majitele. U novorozence to znamená zamčeno na šest desetiletí – zatímco cílem
                bývá mít peníze k dispozici v osmnácti.
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Pro cíl „mít peníze v osmnácti" je tedy běžný investiční účet bez wrapperu jednodušší i pružnější.
            DIP dává smysl vám na vlastní důchod, ne dítěti na studia – kdy a komu se{' '}
            <Link href="/dip" className="text-teal-700 hover:underline">DIP vyplatí</Link>, rozebíráme zvlášť.
          </p>
        </section>

        {/* 6. FONDY – živá data z DB */}
        {funds.length > 0 && (
          <section className="pb-10">
            <SectionHead
              title="Široké světové ETF pro osmnáctiletý horizont"
              desc="Při osmnáctiletém horizontu dává smysl široký světový index v akumulační třídě. Data z naší databáze – výnos v korunách, tak jak ho reálně uvidíte."
            />
            <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
              <table className="w-full min-w-[46rem] text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                    <th className="py-3 px-4 text-left font-medium">Fond</th>
                    <th className="py-3 px-4 text-left font-medium">Index</th>
                    <th className="py-3 px-4 text-right font-medium">TER</th>
                    <th className="py-3 px-4 text-right font-medium">Velikost</th>
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
                      <td className="py-3 px-4 text-right tabular-nums text-slate-500 text-xs">
                        {f.fund_size_numeric == null
                          ? '—'
                          : f.fund_size_numeric >= 1000
                            ? `${(f.fund_size_numeric / 1000).toFixed(1).replace('.', ',')} mld €`
                            : `${Math.round(f.fund_size_numeric)} mil €`}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-medium text-teal-700">{pct(f.return_5y_czk)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
              <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
              Není to doporučení konkrétního fondu – jen srovnání parametrů. Minulé výnosy nezaručují budoucí.
              Hlavní volba není mezi značkami, ale mezi indexy: jen vyspělé trhy (MSCI World) vs. celý svět včetně
              rozvíjejících se trhů (FTSE All-World, MSCI ACWI). Rozdíl rozebírá{' '}
              <Link href="/svetove-etf-indexy" className="text-teal-700 hover:underline">Světové ETF indexy</Link>,
              všech {`4 800+`} fondů profiltrujete ve{' '}
              <Link href="/srovnani" className="text-teal-700 hover:underline">srovnávači</Link>.
            </p>
          </section>
        )}

        {/* 7. NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Spočítejte si to pro své dítě" desc="Tabulky výše jsou modelové. Zadejte vlastní vklad, výnos i horizont." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/investicni-kalkulacka', 'Investiční kalkulačka', 'Váš vklad, výnos, horizont – v Kč', Calculator],
              ['/kolik-investovat-mesicne', 'Kolik investovat měsíčně', 'Kolik na milion nebo rentu', Wallet],
              ['/monte-carlo', 'Monte Carlo', 'Pravděpodobnostní scénáře, ne jedno číslo', LineChart],
              ['/backtest', 'Backtest portfolia', 'Jak by strategie prošla historií', Scale],
              ['/svetove-etf-indexy', 'Který světový ETF', 'Do čeho ty peníze vlastně poslat', Globe],
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

        {/* 8. FAQ */}
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
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Výpočty jsou modelové (7 % p.a., nominálně před inflací a daněmi) a mají vzdělávací charakter. Nejde o investiční, daňové ani právní poradenství a skutečné výnosy se liší. Daňová a právní pravidla se mění – ověřte si aktuální stav. Aktualizováno {dateStr}.</p>
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

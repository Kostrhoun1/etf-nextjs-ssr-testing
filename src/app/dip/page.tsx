import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins,
  Scale, ShieldCheck, HelpCircle, Target, PiggyBank, Clock, Gift,
  LineChart, Landmark, AlertTriangle, Lock, Globe, Percent, Briefcase,
  CheckCircle2, XCircle,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate, getETFsByIsins } from '@/lib/etf-data';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'DIP: vyplatí se dlouhodobý investiční produkt? (daně, ETF, v Kč)',
  description:
    'Dlouhodobý investiční produkt (DIP) 2026 srozumitelně a nezávisle: kolik reálně dostanete zpět od státu v korunách, pravidlo 120/60, příspěvek zaměstnavatele, sankce za předčasný výběr a kdy je DIP výhodnější než běžný účet s ETF.',
  alternates: { canonical: '/dip' },
  openGraph: {
    title: 'DIP: vyplatí se dlouhodobý investiční produkt? (daně, ETF, v Kč)',
    description:
      'Kolik na DIP reálně získáte zpět od státu v korunách, pravidlo 120/60, příspěvek zaměstnavatele a kdy se DIP vyplatí víc než běžný účet s ETF. Nezávisle a česky.',
    url: 'https://etfpruvodce.cz/dip',
    images: [
      ogImage({
        title: 'DIP: vyplatí se dlouhodobý investiční produkt?',
        eyebrow: 'Vzdělávací pilíř',
        stat: '7 200 Kč',
        statLabel: 'ročně zpět od státu (15 % z 48 000 Kč vkladu)',
      }),
    ],
    type: 'article',
  },
};

/* Budoucí hodnota jednou ročně vložené (a reinvestované) částky – roční anuita. */
const fvAnnual = (yearly: number, annual: number, years: number) =>
  yearly * ((Math.pow(1 + annual, years) - 1) / annual);

const RATE = 0.07; // modelový nominální výnos p.a. (dlouhodobý průměr širokého akciového indexu)
const DEDUCTION_CAP = 48_000; // roční strop odpočtu (společný s penzijním/životním)
const EMPLOYER_CAP = 50_000; // osvobozený příspěvek zaměstnavatele / rok

const kc = (v: number) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mil. Kč`
    : `${Math.round(v).toLocaleString('cs-CZ')} Kč`;
const kcRound = (v: number) => `${Math.round(v).toLocaleString('cs-CZ')} Kč`;
const pct = (v: number | null) =>
  v == null ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(1).replace('.', ',')} %`;
const ter = (v: number | null) => (v == null ? '—' : `${v.toFixed(2).replace('.', ',')} %`);

/* Kolik ročně vložíte → jaká část jde na odpočet (strop 48 000) → kolik dostanete zpět. */
const CONTRIB_ROWS = [12_000, 24_000, 48_000, 60_000];
/* Reinvestovaná daňová úspora v čase (roční úspora 7 200 Kč při 15 %). */
const YEARLY_SAVING = DEDUCTION_CAP * 0.15; // 7 200 Kč
const HORIZONS = [10, 20, 30];

/* Široké světové akumulační fondy – typická náplň DIP pro dlouhý horizont do důchodu.
   Data se dotahují živě z naší DB, ISIN je stabilní identifikátor. */
const DIP_ISINS = [
  'IE00B4L5Y983', // iShares Core MSCI World (SWDA)
  'IE00BK5BQT80', // Vanguard FTSE All-World (VWCE)
  'IE00B6R52259', // iShares MSCI ACWI (SSAC)
  'IE00BJ0KDQ92', // Xtrackers MSCI World (XDWD)
  'IE00B5BMR087', // iShares Core S&P 500 (CSPX)
];

export default async function DipPage() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const funds = await getETFsByIsins(DIP_ISINS);

  const maxBack15 = DEDUCTION_CAP * 0.15; // 7 200 Kč
  const maxBack23 = DEDUCTION_CAP * 0.23; // 11 040 Kč
  const compounded30 = fvAnnual(YEARLY_SAVING, RATE, 30);

  const faqs = [
    {
      q: 'Co je dlouhodobý investiční produkt (DIP)?',
      a: 'DIP je od roku 2024 daňově zvýhodněný „obal" na spoření na stáří. Není to konkrétní fond ani produkt jedné instituce – je to režim, do kterého si u licencovaného poskytovatele vložíte běžné investice (ETF, akcie, podílové fondy, dluhopisy, spořicí účet) a stát vám za to dá daňovou úlevu výměnou za to, že peníze necháte ležet do důchodu. Investiční logika uvnitř je stejná jako mimo DIP; mění se jen daňový a časový rámec.',
    },
    {
      q: 'Kolik na DIP reálně dostanu zpět od státu?',
      a: `Vklady si odečtete od základu daně až do 48 000 Kč ročně (společný limit s penzijním připojištěním, doplňkovým penzijním spořením a životním pojištěním). Při 15% sazbě daně to znamená až ${kcRound(maxBack15)} zpět za rok, při 23% sazbě až ${kcRound(maxBack23)}. Není to „výnos navíc" z investice – je to vrácená daň. Kdo vloží míň než 48 000 Kč, dostane zpět 15 % z toho, co vložil.`,
    },
    {
      q: 'Jaké je pravidlo 120/60?',
      a: 'Aby daňová výhoda nepropadla, musí být splněny dvě podmínky současně: DIP musí trvat alespoň 120 měsíců (10 let) a zároveň smíte peníze vybrat nejdříve v roce, kdy dosáhnete 60 let věku. Obojí musí platit najednou. Když vám je 55 a DIP máte 10 let, ještě čekáte na šedesátku; když je vám 62, ale DIP máte teprve 3 roky, čekáte na deset let. Teprve po splnění obou podmínek je výběr bez sankce.',
    },
    {
      q: 'Co se stane, když peníze vyberu dřív?',
      a: 'Předčasný výběr před splněním podmínek 120/60 znamená, že o daňovou výhodu zpětně přijdete. Musíte dodanit (vrátit) daňové odpočty, které jste si za vklady uplatnili, a to až 10 let zpětně. Pokud vám na DIP přispíval zaměstnavatel, z těchto příspěvků za posledních 10 let odvedete 15% daň. Poskytovatel si navíc může naúčtovat vlastní smluvní poplatky. Samotný zisk z investice se řeší běžnými pravidly. Proto do DIP patří jen peníze, které opravdu nebudete potřebovat do šedesátky.',
    },
    {
      q: 'Může mi na DIP přispívat zaměstnavatel?',
      a: `Ano a je to jedna z nejsilnějších stránek DIP. Příspěvek zaměstnavatele je osvobozený od daně i odvodů až do ${kcRound(EMPLOYER_CAP)} ročně (společný limit s penzijním spořením a životním pojištěním). Pro zaměstnavatele je to daňově uznatelný náklad, pro vás peníze, ze kterých neplatíte daň ani sociální a zdravotní. Jestli tuhle možnost zaměstnavatel nabízí, je to zpravidla nejvýhodnější část celé skládačky – zeptejte se na personálním oddělení.`,
    },
    {
      q: 'Co si můžu do DIP dát?',
      a: 'Do DIP můžete vložit prakticky celé běžné investiční spektrum: ETF, jednotlivé akcie, podílové fondy, dluhopisy i spořicí účet – záleží na tom, co váš poskytovatel v režimu DIP nabízí. Pro dlouhý horizont do důchodu bývá jádrem široký světový akciový index v akumulační třídě. Skladbu si řídíte sami; DIP je jen daňový obal, ne hotová strategie.',
    },
    {
      q: 'Vyplatí se DIP víc než běžný účet s ETF?',
      a: 'Záleží, co od peněz čekáte. DIP navíc dává odpočet vkladů (až 7 200 Kč zpět ročně) a případně příspěvek zaměstnavatele – to běžný účet neumí. Platíte za to ale likviditou: peníze jsou zamčené do 60 let. Přitom na běžném účtu je zisk z prodeje ETF po splnění časového testu (držba nad 3 roky) stejně osvobozený a k penězům se dostanete kdykoli. Zjednodušeně: DIP se vyplatí, když byste stejně investovali až do důchodu a chcete k tomu odpočet nebo příspěvek zaměstnavatele. Pokud potřebujete peníze dřív nebo chcete flexibilitu, běžný účet s ETF je jednodušší.',
    },
    {
      q: 'Vyplatí se DIP dítěti?',
      a: 'Zpravidla ne. Hlavní výhoda DIP je odečet vkladů od základu daně, jenže dítě žádný zdanitelný příjem nemá, takže si nemá co odečíst. Navíc pravidlo 120/60 by peníze zamklo do šedesátky, zatímco cílem u dětského spoření bývá mít je k dispozici v osmnácti. Podrobně to rozebírá průvodce investováním pro děti.',
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
      { '@type': 'ListItem', position: 2, name: 'DIP – dlouhodobý investiční produkt', item: 'https://etfpruvodce.cz/dip' },
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
          <span className="text-slate-600">DIP – dlouhodobý investiční produkt</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Landmark className="w-3.5 h-3.5" /> Vzdělávací pilíř · vše v Kč
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              DIP: vyplatí se dlouhodobý investiční produkt?
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Za vklady do DIP vám stát vrátí <strong className="text-white">až {kcRound(maxBack15)} ročně</strong>{' '}
              (15 % z 48 000 Kč), s vyšší sazbou až {kcRound(maxBack23)}. Zní to skvěle – jenže výhoda má cenu:
              peníze jsou <strong className="text-white">zamčené do 60 let</strong>. Kdy se ta výměna vyplatí a kdy je
              běžný účet s ETF jednodušší, rozebíráme dál – v korunách a bez prodeje.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="#vyplati-se" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Target className="w-4 h-4" /> Vyplatí se to zrovna vám?
              </Link>
              <Link href="#kolik-zpet" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Percent className="w-4 h-4" /> Kolik dostanete zpět
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Úspora v Kč</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* ÚVOD */}
        <section className="pb-9">
          <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed space-y-3">
            <p>
              DIP existuje od roku 2024 a je to <strong className="text-slate-900">daňový obal na spoření na stáří</strong>,
              ne konkrétní fond. Vložíte do něj běžné investice – nejčastěji ETF – a stát vám za to dá daňovou úlevu
              výměnou za jediné: že peníze necháte ležet do důchodu.
            </p>
            <p>
              Matematika té úlevy vypadá lákavě. Kdyby si někdo každý rok odečetl maximum a{' '}
              <strong className="text-slate-900">vrácenou daň 7 200 Kč pokaždé znovu investoval</strong>, mělo by z ní
              po 30 letech při modelovém výnosu 7 % ročně kolem <strong className="text-slate-900">{kc(compounded30)}</strong>.
              Jenže to je jen jedna strana. Druhou je zámek do šedesátky – a právě o něj jde, když se ptáte,
              jestli se DIP vyplatí zrovna vám.
            </p>
          </div>
        </section>

        {/* 1. KOLIK ZPĚT – tabulka */}
        <section className="pb-10" id="kolik-zpet">
          <SectionHead
            title="Kolik na DIP dostanete zpět"
            desc="Vklady si odečtete od základu daně až do 48 000 Kč ročně. Vratka daně = vaše sazba × odečtená částka. Není to výnos z investice, je to vrácená daň."
          />
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Roční vklad</th>
                  <th className="py-3 px-4 text-right font-medium">Jde na odpočet</th>
                  <th className="py-3 px-4 text-right font-medium">Zpět při 15 %</th>
                  <th className="py-3 px-4 text-right font-medium">Zpět při 23 %</th>
                </tr>
              </thead>
              <tbody>
                {CONTRIB_ROWS.map((c) => {
                  const used = Math.min(c, DEDUCTION_CAP);
                  return (
                    <tr key={c} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 px-4 font-semibold text-slate-900 tabular-nums">{kcRound(c)}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                        {kcRound(used)}
                        {c > DEDUCTION_CAP && <span className="text-slate-400 text-xs"> (strop)</span>}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-medium text-teal-700">{kcRound(used * 0.15)}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-500">{kcRound(used * 0.23)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-teal-100 bg-teal-50/50 p-4">
            <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              Strop <strong>48 000 Kč</strong> je společný pro DIP, penzijní připojištění, doplňkové penzijní spoření
              i životní pojištění dohromady – ne pro každý zvlášť. Máte-li už rozjeté penzijko blízko limitu, na DIP
              vám z odpočtu zbyde jen zbytek. Sazbu 23 % má v praxi jen menšina poplatníků s vysokým příjmem;
              většina počítá s 15 %.
            </p>
          </div>
        </section>

        {/* 2. REINVESTOVANÁ ÚSPORA */}
        <section className="pb-10">
          <SectionHead
            title="Co ta vrácená daň udělá v čase"
            desc="Kdo vratku daně nechá projíst a kdo ji pokaždé znovu investuje, dopadne po letech úplně jinak. Modelově 7 200 Kč ročně (maximální úspora při 15 %), reinvestováno při 7 % p.a."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {HORIZONS.map((y) => (
              <div key={y} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 mb-3"><Clock className="w-5 h-5" /></span>
                <p className="text-2xl font-bold text-teal-700 tabular-nums">{kc(fvAnnual(YEARLY_SAVING, RATE, y))}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  po <strong>{y} letech</strong> reinvestování roční úspory 7 200 Kč. Sami byste na daních zaplatili
                  o {kcRound(YEARLY_SAVING * y)} víc.
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Jde o modelový výpočet, ne o zaručený výnos – reálné číslo závisí na trhu i na tom, jestli vratku daně
            skutečně znovu investujete. Nominálně, před inflací. Vlastní vklad a horizont si zkusíte v{' '}
            <Link href="/investicni-kalkulacka" className="text-teal-700 hover:underline">investiční kalkulačce</Link>.
          </p>
        </section>

        {/* 3. PODMÍNKY 120/60 */}
        <section className="pb-10">
          <SectionHead
            title="Pravidlo 120/60 – cena za tu výhodu"
            desc="Daňová výhoda není zadarmo. Výměnou za ni se zavazujete nechat peníze ležet – a obě podmínky musí platit současně."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [Clock, '120 měsíců', 'DIP musí trvat alespoň 10 let (120 měsíců). Kratší trvání = daňová výhoda propadá, i kdyby vám už bylo přes 60.'],
              [Lock, 'A zároveň do 60 let', 'Peníze smíte vybrat nejdřív v roce, kdy dosáhnete 60 let. Splněných 10 let samo o sobě nestačí, pokud je vám míň.'],
              [AlertTriangle, 'Předčasný výběr', 'Vyberete-li dřív, dodaníte (vrátíte) uplatněné odpočty až 10 let zpětně a z příspěvků zaměstnavatele za 10 let odvedete 15 % daň.'],
            ] as [typeof Clock, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Praktický důsledek: <strong className="text-slate-700">do DIP patří jen peníze, které do šedesátky
            opravdu nebudete potřebovat</strong>. Nouzovou rezervu ani peníze na blízké cíle sem nedávejte – na to je
            určený <Link href="/nouzova-rezerva" className="text-teal-700 hover:underline">samostatný, dostupný účet</Link>.
          </p>
        </section>

        {/* 4. ZAMĚSTNAVATEL */}
        <section className="pb-10">
          <SectionHead
            title="Příspěvek zaměstnavatele – nejsilnější karta"
            desc="Pokud zaměstnavatel na DIP přispívá, je to zpravidla ta nejvýhodnější část celé skládačky – peníze, ze kterých nikdo neplatí daň ani odvody."
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 mb-3"><Gift className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Až {kcRound(EMPLOYER_CAP)} ročně bez daně</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Příspěvek zaměstnavatele na DIP je osvobozený od daně z příjmu i od sociálního a zdravotního pojištění
                až do {kcRound(EMPLOYER_CAP)} za rok (společný limit s penzijním spořením a životním pojištěním).
                Dostanete tedy celou částku, ne jen její zdaněný zbytek.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><Briefcase className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Zeptejte se na personálním</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Ne každý zaměstnavatel příspěvek nabízí – ale řada firem ho zavádí jako benefit vedle penzijka. Jestli
                ho máte k dispozici, je to typicky výhodnější než odpočet z vlastní kapsy. Za dotaz na HR nic nedáte.
              </p>
            </div>
          </div>
        </section>

        {/* 5. VYPLATÍ SE – jádro pilíře */}
        <section className="pb-10" id="vyplati-se">
          <SectionHead
            title="Vyplatí se DIP zrovna vám?"
            desc="DIP není dobrý ani špatný sám o sobě – je to nástroj. Otázka zní, jestli sedí na vaši situaci. Rozhodují dvě věci: jestli máte co danit a jestli peníze do 60 let opravdu nebudete potřebovat."
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-100 text-teal-700 border border-teal-200 mb-3"><CheckCircle2 className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Spíš ano, když…</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Máte zdanitelný příjem (zaměstnanec i OSVČ), takže odpočet reálně využijete.</li>
                <li className="flex items-start gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Stejně byste investovali dlouhodobě až do důchodu – zámek do 60 vám nevadí.</li>
                <li className="flex items-start gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Zaměstnavatel na DIP přispívá – to je peníze navíc, které jinde nezískáte.</li>
                <li className="flex items-start gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Je vám blíž k šedesátce – zámek je pak krátký a odpočet čistý bonus.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-700 border border-amber-200 mb-3"><XCircle className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Spíš ne, když…</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2 text-slate-600"><XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Můžete peníze potřebovat před šedesátkou – sankce sežere výhodu.</li>
                <li className="flex items-start gap-2 text-slate-600"><XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Nemáte zdanitelný příjem (student, dítě) – není co odečítat.</li>
                <li className="flex items-start gap-2 text-slate-600"><XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Ceníte si flexibility – běžný účet s ETF je po 3 letech stejně bez daně a kdykoli dostupný.</li>
                <li className="flex items-start gap-2 text-slate-600"><XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Odpočet už plně vyčerpáte penzijkem – druhý produkt už nový limit nepřidá.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. DIP vs BĚŽNÝ ÚČET */}
        <section className="pb-10">
          <SectionHead
            title="DIP vs. běžný účet s ETF"
            desc="Nejsou to soupeři na život a na smrt – jsou to dvě legální cesty, každá s jinou cenou. Rozdíl není ve výnosu fondu (ten je stejný), ale v daních a v tom, kdy se k penězům dostanete."
          />
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Vlastnost</th>
                  <th className="py-3 px-4 text-left font-medium">DIP</th>
                  <th className="py-3 px-4 text-left font-medium">Běžný účet s ETF</th>
                </tr>
              </thead>
              <tbody className="[&_td]:py-3 [&_td]:px-4 [&_td]:align-top">
                {([
                  ['Odpočet vkladů z daní', 'Ano, až 48 000 Kč/rok', 'Ne'],
                  ['Příspěvek zaměstnavatele', 'Možný, až 50 000 Kč/rok bez daně', 'Ne'],
                  ['Daň ze zisku', 'Osvobozeno po splnění podmínek', 'Osvobozeno po 3 letech držby (časový test)'],
                  ['Přístup k penězům', 'Až od 60 let a po 10 letech', 'Kdykoli'],
                  ['Sankce za předčasný výběr', 'Dodanění odpočtů 10 let zpět', 'Žádná'],
                  ['Na co se hodí', 'Peníze cíleně na důchod', 'Cokoli – i cíle před 60'],
                ] as [string, string, string][]).map(([label, dip, plain]) => (
                  <tr key={label} className="border-b border-slate-100 last:border-0">
                    <td className="font-medium text-slate-900">{label}</td>
                    <td className="text-slate-600">{dip}</td>
                    <td className="text-slate-600">{plain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Klíčový bod, který se v reklamách ztrácí: <strong className="text-slate-700">zisk z ETF je na běžném účtu
            po třech letech držby stejně osvobozený od daně</strong> (časový test, 3 roky). DIP tedy nepřidává „daň
            z osvobozeného" – přidává odpočet vkladů a příspěvek zaměstnavatele, a bere za to likviditu. Pravidla daní
            rozebírá <Link href="/dane-z-etf" className="text-teal-700 hover:underline">Daně z ETF (2026)</Link>.
          </p>
        </section>

        {/* 7. FONDY – živá data z DB */}
        {funds.length > 0 && (
          <section className="pb-10">
            <SectionHead
              title="Co do DIP dát: široké světové ETF"
              desc="DIP je jen obal – náplň si volíte sami. Pro dlouhý horizont do důchodu bývá jádrem široký světový index v akumulační třídě. Data z naší databáze, výnos v korunách."
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
              Do režimu DIP navíc nezařadí každý poskytovatel každý fond; nabídku si ověřte u toho svého. Rozdíl mezi
              indexy rozebírá <Link href="/svetove-etf-indexy" className="text-teal-700 hover:underline">Světové ETF indexy</Link>,
              všech {`4 800+`} fondů profiltrujete ve{' '}
              <Link href="/srovnani" className="text-teal-700 hover:underline">srovnávači</Link>.
            </p>
          </section>
        )}

        {/* 8. NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Spočítejte si to na svá čísla" desc="Tabulky výše jsou modelové. Zadejte vlastní vklad, výnos i horizont." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/investicni-kalkulacka', 'Investiční kalkulačka', 'Váš vklad, výnos, horizont – v Kč', Calculator],
              ['/fire-kalkulacka', 'FIRE kalkulačka', 'Kdy dosáhnete nezávislosti', PiggyBank],
              ['/dane-z-etf', 'Daně z ETF', 'Kdy platíte a kdy ne (2026)', Landmark],
              ['/portfolio-strategie', 'Modelová portfolia', 'Co do DIP vlastně poslat', Scale],
              ['/svetove-etf-indexy', 'Který světový ETF', 'MSCI World vs FTSE All-World', Globe],
              ['/investovani-pro-deti', 'Investování pro děti', 'Proč dítěti DIP nezakládat', LineChart],
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

        {/* 9. FAQ */}
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
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Výpočty jsou modelové (7 % p.a., nominálně před inflací) a mají vzdělávací charakter. Nejde o investiční ani daňové poradenství a skutečné výsledky se liší. Daňová pravidla DIP se mohou měnit – ověřte si aktuální stav a konkrétní situaci proberte s daňovým poradcem. Aktualizováno {dateStr}.</p>
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

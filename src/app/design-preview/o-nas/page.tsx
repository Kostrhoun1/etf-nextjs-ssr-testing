import { Metadata } from 'next';
import Link from 'next/link';
import AboutHeader from '@/components/design-preview/AboutHeader';
import InfoTip from '@/components/design-preview/InfoTip';
import {
  Linkedin, Mail, ArrowRight, History, Landmark, Users, Award,
  Database, Coins, Scale, BookOpen, ShieldCheck, ExternalLink,
} from 'lucide-react';

export const revalidate = 86400;

// Preview build → noindex. Ostrá /o-nas se MÁ indexovat (autoritní signál):
// na ostré routě se robots přepne na index:true (viz generateCanonicalMetadata).
export const metadata: Metadata = {
  title: 'O nás – kdo stojí za ETF průvodce.cz | Tomáš Kostrhoun',
  description:
    'Za ETF průvodce.cz stojí Tomáš Kostrhoun – 12 let ve financích, dříve ředitel úvěrů a hypoték v MONETA. Nezávislý srovnávač ETF s výnosy přepočtenými do korun.',
  robots: { index: false, follow: false },
};

// JSON-LD: Person (autor) + Organization (web s founder = ten Person).
const PERSON = {
  '@type': 'Person',
  '@id': 'https://www.etfpruvodce.cz/o-nas#tomas-kostrhoun',
  name: 'Tomáš Kostrhoun',
  jobTitle: 'Zakladatel a autor',
  description:
    'Zakladatel a autor ETF průvodce.cz. 12 let zkušeností ve financích, dříve ředitel úvěrů a hypoték v MONETA Money Bank.',
  sameAs: [
    'https://www.linkedin.com/in/tomaskostrhoun/',
    'https://x.com/ETFpruvodce',
  ],
  worksFor: { '@type': 'Organization', name: 'ETF průvodce.cz' },
  alumniOf: { '@type': 'Organization', name: 'MONETA Money Bank' },
  knowsAbout: ['ETF', 'investování', 'osobní finance', 'pasivní investování', 'finanční trhy'],
};

const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.etfpruvodce.cz/#organization',
  name: 'ETF průvodce.cz',
  url: 'https://www.etfpruvodce.cz',
  description:
    'Největší srovnávač ETF pro české investory – nezávislá data 4 300+ fondů s výnosy přepočtenými do korun.',
  founder: PERSON,
};

const EXPERTISE = [
  { icon: History, value: '12 let', label: 've financích', desc: 'Hypotéky, spotřebitelské úvěry a řízení byznysu v bankovnictví.' },
  { icon: Landmark, value: '150+ mld Kč', label: 'úvěrové portfolio', desc: 'Hodnota portfolia, které jsem v MONETA spravoval a řídil.' },
  { icon: Users, value: '30+ lidí', label: 'vedení týmu', desc: 'Přímé vedení obchodního a produktového týmu.' },
  { icon: Award, value: 'První v ČR', label: 'online hypotéka', desc: 'Uvedení první plně online hypotéky na český trh.' },
];

const METODIKA = [
  {
    icon: Database,
    title: 'Data ze 4 300+ fondů',
    desc: 'Žebříčky a srovnání čerpají z databáze tisíců evropských UCITS ETF, kterou denně aktualizujeme.',
  },
  {
    icon: Coins,
    title: 'Výnosy přepočtené do korun',
    desc: 'Vlastní výpočet pro českého investora – vidíte reálný výnos v Kč, ne jen v měně fondu.',
  },
  {
    icon: Scale,
    title: 'Nezávislé pořadí',
    desc: (
      <>
        Fondy řadíme podle reálných parametrů – <InfoTip label="Total Expense Ratio – roční poplatek za správu fondu, strhává se automaticky z hodnoty.">TER</InfoTip>, výnosů a velikosti, nikdy ne podle provize.
      </>
    ),
  },
  {
    icon: BookOpen,
    title: 'Vzdělávací charakter',
    desc: 'Web informuje a vzdělává. Nedáváme investiční doporučení ani neříkáme, co konkrétně kupovat.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }} />

      <AboutHeader />

      <main className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <span className="text-slate-600">O nás</span>
        </nav>

        {/* HERO – kdo za webem stojí */}
        <section className="pb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Kdo stojí za ETF průvodce.cz
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-2xl">
            ETF průvodce.cz je nezávislý srovnávač ETF pro české investory. Nestojí za ním anonymní
            redakce, ale konkrétní člověk s 12 lety praxe ve financích.
          </p>

          {/* Karta autora */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <span className="flex items-center justify-center w-20 h-20 shrink-0 rounded-full bg-teal-50 text-teal-700 text-2xl font-bold tracking-tight">
                TK
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900">Tomáš Kostrhoun</h2>
                <p className="text-sm font-medium text-teal-700">Zakladatel a autor</p>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Dříve ředitel úvěrů a hypoték v MONETA Money Bank.
                </p>
                <a
                  href="https://www.linkedin.com/in/tomaskostrhoun/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* BIO – zkrácené, skenovatelné */}
        <section className="pb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Pár slov ode mě</h2>
          <div className="space-y-4 text-base text-slate-600 leading-relaxed max-w-2xl">
            <p>
              Přes 12 let jsem se pohyboval ve financích – od hypoték přes spotřebitelské úvěry až po
              vedení úvěrového byznysu v MONETA Money Bank. Vedl jsem tým, řídil portfolio v hodnotě
              přes 150 miliard korun a pomáhal uvést na trh první plně online hypotéku v Česku.
            </p>
            <p>
              Při té práci jsem znovu a znovu narážel na jedno: nízkou finanční gramotnost. Lidé se
              spoléhali na rady prodejců, kteří preferovali drahé produkty s tučnými provizemi před
              jednoduchými a levnými řešeními. ETF přitom dělají investování dostupné každému –
              nízké náklady, široká diverzifikace, transparentnost.
            </p>
            <p>
              ETF průvodce.cz jsem založil proto, aby měl český investor nezávislý zdroj postavený na
              datech, ne na provizích. Vše počítám z reálných čísel a hlavně z pohledu člověka, který
              investuje v korunách.
            </p>
          </div>
        </section>

        {/* EXPERTÍZA – ikonové proof karty */}
        <section className="pb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-1">Z čeho ta zkušenost vychází</h2>
          <p className="text-sm text-slate-500 mb-5">Konkrétní, ověřitelná čísla z mé kariéry ve financích.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {EXPERTISE.map((e) => (
              <div key={e.label} className="rounded-xl border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3">
                  <e.icon className="w-5 h-5" />
                </span>
                <span className="block text-lg font-bold text-slate-900 tabular-nums leading-tight">{e.value}</span>
                <span className="block text-sm font-medium text-slate-700">{e.label}</span>
                <span className="block text-xs text-slate-500 mt-1.5 leading-snug">{e.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* JAK TVOŘÍME OBSAH / METODIKA */}
        <section className="pb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-1">Jak tvoříme obsah</h2>
          <p className="text-sm text-slate-500 mb-5">Odkud bereme data a podle čeho řadíme fondy.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {METODIKA.map((m, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3">
                <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-teal-50 text-teal-700">
                  <m.icon className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{m.title}</span>
                  <span className="block text-sm text-slate-500 mt-0.5 leading-relaxed">{m.desc}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/co-jsou-etf" className="inline-flex items-center gap-1.5 text-teal-700 font-medium hover:text-teal-800">
              Jak fungují ETF <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/srovnani-etf" className="inline-flex items-center gap-1.5 text-teal-700 font-medium hover:text-teal-800">
              Srovnat fondy podle dat <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* JAK WEB VYDĚLÁVÁME – affiliate disclosure */}
        <section className="pb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-5">Jak web vyděláváme</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-teal-50 text-teal-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div className="text-base text-slate-600 leading-relaxed space-y-3">
                <p>
                  Web je pro vás zdarma. Financuje se z provizí od brokerů (DEGIRO, XTB, Trading 212,
                  Interactive Brokers), když se přes naše odkazy někdo zaregistruje.
                </p>
                <p className="text-slate-900 font-medium">
                  Provize ale neovlivňuje pořadí ani hodnocení. Brokeři i fondy se řadí výhradně
                  podle reálných parametrů – poplatků, podmínek a nabídky.
                </p>
                <Link href="/kde-koupit-etf" className="inline-flex items-center gap-1.5 text-teal-700 font-medium hover:text-teal-800">
                  Srovnání brokerů pro české investory <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* KONTAKT */}
        <section className="pb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-5">Kontakt</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="mailto:info@etfpruvodce.cz"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors"
            >
              <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-slate-100 text-slate-600">
                <Mail className="w-5 h-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900">E-mail</span>
                <span className="block text-xs text-slate-500 truncate">info@etfpruvodce.cz</span>
              </span>
            </a>
            <a
              href="https://x.com/ETFpruvodce"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors"
            >
              <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-slate-100 text-slate-600">
                <ExternalLink className="w-5 h-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900">X (Twitter)</span>
                <span className="block text-xs text-slate-500 truncate">@ETFpruvodce</span>
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/tomaskostrhoun/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors"
            >
              <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-slate-100 text-slate-600">
                <Linkedin className="w-5 h-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900">LinkedIn</span>
                <span className="block text-xs text-slate-500 truncate">Tomáš Kostrhoun</span>
              </span>
            </a>
          </div>
        </section>

        {/* DISCLAIMER – na konec obsahu (YMYL) */}
        <section className="pb-10">
          <aside
            role="note"
            aria-label="Upozornění na investiční riziko"
            className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed"
          >
            <span className="font-semibold">Upozornění:</span> Obsah na ETF průvodce.cz má pouze
            vzdělávací a informativní charakter a <strong>nepředstavuje investiční doporučení</strong>{' '}
            ani nabídku k nákupu či prodeji cenných papírů. Minulá výkonnost není zárukou budoucích
            výnosů a hodnota investice může kolísat. Před investováním zvažte své cíle a rizikový
            profil, případně se poraďte s licencovaným poradcem.
          </aside>
        </section>
      </main>

      {/* Patička (vzor homepage) */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">ETF průvodce.cz</span>
          <p className="max-w-md text-center sm:text-right leading-relaxed">
            Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Minulá výkonnost
            nezaručuje budoucí výnosy.
          </p>
        </div>
      </footer>
    </div>
  );
}

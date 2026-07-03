import { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp, ArrowUpRight, Home, BookOpen, Rocket, BarChart3, Trophy, Grid3x3,
  LineChart, PieChart, Landmark, Image as ImageIcon, User, Banknote, Scale,
  Building2, Calculator, Percent, Coins, Dice5, History, Flame, ShieldAlert,
  Wallet, Receipt, Briefcase,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Náhled nového webu – rozcestník | ETF průvodce',
  robots: { index: false, follow: false },
};

type Item = { href: string; label: string; desc: string; icon: typeof Home };

const GROUPS: { title: string; intro: string; items: Item[] }[] = [
  {
    title: 'Hlavní stránky',
    intro: 'Jádro webu – od titulky po detail fondu.',
    items: [
      { href: '/design-preview', label: 'Homepage', desc: 'Titulní strana s USP a rozcestníkem.', icon: Home },
      { href: '/design-preview/pruvodce', label: 'Co jsou ETF', desc: 'Konceptuální průvodce pro začátečníky.', icon: BookOpen },
      { href: '/design-preview/jak-zacit', label: 'Jak začít investovat', desc: 'Akční roadmapa v 7 krocích.', icon: Rocket },
      { href: '/design-preview/srovnani', label: 'Srovnání ETF', desc: 'Hlavní srovnávací nástroj.', icon: BarChart3 },
      { href: '/design-preview/zebricky', label: 'Žebříčky (hub)', desc: 'Rozcestník všech žebříčků.', icon: Trophy },
      { href: '/design-preview/kategorie', label: 'Kategorie žebříčku', desc: 'Ukázka: nejlepší S&P 500 ETF.', icon: Grid3x3 },
      { href: '/design-preview/etf', label: 'Detail ETF fondu', desc: 'Ukázka: iShares Core S&P 500 (CSP1).', icon: LineChart },
      { href: '/design-preview/portfolio-strategie', label: 'Modelová portfolia', desc: '5 hotových strategií.', icon: PieChart },
      { href: '/design-preview/infografiky', label: 'Infografiky', desc: 'Vizuální přehledy z dat.', icon: ImageIcon },
      { href: '/design-preview/o-nas', label: 'O nás', desc: 'Kdo za webem stojí (E-E-A-T).', icon: User },
    ],
  },
  {
    title: 'Brokeři',
    intro: 'Kde a u koho ETF koupit.',
    items: [
      { href: '/design-preview/kde-koupit', label: 'Kde koupit ETF', desc: 'Výběr brokera krok za krokem.', icon: Banknote },
      { href: '/design-preview/srovnani-brokeru', label: 'Srovnání brokerů', desc: '6 brokerů se skóre /100.', icon: Scale },
      { href: '/design-preview/broker', label: 'Recenze brokera', desc: 'Šablona detailní recenze.', icon: Building2 },
    ],
  },
  {
    title: 'Kalkulačky a nástroje',
    intro: 'Interaktivní výpočty – zkus změnit vstupy i spustit simulace.',
    items: [
      { href: '/design-preview/kalkulacky', label: 'Rozcestník kalkulaček', desc: 'Přehled všech nástrojů.', icon: Calculator },
      { href: '/design-preview/investicni-kalkulacka', label: 'Investiční kalkulačka', desc: 'Složené úročení + graf.', icon: TrendingUp },
      { href: '/design-preview/kalkulacka', label: 'Kalkulačka poplatků', desc: 'Dopad TER na výnos.', icon: Percent },
      { href: '/design-preview/kurzovy-dopad', label: 'Kurzový dopad ETF', desc: 'Vliv kurzu USD/CZK.', icon: Coins },
      { href: '/design-preview/monte-carlo', label: 'Monte Carlo simulátor', desc: 'Pravděpodobnostní scénáře.', icon: Dice5 },
      { href: '/design-preview/backtest', label: 'Backtest portfolia', desc: 'Test na historických datech.', icon: History },
      { href: '/design-preview/fire-kalkulacka', label: 'FIRE kalkulačka', desc: 'Finanční nezávislost.', icon: Flame },
      { href: '/design-preview/nouzova-rezerva', label: 'Nouzová rezerva', desc: 'Kolik mít stranou.', icon: ShieldAlert },
      { href: '/design-preview/cisty-plat', label: 'Čistá mzda 2025', desc: 'Hrubá → čistá.', icon: Receipt },
      { href: '/design-preview/hypotecni-kalkulacka', label: 'Hypoteční kalkulačka', desc: 'Splátka a přeplatek.', icon: Landmark },
      { href: '/design-preview/uverova-kalkulacka', label: 'Úvěrová kalkulačka', desc: 'Spotřebitelský úvěr.', icon: Wallet },
    ],
  },
];

export default function PrehledNovehoWebu() {
  const total = GROUPS.reduce((s, g) => s + g.items.length, 0);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce — náhled
          </span>
          <span className="text-xs text-slate-400">{total} stránek</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <section className="py-8 md:py-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
            <Briefcase className="w-3.5 h-3.5" /> Rozcestník redesignu
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Náhled nového webu</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
            Všechny nově navržené stránky na jednom místě. Klikni na kteroukoli a prohlédni si ji.
            U kalkulaček zkus měnit vstupy a spouštět simulace.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-400 leading-relaxed">
            Pozn.: horní menu a odkazy uvnitř stránek zatím míří na ostrý (starý) web – proto se
            mezi novými stránkami vracej přes tento rozcestník.
          </p>
        </section>

        {GROUPS.map((g) => (
          <section key={g.title} className="pb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">{g.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{g.intro}</p>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className="group rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700">
                      <it.icon className="w-4 h-4" />
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700" />
                  </span>
                  <p className="mt-2.5 font-semibold text-slate-900 text-sm">{it.label}</p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{it.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

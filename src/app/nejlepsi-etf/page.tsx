import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {
  StarFilledIcon,
  ArrowRightIcon,
  BarChart3Icon,
  GlobeIcon,
  TargetIcon,
  BuildingIcon,
  BrainIcon,
  ShieldIcon,
  DollarIcon,
  AwardIcon
} from '@/components/ui/icons';
import type { Metadata } from 'next';
import { generateCanonicalMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateCanonicalMetadata(
  '/nejlepsi-etf',
  'Nejlepší ETF 2025 - Kompletní přehled podle kategorií',
  'Přehled nejlepších ETF fondů 2025: indexy, regiony, sektory, strategie. S&P 500, MSCI World, dividendové, technologické ETF pro české investory.',
  {
    keywords: 'nejlepší ETF 2025, top ETF, S&P 500 ETF, MSCI World ETF, dividendové ETF, technologické ETF'
  }
);

const categories = [
  {
    title: "Podle indexů",
    icon: BarChart3Icon,
    color: "blue",
    links: [
      { href: "/nejlepsi-etf/nejlepsi-sp500-etf", label: "S&P 500 ETF" },
      { href: "/nejlepsi-etf/nejlepsi-nasdaq-etf", label: "NASDAQ ETF" },
      { href: "/nejlepsi-etf/nejlepsi-msci-world-etf", label: "MSCI World ETF" },
      { href: "/nejlepsi-etf/nejlepsi-stoxx600-etf", label: "STOXX 600 ETF" },
      { href: "/nejlepsi-etf/nejlepsi-ftse100-etf", label: "FTSE 100 ETF" },
      { href: "/nejlepsi-etf/nejlepsi-dax-etf", label: "DAX ETF" },
    ]
  },
  {
    title: "Podle regionů",
    icon: GlobeIcon,
    color: "green",
    links: [
      { href: "/nejlepsi-etf/nejlepsi-celosvetove-etf", label: "Celosvětové ETF" },
      { href: "/nejlepsi-etf/nejlepsi-americke-etf", label: "Americké ETF" },
      { href: "/nejlepsi-etf/nejlepsi-evropske-etf", label: "Evropské ETF" },
      { href: "/nejlepsi-etf/nejlepsi-emerging-markets-etf", label: "Emerging Markets" },
      { href: "/nejlepsi-etf/nejlepsi-cinske-etf", label: "Čínské ETF" },
      { href: "/nejlepsi-etf/nejlepsi-japonske-etf", label: "Japonské ETF" },
      { href: "/nejlepsi-etf/nejlepsi-asijsko-pacificke-etf", label: "Asijsko-pacifické" },
    ]
  },
  {
    title: "Podle strategie",
    icon: TargetIcon,
    color: "purple",
    links: [
      { href: "/nejlepsi-etf/nejlepsi-dividendove-etf", label: "Dividendové ETF" },
      { href: "/nejlepsi-etf/nejlepsi-value-etf", label: "Value ETF" },
      { href: "/nejlepsi-etf/nejlepsi-growth-etf", label: "Growth ETF" },
      { href: "/nejlepsi-etf/nejlepsi-esg-etf", label: "ESG ETF" },
      { href: "/nejlepsi-etf/nejlepsi-small-cap-etf", label: "Small Cap ETF" },
    ]
  },
  {
    title: "Tradiční sektory",
    icon: BuildingIcon,
    color: "orange",
    links: [
      { href: "/nejlepsi-etf/nejlepsi-technologicke-etf", label: "Technologické ETF" },
      { href: "/nejlepsi-etf/nejlepsi-healthcare-etf", label: "Healthcare ETF" },
      { href: "/nejlepsi-etf/nejlepsi-financni-etf", label: "Finanční ETF" },
      { href: "/nejlepsi-etf/nejlepsi-energeticke-etf", label: "Energetické ETF" },
      { href: "/nejlepsi-etf/nejlepsi-spotrebni-etf", label: "Spotřební ETF" },
    ]
  },
  {
    title: "Moderní trendy",
    icon: BrainIcon,
    color: "pink",
    links: [
      { href: "/nejlepsi-etf/nejlepsi-ai-etf", label: "AI & Umělá inteligence" },
      { href: "/nejlepsi-etf/nejlepsi-clean-energy-etf", label: "Čistá energie" },
      { href: "/nejlepsi-etf/nejlepsi-biotechnologie-etf", label: "Biotechnologie" },
      { href: "/nejlepsi-etf/nejlepsi-robotika-etf", label: "Robotika" },
      { href: "/nejlepsi-etf/nejlepsi-cloud-etf", label: "Cloud Computing" },
      { href: "/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf", label: "Kyberbezpečnost" },
      { href: "/nejlepsi-etf/nejlepsi-defense-etf", label: "Defense & Obrana" },
    ]
  },
  {
    title: "Třídy aktiv",
    icon: ShieldIcon,
    color: "indigo",
    links: [
      { href: "/nejlepsi-etf/nejlepsi-dluhopisove-etf", label: "Dluhopisové ETF" },
      { href: "/nejlepsi-etf/nejlepsi-zlate-etf", label: "Zlato ETF" },
      { href: "/nejlepsi-etf/nejlepsi-komoditni-etf", label: "Komoditní ETF" },
      { href: "/nejlepsi-etf/nejlepsi-nemovitostni-etf", label: "REIT / Nemovitosti" },
    ]
  },
  {
    title: "Podle nákladů",
    icon: DollarIcon,
    color: "emerald",
    links: [
      { href: "/nejlepsi-etf/nejlevnejsi-etf", label: "Nejlevnější ETF" },
      { href: "/nejlepsi-etf/etf-zdarma-degiro", label: "ETF zdarma (DEGIRO)" },
    ]
  },
];

const colorStyles: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", iconBg: "bg-blue-100" },
  green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", iconBg: "bg-green-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", iconBg: "bg-purple-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", iconBg: "bg-orange-100" },
  pink: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", iconBg: "bg-pink-100" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", iconBg: "bg-indigo-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", iconBg: "bg-emerald-100" },
};

const currentYear = new Date().getFullYear();

export default function NejlepsiETFPage() {
  return (
    <Layout>
      {/* Compact Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nejlepší ETF {currentYear}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Kompletní přehled ETF fondů podle kategorií pro české investory
            </p>

            {/* Featured CTA */}
            <Link
              href="/nejlepsi-etf/nejlepsi-etf-2025"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all shadow-lg hover:shadow-xl"
            >
              <StarFilledIcon className="w-6 h-6" />
              TOP 10 nejlepších ETF {currentYear}
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Compact Category Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Kategorií", value: "7" },
              { label: "ETF článků", value: "36+" },
              { label: "Analyzovaných fondů", value: "4300+" },
              { label: "Aktualizace", value: "Denně" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Category Columns */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const styles = colorStyles[category.color];

              return (
                <div
                  key={category.title}
                  className={`${styles.bg} ${styles.border} border rounded-xl p-5`}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${styles.iconBg} p-2 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${styles.text}`} />
                    </div>
                    <h2 className={`font-bold ${styles.text}`}>{category.title}</h2>
                  </div>

                  {/* Links */}
                  <ul className="space-y-2">
                    {category.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 group py-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-gray-600 transition-colors"></span>
                          <span className="text-sm group-hover:underline">{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Nevíte, které ETF vybrat?
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Použijte náš interaktivní nástroj pro srovnání všech ETF nebo se podívejte na doporučení brokerů.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/srovnani-etf"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <BarChart3Icon className="w-5 h-5" />
                Srovnat ETF
              </Link>
              <Link
                href="/kde-koupit-etf"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                <AwardIcon className="w-5 h-5" />
                Kde koupit ETF
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

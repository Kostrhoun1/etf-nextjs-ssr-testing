import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, TrendingUp, DollarSign, Shield, Clock, Target, Users, BarChart3, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ETF vs akcie: Kompletní srovnání | Výhody a nevýhody | ETF průvodce.cz',
  description: 'Kompletní srovnání ETF fondů a individuálních akcií. Zjistěte výhody, nevýhody, náklady a rizika. Průvodce pro správnou volbu investice.',
  keywords: [
    'ETF vs akcie',
    'akcie vs ETF',
    'srovnání ETF akcie',
    'individuální akcie ETF',
    'výhody ETF',
    'nevýhody akcií',
    'diverzifikace portfolio',
    'náklady ETF akcie',
    'riziko investování',
    'aktivní pasivní investování'
  ],
  openGraph: {
    title: 'ETF vs akcie: Kompletní srovnání výhod a nevýhod',
    description: 'Detailní srovnání ETF fondů a individuálních akcií. Zjistěte, která investice je vhodnější pro váš typ investora.',
    type: 'article',
    locale: 'cs_CZ'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ETF vs akcie: Kompletní srovnání',
    description: 'Detailní srovnání ETF fondů a individuálních akcií pro české investory.'
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/etf-vs-akcie'
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'ETF vs akcie: Kompletní srovnání výhod a nevýhod',
  description: 'Detailní srovnání ETF fondů a individuálních akcií včetně nákladů, rizik a vhodnosti pro různé typy investorů.',
  author: {
    '@type': 'Organization',
    name: 'ETF průvodce.cz'
  },
  publisher: {
    '@type': 'Organization',
    name: 'ETF průvodce.cz'
  },
  datePublished: '2025-01-20',
  dateModified: '2025-01-20',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.etfpruvodce.cz/etf-vs-akcie'
  }
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jsou ETF fondy lepší než individuální akcie?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Závisí na vašich cílech a zkušenostech. ETF poskytují okamžitou diverzifikaci a jsou vhodné pro začátečníky, zatímco individuální akcie mohou přinést vyšší výnosy, ale vyžadují více času a znalostí.'
      }
    },
    {
      '@type': 'Question',
      name: 'Jaké jsou hlavní výhody ETF oproti akciím?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hlavní výhody ETF: okamžitá diverzifikace, nižší riziko, pasivní správa, nižší náklady na vstup, automatická reinvestice dividend a jednoduchá správa portfolia.'
      }
    },
    {
      '@type': 'Question',
      name: 'Kdy je lepší investovat do individuálních akcií?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Individuální akcie jsou vhodné pro zkušené investory s dostatkem času na analýzu, kteří chtějí aktivně řídit portfolio a jsou ochotni akceptovat vyšší riziko za potenciálně vyšší výnosy.'
      }
    }
  ]
};

export default function ETFvsAkcieVyhodPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-violet-600" />
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ETF <span className="text-violet-600">vs</span> akcie
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kompletní srovnání ETF fondů a individuálních akcií. Zjistěte výhody, nevýhody 
              a který přístup je vhodnější pro váš typ investora.
            </p>
          </div>

          {/* Quick comparison table */}
          <Card className="mb-12 overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Rychlé srovnání</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 font-semibold">Kritérium</th>
                      <th className="text-center p-4 font-semibold text-violet-600">ETF fondy</th>
                      <th className="text-center p-4 font-semibold text-blue-600">Individuální akcie</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium">Diverzifikace</td>
                      <td className="p-4 text-center">
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                        <span className="text-sm text-green-600 block mt-1">Okamžitá</span>
                      </td>
                      <td className="p-4 text-center">
                        <XCircle className="h-6 w-6 text-red-500 mx-auto" />
                        <span className="text-sm text-red-600 block mt-1">Ruční</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="p-4 font-medium">Potřeba analýzy</td>
                      <td className="p-4 text-center">
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                        <span className="text-sm text-green-600 block mt-1">Minimální</span>
                      </td>
                      <td className="p-4 text-center">
                        <XCircle className="h-6 w-6 text-red-500 mx-auto" />
                        <span className="text-sm text-red-600 block mt-1">Vysoká</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium">Potenciální výnos</td>
                      <td className="p-4 text-center">
                        <span className="text-violet-600 font-semibold">7-10%</span>
                        <span className="text-sm text-gray-500 block mt-1">Průměr trhu</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-blue-600 font-semibold">Neomezený</span>
                        <span className="text-sm text-gray-500 block mt-1">Ale i ztráty</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="p-4 font-medium">Časová náročnost</td>
                      <td className="p-4 text-center">
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                        <span className="text-sm text-green-600 block mt-1">Nízká</span>
                      </td>
                      <td className="p-4 text-center">
                        <XCircle className="h-6 w-6 text-red-500 mx-auto" />
                        <span className="text-sm text-red-600 block mt-1">Vysoká</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium">Vstupní náklady</td>
                      <td className="p-4 text-center">
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                        <span className="text-sm text-green-600 block mt-1">Nízké</span>
                      </td>
                      <td className="p-4 text-center">
                        <XCircle className="h-6 w-6 text-red-500 mx-auto" />
                        <span className="text-sm text-red-600 block mt-1">Vyšší</span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 font-medium">Vhodné pro</td>
                      <td className="p-4 text-center">
                        <Badge variant="outline" className="text-violet-600 border-violet-600">
                          Začátečníky
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          Pokročilé
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ETF fondy - výhody a nevýhody */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-violet-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-violet-600">ETF fondy</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Výhody ETF
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Okamžitá diverzifikace:</strong> Jeden ETF obsahuje stovky či tisíce akcií</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Nízké náklady:</strong> TER obvykle 0,05-0,75% ročně</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Pasivní investování:</strong> Minimální čas na správu portfolia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Průměrné výnosy trhu:</strong> Dlouhodobě 7-10% ročně</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Vhodné pro začátečníky:</strong> Jednoduché na pochopení</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Nevýhody ETF
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Průměrné výnosy:</strong> Nemůžete překonat trh</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Poplatky za správu:</strong> Ročně se odečítá TER</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Omezená kontrola:</strong> Nemůžete vybírat konkrétní akcie</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-600">Individuální akcie</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Výhody akcií
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Neomezený potenciál:</strong> Možnost dosáhnout výrazně vyšších výnosů</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Plná kontrola:</strong> Sami rozhodujete o každé investici</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Vyšší dividendy:</strong> Můžete vybrat akcie s vysokými dividendami</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Vzdělávací hodnota:</strong> Učíte se o firmách a trzích</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Nevýhody akcií
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Vysoké riziko:</strong> Možnost ztráty celé investice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Časová náročnost:</strong> Potřeba stálého sledování a analýzy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Potřeba znalostí:</strong> Nutnost rozumět fundamentální analýze</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Vyšší náklady:</strong> Transakční poplatky za každý nákup/prodej</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kdo by měl investovat do čeho */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Pro koho je vhodná která strategie?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-violet-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-violet-600 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    ETF fondy jsou ideální pro:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Začátečníky:</strong> Kteří chtějí začít investovat bez složité analýzy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Zaneprázdněné:</strong> Kteří nemají čas na sledování jednotlivých akcií</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Konzervativní investory:</strong> Kteří preferují stabilní růst</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Dlouhodobé investory:</strong> S investičním horizontem 10+ let</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Malé investory:</strong> S kapitálem do 100 000 Kč</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Individuální akcie pro:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Zkušené investory:</strong> S několika lety zkušeností na trzích</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Aktivní obchodníky:</strong> Kteří chtějí aktivně řídit portfolio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Větší investory:</strong> S kapitálem nad 500 000 Kč</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Rizikové investory:</strong> Ochotné akceptovat vysokou volatilitu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Analyticky nadané:</strong> Kteří umí číst finanční výkazy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nákladové srovnání */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Srovnání nákladů</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-violet-600 mb-4">ETF fondy - náklady</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">TER (roční poplatek)</span>
                      <span className="text-violet-600 font-bold">0,05-0,75%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Vstupní poplatek</span>
                      <span className="text-green-600 font-bold">0 Kč</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Výstupní poplatek</span>
                      <span className="text-green-600 font-bold">0 Kč</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Broker poplatek</span>
                      <span className="text-orange-600 font-bold">0-10 €</span>
                    </div>
                    <div className="bg-violet-50 p-3 rounded mt-4">
                      <p className="text-sm text-violet-700">
                        <strong>Příklad:</strong> Při investici 100 000 Kč zaplatíte ročně 50-750 Kč na TER.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Individuální akcie - náklady</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Roční poplatek</span>
                      <span className="text-green-600 font-bold">0%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Transakční poplatek</span>
                      <span className="text-red-600 font-bold">2-20 €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Spread</span>
                      <span className="text-orange-600 font-bold">0,01-0,5%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Kurzové riziko</span>
                      <span className="text-red-600 font-bold">Ano</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded mt-4">
                      <p className="text-sm text-blue-700">
                        <strong>Příklad:</strong> 10 nákupů ročně = 200-2000 Kč na poplatcích + spread.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kombinovaná strategie */}
          <Card className="mb-12 bg-gradient-to-r from-violet-50 to-blue-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">💡 Kombinovaná strategie</h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-center mb-6 text-gray-700">
                  Nejlepší přístup často kombinuje výhody obou strategií podle pravidla <strong>&quot;Core-Satellite&quot;</strong>
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-violet-600" />
                    </div>
                    <h3 className="font-bold text-violet-600 mb-2">Core (80% portfolia)</h3>
                    <p className="text-sm">Široce diverzifikované ETF jako základ portfolia</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-blue-600 mb-2">Satellite (20% portfolia)</h3>
                    <p className="text-sm">Individuální akcie pro vyšší výnos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Často kladené otázky</h2>
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="border-l-4 border-violet-500 pl-6">
                  <h3 className="text-lg font-semibold mb-2">Jsou ETF fondy lepší než individuální akcie?</h3>
                  <p className="text-gray-700">
                    Závisí na vašich cílech a zkušenostech. ETF poskytují okamžitou diverzifikaci a jsou vhodné pro začátečníky, 
                    zatímco individuální akcie mohou přinět vyšší výnosy, ale vyžadují více času a znalostí.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold mb-2">Jaké jsou hlavní výhody ETF oproti akciím?</h3>
                  <p className="text-gray-700">
                    Hlavní výhody ETF: okamžitá diverzifikace, nižší riziko, pasivní správa, nižší náklady na vstup, 
                    automatická reinvestice dividend a jednoduchá správa portfolia.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold mb-2">Kdy je lepší investovat do individuálních akcií?</h3>
                  <p className="text-gray-700">
                    Individuální akcie jsou vhodné pro zkušené investory s dostatkem času na analýzu, kteří chtějí aktivně 
                    řídit portfolio a jsou ochotni akceptovat vyšší riziko za potenciálně vyšší výnosy.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-lg font-semibold mb-2">Mohu kombinovat ETF a individuální akcie?</h3>
                  <p className="text-gray-700">
                    Ano! Mnoho investorů používá strategii &quot;Core-Satellite&quot;, kde 70-80% portfolia tvoří ETF (stabilní základ) 
                    a 20-30% individuální akcie (pro vyšší výnos). Tato kombinace nabízí výhody obou přístupů.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to action */}
          <div className="text-center bg-gradient-to-r from-violet-600 to-blue-600 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Začněte investovat ještě dnes</h2>
            <p className="text-lg mb-6 opacity-90">
              Ať už se rozhodnete pro ETF nebo akcie, důležité je začít. Čím dříve začnete, 
              tím více využijete sílu složeného úročení.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/nejlepsi-etf-2025" className="bg-white text-violet-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Nejlepší ETF pro rok 2025
              </Link>
              <Link href="/kde-koupit-etf" className="bg-violet-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-400 transition-colors">
                Kde koupit ETF
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
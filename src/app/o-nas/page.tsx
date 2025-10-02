import Layout from '@/components/Layout';
import { Metadata } from 'next';
import { Mail, LinkedinIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'O nás - ETF průvodce.cz',
  description: 'Seznamte se s Tomášem Kostrhoun, autorem ETF průvodce.cz. Fintech expert s 12letou zkušeností v bankovnictví, jehož cílem je zvýšení investiční gramotnosti v České republice.',
  alternates: {
    canonical: '/o-nas'
  }
};

export default function AboutPage() {
  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero sekce */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">O projektu ETF průvodce.cz</h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Moderní a komplexní průvodce světem ETF fondů pro české investory. 
              Náš cíl je zvýšení investiční gramotnosti v České republice prostřednictvím 
              kvalitních vzdělávacích materiálů a pokročilých analytických nástrojů.
            </p>
          </div>

          {/* Autor sekce */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Autor projektu</h2>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Tomáš Kostrhoun</h3>
                  <p className="text-lg text-violet-600 font-medium">Fintech expert & Founder</p>
                </div>

                <p className="text-lg">
                  S více než <strong>12letou zkušeností</strong> v oblasti hypotéčních úvěrů, spotřebitelského úvěrování 
                  a řízení P&L jsem přešel z pozice <strong>Head of Loans & Mortgages v MONETA Money Bank</strong> 
                  k roli nezávislého poradce a zakladatele fintech projektů.
                </p>

                <p>
                  Moje expertiza se zaměřuje na produktovou strategii, oceňování a digitální automatizaci. 
                  V průběhu své kariéry jsem vedl tým 30+ FTE, spravoval úvěrové portfolio v hodnotě 
                  <strong>150+ miliard CZK</strong> a uvedl na trh <strong>první end-to-end online hypotéku</strong> 
                  v České republice.
                </p>

                <p>
                  Aktuálně se věnujem budování fintech a poradenských platforem zaměřených na 
                  osobní finance, hypotéky a spotřebitelské úvěrování napříč CEE/EU regiony. 
                  Má práce se zaměřuje na objevování problémů, sizing trhů a vývoj MVP roadmap, 
                  přičemž navrhuji cenové modely, koncepty úvěrových rizik a digitální procesy.
                </p>

                <div className="bg-white rounded-lg p-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Mise ETF průvodce.cz</h4>
                  <p className="text-gray-700">
                    Věřím, že kvalitní investiční vzdělání by mělo být dostupné každému. 
                    ETF průvodce.cz vznikl z potřeby poskytnut českým investorům nástroje a informace, 
                    které jim pomohou činit informovaná investiční rozhodnutí. Naším jedinečným přínosem 
                    je zobrazování výkonnosti ETF fondů přepočítané do českých korun, což umožňuje 
                    reálné porovnání pro české investory.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kontakt sekce */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Spojte se s námi</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a 
                href="mailto:info@etfpruvodce.cz" 
                className="flex items-center gap-3 bg-violet-100 hover:bg-violet-200 text-violet-700 px-6 py-3 rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5" />
                info@etfpruvodce.cz
              </a>
              
              <a 
                href="https://x.com/ETFpruvodce" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                @ETFpruvodce
              </a>
              
              <a 
                href="https://www.linkedin.com/in/tomas-kostrhoun-b34a6831" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Zpět domů */}
          <div className="text-center mt-12">
            <Link 
              href="/" 
              className="inline-flex items-center text-violet-600 hover:text-violet-700 font-medium"
            >
              ← Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import Logo from '../Logo';
import LastUpdatedInfo from '../LastUpdatedInfo';

interface FooterProps {
  lastUpdated?: Date | null;
}

const Footer: React.FC<FooterProps> = ({ lastUpdated }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Logo size={180} />
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Váš moderní a komplexní průvodce světem ETF fondů pro české investory.
              Srovnání, analýzy a vzdělávací obsah pro vaše investiční rozhodnutí.
            </p>

            <div className="space-y-3">
              <h4 className="text-slate-200 font-semibold">Kontakt</h4>
              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@etfpruvodce.cz" className="hover:text-white transition-colors">
                  info@etfpruvodce.cz
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <a href="https://x.com/ETFpruvodce" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  @ETFpruvodce
                </a>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-slate-200 font-semibold mb-4">Nástroje</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/srovnani-etf" className="hover:text-white transition-colors">Srovnání ETF</Link></li>
                <li><Link href="/portfolio-strategie" className="hover:text-white transition-colors">Portfolio Strategie</Link></li>
                <li><Link href="/kalkulacky" className="hover:text-white transition-colors">Kalkulačky</Link></li>
                <li><Link href="/nejlepsi-etf/nejlevnejsi-etf" className="hover:text-white transition-colors">Nejlevnější ETF</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-semibold mb-4">Vzdělání</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/co-jsou-etf" className="hover:text-white transition-colors">Co jsou ETF</Link></li>
                <li><Link href="/kde-koupit-etf" className="hover:text-white transition-colors">Kde koupit ETF</Link></li>
                <li><Link href="/co-jsou-etf/jak-zacit-investovat" className="hover:text-white transition-colors">Jak začít investovat</Link></li>
                <li><Link href="/o-nas" className="hover:text-white transition-colors">O nás</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-semibold mb-4">Brokeři</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/portu-recenze" className="hover:text-white transition-colors">Portu</Link></li>
                <li><Link href="/xtb-recenze" className="hover:text-white transition-colors">XTB</Link></li>
                <li><Link href="/degiro-recenze" className="hover:text-white transition-colors">DEGIRO</Link></li>
                <li><Link href="/trading212-recenze" className="hover:text-white transition-colors">Trading212</Link></li>
                <li><Link href="/interactive-brokers-recenze" className="hover:text-white transition-colors">Interactive Brokers</Link></li>
                <li><Link href="/fio-ebroker-recenze" className="hover:text-white transition-colors">Fio eBroker</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-slate-500">
              <span>&copy; 2025 ETF průvodce.cz. Všechna práva vyhrazena.</span>
              <span className="hidden sm:inline">•</span>
              <span>
                Autor:
                <a href="https://www.linkedin.com/in/tomas-kostrhoun-b34a6831" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors ml-1">
                  Tomáš Kostrhoun
                </a>
              </span>
            </div>
            {lastUpdated && (
              <LastUpdatedInfo lastUpdated={lastUpdated} className="text-slate-500" />
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

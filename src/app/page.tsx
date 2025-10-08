import { supabaseAdmin } from '@/lib/supabase';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import USPSection from '@/components/home/USPSection';
import TopETFTabs from '@/components/home/TopETFTabs';
import BrokerComparisonSection from '@/components/home/BrokerComparisonSection';
import FAQSection from '@/components/SEO/FAQSection';
import PortfolioStrategiesTeaser from '@/components/home/PortfolioStrategiesTeaser';
import InternalLinking from '@/components/SEO/InternalLinking';
import SEOHead from '@/components/SEO/SEOHead';
import GlobalSEO from '@/components/SEO/GlobalSEO';
import { getTopETFsByCategories } from '@/lib/getTopETFsByCategories';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ETF průvodce 2025 🇨🇿 - Nejlepší ETF fondy pro české investory',
  description: '★ ZDARMA ETF průvodce ★ Najděte nejlepší ETF fondy 2025. Kde koupit ETF, srovnání poplatků, DEGIRO ETF zdarma. Kompletní guide pro české investory s 3500+ ETF databází.',
  keywords: 'nejlepší ETF, ETF fondy, kde koupit ETF, co jsou ETF, ETF poplatky, DEGIRO ETF, dividendové ETF, S&P 500 ETF, ETF srovnání, česky investování',
  openGraph: {
    title: 'ETF průvodce.cz - Nejlepší ETF fondy pro české investory',
    description: 'Kompletní databáze 3500+ ETF fondů s analýzami a kalkulačkami pro české investory.',
    url: 'https://etfpruvodce.cz/',
    siteName: 'ETF průvodce.cz',
    images: [
      {
        url: 'https://etfpruvodce.cz/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ETF průvodce.cz - Nejlepší ETF fondy pro české investory',
      },
    ],
    locale: 'cs_CZ',
    type: 'website',
  },
  alternates: {
    canonical: 'https://etfpruvodce.cz/'
  }
};

async function getETFCount() {
  const { count } = await supabaseAdmin
    .from('etf_funds')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

export default async function HomePage() {
  const totalETFCount = await getETFCount();
  const topETFCategories = await getTopETFsByCategories();

  return (
    <Layout>
      <GlobalSEO />
      
      {/* HERO sekce - s integrovaným Portfolio CTA */}
      <HeroSection totalCount={totalETFCount} />

      {/* USP sekce - kompaktní */}
      <USPSection />

      {/* TOP ETF PODLE KATEGORIÍ - RYCHLÝ NÁHLED */}
      <TopETFTabs categories={topETFCategories} totalETFCount={totalETFCount} />

      {/* SROVNÁNÍ BROKERŮ */}
      <BrokerComparisonSection />


      {/* FAQ sekce */}
      <FAQSection 
        title="Často kladené otázky o ETF fondech"
        faqs={[
          {
            question: "Co jsou ETF fondy a proč investovat do ETF?",
            answer: "ETF (Exchange-Traded Fund) jsou indexové fondy obchodované na burze. Nabízejí nízké poplatky, širokou diverzifikaci a jednoduchost investování. Jsou ideální pro začátečníky i pokročilé investory."
          },
          {
            question: "Který broker je nejlepší pro nákup ETF v České republice?",
            answer: "Nejlepším brokerem je Portu (98/100 bodů) pro automatizované investování. Pro aktivní obchodování je výborný XTB (94/100) s 0% poplatky, Trading212 (87/100) či DEGIRO (79/100) s nízkými poplatky."
          },
          {
            question: "Jaké jsou nejlepší ETF fondy pro rok 2025?",
            answer: "Pro dlouhodobé investování doporučujeme: VWCE (celý svět), CSPX (S&P 500), EUNL (evropské akcie) a VFEM (rozvíjející se trhy). Tyto ETF nabízejí širokou diverzifikaci a nízké poplatky."
          },
          {
            question: "Kolik stojí investování do ETF fondů?",
            answer: "Náklady se skládají z poplatků brokera a ročních poplatků fondu (TER 0,1-0,7%). Nejlepší brokeři: Portu (0,24-1% ročně), XTB a Trading212 (0% poplatky), DEGIRO (1-3 EUR za transakci)."
          },
          {
            question: "Jak funguje zdanění ETF fondů v ČR?",
            answer: "Zisky z prodeje ETF se zdaňují 15% daní z příjmů po odpočtu testů. Dividendy podléhají srážkové dani dle smlouvy o zamezení dvojího zdanění. ETF s akumulací dividend jsou daňově výhodnější."
          },
          {
            question: "Lze investovat do ETF s malými částkami?",
            answer: "Ano, u nejlepších brokerů můžete začít s malými částkami: Portu od 500 Kč, XTB a Trading212 od 1 EUR. Většina nabízí automatické investování a frakční ETF pro malé pravidelné investice."
          }
        ]}
        className="mt-16 bg-gray-50"
      />

      {/* Portfolio Strategies Teaser */}
      <PortfolioStrategiesTeaser />


      {/* Related Content Links */}
      <InternalLinking 
        relatedLinks={[
          { title: "Srovnání ETF fondů", href: "/srovnani-etf", description: "Porovnejte více než 3500 ETF fondů" },
          { title: "Portfolio Strategie", href: "/portfolio-strategie", description: "5 ověřených investičních strategií" },
          { title: "Kde koupit ETF", href: "/kde-koupit-etf", description: "Nejlepší brokeři pro české investory" },
          { title: "Nejlevnější ETF fondy", href: "/nejlepsi-etf/nejlevnejsi-etf", description: "TOP ETF s nejnižšími poplatky pro efektivní investování" },
          { title: "Investiční kalkulačky", href: "/kalkulacky", description: "Bezplatné kalkulačky a nástroje" },
          { title: "Nejlepší ETF 2025", href: "/nejlepsi-etf/nejlepsi-etf-2025", description: "Doporučené ETF fondy pro rok 2025" }
        ]}
        title="Další užitečné stránky"
        className="mt-16"
      />

    </Layout>
  );
}

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
  description: '★ ZDARMA ETF průvodce ★ Najděte nejlepší ETF fondy 2025. Kde koupit ETF, srovnání poplatků, DEGIRO ETF zdarma. Kompletní guide pro české investory s 4300+ ETF databází.',
  keywords: 'nejlepší ETF, ETF fondy, kde koupit ETF, co jsou ETF, ETF poplatky, DEGIRO ETF, dividendové ETF, S&P 500 ETF, ETF srovnání, česky investování',
  openGraph: {
    title: 'ETF průvodce.cz - Nejlepší ETF fondy pro české investory',
    description: 'Kompletní databáze 4300+ ETF fondů s analýzami a kalkulačkami pro české investory.',
    url: 'https://www.etfpruvodce.cz/',
    siteName: 'ETF průvodce.cz',
    images: [
      {
        url: 'https://www.etfpruvodce.cz/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ETF průvodce.cz - Nejlepší ETF fondy pro české investory',
      },
    ],
    locale: 'cs_CZ',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/'
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
          },
          {
            question: "Jaký je rozdíl mezi ETF a podílovým fondem?",
            answer: "ETF se obchodují na burze jako akcie (kdykoli během obchodního dne), zatímco podílové fondy se kupují/prodávají pouze jednou denně za NAV cenu. ETF mají typicky nižší poplatky (TER 0.1-0.5%) oproti aktivním podílovým fondům (1-2%). ETF jsou také transparentnější - portfolio se zveřejňuje denně."
          },
          {
            question: "Jaké ETF doporučujete pro úplné začátečníky?",
            answer: "Pro začátečníky doporučujeme začít s jedním globálním ETF jako VWCE (Vanguard All-World) nebo SWDA (iShares Core MSCI World). Tyto ETF poskytují diverzifikaci napříč tisíci společnostmi ve více než 20 zemích. Jsou to tzv. \"all-in-one\" řešení - není potřeba složitě skládat portfolio."
          },
          {
            question: "Co znamená TER (Total Expense Ratio)?",
            answer: "TER je roční náklad fondu vyjádřený v procentech z investované částky. Například TER 0,20% znamená, že ročně zaplatíte 20 Kč z každých 10 000 Kč. TER zahrnuje správu fondu, administrativu a marketing. Nižší TER = vyšší výnos pro investora. ETF mají typicky TER 0,1-0,7%, zatímco aktivní fondy 1-2%."
          },
          {
            question: "Jsou ETF bezpečnější než akcie jednotlivých společností?",
            answer: "Ano, ETF jsou výrazně bezpečnější díky diverzifikaci. Zatímco jedna akcie může zkrachovat (např. Lehman Brothers -100%), ETF obsahuje desítky až tisíce akcií. Pokud jedna společnost zkrachuje, ovlivní to pouze zlomek vašeho portfolia. ETF sledující celosvětové indexy (VWCE, SWDA) jsou nejbezpečnější volbou pro dlouhodobé investování."
          },
          {
            question: "Jak často mám investovat do ETF?",
            answer: "Nejlepší strategie je pravidelné měsíční investování (dollar-cost averaging). Tím eliminujete riziko špatného načasování trhu. U brokerů jako Portu, XTB nebo Trading212 můžete nastavit automatické měsíční nákupy již od 500 Kč. Tato strategie historicky překonává jednorázové investice v 60-70% případů."
          },
          {
            question: "Co je to akumulační (ACC) a distribuční (DIST) ETF?",
            answer: "Akumulační ETF (ACC) automaticky reinvestují všechny dividendy zpět do fondu - vaše investice roste bez vašeho zásahu. Distribuční ETF (DIST) vyplácejí dividendy na váš účet. Pro dlouhodobé investory jsou akumulační ETF výhodnější díky složenému úročení a daňové efektivitě (dividendy se nezdaňují průběžně, ale až při prodeji)."
          },
          {
            question: "Jaké jsou nejčastější chyby začínajících investorů do ETF?",
            answer: "1) Příliš složené portfolio (10+ ETF místo 1-3), 2) Investování jednorázové částky místo pravidelného DCA, 3) Prodej při poklesu trhu, 4) Ignorování TER a výběr drahých fondů, 5) Investování do sektorových ETF bez pochopení rizika. Nejlepší strategie: pravidelně investovat do 1-2 globálních ETF a držet dlouhodobě (10+ let)."
          },
          {
            question: "Jak dlouho mám držet investici do ETF?",
            answer: "ETF jsou určeny pro dlouhodobé investování - minimálně 5 let, ideálně 10-20 let. Historická data ukazují, že při horizontu 15+ let je pravděpodobnost ztráty téměř nulová. Krátkodobé investování (1-2 roky) je riskantní kvůli volatilitě trhů. Pravidlo: čím delší horizont, tím vyšší očekávaný výnos (historicky 7-10% ročně)."
          },
          {
            question: "Co se stane s mými ETF, pokud broker zkrachuje?",
            answer: "Vaše ETF jsou v bezpečí! ETF jsou ze zákona odděleny od majetku brokera (segregace aktiv). V případě krachu brokera jsou vaše ETF převedena k jinému brokerovi nebo můžete požádat o jejich prodej. ETF v EU jsou navíc chráněny direktivou UCITS a kompenzačním fondem investorů (do 20 000 EUR). Proto volte pouze regulované brokery s licencí ČNB/ECB."
          }
        ]}
        className="mt-16 bg-gray-50"
      />

      {/* Portfolio Strategies Teaser */}
      <PortfolioStrategiesTeaser />


      {/* Related Content Links */}
      <InternalLinking
        relatedLinks={[
          { title: "Srovnání ETF fondů", href: "/srovnani-etf", description: "Porovnejte více než 4300 ETF fondů" },
          { title: "Portfolio Strategie", href: "/portfolio-strategie", description: "5 ověřených investičních strategií" },
          { title: "Backtest portfolia", href: "/kalkulacky/backtest-portfolia", description: "Historická simulace výkonnosti od roku 2000" },
          { title: "Kde koupit ETF", href: "/kde-koupit-etf", description: "Nejlepší brokeři pro české investory" },
          { title: "Investiční kalkulačky", href: "/kalkulacky", description: "10+ bezplatných nástrojů a kalkulaček" },
          { title: "Nejlepší ETF 2025", href: "/nejlepsi-etf/nejlepsi-etf-2025", description: "Doporučené ETF fondy pro rok 2025" }
        ]}
        title="Další užitečné stránky"
        className="mt-16"
      />

    </Layout>
  );
}

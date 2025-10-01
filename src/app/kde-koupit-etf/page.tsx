import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import DetailedBrokerComparison from '../../components/home/DetailedBrokerComparison';
import { Button } from '@/components/ui/button';
import { Store, ArrowRight, ExternalLink, Award, Shield, Users, DollarSign, TrendingUp } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import InternalLinking, { BrokerGuideRelatedLinks } from '@/components/SEO/InternalLinking';
import { generateBrokerSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/components/SEO/BrokerSEO';

export default function KdeKoupitETF() {
  const currentYear = new Date().getFullYear();
  
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      generateBrokerSchema(),
      generateFAQSchema(),
      generateBreadcrumbSchema()
    ]
  };

  const considerations = [
    {
      icon: DollarSign,
      title: 'Poplatky a náklady',
      description: 'Porovnejte transakční poplatky, správní poplatky a poplatky za vedení účtu',
      highlight: 'Od 0€ za transakci',
      color: 'emerald'
    },
    {
      icon: Shield,
      title: 'Regulace a bezpečnost',
      description: 'Vybírejte brokery regulované v EU s ochranou investorů',
      highlight: 'Ochrana do 20 000€',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      title: 'Výběr ETF',
      description: 'Ujistěte se, že broker nabízí ETF, které chcete koupit',
      highlight: '3000+ ETF fondů',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Uživatelské rozhraní',
      description: 'Intuitivní platforma je klíčová pro pohodlné investování',
      highlight: 'Mobilní aplikace',
      color: 'orange'
    }
  ];

  return (
    <Layout>
      <SEOHead
        title={`Kde koupit ETF? Srovnání nejlepších brokerů ${currentYear} | ETF průvodce.cz`}
        description={`Kompletní srovnání brokerů pro ETF investice ${currentYear}. DEGIRO, XTB, Trading 212, Interactive Brokers, Fio, Portu. Poplatky, recenze, zkušenosti českých investorů.`}
        canonical="https://etfpruvodce.cz/kde-koupit-etf"
        keywords={`kde koupit ETF ${currentYear}, nejlepší brokeři ${currentYear}, DEGIRO recenze ${currentYear}, XTB recenze ${currentYear}, Trading 212 recenze ${currentYear}, Interactive Brokers recenze ${currentYear}, Portu recenze ${currentYear}, srovnání brokerů ${currentYear}, poplatky brokerů, broker pro ETF Česká republika`}
        ogImage="https://etfpruvodce.cz/og-where-to-buy.jpg"
        schema={combinedSchema}
        publishedTime={`${currentYear}-01-01`}
        modifiedTime={new Date().toISOString()}
        author="ETF průvodce.cz"
      />
      {/* Modern Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <Store className="w-4 h-4 mr-2" />
                Srovnání nejlepších brokerů {currentYear}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Kde koupit{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ETF fondy?
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Najděte ideálního brokera pro vaše investice do ETF. 
                Nezávislé srovnání poplatků, funkcí a hodnocení.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="#porovnani"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Srovnat brokery
                </Link>
                <Button asChild size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
                  <Link href="/co-jsou-etf/jak-zacit-investovat">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Jak začít
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Content - Row Layout */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-50/60 backdrop-blur-sm rounded-3xl shadow-2xl"></div>
              <div className="relative bg-gradient-to-br from-white/80 to-gray-50/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🏆 Nejlepší volba podle kategorie</h3>
                  <p className="text-gray-600">Naše doporučení pro různé typy investorů</p>
                </div>
                
                {/* Compact Category Layout */}
                <div className="space-y-3">
                  
                  {/* Nejlepší broker celkem - Portu */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="relative p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg">👑</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium opacity-90">Nejlepší celkem</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold">Portu</div>
                          <Link href="/portu-recenze">
                            <ExternalLink className="w-4 h-4 opacity-75 hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Nejlepší pro pokročilé - Interactive Brokers */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="relative p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🚀</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium opacity-90">Pro pokročilé</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold">Interactive Brokers</div>
                          <Link href="/interactive-brokers-recenze">
                            <ExternalLink className="w-4 h-4 opacity-75 hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Nejlepší pro české akcie - Fio */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="relative p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🇨🇿</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium opacity-90">České akcie</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold">Fio e-Broker</div>
                          <Link href="/fio-ebroker-recenze">
                            <ExternalLink className="w-4 h-4 opacity-75 hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
                
                <div className="text-center pt-6 border-t border-gray-200/50 mt-6">
                  <p className="text-sm text-gray-600 mb-3">+ další 3 brokeři v kompletním srovnání</p>
                  <Button asChild variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Link href="#porovnani">
                      Zobrazit všech 6 brokerů
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Factors Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-violet-100 w-20 h-20 mx-auto mb-8 hover:bg-violet-200 transition-colors hover-scale">
              <Shield className="w-10 h-10 text-violet-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Na co se zaměřit při výběru brokera
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Klíčové faktory pro správnou volbu investiční platformy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {considerations.map((item, index) => {
              const Icon = item.icon;
              const colorClasses = {
                emerald: 'from-emerald-500 to-teal-600 border-emerald-100',
                blue: 'from-blue-500 to-indigo-600 border-blue-100',
                purple: 'from-purple-500 to-violet-600 border-purple-100',
                orange: 'from-orange-500 to-red-600 border-orange-100'
              };
              
              const iconColorMap = {
                emerald: 'emerald-700',
                blue: 'violet-700',
                purple: 'emerald-700',
                orange: 'violet-700'
              };
              
              return (
                <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in text-center" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                  <div className={`flex items-center justify-center rounded-full ${item.color === 'emerald' || item.color === 'purple' ? 'bg-emerald-100 group-hover:bg-emerald-200' : 'bg-violet-100 group-hover:bg-violet-200'} w-16 h-16 mx-auto mb-6 transition-colors hover-scale`}>
                    <Icon className={`w-8 h-8 text-${iconColorMap[item.color] || 'gray-700'}`} />
                  </div>
                  <div className="mb-4">
                    <h3 className={`text-xl font-bold text-gray-900 mb-2 group-hover:${item.color === 'emerald' || item.color === 'purple' ? 'text-emerald-800' : 'text-violet-800'} transition-colors`}>{item.title}</h3>
                    <div className={`text-sm ${item.color === 'emerald' || item.color === 'purple' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'} px-3 py-1 rounded-full font-medium inline-block`}>
                      {item.highlight}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailní srovnání brokerů */}
      <div id="porovnani">
        <DetailedBrokerComparison />
      </div>

      {/* Tips Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-emerald-100 w-20 h-20 mx-auto mb-8 hover:bg-emerald-200 transition-colors hover-scale">
              <Users className="w-10 h-10 text-emerald-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tipy pro začátečníky
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Jak začít s investováním do ETF přes brokery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                title: "Začněte s demo účtem",
                description: "Většina brokerů nabízí demo účty, kde si můžete vyzkoušet platformu bez rizika a naučit se základy obchodování.",
                icon: "🎮"
              },
              {
                title: "Porovnejte celkové náklady",
                description: "Nezaměřujte se jen na transakční poplatky, ale i na poplatky za vedení účtu, převody a měnové konverze.",
                icon: "💰"
              },
              {
                title: "Ověřte regulaci",
                description: "Vybírejte pouze brokery regulované v EU s ochranou investorů do 20 000€ podle ESMA směrnic.",
                icon: "🛡️"
              },
              {
                title: "Začněte malými částkami",
                description: "Prvotní investice nemusí být vysoká. Důležité je začít a postupně se učit na vlastních zkušenostech.",
                icon: "🌱"
              }
            ].map((tip, index) => (
              <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{tip.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-800 transition-colors">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="hover-scale bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold">
                <Link href="/co-jsou-etf/jak-zacit-investovat">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Jak začít s ETF investicemi
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover-scale border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold">
                <Link href="#porovnani">
                  <Award className="w-5 h-5 mr-2" />
                  Srovnání brokerů výše
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-violet-100 w-20 h-20 mx-auto mb-8 hover:bg-violet-200 transition-colors hover-scale">
              <span className="text-2xl">❓</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Často kladené otázky o koupi ETF
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Odpovědi na nejčastější dotazy o výběru brokera pro ETF investice
            </p>
          </div>

          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
            <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Kde koupit ETF v České republice?",
                answer: "ETF můžete koupit u online brokerů jako DEGIRO, XTB, Trading 212, Interactive Brokers nebo u českých bank jako Fio e-Broker. Nejlepší volbou jsou online brokeři s nízkými poplatky a širokým výběrem ETF fondů."
              },
              {
                question: "Který broker je nejlepší pro začátečníky?",
                answer: "Pro začátečníky doporučujeme DEGIRO (snadné ovládání, ETF zdarma) nebo XTB (0% poplatky do 100 000 EUR měsíčně, česká podpora). Oba nabízejí intuitivní rozhraní a nízké náklady."
              },
              {
                question: "Kolik stojí nákup ETF u různých brokerů?",
                answer: "Poplatky se liší: DEGIRO - 0€ za vybrané ETF, jinak 2€ + 0,03%; XTB - 0€ do 100 000 EUR měsíčně; Trading 212 - 0€; Interactive Brokers - od 1,25€; Fio e-Broker - 0,4% (min. 7,90€)."
              },
              {
                question: "Jsou online brokeři bezpeční?",
                answer: "Ano, všichni doporučení brokeři jsou regulovaní v EU a nabízejí ochranu investorů do 20 000€ podle ESMA směrnic. DEGIRO, XTB, Trading 212 a Interactive Brokers jsou ověřené platformy s miliony uživatelů."
              },
              {
                question: "Mohu koupit americké ETF u evropských brokerů?",
                answer: "Ne, kvůli MiFID II regulaci nemohou evropští brokeři nabízet americké ETF retailovým investorům. Místo toho lze koupit evropské ETF (UCITS) sledující stejné indexy, např. CSPX místo SPY."
              },
              {
                question: "Jak začít s malými částkami?",
                answer: "Většina brokerů neumožňuje částečné akcie, ale nabízejí spořící plány už od 25€ měsíčně. Trading 212 umožňuje nákup frakcí akcií/ETF už od 1€."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-violet-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-violet-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-violet-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-violet-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                  {faq.answer}
                </div>
              </details>
            ))}
            </div>
          </div>
        </div>
      </section>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Internal Linking */}
        <InternalLinking 
          relatedLinks={BrokerGuideRelatedLinks} 
        />
      </div>
    </Layout>
  );
}
import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Metadata } from 'next';
import {
  TargetIcon, CheckCircleIcon, ClockIcon,
  StarFilledIcon, SmartphoneIcon, ArrowRightIcon, AlertTriangleIcon,
  BookOpenIcon, BuildingIcon, TrendingUpIcon
} from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';

export const metadata: Metadata = {
  title: 'Jak začít investovat do ETF? | Návod krok za krokem 2025',
  description: 'Kompletní návod jak začít s ETF investováním. Od výběru brokera po sestavení portfolia. Praktický průvodce pro české investory 2025.',
  keywords: 'jak začít investovat do ETF, ETF pro začátečníky, návod ETF investování, DEGIRO, XTB, Trading212',
  openGraph: {
    title: 'Jak začít investovat do ETF? | Návod krok za krokem 2025',
    description: 'Kompletní návod jak začít s ETF investováním. Od výběru brokera po sestavení portfolia.',
    url: 'https://www.etfpruvodce.cz/co-jsou-etf/jak-zacit-investovat',
    siteName: 'ETF průvodce.cz',
    locale: 'cs_CZ',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/co-jsou-etf/jak-zacit-investovat',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

const JakZacitInvestovatPage: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // FAQ structured data for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "S jakou částkou můžu začít investovat do ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Můžete začít už s 50-100 EUR měsíčně. Většina brokerů neumá minimální investici pro ETF. Důležitější než vysoká částka je pravidelnost investování."
        }
      },
      {
        "@type": "Question",
        "name": "Je lepší investovat najednou nebo postupně?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pro začátečníky je lepší postupné investování (DCA - Dollar Cost Averaging). Investujte stejnou částku každý měsíc bez ohledu na cenu. Snižuje to riziko špatného načasování."
        }
      },
      {
        "@type": "Question",
        "name": "Kolik ETF fondů mám mít v portfoliu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pro začátečníky stačí 2-3 kvalitní ETF. Například: 80% VWCE (svět) + 20% VGEA (dluhopisy). Nepřekombinujte to s 10+ fondy."
        }
      },
      {
        "@type": "Question",
        "name": "Kdy mám prodávat ETF fondy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ETF jsou určené pro dlouhodobé držení (5+ let). Prodávejte pouze pokud se změní vaše životní situace nebo investiční cíle. Neprodávejte kvůli krátkodobým výkyvům."
        }
      },
      {
        "@type": "Question",
        "name": "Musím platit daně z ETF investic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, z prodeje ETF se platí 15% daň z kapitálového zisku. Můžete využít odpočet 100 000 Kč ročně. Dividendy jsou také zdaněny. Doporučujeme konzultaci s daňovým poradcem."
        }
      },
      {
        "@type": "Question",
        "name": "Jak často mám rebalancovat portfolio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Jednou ročně nebo když se alokace změní o více než 5%. Například pokud máte 80/20 akcie/dluhopisy a dojde k posunu na 85/15, je čas rebalancovat."
        }
      }
    ]
  };

  const steps = [
    {
      title: "1. Definujte své cíle",
      description: "Stanovte si jasné investiční cíle a časový horizont",
      details: [
        "Důchod (15+ let) - agresivní růstové portfolio",
        "Koupě nemovitosti (3-7 let) - vyvážené portfolio", 
        "Rezerva (1-3 roky) - konzervativní portfolio",
        "Určete měsíční částku pro investování"
      ],
      icon: TargetIcon,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "2. Vyberte si brokera",
      description: "Zvolte spolehlivého brokera s nízkými poplatky",
      details: [
        "DEGIRO - některé ETF zdarma, vhodné pro začátečníky",
        "XTB - 0% poplatky do 100k EUR měsíčně",
        "Trading212 - 0% poplatky, jednoduchá aplikace",
        "Interactive Brokers - největší výběr, pokročilé funkce"
      ],
      icon: BuildingIcon,
      color: "from-teal-500 to-blue-600"
    },
    {
      title: "3. Otevřete účet",
      description: "Projděte procesem registrace a verifikace",
      details: [
        "Připravte si občanský průkaz a doklad o příjmech",
        "Vyplňte registrační formulář online",
        "Projděte procesem KYC (Know Your Customer)",
        "Aktivujte účet a proveďte první vklad"
      ],
      icon: CheckCircleIcon,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "4. Sestavte portfolio",
      description: "Vyberte správnou kombinaci ETF fondů",
      details: [
        "80-90% akcie pro mladé investory (VWCE, CSPX)",
        "10-20% dluhopisy pro stabilitu (VGEA, IEAA)",
        "Zvažte geografickou diverzifikaci",
        "Začněte s 2-3 ETF fondy maximum"
      ],
      icon: TrendingUpIcon,
      color: "from-emerald-600 to-teal-700"
    },
    {
      title: "5. Investujte pravidelně",
      description: "Nastavte si automatické investování",
      details: [
        "DCA (Dollar Cost Averaging) - investujte stejnou částku měsíčně",
        "Ignorujte krátkodobé výkyvy trhu",
        "Rebalancujte portfolio jednou ročně",
        "Neprodávejte v panické náladě"
      ],
      icon: ClockIcon,
      color: "from-teal-500 to-cyan-600"
    }
  ];

  const commonMistakes = [
    {
      mistake: "Časování trhu",
      solution: "Investujte pravidelně bez ohledu na tržní podmínky"
    },
    {
      mistake: "Přílišná diverzifikace",
      solution: "Začněte s 2-3 kvalitními ETF, ne s 10+"
    },
    {
      mistake: "Honění výkonnosti",
      solution: "Držte se dlouhodobé strategie, ne krátkodobých trendů"
    },
    {
      mistake: "Vysoké poplatky",
      solution: "Vybírejte ETF s TER pod 0,5% a levného brokera"
    },
    {
      mistake: "Emocionální rozhodování",
      solution: "Mějte plán a držte se ho i v krizích"
    }
  ];

  const brokerComparison = [
    {
      name: "DEGIRO",
      icon: StarFilledIcon,
      pros: ["Zdarma vybrané ETF", "Nízké poplatky", "Česká podpora"],
      cons: ["Limitovaný výběr zdarma ETF", "Složitější rozhraní"],
      bestFor: "Začátečníci s malými částkami",
      color: "from-emerald-500 to-teal-600",
      rating: "Nejlepší pro začátečníky"
    },
    {
      name: "XTB",
      icon: BuildingIcon,
      pros: ["0% do 100k EUR/měsíc", "Česká pobočka", "Jednoduché rozhraní"],
      cons: ["Poplatky nad limit", "Menší výběr"],
      bestFor: "Střední investoři",
      color: "from-teal-500 to-blue-600",
      rating: "Česká spolehlivost"
    },
    {
      name: "Trading212",
      icon: SmartphoneIcon,
      pros: ["Kompletně zdarma", "Skvělá aplikace", "Investiční plány"],
      cons: ["Pouze aplikace", "Čekací lista"],
      bestFor: "Mobilní investoři",
      color: "from-blue-500 to-indigo-600",
      rating: "Nejlepší aplikace"
    },
    {
      name: "Interactive Brokers",
      icon: TrendingUpIcon,
      pros: ["Největší výběr", "Nízké poplatky", "Pokročilé funkce"],
      cons: ["Složitější", "Vyšší minimální vklad"],
      bestFor: "Pokročilí investoři",
      color: "from-emerald-600 to-blue-700",
      rating: "Pro profesionály"
    }
  ];

  const relatedLinks = [
    {
      title: "Co jsou ETF fondy",
      description: "Základní průvodce ETF pro začátečníky",
      href: "/co-jsou-etf",
      category: "Základy"
    },
    {
      title: "Kde koupit ETF",
      description: "Srovnání brokerů pro nákup ETF",
      href: "/kde-koupit-etf",
      category: "Praktické tipy"
    },
    {
      title: "Nejlepší ETF 2026",
      description: "Doporučené ETF podle kategorií",
      href: "/nejlepsi-etf",
      category: "Doporučení"
    },
    {
      title: "Investiční kalkulačka",
      description: "Spočítejte si potenciální výnosy",
      href: "/kalkulacky/investicni-kalkulacka",
      category: "Nástroje"
    }
  ];

  return (
    <Layout>
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-blue-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-emerald-200/50">
                <BookOpenIcon className="w-4 h-4 mr-2" />
                Praktický návod {currentYear}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Jak začít{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                  investovat do ETF?
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Praktický návod krok za krokem. Od otevření účtu u brokera 
                po sestavení prvního portfolia ETF fondů.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/kde-koupit-etf" 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <BuildingIcon className="w-5 h-5" />
                  Vybrat brokera
                </Link>
                <Link 
                  href="/nejlepsi-etf" 
                  className="bg-white/80 backdrop-blur-sm border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <StarFilledIcon className="w-5 h-5" />
                  Nejlepší ETF
                </Link>
              </div>
            </div>
            
            {/* Right Content - Quick Stats */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Proč začít s ETF?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700">Minimální počáteční investice</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <span className="text-gray-700">Automatická diverzifikace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Nízké roční poplatky</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">Jednoduché pro začátečníky</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                  <p className="text-sm font-semibold text-emerald-800">
                    🚀 Začněte s 50 EUR měsíčně
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              5 kroků k prvním ETF investicím
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Praktický návod, který vás provede celým procesem od začátku do konce
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 bg-gradient-to-br ${step.color} rounded-2xl flex-shrink-0`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6">
                        {step.description}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Broker Comparison */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Porovnání brokerů pro ETF
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vyberte si brokera podle vašich potřeb a velikosti investice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brokerComparison.map((broker, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex p-3 bg-gradient-to-br ${broker.color} rounded-lg mb-4`}>
                  <broker.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{broker.name}</h3>
                <p className="text-sm text-emerald-600 font-semibold mb-4">{broker.rating}</p>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Výhody:</h4>
                    {broker.pros.map((pro, proIndex) => (
                      <div key={proIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                        {pro}
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Nevýhody:</h4>
                    {broker.cons.map((con, conIndex) => (
                      <div key={conIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
                        {con}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Nejlepší pro:</span> {broker.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/kde-koupit-etf"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
            >
              Podrobné srovnání brokerů
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              5 nejčastějších chyb začátečníků
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vyhněte se těmto pastím a investujte jako profíci
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonMistakes.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <AlertTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      ❌ {item.mistake}
                    </h3>
                    <p className="text-gray-700">
                      <span className="font-semibold text-emerald-700">✅ Řešení:</span> {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-emerald-100 w-20 h-20 mx-auto mb-8 hover:bg-emerald-200 transition-colors">
              <span className="text-2xl">❓</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Často kladené otázky
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "S jakou částkou můžu začít investovat do ETF?",
                answer: "Můžete začít už s 50-100 EUR měsíčně. Většina brokerů neumá minimální investici pro ETF. Důležitější než vysoká částka je pravidelnost investování."
              },
              {
                question: "Je lepší investovat najednou nebo postupně?",
                answer: "Pro začátečníky je lepší postupné investování (DCA - Dollar Cost Averaging). Investujte stejnou částku každý měsíc bez ohledu na cenu. Snižuje to riziko špatného načasování."
              },
              {
                question: "Kolik ETF fondů mám mít v portfoliu?",
                answer: "Pro začátečníky stačí 2-3 kvalitní ETF. Například: 80% VWCE (svět) + 20% VGEA (dluhopisy). Nepřekombinujte to s 10+ fondy."
              },
              {
                question: "Kdy mám prodávat ETF fondy?",
                answer: "ETF jsou určené pro dlouhodobé držení (5+ let). Prodávejte pouze pokud se změní vaše životní situace nebo investiční cíle. Neprodávejte kvůli krátkodobým výkyvům."
              },
              {
                question: "Musím platit daně z ETF investic?",
                answer: "Ano, z prodeje ETF se platí 15% daň z kapitálového zisku. Můžete využít odpočet 100 000 Kč ročně. Dividendy jsou také zdaněny. Doporučujeme konzultaci s daňovým poradcem."
              },
              {
                question: "Jak často mám rebalancovat portfolio?",
                answer: "Jednou ročně nebo když se alokace změní o více než 5%. Například pokud máte 80/20 akcie/dluhopisy a dojde k posunu na 85/15, je čas rebalancovat."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-emerald-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-emerald-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-emerald-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 transition-all group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Připraveni začít s ETF investováním?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Vyberte si brokera a začněte budovat své portfolio ETF fondů ještě dnes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/kde-koupit-etf"
              className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
            >
              <BuildingIcon className="w-5 h-5" />
              Vybrat brokera
            </Link>
            
            <Link 
              href="/nejlepsi-etf"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:shadow-lg inline-flex items-center gap-2"
            >
              <StarFilledIcon className="w-5 h-5" />
              Najít nejlepší ETF
            </Link>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={relatedLinks}
        className="bg-gray-50"
      />
    </Layout>
  );
};

export default JakZacitInvestovatPage;
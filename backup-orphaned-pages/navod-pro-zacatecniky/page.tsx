'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import BreadcrumbNav from '@/components/SEO/BreadcrumbNav';
import StructuredData from '@/components/SEO/StructuredData';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Star, Users, Shield, TrendingUp, BookOpen, Target, DollarSign, PieChart, Download } from 'lucide-react';

export default function NavodProZacatecnikyPage() {
  const [showPDFDownload, setShowPDFDownload] = useState(false);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Domů",
        "item": "https://etfpruvodce.cz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Návod pro začátečníky 2025",
        "item": "https://etfpruvodce.cz/navod-pro-zacatecniky"
      }
    ]
  };

  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Jak začít investovat do ETF - Kompletní návod pro začátečníky 2025",
    "description": "Krok za krokem návod pro začátečníky, jak začít investovat do ETF. Od výběru brokera po sestavení portfolia.",
    "image": "https://etfpruvodce.cz/og-navod-pro-zacatecniky.jpg",
    "totalTime": "PT30M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": "50"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Internetové bankovnictví nebo karta"
      },
      {
        "@type": "HowToSupply", 
        "name": "Doklad totožnosti"
      },
      {
        "@type": "HowToSupply",
        "name": "Minimálně 50 EUR na investici"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Broker account (DEGIRO, XTB, Trading 212)"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Výběr brokera",
        "text": "Vyberte si vhodného brokera podle vašeho profilu začátečníka",
        "url": "https://etfpruvodce.cz/srovnani-brokeru"
      },
      {
        "@type": "HowToStep",
        "name": "Registrace u brokera",
        "text": "Zaregistrujte se u vybraného brokera a ověřte identitu"
      },
      {
        "@type": "HowToStep",
        "name": "Vklad peněz",
        "text": "Vložte peníze na investiční účet"
      },
      {
        "@type": "HowToStep",
        "name": "Výběr ETF",
        "text": "Vyberte vhodné ETF fondy podle vaší strategie",
        "url": "https://etfpruvodce.cz/srovnani-etf"
      },
      {
        "@type": "HowToStep",
        "name": "První nákup",
        "text": "Proveďte svůj první nákup ETF"
      },
      {
        "@type": "HowToStep",
        "name": "Pravidelné investování",
        "text": "Nastavte si pravidelné měsíční investování (DCA)"
      }
    ]
  };

  const generatePDF = async () => {
    // Import jsPDF dynamically
    const { jsPDF } = await import('jspdf');
    
    // Create new PDF instance
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Title
    doc.setFontSize(20);
    doc.text('ETF PRŮVODCE PRO ZAČÁTEČNÍKY 2025', 20, 30);
    
    // Content sections
    let y = 50;
    const lineHeight = 7;
    const pageHeight = 280;
    
    const sections = [
      {
        title: 'OBSAH:',
        content: [
          '1. Než začnete investovat - důležité podmínky',
          '2. Krok za krokem návod (6 kroků)', 
          '3. Doporučená portfolia podle věku',
          '4. Časté chyby začátečníků a jak se jim vyhnout',
          '5. Často kladené otázky',
          '6. Praktické tipy pro úspěšné investování'
        ]
      },
      {
        title: 'NEŽ ZAČNETE INVESTOVAT - DŮLEŽITÉ!',
        content: [
          'SPLŇTE TYTO PODMÍNKY:',
          '• Máte emergency fond na 3-6 měsíců výdajů',
          '• Nemáte vysokoúročné dluhy (kreditky)',
          '• Investujete pouze volné peníze',
          '• Plánujete investovat alespoň 5+ let',
          '• Jste připraveni na krátkodobé ztráty',
          '',
          'NEINVESTUJTE POKUD:',
          '• Peníze budete potřebovat do 2 let',
          '• Investujete půjčené peníze',
          '• Očekáváte rychlé zbohatnutí',
          '• Nevydržíte vidět ztráty v portfoliu',
          '• Nerozumíte do čeho investujete'
        ]
      },
      {
        title: 'KROK ZA KROKEM NÁVOD',
        content: [
          'KROK 1: STANOVTE SI INVESTIČNÍ CÍLE (5 minut)',
          '• Penze (30+ let)',
          '• Koupě nemovitosti (5-10 let)',
          '• Finanční nezávislost (15-25 let)',
          '• Děti a vzdělání (10-20 let)',
          'TIP: Čím delší horizont, tím vyšší podíl akcií.',
          '',
          'KROK 2: VYBERTE SI BROKERA (15 minut)',
          '• Pro začátečníky: Trading 212',
          '• Pro ETF investory: XTB',
          '• Pro pokročilé: DEGIRO',
          'TIP: Začněte s jednoduchým brokerem.',
          '',
          'KROK 3: ZAREGISTRUJTE SE A VLOŽTE PENÍZE',
          '• Potřebujete občanský průkaz',
          '• Minimálně 50-100 EUR na start',
          'TIP: Začněte s menší částkou.',
          '',
          'KROK 4: VYBERTE SVÉ PRVNÍ ETF (30 minut)',
          '• 80% světové akcie (VWCE, IWDA)',
          '• 20% dluhopisy (AGGH, IEAA)',
          'TIP: Jednoduchost je klíčová.',
          '',
          'KROK 5: PROVEĎTE PRVNÍ NÁKUP (10 minut)',
          '• Použijte market order pro začátek',
          '• Nekupujte všechno najednou',
          'TIP: První nákup je nejdůležitější krok.',
          '',
          'KROK 6: PRAVIDELNÉ INVESTOVÁNÍ (10 minut)',
          '• Investujte každý měsíc stejnou částku',
          '• Využijte automatické investování',
          'TIP: DCA je mocnější než timing trhu.'
        ]
      }
    ];
    
    // Add sections to PDF
    sections.forEach((section) => {
      // Check if we need a new page
      if (y > pageHeight - 50) {
        doc.addPage();
        y = 30;
      }
      
      // Section title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(section.title, 20, y);
      y += lineHeight + 3;
      
      // Section content
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      section.content.forEach((line) => {
        // Check if we need a new page
        if (y > pageHeight - 10) {
          doc.addPage();
          y = 30;
        }
        
        if (line.trim() === '') {
          y += lineHeight / 2;
        } else {
          // Handle long lines by splitting them
          const maxWidth = 170;
          const lines = doc.splitTextToSize(line, maxWidth);
          lines.forEach((splitLine) => {
            if (y > pageHeight - 10) {
              doc.addPage();
              y = 30;
            }
            doc.text(splitLine, 20, y);
            y += lineHeight;
          });
        }
      });
      
      y += lineHeight;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`© 2025 ETF průvodce.cz - Strana ${i}/${pageCount}`, 20, 290);
    }
    
    // Save the PDF
    doc.save('ETF-pruvodce-pro-zacatecniky-2025.pdf');
  };

  const steps = [
    {
      number: 1,
      title: "Stanovte si investiční cíle",
      duration: "5 minut",
      icon: <Target className="h-8 w-8 text-blue-600" />,
      description: "Definujte, proč chcete investovat a na jak dlouho",
      details: [
        "Penze (30+ let)",
        "Koupě nemovitosti (5-10 let)", 
        "Finanční nezávislost (15-25 let)",
        "Děti a vzdělání (10-20 let)"
      ],
      tips: "Čím delší horizont, tím vyšší podíl akcií můžete mít v portfoliu."
    },
    {
      number: 2,
      title: "Vyberte si brokera",
      duration: "15 minut",
      icon: <Shield className="h-8 w-8 text-green-600" />,
      description: "Zvolte spolehlivého brokera s nízkými poplatky",
      details: [
        "Pro začátečníky: Trading 212",
        "Pro ETF investory: XTB", 
        "Pro pokročilé: DEGIRO",
        "Regulace v EU je klíčová"
      ],
      tips: "Začněte s jednoduchým brokerem. Později můžete přejít na pokročilejší."
    },
    {
      number: 3,
      title: "Zaregistrujte se a vložte peníze",
      duration: "20 minut",
      icon: <DollarSign className="h-8 w-8 text-yellow-600" />,
      description: "Otevřete si účet a proveďte první vklad",
      details: [
        "Potřebujete občanský průkaz",
        "Bankovní účet pro převody",
        "Minimálně 50-100 EUR na start",
        "Ověření může trvat 1-3 dny"
      ],
      tips: "Začněte s menší částkou, kterou si můžete dovolit ztratit."
    },
    {
      number: 4,
      title: "Vyberte své první ETF",
      duration: "30 minut",
      icon: <PieChart className="h-8 w-8 text-purple-600" />,
      description: "Sestavte si jednoduché a diversifikované portfolio",
      details: [
        "80% světové akcie (VWCE, IWDA)",
        "20% dluhopisy (AGGH, IEAA)",
        "Nebo 100% světové akcie (mladší lidé)",
        "Začněte jednoduše s 1-2 ETF"
      ],
      tips: "Nesnažte se být moc chytrí na začátku. Jednoduchost je klíčová."
    },
    {
      number: 5,
      title: "Proveďte první nákup",
      duration: "10 minut",
      icon: <TrendingUp className="h-8 w-8 text-emerald-600" />,
      description: "Nakupte své první ETF",
      details: [
        "Použijte market order pro začátek",
        "Nekupujte všechno najednou",
        "Rozložte nákupy do několika měsíců",
        "Sledujte poplatky za transakce"
      ],
      tips: "První nákup je nejdůležitější krok. Nezváhejte příliš dlouho."
    },
    {
      number: 6,
      title: "Nastavte pravidelné investování",
      duration: "10 minut",
      icon: <BookOpen className="h-8 w-8 text-red-600" />,
      description: "Automatizujte své investování (DCA strategie)",
      details: [
        "Investujte každý měsíc stejnou částku",
        "Využijte automatické investování brokera",
        "Částka podle vašich možností (100-1000 EUR)",
        "Buďte konzistentní alespoň 1 rok"
      ],
      tips: "Pravidelné investování je mocnější než snaha 'načasovat trh'."
    }
  ];

  const commonMistakes = [
    {
      mistake: "Snaha načasovat trh",
      solution: "Investujte pravidelně bez ohledu na aktuální ceny",
      risk: "Vysoké"
    },
    {
      mistake: "Investování do příliš mnoha ETF",
      solution: "Začněte s 1-2 ETF, postupně rozšiřujte",
      risk: "Střední"
    },
    {
      mistake: "Panika při poklesu trhu",
      solution: "Pokles je normální, držte své pozice",
      risk: "Vysoké"
    },
    {
      mistake: "Investování půjčených peněz",
      solution: "Investujte pouze vlastní úspory",
      risk: "Kritické"
    },
    {
      mistake: "Ignorování poplatků",
      solution: "Vždy zkontrolujte poplatky před nákupem",
      risk: "Střední"
    },
    {
      mistake: "Investování bez emergency fondu",
      solution: "Nejdříve si vytvořte rezervu na 3-6 měsíců",
      risk: "Vysoké"
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="Návod pro začátečníky 2025 - Jak začít investovat do ETF | ETF průvodce.cz"
        description="✅ Kompletní návod krok za krokem pro začátečníky. Jak začít investovat do ETF v roce 2025. Od výběru brokera po první nákup a pravidelné investování."
        canonical="https://etfpruvodce.cz/navod-pro-zacatecniky"
        keywords="návod pro začátečníky, jak investovat, ETF pro začátečníky, první investice, investování krok za krokem"
        schema={guideSchema}
        ogImage="https://etfpruvodce.cz/og-navod-pro-zacatecniky.jpg"
      />
      <StructuredData data={breadcrumbSchema} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero sekce */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            📚 Kompletní průvodce 2025
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Návod pro začátečníky
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Krok za krokem průvodce, jak začít investovat do ETF. Vše, co potřebujete vědět 
            pro svou první investici - jednoduše, bezpečně a s minimálními poplatky.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Čas čtení: 15 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Obtížnost: Začátečník</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Min. kapitál: 50 EUR</span>
            </div>
          </div>
          
          {/* PDF Download Button */}
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl p-6 text-white mb-8">
            <h3 className="text-xl font-bold mb-2">📄 Stáhněte si tento průvodce jako PDF</h3>
            <p className="text-blue-100 mb-4">Kompletní obsah tohoto průvodce si můžete stáhnout a číst offline</p>
            <Button 
              onClick={generatePDF}
              className="bg-white text-violet-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Stáhnout PDF průvodce
            </Button>
          </div>
        </div>

        {/* Než začnete - důležité */}
        <Card className="mb-12 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
              Než začnete investovat - důležité!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Splňte tyto podmínky</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Máte emergency fond na 3-6 měsíců výdajů</li>
                  <li>• Nemáte vysokoúročné dluhy (kreditky)</li>
                  <li>• Investujete pouze volné peníze</li>
                  <li>• Plánujete investovat alespoň 5+ let</li>
                  <li>• Jste připraveni na krátkodobé ztráty</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">❌ Neinvestujte pokud</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Peníze budete potřebovat do 2 let</li>
                  <li>• Investujete půjčené peníze</li>
                  <li>• Očekáváte rychlé zbohatnutí</li>
                  <li>• Nevydržíte vidět ztráty v portfoliu</li>
                  <li>• Nerozumíte do čeho investujete</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Krok za krokem návod */}
        <div className="space-y-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Krok za krokem návod</h2>
            <p className="text-lg text-gray-600">Následujte tento návod a za hodinu budete mít svou první investici</p>
          </div>

          {steps.map((step, index) => (
            <Card key={step.number} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      {step.icon}
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <Badge variant="outline" className="ml-auto">{step.duration}</Badge>
                    </div>
                    <CardDescription className="text-base">{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Co dělat:</h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-800">💡 Tip pro začátečníky</h4>
                    <p className="text-sm text-blue-700">{step.tips}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Doporučené portfolio pro začátečníky */}
        <Card className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-6 w-6 text-green-600" />
              Doporučená portfolia pro začátečníky
            </CardTitle>
            <CardDescription>Jednoduché a efektivní portfolia podle věku</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-center">20-30 let</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span>Světové akcie (VWCE)</span>
                    <Badge className="bg-blue-100 text-blue-800">100%</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Maximální růstový potenciál pro dlouhý investiční horizont.</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-center">30-50 let</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span>Světové akcie (VWCE)</span>
                    <Badge className="bg-blue-100 text-blue-800">80%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dluhopisy (AGGH)</span>
                    <Badge className="bg-green-100 text-green-800">20%</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Vyvážené portfolio s nižší volatilitou.</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-center">50+ let</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span>Světové akcie (VWCE)</span>
                    <Badge className="bg-blue-100 text-blue-800">60%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dluhopisy (AGGH)</span>
                    <Badge className="bg-green-100 text-green-800">40%</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Konzervativnější přístup s vyšší stabilitou.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Časté chyby začátečníků */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-600" />
              Časté chyby začátečníků
            </CardTitle>
            <CardDescription>Vyvarujte se těmto pastím</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonMistakes.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-semibold">{item.mistake}</span>
                    </div>
                    <Badge 
                      className={
                        item.risk === "Kritické" ? "bg-red-100 text-red-800" :
                        item.risk === "Vysoké" ? "bg-orange-100 text-orange-800" :
                        "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {item.risk} riziko
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 ml-8">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700">{item.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ pro začátečníky */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Často kladené otázky začátečníků
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-1 gap-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">S kolika penězi mohu začít?</h4>
                  <p className="text-sm text-gray-600">
                    Minimálně 50 EUR, ale doporučujeme alespoň 200-500 EUR. 
                    Důležitější než částka je pravidelnost investování.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Kolik ETF mám koupit?</h4>
                  <p className="text-sm text-gray-600">
                    Pro začátek stačí 1-2 ETF. Například pouze světový akciový ETF (VWCE) 
                    nebo kombinace 80% VWCE + 20% dluhopisový ETF (AGGH).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Kdy mám kupovat a prodávat?</h4>
                  <p className="text-sm text-gray-600">
                    Kupujte pravidelně každý měsíc stejnou částku (DCA strategie). 
                    Neprodávejte, pokud nepotřebujete peníze - nechte investice růst.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Co dělat při poklesu trhu?</h4>
                  <p className="text-sm text-gray-600">
                    Nic. Poklesy jsou normální část investování. Někdy i nakupujte více 
                    při velkých poklesech. Nikdy neprodávejte v panice.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Jak často kontrolovat portfolio?</h4>
                  <p className="text-sm text-gray-600">
                    Stačí 1x za měsíc při pravidelném investování. Častější kontrola 
                    vede k emotivním rozhodnutím, která škodí výnosům.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Potřebuji pojištění investic?</h4>
                  <p className="text-sm text-gray-600">
                    ETF investice jsou automaticky pojištěny do 20-100k EUR podle brokera. 
                    Dodatečné pojištění není potřeba.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA sekce */}
        <Card className="mb-12 bg-gradient-to-r from-violet-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Připraveni začít investovat?</CardTitle>
            <CardDescription className="text-center text-base">
              Vyberte si brokera a začněte svou investiční cestu už dnes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-blue-200 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Úplný začátečník?</h3>
                <p className="text-sm text-gray-600 mb-4">Začněte s Trading 212</p>
                <Button asChild className="w-full">
                  <a href="/trading212-recenze">Trading 212 recenze</a>
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-green-200 text-center">
                <Star className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Zaměřeno na ETF?</h3>
                <p className="text-sm text-gray-600 mb-4">XTB je nejlepší volba</p>
                <Button asChild className="w-full">
                  <a href="/xtb-recenze">XTB recenze</a>
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-yellow-200 text-center">
                <Shield className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Chcete nejlepší?</h3>
                <p className="text-sm text-gray-600 mb-4">DEGIRO pro pokročilé</p>
                <Button asChild className="w-full">
                  <a href="/degiro-recenze">DEGIRO recenze</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Související stránky */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Srovnání brokerů 2025",
              href: "/srovnani-brokeru",
              description: "Najděte ideálního brokera pro začátek"
            },
            {
              title: "Srovnání ETF fondů",
              href: "/srovnani-etf",
              description: "Vyberte si správné ETF pro portfolio"
            },
            {
              title: "Investiční kalkulačky",
              href: "/kalkulacky",
              description: "Spočítejte si potenciální výnosy"
            },
            {
              title: "Co jsou ETF",
              href: "/co-jsou-etf",
              description: "Základy ETF investování"
            }
          ]}
          title="Další užitečné články"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}
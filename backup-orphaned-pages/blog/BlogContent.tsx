'use client';

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import Layout from "@/components/Layout";
import SocialSharing from "@/components/SocialSharing";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const ARTICLE_IMAGES: Record<string, string> = {
  "fed-snizil-sazby-etf-analyza-2025": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
  "nejlepsi-etf-2025": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  "nejlepsi-etf-na-americke-akcie": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
  "nejlepsi-etf-na-nasdaq": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
  "nejlepsi-dividendove-etf": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
  "nejlepsi-etf-na-evropske-akcie": "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
  "all-weather-portfolio": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  "jak-zacit-investovat-do-etf": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
  "etf-vs-aktivni-fondy": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  "rebalancing-portfolia": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
  "etf-pro-duchod": "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&h=600&fit=crop",
  "nejlevnejsi-etf-fondy": "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=800&h=600&fit=crop",
  "esg-udrzitelne-etf": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
};

const ARTICLE_ALT_TEXTS: Record<string, string> = {
  "fed-snizil-sazby-etf-analyza-2025": "Fed snižuje úrokové sazby a analýza dopadu na ETF fondy, gold mining a bankovní sektor září 2025",
  "nejlepsi-etf-2025": "Graf výkonnosti nejlepších ETF fondů pro rok 2025 s analýzou poplatků TER",
  "nejlepsi-etf-na-americke-akcie": "Americký akciový trh ETF fondy zaměřené na S&P 500 a americké společnosti",
  "nejlepsi-etf-na-nasdaq": "NASDAQ technologické ETF fondy s výkonnostními daty a porovnáním poplatků",
  "nejlepsi-dividendove-etf": "Dividendové ETF fondy pro pasivní příjem a dlouhodobé investování",
  "nejlepsi-etf-na-evropske-akcie": "Evropské akciové ETF fondy zaměřené na STOXX 600 a evropské společnosti",
  "all-weather-portfolio": "All-Weather portfolio strategie Ray Dalia s ETF fondy pro každé ekonomické prostředí",
  "jak-zacit-investovat-do-etf": "Návod pro začátečníky jak začít investovat do ETF fondů krok za krokem",
  "etf-vs-aktivni-fondy": "Srovnání ETF a aktivně řízených fondů podle nákladů a výkonnosti",
  "rebalancing-portfolia": "Strategie rebalancingu ETF portfolia pro optimální dlouhodobé výnosy",
  "etf-pro-duchod": "Důchodové spoření s ETF fondy podle věku a investiční strategie",
  "nejlevnejsi-etf-fondy": "ETF fondy s nejnižšími poplatky TER a jejich vliv na dlouhodobé výnosy",
  "esg-udrzitelne-etf": "ESG udržitelné ETF fondy pro etické investování s ohledem na životní prostředí",
};

const ARTICLES = [
  {
    slug: "fed-snizil-sazby-etf-analyza-2025",
    title: "Fed snížil sazby o 0,25%: ETF fondy reagují na první úrokové uvolnění roku 2025",
    perex:
      "Středeční rozhodnutí Federální rezervy snížit úrokové sazby odstartovalo první uvolnění měnové politiky v roce 2025. Analýza dopadu na ETF trhy, zlatá horečka mining fondů a investiční příležitosti.",
    category: "Týdenní zprávy",
    readTime: "12 min",
    difficulty: "Mírně pokročilé"
  },
  {
    slug: "nejlepsi-etf-2025",
    title: "Nejlepší ETF 2025",
    perex:
      "Výběr nejlepších ETF fondů pro rok 2025. Analýza podle správcovských poplatků, velikosti fondu, výkonnosti a diverzifikace s konkrétními doporučeními pro české investory.",
    category: "Doporučení",
    readTime: "8 min",
    difficulty: "Začátečník"
  },
  {
    slug: "nejlepsi-etf-na-americke-akcie",
    title: "Nejlepší ETF na americké akcie",
    perex:
      "Kompletní průvodce investováním do amerického akciového trhu. Srovnání S&P 500, celého amerického trhu a růstových akcií s praktickými tipy pro výběr.",
    category: "Regionální",
    readTime: "10 min",
    difficulty: "Začátečník"
  },
  {
    slug: "nejlepsi-etf-na-nasdaq",
    title: "Nejlepší ETF na NASDAQ",
    perex:
      "Technologické ETF fondy zaměřené na NASDAQ index. Detailní analýza výnosů, rizik a srovnání největších poskytovatelů s doporučeními pro různé investiční profily.",
    category: "Sektorové",
    readTime: "7 min",
    difficulty: "Mírně pokročilé"
  },
  {
    slug: "nejlepsi-dividendove-etf",
    title: "Nejlepší dividendové ETF",
    perex:
      "Jak budovat pasivní příjem s dividendovými ETF. Strategie výběru, daňové optimalizace, srovnání výnosů a praktické tipy pro dlouhodobé investory.",
    category: "Strategie",
    readTime: "12 min",
    difficulty: "Mírně pokročilé"
  },
  {
    slug: "nejlepsi-etf-na-evropske-akcie",
    title: "Nejlepší ETF na evropské akcie",
    perex:
      "Diverzifikace do evropských trhů. Analýza STOXX 600, jednotlivých zemí a sektorů s praktickými radami pro sestavení vyváženého portfolia.",
    category: "Regionální",
    readTime: "9 min",
    difficulty: "Začátečník"
  },
  {
    slug: "all-weather-portfolio",
    title: "All-Weather Portfolio podle Raya Dalia",
    perex:
      "Legendární strategie pro každé ekonomické prostředí. Krok za krokem návod jak sestavit odolné portfolio s ETF fondy včetně praktických kalkulací a rebalancingu.",
    category: "Strategie",
    readTime: "15 min",
    difficulty: "Pokročilé"
  },
  {
    slug: "jak-zacit-investovat-do-etf",
    title: "Jak začít investovat do ETF",
    perex:
      "Kompletní průvodce pro úplné začátečníky. Od otevření účtu u brokera až po první nákup ETF. Včetně chyb, kterým se vyhnout a praktických tipů pro dlouhodobý úspěch.",
    category: "Začátečníci",
    readTime: "20 min",
    difficulty: "Začátečník"
  },
  {
    slug: "etf-vs-aktivni-fondy",
    title: "ETF vs. aktivní fondy",
    perex:
      "Objektivní srovnání ETF a aktivně řízených fondů. Analýza nákladů, výkonnosti, daní a rizik s konkrétními příklady a doporučeními pro různé typy investorů.",
    category: "Vzdělávání",
    readTime: "11 min",
    difficulty: "Mírně pokročilé"
  },
  {
    slug: "rebalancing-portfolia",
    title: "Rebalancing portfolia",
    perex:
      "Kdy a jak rebalancovat portfolio ETF fondů. Praktické strategie, náklady, daňové dopady a automatizace rebalancingu pro optimální dlouhodobé výnosy.",
    category: "Strategie",
    readTime: "13 min",
    difficulty: "Pokročilé"
  },
  {
    slug: "etf-pro-duchod",
    title: "ETF pro důchod",
    perex:
      "Jak sestavit ETF portfolio pro důchodové spoření. Strategie podle věku, optimalizace daní, výběr akumulačních vs. distribučních fondů a plánování výběru.",
    category: "Životní situace",
    readTime: "16 min",
    difficulty: "Mírně pokročilé"
  },
  {
    slug: "nejlevnejsi-etf-fondy",
    title: "Nejlevnější ETF fondy",
    perex:
      "Fondy s nejnižšími poplatky TER na trhu. Analýza nákladů, skrytých poplatků a jejich vliv na dlouhodobé výnosy. Tipy jak minimalizovat náklady investování.",
    category: "Optimalizace",
    readTime: "8 min",
    difficulty: "Začátečník"
  },
  {
    slug: "esg-udrzitelne-etf",
    title: "ESG a udržitelné ETF",
    perex:
      "Investování s ohledem na životní prostředí a společenskou odpovědnost. Přehled nejlepších ESG ETF, jejich výkonnost a jak vybírat udržitelné investice.",
    category: "Specializované",
    readTime: "10 min",
    difficulty: "Mírně pokročilé"
  }
];

const BlogContent: React.FC = () => {

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Začátečník": return "bg-green-100 text-green-800";
      case "Mírně pokročilé": return "bg-yellow-100 text-yellow-800";
      case "Pokročilé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Týdenní zprávy": "bg-red-100 text-red-800",
      "Doporučení": "bg-blue-100 text-blue-800",
      "Regionální": "bg-purple-100 text-purple-800",
      "Sektorové": "bg-orange-100 text-orange-800",
      "Strategie": "bg-violet-100 text-violet-800",
      "Začátečníci": "bg-green-100 text-green-800",
      "Vzdělávání": "bg-indigo-100 text-indigo-800",
      "Životní situace": "bg-pink-100 text-pink-800",
      "Optimalizace": "bg-teal-100 text-teal-800",
      "Specializované": "bg-amber-100 text-amber-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gray-50">
        {/* Hero sekce */}
        <section className="relative flex flex-col items-center justify-center px-4 py-12 md:py-20 mb-6 bg-gradient-to-br from-violet-600 to-violet-800">
          <div className="relative z-10 max-w-2xl text-center">
            <span className="uppercase text-xs font-bold text-violet-200 tracking-widest">BLOG A TIPY PRO INVESTORY</span>
            <h1 className="font-extrabold text-4xl md:text-5xl text-white mt-3 mb-4">
              Chytré tipy a srovnání ETF fondů
            </h1>
            <p className="text-violet-100 text-lg md:text-xl mb-6">
              Nejlepší ETF pro vaše portfolio, aktuální doporučení a inspirace – vše na jednom místě s expertní analýzou. Klikněte na článek a dozvíte se detaily, které vám usnadní investiční rozhodování.
            </p>
          </div>
        </section>

        {/* Výpis článků */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ARTICLES.map((article, idx) => (
              <Card
                key={article.slug}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-200 animate-fade-in flex flex-col h-full"
              >
                <Link href={`/tipy/${article.slug}`} className="block h-full focus:outline-none group flex flex-col">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    <img
                      src={ARTICLE_IMAGES[article.slug] || PLACEHOLDER_IMAGE}
                      alt={ARTICLE_ALT_TEXTS[article.slug] || `${article.title} - ilustrační obrázek`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="absolute left-3 top-3 flex gap-2">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                    </div>
                    <div className="absolute right-3 top-3">
                      <Badge className={getDifficultyColor(article.difficulty)}>
                        {article.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="flex flex-col h-full justify-between p-5 flex-1">
                    <div className="flex-1">
                      <h2 className="font-bold text-lg leading-tight mb-3 text-gray-900 group-hover:text-violet-700 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{article.perex}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {article.difficulty}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-violet-700 font-medium text-sm group-hover:underline underline-offset-2 transition-colors">
                          Číst více
                        </span>
                        <ArrowRight className="w-4 h-4 text-violet-700 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Social Sharing */}
        <SocialSharing 
          url="https://etfpruvodce.cz/blog"
          title="Blog - Tipy a návody pro investory - ETF průvodce.cz"
          description="Expertní tipy, návody a strategie pro investování do ETF fondů. Praktické rady pro začátečníky i pokročilé investory."
          className="mt-8"
        />
      </div>
    </Layout>
  );
};

export default BlogContent;
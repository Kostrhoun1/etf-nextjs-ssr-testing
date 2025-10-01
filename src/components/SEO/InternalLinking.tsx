import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Calculator , Globe, TrendingUp, Building} from 'lucide-react';

interface RelatedLink {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

interface InternalLinkingProps {
  relatedLinks?: RelatedLink[];
  title?: string;
  className?: string;
  currentPage?: string;
  links?: RelatedLink[];
}

const InternalLinking: React.FC<InternalLinkingProps> = ({ 
  relatedLinks, 
  title = "Související články a nástroje",
  className = "",
  currentPage,
  links
}) => {
  // Use links prop as fallback for relatedLinks
  const linksToRender = relatedLinks || links;
  
  if (!linksToRender || linksToRender.length === 0) return null;

  return (
    <section className={`bg-gray-50 rounded-lg p-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {linksToRender.map((link, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                {link.icon}
                <CardTitle className="text-lg">{link.title}</CardTitle>
              </div>
              <CardDescription className="text-sm">
                {link.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link 
                href={link.href}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm group"
              >
                Přečíst více
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

// Predefined link sets for different page types
export const ETFGuideRelatedLinks: RelatedLink[] = [
  {
    title: "Srovnání ETF fondů",
    description: "Porovnejte více než 3500 ETF fondů podle kategorií, poplatků a výkonnosti",
    href: "/srovnani-etf",
    icon: <TrendingUp className="h-5 w-5 text-blue-600" />
  },
  {
    title: "Kde koupit ETF",
    description: "Najděte nejlepšího brokera pro investování do ETF fondů",
    href: "/kde-koupit-etf",
    icon: <BookOpen className="h-5 w-5 text-green-600" />
  },
  {
    title: "Investiční kalkulačky",
    description: "Spočítejte si potenciální výnosy a poplatky u ETF investic",
    href: "/kalkulacky",
    icon: <Calculator className="h-5 w-5 text-purple-600" />
  }
];

export const BrokerGuideRelatedLinks: RelatedLink[] = [
  {
    title: "Co jsou ETF fondy?",
    description: "Kompletní průvodce ETF fondy pro začátečníky",
    href: "/co-jsou-etf",
    icon: <BookOpen className="h-5 w-5 text-blue-600" />
  },
  {
    title: "Srovnání ETF fondů",
    description: "Najděte nejlepší ETF fondy pro vaši investiční strategii",
    href: "/srovnani-etf",
    icon: <TrendingUp className="h-5 w-5 text-green-600" />
  },
  {
    title: "DEGIRO recenze",
    description: "Detailní recenze populárního nizozemského brokera",
    href: "/degiro-recenze",
    icon: <ArrowRight className="h-5 w-5 text-orange-600" />
  },
  {
    title: "Portu recenze",
    description: "Recenze českého robo-advisora pro automatizované investování",
    href: "/portu-recenze",
    icon: <ArrowRight className="h-5 w-5 text-blue-600" />
  }
];

export const ToolsRelatedLinks: RelatedLink[] = [
  {
    title: "Návod pro začátečníky",
    description: "Kompletní průvodce jak začít investovat do ETF",
    href: "/co-jsou-etf/jak-zacit-investovat",
    icon: <BookOpen className="h-5 w-5 text-blue-600" />
  },
  {
    title: "Srovnání ETF fondů",
    description: "Porovnejte ETF fondy podle různých kritérií",
    href: "/srovnani-etf",
    icon: <TrendingUp className="h-5 w-5 text-green-600" />
  },
  {
    title: "Investiční tipy",
    description: "Užitečné články o investování do ETF fondů",
    href: "/tipy",
    icon: <ArrowRight className="h-5 w-5 text-purple-600" />
  }
];

export default InternalLinking;
import React from "react";
import { BarChart, BookOpen, Calculator, List } from "lucide-react";
import { Card } from "@/components/ui/card";

const usp = [
  {
    icon: List,
    title: "3 500+ ETF fondů",
    description: "Kompletní databáze ETF z celého světa – snadné srovnání výnosů, poplatků i strategií.",
  },
  {
    icon: BarChart,
    title: "Srovnání brokerů",
    description: "Přehledný výběr českých a zahraničních brokerů podle poplatků a nabídky ETF.",
  },
  {
    icon: Calculator,
    title: "Investiční nástroje",
    description: "Kalkulačka složeného úročení, simulace portfolia a analýza dopadu poplatků.",
  },
  {
    icon: BookOpen,
    title: "Praktické tipy a vzdělávání",
    description: "Jednoduše a srozumitelně – průvodci, články i odpovědi na časté dotazy o ETF investování.",
  },
];

const USPSection: React.FC = () => (
  <section className="bg-white py-8">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {usp.map((item) =>
          <Card key={item.title} className="flex flex-col items-center text-center py-5 px-3 border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white">
            <div className="mb-3 flex items-center justify-center rounded-full bg-violet-100 w-12 h-12 group-hover:bg-violet-200 transition-colors">
              <item.icon className="h-6 w-6 text-violet-700" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
          </Card>
        )}
      </div>
    </div>
  </section>
);

export default USPSection;
import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { TrendingUp, Compass, ShieldCheck, Wallet, Sparkles } from 'lucide-react';
import EtfSelector from '@/components/design-preview/EtfSelector';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Který ETF si vybrat? Průvodce výběrem ETF pro české investory',
  description: 'Nevíš, který ETF koupit? Odpověz na pár otázek a náš průvodce ti podle horizontu, rizika a cíle doporučí vhodný typ ETF – s výnosy v korunách a českým daňovým kontextem.',
};

export default function VyberEtfPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Jak si vybrat správný ETF?', acceptedAnswer: { '@type': 'Answer', text: 'Vyjdi z investičního horizontu (jak dlouho nebudeš peníze potřebovat), tolerance rizika a cíle (růst vs pravidelný příjem). Na dlouhý horizont a širokou diverzifikaci se hodí celosvětový nebo S&P 500 ETF v akumulační variantě. Náš průvodce ti podle odpovědí doporučí vhodný typ.' } },
      { '@type': 'Question', name: 'Je lepší celosvětový ETF, nebo S&P 500?', acceptedAnswer: { '@type': 'Answer', text: 'Celosvětový ETF (např. FTSE All-World) dává nejširší rozložení bez nutnosti hádat region. S&P 500 je koncentrovaná sázka na 500 největších amerických firem s nižšími poplatky, ale 100 % v USA. Pro většinu dlouhodobých investorů je celosvětový fond bezpečnější základ.' } },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/design-preview/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
          <Link href="/design-preview/srovnani" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnávač</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-20">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-700">Domů</Link><span>/</span>
          <span className="text-slate-700">Který ETF vybrat</span>
        </nav>

        <section className="pb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700"><Sparkles className="w-3.5 h-3.5" /> Průvodce výběrem</span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Který ETF si vybrat?</h1>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Odpověz na 4 otázky a podle horizontu, rizika a cíle ti doporučíme vhodný typ ETF –
            s <strong>výnosy přepočtenými do korun</strong> a českým daňovým kontextem. Zdarma, bez registrace.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> 4 otázky, ~30 vteřin</span>
            <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Výnosy v Kč</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Vzdělávací, ne poradenství</span>
          </div>
        </section>

        <EtfSelector />
      </main>
    </div>
  );
}

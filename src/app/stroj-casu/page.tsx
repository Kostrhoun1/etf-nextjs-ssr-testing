import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import AutorBox from '@/components/design-preview/AutorBox';
import { clanekSchema } from '@/lib/redakce';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import StrojCasuWidget from '@/components/design-preview/StrojCasuWidget';
import { nactiStrojCasu, spocitejStroj, STROJ_PRESETY } from '@/lib/strojCasu';
import { ogImage } from '@/lib/ogImage';
import { titulek } from '@/lib/seoTitulek';

/* Korunový stroj času (Vlna 6). Řady se počítají při ISR renderu (1× denně) stejným enginem
   jako backtest; prohlížeč jen násobí – žádný výpočet na serveru při každé návštěvě. */
export const revalidate = 86400;

/* Vlastní OG (UX review: dřív se dědilo og:url homepage → Facebook sdílel titulní stranu).
   Číslo v obrázku = výchozí scénář, spočítaný stejně jako na stránce. generateMetadata BEZ
   searchParams → stránka zůstává statická (ISR); obrázek per scénář by ji udělal dynamickou. */
export async function generateMetadata(): Promise<Metadata> {
  const svet = (await nactiStrojCasu(['svet']))[0];
  const cerstvy = svet && Date.now() - new Date(svet.posledniDen).getTime() < 7 * 864e5;
  const v = svet && cerstvy ? spocitejStroj(svet, '2010-01', 5000, 0) : null;
  const stat = v ? `${(v.hodnota / 1_000_000).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} mil. Kč` : undefined;
  const title = 'Kolik byste dnes měli, kdybyste začali investovat dřív?';
  const description = 'Korunový stroj času: kolik by dnes měly vaše pravidelné investice od roku 2000, 2010 nebo 2020 – v korunách, na skutečných historických datech včetně krizí.';
  return {
    title: titulek('Korunový stroj času: kolik byste dnes měli, kdybyste začali dřív'),
    description,
    alternates: { canonical: '/stroj-casu' },
    openGraph: {
      title, description, url: '/stroj-casu', type: 'website',
      images: [ogImage({ title, eyebrow: 'Korunový stroj času', stat, statLabel: stat ? '5 000 Kč měsíčně do akcií celého světa od roku 2010' : undefined })],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function StrojCasuStranka() {
  const rady = await nactiStrojCasu();
  // Chybějící data = výjimka: Next pak při ISR ponechá poslední dobrou verzi stránky (místo
  // „nepodařilo se načíst“ na celý den). Při buildu selže build – raději než nasadit prázdnou stránku.
  if (rady.length < STROJ_PRESETY.length) throw new Error(`stroj času: načteno ${rady.length} z ${STROJ_PRESETY.length} presetů`);
  // Den dat = poslední den řad (stejný jako „Data k …“ ve widgetu) – datum úpravy článku (src/lib/redakce.ts).
  const denDat = rady.map((r) => r.posledniDen).filter(Boolean).sort().at(-1) ?? null;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Co říkají data', item: 'https://etfpruvodce.cz/co-rikaji-data' },
      { '@type': 'ListItem', position: 3, name: 'Korunový stroj času', item: 'https://etfpruvodce.cz/stroj-casu' },
    ],
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clanekSchema({ cesta: '/stroj-casu', nadpis: 'Korunový stroj času', denDat })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-20">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <Link href="/co-rikaji-data" className="hover:text-slate-700">Co říkají data</Link><span>/</span>
          <span className="text-slate-700">Korunový stroj času</span>
        </nav>

        <section className="py-2 md:py-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Korunový stroj času</h1>
          <p className="mt-2 md:mt-3 text-base text-slate-600 leading-relaxed">
            <span className="md:hidden">Kolik byste měli dnes, kdybyste začali dřív? Na skutečných datech v korunách.</span>
            <span className="hidden md:inline">
              Kolik byste měli dnes, kdybyste začali investovat dřív? Vyberte, do čeho, kolik měsíčně a od kterého roku –
              výsledek je v korunách, na skutečných historických datech včetně krizí a pohybu kurzu koruny.
            </span>
          </p>
        </section>

        <StrojCasuWidget rady={rady} />

        <section className="mt-10 grid gap-4 md:grid-cols-2 max-w-4xl">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Proč v korunách</h2>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Zahraniční kalkulačky počítají v dolarech. Českému investorovi ale výsledek mění i kurz koruny – v krizích ho
              většinou tlumí, dlouhodobě koruna posilovala.{' '}
              <Link href="/menove-riziko-etf" className="font-medium text-teal-700 hover:underline">Víc o měnovém riziku</Link>
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Naráz, nebo postupně?</h2>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Zkuste stejnou částku vložit jednorázově na začátku místo po měsících – a podívejte se, co říkají data.{' '}
              <Link href="/dca-vs-jednorazova" className="font-medium text-teal-700 hover:underline">Jednorázově vs. pravidelně</Link>
            </p>
          </div>
        </section>

        <section className="mt-6 max-w-4xl">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Co říkají data dál</h2>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['/kolik-vydelaly-etf', 'Kolik vydělaly ETF a akcie', 'Výnosy hlavních trhů v korunách za ~18 let.'],
              ['/jak-dlouho-v-minusu', 'Jak dlouho můžete být v minusu?', 'Návrat po propadech – v Kč i po inflaci.'],
              ['/sp500-nebo-cely-svet', 'S&P 500, nebo celý svět?', 'Co vydělalo víc v korunách.'],
              ['/pravidlo-4-procent', 'Pravidlo 4 % v korunách', 'Vydržel by výběr 4 % ročně od roku 2000?'],
            ].map(([href, t, p]) => (
              <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300">
                <span className="block text-sm font-semibold text-slate-900">{t}</span>
                <span className="mt-1 block text-xs text-slate-500">{p}</span>
              </Link>
            ))}
          </div>
        </section>
        <div className="mt-10 max-w-4xl"><AutorBox cesta="/stroj-casu" denDat={denDat} /></div>
      </main>
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { TrendingUp, ArrowLeft, ArrowRight, Search, Scale, Plus, Check } from 'lucide-react';
import { getComparisonETFsByIsins, getETFsByIsins } from '@/lib/etf-data';
import { HLAVNI_DVOJICE, POPISKY_DVOJIC } from '@/lib/pairs';
import { kratkyNazevFondu } from '@/lib/nazevFondu';
import PorovnaniTable from '@/components/design-preview/PorovnaniTable';
import PorovnaniGraf from '@/components/design-preview/PorovnaniGraf';
import UpravitVyber from '@/components/design-preview/UpravitVyber';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import { zobrazovanyTicker } from '@/lib/ticker';
import { nejcastejsiDatumVynosu, jineDatumVynosu, datumVynosuIso, type SDatemVynosu } from '@/lib/datumVynosu';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Porovnání ETF vedle sebe',
  description: 'Detailní porovnání vybraných ETF fondů vedle sebe – poplatky, výnosy v Kč, riziko, typ a daně.',
  robots: { index: false, follow: false },
};

function Head() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
          ETF průvodce.cz
        </Link>
        <MobileMenu />
        <SiteNav />
        <HeaderSearch />
      </div>
    </header>
  );
}

/* Prázdné porovnání (kolo 5, 19. 10. 2026): 80 % plochy bylo prázdných. Hotové dvojice = VŠECHNY hlavní kurátorské
   dvojice ze sitemapy (src/lib/pairs.ts, SEO audit 20. 10. 2026 – dřív 6 ze 14 a zbytek bez interního odkazu). */
const HOTOVE_DVOJICE: { slug: string; otazka: string }[] = HLAVNI_DVOJICE.map((slug) => ({ slug, otazka: POPISKY_DVOJIC[slug] ?? '' }));
/** Nejčastěji porovnávané fondy (VWCE, SXR8, EUNL, VUAA, SPYL, EIMI). */
const CASTE_FONDY = ['IE00BK5BQT80', 'IE00B5BMR087', 'IE00B4L5Y983', 'IE00BFMXXD54', 'IE000XZSV718', 'IE00BKM4GZ66'];

async function PrazdnePorovnani({ vybrane }: { vybrane: string[] }) {
  const fondy = await getETFsByIsins([...new Set([...vybrane, ...CASTE_FONDY])]);
  const tk = (isin: string) => {
    const e = fondy.find((f) => f.isin === isin);
    return e ? zobrazovanyTicker(e as unknown as Record<string, unknown>) ?? isin : isin;
  };
  const nabidka = fondy.filter((f) => CASTE_FONDY.includes(f.isin));
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-700 mb-4"><Scale className="w-6 h-6" /></span>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Vyberte fondy k porovnání</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          {vybrane.length === 1 ? <>Máte vybraný <strong className="text-slate-700">{tk(vybrane[0])}</strong> – přidejte aspoň jeden další fond (nejvýš 4).</> : 'Porovnat jde 2 až 4 fondy vedle sebe. Začněte hotovou dvojicí, nebo fondy přidejte jedním klikem.'}
        </p>
      </div>

      <section className="mt-8" aria-labelledby="h-dvojice">
        <h2 id="h-dvojice" className="text-sm font-semibold text-slate-900">Nejčastější srovnání</h2>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {HOTOVE_DVOJICE.map((d) => (
            <li key={d.slug}>
              <Link href={`/srovnani/${d.slug}`} prefetch={false} className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-teal-300">
                <span className="min-w-0">
                  <span className="block font-semibold text-slate-900 group-hover:text-teal-800">{d.slug.split('-vs-').map((t) => t.toUpperCase()).join(' vs ')}</span>
                  <span className="block text-xs text-slate-500">{d.otazka}</span>
                </span>
                <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-teal-700" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {nabidka.length > 0 && (
        <section className="mt-8" aria-labelledby="h-caste">
          <h2 id="h-caste" className="text-sm font-semibold text-slate-900">Přidat fond jedním klikem</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {nabidka.map((f) => {
              const uz = vybrane.includes(f.isin);
              const dalsi = [...vybrane, f.isin].slice(0, 4).join(',');
              return (
                <li key={f.isin}>
                  {uz ? (
                    <span className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 text-sm font-medium text-teal-800"><Check className="w-4 h-4" /> {tk(f.isin)}</span>
                  ) : (
                    <Link href={`/srovnani/porovnani?isins=${dalsi}`} title={f.name} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 hover:border-teal-400 hover:text-teal-800">
                      <Plus className="w-4 h-4 text-teal-700" /> <strong className="font-semibold">{tk(f.isin)}</strong> <span className="hidden sm:inline text-slate-500">{kratkyNazevFondu(f.name)}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-8 text-center">
        <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"><Search className="w-4 h-4" /> Vybrat jiné fondy ve srovnávači</Link>
        <p className="mt-2 text-xs text-slate-500">Ve srovnávači i na detailu fondu přidáte fond tlačítkem „Porovnat“.</p>
      </div>
    </div>
  );
}

export default async function PorovnaniPreview(
  { searchParams }: { searchParams: Promise<{ isins?: string }> },
) {
  const { isins } = await searchParams;
  const list = (isins ?? '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const etfs = await getComparisonETFsByIsins(list);

  // Každé číslo má datum (pravidlo č. 1). 21. 10. 2026: „Data k“ = nejčastější den VÝNOSŮ porovnávaných fondů
  // (returns_as_of – poslední jistě konečný den u zdroje, src/lib/datumVynosu.ts); když se fondy liší (zpožděná
  // řada u zdroje – ESEA 16. 10. vs. VWCE 19. 10.), vypíše se den u každého fondu zvlášť.
  const sDaty = etfs as unknown as (SDatemVynosu & { isin: string })[];
  const datumDat = nejcastejsiDatumVynosu(sDaty);
  const jineDny = sDaty.map((e, i) => ({ e, i, dv: jineDatumVynosu(e, datumDat) })).filter((x) => x.dv);
  // Rok dat: letošní (YTD) sloupec grafu a posledních 5 dokončených roků se počítají od data dat, ne od dneška.
  const rokDat = (datumDat ?? new Date()).getFullYear();
  const fondy = etfs.map((e) => ({ isin: e.isin, label: zobrazovanyTicker(e as unknown as Record<string, unknown>) ?? e.isin.slice(0, 8) }));

  if (etfs.length < 2) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Head />
        <main id="obsah" className="max-w-6xl mx-auto px-4 py-12">
          <PrazdnePorovnani vybrane={etfs.map((e) => e.isin)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Head />
      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-24">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <Link href="/srovnani" className="hover:text-slate-700">Srovnávač</Link><span>/</span>
          <span className="text-slate-700">Porovnání</span>
        </nav>

        <section className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Porovnání {etfs.length} fondů</h1>
            <div className="flex items-center gap-3">
              {datumDat && <AktualnostDat datum={datumDat} />}
              <CurrencyToggle size="sm" showLabel={false} />
            </div>
          </div>
          {jineDny.length > 0 && (
            <p className="mt-2 text-xs text-amber-800">
              Výnosy některých fondů platí k jinému dni (zdroj má jejich ceny se zpožděním):{' '}
              {jineDny.map((x, k) => (
                <span key={x.e.isin} data-vynosy-k={datumVynosuIso(x.e) ?? undefined}>{k > 0 && ', '}<strong>{fondy[x.i]?.label}</strong> k {x.dv}</span>
              ))}.
            </p>
          )}
        </section>

        <div className="space-y-4">
          <UpravitVyber fondy={fondy} />
          <PorovnaniGraf rokDat={rokDat} fondy={etfs.map((e, i) => ({ ...fondy[i], data: Object.fromEntries(Object.entries(e).filter(([k]) => k.startsWith("return_"))) }))} />
          <PorovnaniTable etfs={etfs} rokDat={rokDat} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"><ArrowLeft className="w-4 h-4" /> Zpět do srovnávače</Link>
        </div>
      </main>
    </div>
  );
}

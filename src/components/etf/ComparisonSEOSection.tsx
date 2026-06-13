import React from 'react';
import type { ComparisonETF } from '@/lib/etf-data';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

const SITE_URL = 'https://www.etfpruvodce.cz';

interface Props {
  etf1: ComparisonETF;
  etf2: ComparisonETF;
  ticker1: string;
  ticker2: string;
  comparison: string;
  lastModified?: string | null;
}

// ---- formátovače ----
const pct = (v: number | null | undefined, digits = 2) =>
  v === null || v === undefined ? '—' : `${v.toFixed(digits)} %`;
const ter = (v: number | null | undefined) => (v === null || v === undefined ? '—' : `${v.toFixed(2)} %`);
const money = (v: number | null | undefined) => {
  if (v === null || v === undefined) return '—';
  if (v >= 1000) return `${(v / 1000).toFixed(1)} mld. €`;
  return `${Math.round(v)} mil. €`;
};
const dist = (v: string | null | undefined) =>
  v === 'Accumulating' ? 'Akumulační' : v === 'Distributing' ? 'Distribuční' : v || '—';
const year = (v: string | null | undefined) => (v ? v.slice(0, 4) : '—');
const num = (v: number | null | undefined) => (v === null || v === undefined ? '—' : v.toLocaleString('cs-CZ'));
const shortName = (n: string) => n.replace(/\s+UCITS ETF.*/i, '').trim();

export default function ComparisonSEOSection({ etf1, etf2, ticker1, ticker2, comparison, lastModified }: Props) {
  const n1 = shortName(etf1.name);
  const n2 = shortName(etf2.name);

  // ---- datově řízené srovnávací věty ----
  const cheaper =
    etf1.ter_numeric != null && etf2.ter_numeric != null && etf1.ter_numeric !== etf2.ter_numeric
      ? (etf1.ter_numeric < etf2.ter_numeric
          ? { win: ticker1, lose: ticker2, diff: etf2.ter_numeric - etf1.ter_numeric }
          : { win: ticker2, lose: ticker1, diff: etf1.ter_numeric - etf2.ter_numeric })
      : null;

  const bigger =
    etf1.fund_size_numeric != null && etf2.fund_size_numeric != null
      ? (etf1.fund_size_numeric > etf2.fund_size_numeric ? ticker1 : ticker2)
      : null;

  const better3y =
    etf1.return_3y != null && etf2.return_3y != null && etf1.return_3y !== etf2.return_3y
      ? (etf1.return_3y > etf2.return_3y
          ? { win: ticker1, diff: etf1.return_3y - etf2.return_3y }
          : { win: ticker2, diff: etf2.return_3y - etf1.return_3y })
      : null;

  const sameIndex =
    !!etf1.index_name && !!etf2.index_name &&
    etf1.index_name.toLowerCase().split('  ')[0] === etf2.index_name.toLowerCase().split('  ')[0];

  // ---- FAQ (datově řízené) ----
  const faqs: { q: string; a: string }[] = [
    {
      q: `Jaký je hlavní rozdíl mezi ${ticker1} a ${ticker2}?`,
      a: sameIndex
        ? `Oba fondy sledují podobný index (${etf1.index_name}), takže expozicí jsou si blízké. Liší se hlavně poplatkem TER (${ter(etf1.ter_numeric)} u ${ticker1} vs ${ter(etf2.ter_numeric)} u ${ticker2}), velikostí fondu, politikou výplaty (${dist(etf1.distribution_policy)} vs ${dist(etf2.distribution_policy)}) a domicilem.`
        : `${ticker1} sleduje index ${etf1.index_name || 'svůj benchmark'} (region ${etf1.region || 'n/a'}), zatímco ${ticker2} sleduje ${etf2.index_name || 'jiný benchmark'} (region ${etf2.region || 'n/a'}). Liší se tedy už samotnou investiční expozicí, ne jen poplatky.`,
    },
    {
      q: `Který z fondů ${ticker1} a ${ticker2} má nižší poplatky?`,
      a: cheaper
        ? `Nižší roční poplatek TER má ${cheaper.win} (${ter(cheaper.win === ticker1 ? etf1.ter_numeric : etf2.ter_numeric)}), což je o ${cheaper.diff.toFixed(2)} p.b. ročně méně než ${cheaper.lose}. Na dlouhém horizontu se rozdíl v nákladech promítá do výnosu.`
        : `Oba fondy mají srovnatelný poplatek TER (${ter(etf1.ter_numeric)}).`,
    },
    {
      q: `Vyplácí ${ticker1} a ${ticker2} dividendy?`,
      a: `${ticker1} je ${dist(etf1.distribution_policy).toLowerCase()} (${etf1.distribution_policy === 'Distributing' ? 'dividendy vyplácí' : 'dividendy reinvestuje'}), ${ticker2} je ${dist(etf2.distribution_policy).toLowerCase()} (${etf2.distribution_policy === 'Distributing' ? 'dividendy vyplácí' : 'dividendy reinvestuje'}). Akumulační varianta je obvykle praktičtější pro dlouhodobé spoření, distribuční pro pasivní příjem.`,
    },
    {
      q: `Který fond je větší a déle na trhu?`,
      a: `${ticker1} spravuje ${money(etf1.fund_size_numeric)} (založen ${year(etf1.inception_date)}), ${ticker2} spravuje ${money(etf2.fund_size_numeric)} (založen ${year(etf2.inception_date)}). Větší a starší fond bývá likvidnější a má nižší riziko zrušení.`,
    },
  ];

  // ---- JSON-LD ----
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Srovnání ETF', item: `${SITE_URL}/srovnani-etf` },
      { '@type': 'ListItem', position: 3, name: `${ticker1} vs ${ticker2}`, item: `${SITE_URL}/srovnani-etf/${comparison}` },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${ticker1} vs ${ticker2}: srovnání ETF`,
    inLanguage: 'cs',
    datePublished: '2025-01-01',
    dateModified: lastModified || new Date().toISOString(),
    author: { '@type': 'Person', name: 'Tomáš Kostrhoun', url: `${SITE_URL}/o-nas` },
    publisher: { '@type': 'Organization', name: 'ETF průvodce.cz', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/srovnani-etf/${comparison}`,
  };

  const rows: { label: string; v1: string; v2: string }[] = [
    { label: 'Sledovaný index', v1: etf1.index_name || '—', v2: etf2.index_name || '—' },
    { label: 'Region', v1: etf1.region || '—', v2: etf2.region || '—' },
    { label: 'Poplatek TER (ročně)', v1: ter(etf1.ter_numeric), v2: ter(etf2.ter_numeric) },
    { label: 'Velikost fondu', v1: money(etf1.fund_size_numeric), v2: money(etf2.fund_size_numeric) },
    { label: 'Výnos 1 rok', v1: pct(etf1.return_1y), v2: pct(etf2.return_1y) },
    { label: 'Výnos 3 roky', v1: pct(etf1.return_3y), v2: pct(etf2.return_3y) },
    { label: 'Výnos 5 let', v1: pct(etf1.return_5y), v2: pct(etf2.return_5y) },
    { label: 'Dividendový výnos', v1: pct(etf1.current_dividend_yield_numeric), v2: pct(etf2.current_dividend_yield_numeric) },
    { label: 'Výplata', v1: dist(etf1.distribution_policy), v2: dist(etf2.distribution_policy) },
    { label: 'Replikace', v1: etf1.replication || '—', v2: etf2.replication || '—' },
    { label: 'Měna fondu', v1: etf1.fund_currency || '—', v2: etf2.fund_currency || '—' },
    { label: 'Domicil', v1: etf1.fund_domicile || '—', v2: etf2.fund_domicile || '—' },
    { label: 'Počet pozic', v1: num(etf1.total_holdings), v2: num(etf2.total_holdings) },
    { label: 'Datum založení', v1: year(etf1.inception_date), v2: year(etf2.inception_date) },
    { label: 'ISIN', v1: etf1.isin, v2: etf2.isin },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-8" aria-label={`Srovnání ${ticker1} vs ${ticker2}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      {/* Breadcrumb */}
      <nav aria-label="Drobečková navigace" className="text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-violet-700">Domů</a>
        <span aria-hidden="true"> › </span>
        <a href="/srovnani-etf" className="hover:text-violet-700">Srovnání ETF</a>
        <span aria-hidden="true"> › </span>
        <span className="text-gray-700">{ticker1} vs {ticker2}</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        {ticker1} vs {ticker2}: které ETF je lepší?
      </h1>
      <p className="text-gray-700 leading-relaxed mb-4">
        Srovnáváme <strong>{n1}</strong> ({ticker1}) a <strong>{n2}</strong> ({ticker2}) –
        dva ETF, které čeští investoři často zvažují vedle sebe.{' '}
        {sameIndex
          ? `Oba sledují podobnou expozici, takže rozhodují hlavně náklady, velikost a způsob výplaty.`
          : `Každý sleduje jinou expozici, takže nejde jen o poplatky, ale i o to, do čeho přesně investujete.`}{' '}
        {cheaper && `Z hlediska nákladů je levnější ${cheaper.win} (TER nižší o ${cheaper.diff.toFixed(2)} p.b. ročně). `}
        {bigger && `Větší a likvidnější je ${bigger}. `}
        {better3y && `Za poslední 3 roky vynesl více ${better3y.win} (o ${better3y.diff.toFixed(1)} p.b.).`}
      </p>

      <InvestmentDisclaimer variant="box" className="mb-8" />

      {/* Tabulka metrik */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Srovnání klíčových parametrů</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse min-w-[520px]">
          <caption className="sr-only">Srovnání parametrů ETF {ticker1} a {ticker2}</caption>
          <thead>
            <tr className="border-b-2 border-gray-200 text-left">
              <th scope="col" className="py-2 pr-4 font-semibold text-gray-600">Parametr</th>
              <th scope="col" className="py-2 px-3 font-semibold text-gray-900">{ticker1}</th>
              <th scope="col" className="py-2 px-3 font-semibold text-gray-900">{ticker2}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-gray-100">
                <th scope="row" className="py-2 pr-4 font-medium text-gray-600 text-left">{r.label}</th>
                <td className="py-2 px-3 text-gray-900">{r.v1}</td>
                <td className="py-2 px-3 text-gray-900">{r.v2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kdy zvolit který */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Kdy zvolit který fond</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Zvolte {ticker1}, pokud…</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
            {cheaper?.win === ticker1 && <li>chcete nižší poplatek (TER {ter(etf1.ter_numeric)})</li>}
            {bigger === ticker1 && <li>preferujete větší a likvidnější fond ({money(etf1.fund_size_numeric)})</li>}
            {etf1.distribution_policy === 'Accumulating' && <li>chcete automatickou reinvestici dividend (akumulační)</li>}
            {etf1.distribution_policy === 'Distributing' && <li>chcete pravidelně vyplácené dividendy</li>}
            {better3y?.win === ticker1 && <li>sázíte na dosavadní 3letou výkonnost ({pct(etf1.return_3y)})</li>}
            <li>vyhovuje vám expozice „{etf1.index_name || etf1.region || n1}"</li>
          </ul>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Zvolte {ticker2}, pokud…</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
            {cheaper?.win === ticker2 && <li>chcete nižší poplatek (TER {ter(etf2.ter_numeric)})</li>}
            {bigger === ticker2 && <li>preferujete větší a likvidnější fond ({money(etf2.fund_size_numeric)})</li>}
            {etf2.distribution_policy === 'Accumulating' && <li>chcete automatickou reinvestici dividend (akumulační)</li>}
            {etf2.distribution_policy === 'Distributing' && <li>chcete pravidelně vyplácené dividendy</li>}
            {better3y?.win === ticker2 && <li>sázíte na dosavadní 3letou výkonnost ({pct(etf2.return_3y)})</li>}
            <li>vyhovuje vám expozice „{etf2.index_name || etf2.region || n2}"</li>
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Často kladené otázky</h2>
      <div className="space-y-4 mb-8">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold text-gray-900 mb-1">{f.q}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500">
        Data o fondech se aktualizují denně z naší databáze přes 4 300 ETF.
        Autor: <a href="/o-nas" className="text-violet-700 hover:underline">Tomáš Kostrhoun</a>
        {lastModified && ` • Aktualizováno: ${new Date(lastModified).toLocaleDateString('cs-CZ')}`}
      </p>
    </section>
  );
}

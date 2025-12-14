/**
 * Server component for displaying pre-rendered featured ETFs
 * Used on /srovnani-etf for SEO-friendly initial content
 */
import Link from 'next/link';
import { ETFBasicInfo } from '@/lib/etf-data';

interface FeaturedETFSectionProps {
  bySize: ETFBasicInfo[];
  byPerformance: ETFBasicInfo[];
  byRating: ETFBasicInfo[];
  lowCost: ETFBasicInfo[];
  totalCount: number;
}

function formatFundSize(size: number | null): string {
  if (!size) return '-';
  if (size >= 1000) {
    return `${(size / 1000).toFixed(1)} mld EUR`;
  }
  return `${size.toFixed(0)} mil EUR`;
}

function formatTER(ter: number | null): string {
  if (ter === null || ter === undefined) return '-';
  return `${(ter * 100).toFixed(2)}%`;
}

function formatReturn(ret: number | null): string {
  if (ret === null || ret === undefined) return '-';
  const sign = ret >= 0 ? '+' : '';
  return `${sign}${ret.toFixed(2)}%`;
}

function ETFCard({ etf, highlight }: { etf: ETFBasicInfo; highlight: string }) {
  return (
    <Link
      href={`/etf/${etf.isin}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-violet-300 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
          {etf.name}
        </h4>
        {etf.rating && (
          <span className="text-yellow-500 text-sm whitespace-nowrap">
            {'★'.repeat(Math.round(etf.rating))}
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mb-2">
        {etf.fund_provider} · {etf.primary_ticker || etf.isin}
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-gray-600">TER</div>
          <div className="font-medium text-gray-900">{formatTER(etf.ter_numeric)}</div>
        </div>
        <div>
          <div className="text-gray-600">Velikost</div>
          <div className="font-medium text-gray-900">{formatFundSize(etf.fund_size_numeric)}</div>
        </div>
        <div>
          <div className="text-gray-600">1R výnos</div>
          <div className={`font-medium ${(etf.return_1y || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatReturn(etf.return_1y)}
          </div>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-violet-600 font-medium">
        {highlight}
      </div>
    </Link>
  );
}

function ETFSection({
  title,
  icon,
  etfs,
  highlight,
  linkHref,
  linkText
}: {
  title: string;
  icon: string;
  etfs: ETFBasicInfo[];
  highlight: string;
  linkHref: string;
  linkText: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {title}
        </h3>
        <Link
          href={linkHref}
          className="text-sm text-violet-600 hover:text-violet-700 font-medium"
        >
          {linkText} →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {etfs.slice(0, 4).map((etf) => (
          <ETFCard key={etf.isin} etf={etf} highlight={highlight} />
        ))}
      </div>
    </div>
  );
}

export default function FeaturedETFSection({
  bySize,
  byPerformance,
  byRating,
  lowCost,
  totalCount
}: FeaturedETFSectionProps) {
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🏆</span>
          <h2 className="text-2xl font-bold text-gray-900">
            Doporučená ETF z {totalCount.toLocaleString('cs-CZ')}+ fondů
          </h2>
        </div>
        <p className="text-gray-600">
          Vyberte si z nejlepších ETF fondů podle velikosti, výkonnosti, ratingu nebo nejnižších poplatků.
          Pro pokročilé filtrování a srovnání použijte interaktivní nástroj níže.
        </p>
      </div>

      <ETFSection
        title="Největší ETF fondy"
        icon="📊"
        etfs={bySize}
        highlight="Top podle velikosti"
        linkHref="/nejlepsi-etf/nejlepsi-etf-2025"
        linkText="Všechny nejlepší ETF"
      />

      <ETFSection
        title="Nejvýkonnější ETF (1 rok)"
        icon="📈"
        etfs={byPerformance}
        highlight="Top výkonnost 1R"
        linkHref="/nejlepsi-etf/nejlepsi-akciove-etf"
        linkText="Všechny akciové ETF"
      />

      <ETFSection
        title="Nejlépe hodnocená ETF"
        icon="⭐"
        etfs={byRating}
        highlight="5★ rating"
        linkHref="/nejlepsi-etf/nejlepsi-etf-2025"
        linkText="Top hodnocená ETF"
      />

      <ETFSection
        title="ETF s nejnižšími poplatky"
        icon="💰"
        etfs={lowCost}
        highlight={`TER od ${formatTER(lowCost[0]?.ter_numeric)}`}
        linkHref="/nejlepsi-etf/nejlevnejsi-etf"
        linkText="Všechny levné ETF"
      />

      {/* Hidden content for SEO - full list of featured ETFs */}
      <div className="sr-only">
        <h3>Kompletní seznam doporučených ETF fondů:</h3>
        <h4>Největší ETF fondy podle velikosti:</h4>
        <ul>
          {bySize.map((etf) => (
            <li key={etf.isin}>
              {etf.name} (ISIN: {etf.isin}) - TER: {formatTER(etf.ter_numeric)},
              Velikost: {formatFundSize(etf.fund_size_numeric)},
              Výnos 1R: {formatReturn(etf.return_1y)}
            </li>
          ))}
        </ul>
        <h4>ETF s nejvyšší výkonností:</h4>
        <ul>
          {byPerformance.map((etf) => (
            <li key={etf.isin}>
              {etf.name} (ISIN: {etf.isin}) - Výnos 1R: {formatReturn(etf.return_1y)},
              TER: {formatTER(etf.ter_numeric)}
            </li>
          ))}
        </ul>
        <h4>Nejlépe hodnocená ETF:</h4>
        <ul>
          {byRating.map((etf) => (
            <li key={etf.isin}>
              {etf.name} (ISIN: {etf.isin}) - Rating: {etf.rating}★,
              TER: {formatTER(etf.ter_numeric)}
            </li>
          ))}
        </ul>
        <h4>ETF s nejnižšími poplatky (TER):</h4>
        <ul>
          {lowCost.map((etf) => (
            <li key={etf.isin}>
              {etf.name} (ISIN: {etf.isin}) - TER: {formatTER(etf.ter_numeric)},
              Velikost: {formatFundSize(etf.fund_size_numeric)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { supabaseAdmin } from '@/lib/supabase';
import { ETF } from '@/types/etf';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Tato funkce pomůže Next.js rozpoznat možné parametry
export async function generateStaticParams() {
  try {
    // Vracíme prázdný array, protože chceme dynamické renderování
    // ale Next.js očekává, že funkce existuje
    return [];
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPercentage } from '@/utils/csvParser';
import ETFRating from '@/components/ETFRating';
import Layout from '@/components/Layout';
import ETFDetailHeader from '@/components/etf/ETFDetailHeader';
import ETFPerformanceCards from '@/components/etf/ETFPerformanceCards';
import ETFPerformanceTable from '@/components/etf/ETFPerformanceTable';

interface PageProps {
  params: {
    isin: string;
  };
}

async function getETFData(isin: string): Promise<ETF | null> {
  const { data: etf, error } = await supabaseAdmin
    .from('etf_funds')
    .select('*')
    .eq('isin', isin)
    .single();

  if (error || !etf) {
    console.error('Error fetching ETF:', error);
    return null;
  }

  return etf as ETF;
}

export async function generateMetadata({ params }: PageProps) {
  const { isin } = params;
  const etf = await getETFData(isin);

  if (!etf) {
    return {
      title: 'ETF nenalezen',
    };
  }

  // Include ticker in title and description for better SEO
  const ticker = etf.primary_ticker || etf.exchange_1_ticker || '';
  const titleWithTicker = ticker ? `${ticker} - ${etf.name} (${etf.isin})` : `${etf.name} (${etf.isin})`;
  const descriptionWithTicker = ticker 
    ? `Detailní analýza ETF ${ticker} - ${etf.name} od ${etf.fund_provider}. TER ${formatPercentage(etf.ter_numeric)}, ${etf.return_1y ? 'roční výnos ' + formatPercentage(etf.return_1y) : 'výkonnostní data'}, složení portfolia a detailní informace o fondu.`
    : `Kompletní analýza ETF ${etf.name} od ${etf.fund_provider}. TER ${formatPercentage(etf.ter_numeric)}, ${etf.return_1y ? 'roční výnos ' + formatPercentage(etf.return_1y) : 'výkonnostní data'}, složení portfolia a detailní informace o fondu.`;

  return {
    title: `${titleWithTicker} | ETF Průvodce`,
    description: descriptionWithTicker,
    keywords: ticker ? [ticker, etf.name, etf.isin, etf.fund_provider, 'ETF', 'investice'].join(', ') : [etf.name, etf.isin, etf.fund_provider, 'ETF', 'investice'].join(', '),
    openGraph: {
      title: `${titleWithTicker} | ETF Průvodce`,
      description: descriptionWithTicker,
      url: `https://www.etfpruvodce.cz/etf/${isin}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titleWithTicker} | ETF Průvodce`,
      description: descriptionWithTicker,
    },
    alternates: {
      canonical: `https://www.etfpruvodce.cz/etf/${isin}`,
    },
    other: {
      // Add structured data for ETF investment product
      'structured-data': JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["FinancialProduct", "InvestmentFund"],
        "name": etf.name,
        "identifier": {
          "@type": "PropertyValue",
          "propertyID": "ISIN",
          "value": etf.isin
        },
        "description": etf.description_cs || etf.description_en || `ETF fond ${etf.name} od poskytovatele ${etf.fund_provider}`,
        "provider": {
          "@type": "Organization",
          "name": etf.fund_provider
        },
        "url": `https://www.etfpruvodce.cz/etf/${etf.isin}`,
        "category": etf.category,
        "currency": etf.fund_currency,
        "feesAndCommissionsSpecification": {
          "@type": "UnitPriceSpecification",
          "price": etf.ter_numeric,
          "priceCurrency": "percent",
          "unitText": "TER (Total Expense Ratio)"
        },
        "yields": etf.current_dividend_yield_numeric ? {
          "@type": "MonetaryAmount",
          "value": etf.current_dividend_yield_numeric,
          "currency": "percent"
        } : undefined,
        "fundSize": etf.fund_size_numeric,
        "inceptionDate": etf.inception_date,
        "trackingError": etf.tracking_error,
        "distributionPolicy": etf.distribution_policy,
        "domicile": etf.fund_domicile,
        "aggregateRating": etf.rating ? {
          "@type": "AggregateRating",
          "ratingValue": etf.rating,
          "bestRating": 5,
          "worstRating": 1
        } : undefined,
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": etf.fund_currency
        }
      })
    }
  };
}

export default async function ETFDetailPage({ params }: PageProps) {
  const { isin } = params;
  const etf = await getETFData(isin);

  if (!etf) {
    notFound();
  }

  const getReturnColor = (value: number | null | undefined) => {
    if (!value) return 'text-gray-600';
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTopHoldings = () => {
    const holdings = [];
    for (let i = 1; i <= 10; i++) {
      const name = etf[`holding_${i}_name` as keyof ETF] as string;
      const weight = etf[`holding_${i}_weight` as keyof ETF] as number;
      if (name && weight) {
        holdings.push({ name, weight });
      }
    }
    return holdings;
  };

  const getTopCountries = () => {
    const countries = [];
    for (let i = 1; i <= 5; i++) {
      const name = etf[`country_${i}_name` as keyof ETF] as string;
      const weight = etf[`country_${i}_weight` as keyof ETF] as number;
      if (name && weight) {
        countries.push({ name, weight });
      }
    }
    return countries;
  };

  const getTopSectors = () => {
    const sectors = [];
    for (let i = 1; i <= 5; i++) {
      const name = etf[`sector_${i}_name` as keyof ETF] as string;
      const weight = etf[`sector_${i}_weight` as keyof ETF] as number;
      if (name && weight) {
        sectors.push({ name, weight });
      }
    }
    return sectors;
  };

  const topHoldings = getTopHoldings();
  const topCountries = getTopCountries();
  const topSectors = getTopSectors();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <ETFDetailHeader etf={etf} />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">TER</p>
            <p className="text-xl font-bold">{formatPercentage(etf.ter_numeric)}</p>
          </CardContent>
        </Card>
        <ETFPerformanceCards etf={etf} />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Základní informace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Poskytovatel fondu:</span>
                <span className="font-medium">{etf.fund_provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Velikost fondu:</span>
                <span className="font-medium">{etf.fund_size || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Měna fondu:</span>
                <span className="font-medium">{etf.fund_currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Domicil:</span>
                <span className="font-medium">{etf.fund_domicile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Datum založení:</span>
                <span className="font-medium">{etf.inception_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distribuce:</span>
                <span className="font-medium">{etf.distribution_policy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Replikace:</span>
                <span className="font-medium">{etf.replication}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sledovaný index:</span>
                <span className="font-medium">{etf.index_name}</span>
              </div>
              {etf.legal_structure && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Právní struktura:</span>
                  <span className="font-medium">{etf.legal_structure}</span>
                </div>
              )}
              {etf.sustainability && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ESG hodnocení:</span>
                  <span className="font-medium">{etf.sustainability}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dividend Information */}
        <Card>
          <CardHeader>
            <CardTitle>Dividendové informace</CardTitle>
            <CardDescription>Informace o dividendách a výnosech</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Aktuální dividendový výnos:</span>
                <span className="font-medium font-mono">
                  {etf.current_dividend_yield_numeric ? 
                    formatPercentage(etf.current_dividend_yield_numeric) : 
                    (etf.current_dividend_yield || '-')
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dividendy za 12 měsíců:</span>
                <span className="font-medium">
                  {etf.dividends_12m_numeric ? 
                    `${etf.dividends_12m_numeric.toFixed(4)} ${etf.dividends_12m_currency || etf.fund_currency}` : 
                    (etf.dividends_12m || '-')
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frekvence dividend:</span>
                <span className="font-medium">{etf.distribution_frequency || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Způsob výplaty:</span>
                <span className="font-medium">{etf.distribution_policy || '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics Table */}
        <ETFPerformanceTable etf={etf} />

        {/* Risk Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rizikovost</CardTitle>
            <CardDescription>Rizikové charakteristiky fondu</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metrika</TableHead>
                  <TableHead>Hodnota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Beta</TableCell>
                  <TableCell>
                    {etf.beta ? etf.beta.toFixed(2) : '-'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Korelace</TableCell>
                  <TableCell>
                    {etf.correlation ? etf.correlation.toFixed(2) : '-'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tracking error</TableCell>
                  <TableCell>
                    {etf.tracking_error ? formatPercentage(etf.tracking_error) : '-'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Information ratio</TableCell>
                  <TableCell>
                    {etf.information_ratio ? etf.information_ratio.toFixed(2) : '-'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Max. pokles celkem</TableCell>
                  <TableCell className="text-red-600">
                    {etf.max_drawdown_inception ? formatPercentage(etf.max_drawdown_inception) : '-'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Holdings */}
        {topHoldings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Největší pozice</CardTitle>
              <CardDescription>Top 10 největších pozic v portfoliu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topHoldings.map((holding, index) => {
                  const maxWeight = Math.max(...topHoldings.map(h => h.weight));
                  const widthPercent = (holding.weight / maxWeight) * 100;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-gray-800 font-medium">{holding.name}</span>
                        </div>
                        <span className="font-bold text-blue-600">{formatPercentage(holding.weight)}</span>
                      </div>
                      <div className="ml-11">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${Math.min(widthPercent, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Geographic Allocation */}
        {topCountries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Geografické rozložení</CardTitle>
              <CardDescription>Top 5 zemí podle váhy v portfoliu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCountries.map((country, index) => {
                  const maxWeight = Math.max(...topCountries.map(c => c.weight));
                  const widthPercent = (country.weight / maxWeight) * 100;
                  
                  // Barvy pro různé země/regiony
                  const colorVariants = [
                    'from-emerald-500 to-emerald-600',
                    'from-blue-500 to-blue-600', 
                    'from-purple-500 to-purple-600',
                    'from-orange-500 to-orange-600',
                    'from-teal-500 to-teal-600'
                  ];
                  
                  // Mapování zemí na vlajky
                  const getCountryFlag = (countryName: string): string => {
                    const name = countryName.toLowerCase();
                    if (name.includes('united states') || name.includes('usa') || name.includes('america')) return '🇺🇸';
                    if (name.includes('germany') || name.includes('německo')) return '🇩🇪';
                    if (name.includes('france') || name.includes('francie')) return '🇫🇷';
                    if (name.includes('united kingdom') || name.includes('uk') || name.includes('britain') || name.includes('británie')) return '🇬🇧';
                    if (name.includes('japan') || name.includes('japonsko')) return '🇯🇵';
                    if (name.includes('china') || name.includes('čína')) return '🇨🇳';
                    if (name.includes('switzerland') || name.includes('švýcarsko')) return '🇨🇭';
                    if (name.includes('netherlands') || name.includes('nizozemsko') || name.includes('holandsko')) return '🇳🇱';
                    if (name.includes('canada') || name.includes('kanada')) return '🇨🇦';
                    if (name.includes('australia') || name.includes('austrálie')) return '🇦🇺';
                    if (name.includes('ireland') || name.includes('irsko')) return '🇮🇪';
                    if (name.includes('italy') || name.includes('itálie')) return '🇮🇹';
                    if (name.includes('spain') || name.includes('španělsko')) return '🇪🇸';
                    if (name.includes('sweden') || name.includes('švédsko')) return '🇸🇪';
                    if (name.includes('denmark') || name.includes('dánsko')) return '🇩🇰';
                    if (name.includes('norway') || name.includes('norsko')) return '🇳🇴';
                    if (name.includes('finland') || name.includes('finsko')) return '🇫🇮';
                    if (name.includes('belgium') || name.includes('belgie')) return '🇧🇪';
                    if (name.includes('austria') || name.includes('rakousko')) return '🇦🇹';
                    if (name.includes('taiwan') || name.includes('tchaj-wan')) return '🇹🇼';
                    if (name.includes('south korea') || name.includes('korea') || name.includes('jižní korea')) return '🇰🇷';
                    if (name.includes('hong kong')) return '🇭🇰';
                    if (name.includes('singapore') || name.includes('singapur')) return '🇸🇬';
                    if (name.includes('emerging') || name.includes('rozvíjející')) return '🌍';
                    if (name.includes('europe') || name.includes('evropa')) return '🇪🇺';
                    if (name.includes('world') || name.includes('global') || name.includes('svět')) return '🌎';
                    if (name.includes('other') || name.includes('ostatní')) return '🏳️';
                    return '🏳️'; // default flag
                  };
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colorVariants[index % colorVariants.length]} shadow-sm`}></div>
                          <span className="text-gray-800 font-medium">{country.name}</span>
                          <span className="text-lg">{getCountryFlag(country.name)}</span>
                        </div>
                        <span className="font-bold text-emerald-600">{formatPercentage(country.weight)}</span>
                      </div>
                      <div className="ml-7">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r ${colorVariants[index % colorVariants.length]} h-3 rounded-full transition-all duration-500 ease-out shadow-sm`}
                            style={{ width: `${Math.min(widthPercent, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sector Allocation */}
        {topSectors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sektorové rozložení</CardTitle>
              <CardDescription>Top 5 sektorů podle váhy v portfoliu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSectors.map((sector, index) => {
                  const maxWeight = Math.max(...topSectors.map(s => s.weight));
                  const widthPercent = (sector.weight / maxWeight) * 100;
                  
                  // Barvy pro různé sektory
                  const sectorColors = [
                    'from-indigo-500 to-indigo-600',
                    'from-rose-500 to-rose-600',
                    'from-amber-500 to-amber-600',
                    'from-cyan-500 to-cyan-600',
                    'from-violet-500 to-violet-600'
                  ];
                  
                  // Ikony pro sektory
                  const sectorIcons = ['💼', '🏭', '💡', '🏥', '🏦'];
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-lg">
                            {sectorIcons[index % sectorIcons.length]}
                          </div>
                          <span className="text-gray-800 font-medium">{sector.name}</span>
                        </div>
                        <span className="font-bold text-indigo-600">{formatPercentage(sector.weight)}</span>
                      </div>
                      <div className="ml-11">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r ${sectorColors[index % sectorColors.length]} h-3 rounded-full transition-all duration-700 ease-out shadow-sm`}
                            style={{ width: `${Math.min(widthPercent, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trading Information */}
        <Card>
          <CardHeader>
            <CardTitle>Obchodní informace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Primární burza:</span>
                <span className="font-medium">{etf.primary_exchange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Primární ticker:</span>
                <span className="font-medium">{etf.primary_ticker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Počet burz:</span>
                <span className="font-medium">{etf.total_exchanges}</span>
              </div>
              {etf.exchange_1_name && (
                <>
                  <div className="pt-2 border-t">
                    <h4 className="font-medium mb-2">Všechny burzy:</h4>
                    <div className="text-sm space-y-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
                        const exchangeName = etf[`exchange_${i}_name` as keyof ETF] as string;
                        const exchangeTicker = etf[`exchange_${i}_ticker` as keyof ETF] as string;
                        const exchangeCurrency = etf[`exchange_${i}_currency` as keyof ETF] as string;
                        
                        if (exchangeName && exchangeName.trim()) {
                          return (
                            <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                  {i}
                                </div>
                                <span className="font-medium">{exchangeName}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-mono text-sm">{exchangeTicker || '-'}</div>
                                <div className="text-xs text-gray-500">{exchangeCurrency || '-'}</div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {(etf.description_cs || etf.description_en) && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Popis fondu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {etf.description_cs || etf.description_en}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
    </Layout>
  );
}
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// List of all nejlepsi-etf category pages for bulk revalidation
const NEJLEPSI_ETF_PAGES = [
  '/nejlepsi-etf/nejlepsi-etf-2025',
  '/nejlepsi-etf/nejlepsi-akciove-etf',
  '/nejlepsi-etf/nejlepsi-dividendove-etf',
  '/nejlepsi-etf/nejlepsi-dluhopisove-etf',
  '/nejlepsi-etf/nejlepsi-komoditni-etf',
  '/nejlepsi-etf/nejlepsi-sp500-etf',
  '/nejlepsi-etf/nejlepsi-msci-world-etf',
  '/nejlepsi-etf/nejlepsi-technologicke-etf',
  '/nejlepsi-etf/nejlepsi-healthcare-etf',
  '/nejlepsi-etf/nejlepsi-realitni-etf',
  '/nejlepsi-etf/nejlepsi-emerging-markets-etf',
  '/nejlepsi-etf/nejlepsi-evropske-etf',
  '/nejlepsi-etf/nejlepsi-bitcoin-etf',
  '/nejlepsi-etf/nejlepsi-zlato-etf',
  '/nejlepsi-etf/nejlepsi-esg-etf',
  '/nejlepsi-etf/nejlepsi-akumulacni-etf',
  '/nejlepsi-etf/nejlepsi-distribucni-etf',
  '/nejlepsi-etf/nejlepsi-globalni-etf',
  '/nejlepsi-etf/nejlepsi-americke-etf',
  '/nejlepsi-etf/nejlepsi-japonske-etf',
  '/nejlepsi-etf/nejlepsi-cinske-etf',
  '/nejlepsi-etf/nejlepsi-indicke-etf',
  '/nejlepsi-etf/nejlepsi-small-cap-etf',
  '/nejlepsi-etf/nejlepsi-value-etf',
  '/nejlepsi-etf/nejlepsi-growth-etf',
  '/nejlepsi-etf/nejlepsi-financni-etf',
  '/nejlepsi-etf/nejlepsi-energeticke-etf',
  '/nejlepsi-etf/nejlepsi-prumyslove-etf',
  '/nejlepsi-etf/nejlepsi-spotrebitelske-etf',
  '/nejlepsi-etf/nejlepsi-infrastrukturni-etf',
  '/nejlepsi-etf/nejlepsi-obnovitelne-zdroje-etf',
  '/nejlepsi-etf/nejlepsi-korporatni-dluhopisy-etf',
  '/nejlepsi-etf/nejlepsi-vladni-dluhopisy-etf',
  '/nejlepsi-etf/nejlepsi-high-yield-etf',
  '/nejlepsi-etf/nejlepsi-stribro-etf',
  '/nejlepsi-etf/nejlepsi-ropa-etf',
  '/nejlepsi-etf/etf-zdarma-degiro',
  '/nejlepsi-etf/nejlepsi-ai-etf',
  '/nejlepsi-etf/nejlepsi-asijsko-pacificke-etf',
  '/nejlepsi-etf/nejlepsi-biotechnologie-etf',
  '/nejlepsi-etf/nejlepsi-celosvetove-etf',
  '/nejlepsi-etf/nejlepsi-clean-energy-etf',
  '/nejlepsi-etf/nejlepsi-cloud-etf',
  '/nejlepsi-etf/nejlepsi-dax-etf',
  '/nejlepsi-etf/nejlepsi-defense-etf',
  '/nejlepsi-etf/nejlepsi-ftse100-etf',
  '/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf',
  '/nejlepsi-etf/nejlepsi-nasdaq-etf',
  '/nejlepsi-etf/nejlepsi-nemovitostni-etf',
  '/nejlepsi-etf/nejlepsi-robotika-etf',
  '/nejlepsi-etf/nejlepsi-stoxx600-etf',
  '/nejlepsi-etf/nejlepsi-zlate-etf',
  '/nejlepsi-etf/nejlevnejsi-etf',
];

// Popular ETF comparison pages
const COMPARISON_PAGES = [
  '/srovnani-etf/vwce-vs-cspx',
  '/srovnani-etf/iwda-vs-cspx',
  '/srovnani-etf/vwce-vs-iwda',
  '/srovnani-etf/cspx-vs-vwra',
  '/srovnani-etf/cspx-vs-vuaa',
  '/srovnani-etf/swrd-vs-iwda',
  '/srovnani-etf/vwce-vs-vwrl',
  '/srovnani-etf/iwda-vs-vwra',
  '/srovnani-etf/cspx-vs-eunl',
  '/srovnani-etf/vwce-vs-eunl',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify secret key
    const secret = body.secret;
    const expectedSecret = process.env.REVALIDATE_SECRET || 'etf_refresh_2025';

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    const revalidatedPaths: string[] = [];
    const type = body.type || 'all';
    const isins = body.isins || [];

    // Type: 'etf' - Revalidate specific ETF detail pages
    if (type === 'etf' && isins.length > 0) {
      for (const isin of isins) {
        const path = `/etf/${isin}`;
        revalidatePath(path);
        revalidatedPaths.push(path);
      }
      return NextResponse.json({
        success: true,
        message: `Revalidated ${revalidatedPaths.length} ETF pages`,
        paths: revalidatedPaths,
        timestamp: new Date().toISOString()
      });
    }

    // Type: 'category' - Revalidate all nejlepsi-etf category pages
    if (type === 'category' || type === 'all') {
      for (const path of NEJLEPSI_ETF_PAGES) {
        revalidatePath(path);
        revalidatedPaths.push(path);
      }
    }

    // Type: 'comparison' - Revalidate comparison pages
    if (type === 'comparison' || type === 'all') {
      for (const path of COMPARISON_PAGES) {
        revalidatePath(path);
        revalidatedPaths.push(path);
      }
    }

    // Type: 'core' or 'all' - Revalidate core pages
    if (type === 'core' || type === 'all') {
      const corePaths = [
        '/',
        '/srovnani-etf',
        '/nejlepsi-etf',
        '/kde-koupit-etf',
      ];
      for (const path of corePaths) {
        revalidatePath(path);
        revalidatedPaths.push(path);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated ${revalidatedPaths.length} pages`,
      type,
      pathCount: revalidatedPaths.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);

    return NextResponse.json(
      {
        error: 'Revalidation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for easier testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const expectedSecret = process.env.REVALIDATE_SECRET || 'etf_refresh_2025';

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: 'ok',
    availableTypes: ['all', 'core', 'category', 'comparison', 'etf'],
    categoryPagesCount: NEJLEPSI_ETF_PAGES.length,
    comparisonPagesCount: COMPARISON_PAGES.length,
    usage: {
      all: 'POST with { secret, type: "all" } - Revalidate all pages',
      core: 'POST with { secret, type: "core" } - Revalidate homepage, srovnani-etf, etc.',
      category: 'POST with { secret, type: "category" } - Revalidate all nejlepsi-etf pages',
      comparison: 'POST with { secret, type: "comparison" } - Revalidate comparison pages',
      etf: 'POST with { secret, type: "etf", isins: ["IE00B4L5Y983"] } - Revalidate specific ETF pages',
    }
  });
}
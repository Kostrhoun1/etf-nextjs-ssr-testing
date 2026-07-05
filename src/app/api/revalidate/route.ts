import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { categoryConfigs } from '@/lib/etf-data';

// Kategorie žebříčků – dynamicky z konfigurace (vždy v sync s reálnými routami)
const NEJLEPSI_ETF_PAGES = Object.keys(categoryConfigs).map((slug) => `/nejlepsi-etf/${slug}`);

// Popular ETF comparison pages
const COMPARISON_PAGES = [
  '/srovnani/vwce-vs-cspx',
  '/srovnani/iwda-vs-cspx',
  '/srovnani/vwce-vs-iwda',
  '/srovnani/cspx-vs-vwra',
  '/srovnani/cspx-vs-vuaa',
  '/srovnani/swrd-vs-iwda',
  '/srovnani/vwce-vs-vwrl',
  '/srovnani/iwda-vs-vwra',
  '/srovnani/cspx-vs-eunl',
  '/srovnani/vwce-vs-eunl',
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
        '/srovnani',
        '/zebricky',
        '/kategorie',
        '/kde-koupit',
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
      core: 'POST with { secret, type: "core" } - Revalidate homepage, srovnani, zebricky, etc.',
      category: 'POST with { secret, type: "category" } - Revalidate all nejlepsi-etf pages',
      comparison: 'POST with { secret, type: "comparison" } - Revalidate comparison pages',
      etf: 'POST with { secret, type: "etf", isins: ["IE00B4L5Y983"] } - Revalidate specific ETF pages',
    }
  });
}
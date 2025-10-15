import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper to detect if string is ISIN format (2 letters + 10 alphanumeric)
function isISIN(str: string): boolean {
  return /^[A-Z]{2}[A-Z0-9]{10}$/i.test(str);
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Redirect www to non-www (canonical domain)
  const host = request.headers.get('host');
  if (host?.startsWith('www.')) {
    const newUrl = request.nextUrl.clone();
    newUrl.host = host.replace('www.', '');
    return NextResponse.redirect(newUrl, 301);
  }

  // Handle /etf/ticker/[ticker] - redirect to ISIN page (prevent duplicate content)
  if (pathname.startsWith('/etf/ticker/')) {
    const ticker = pathname.split('/etf/ticker/')[1];

    if (ticker) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          // Fetch ISIN for this ticker from database
          const response = await fetch(
            `${supabaseUrl}/rest/v1/etf_funds?primary_ticker=eq.${ticker.toUpperCase()}&select=isin`,
            {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
              },
            }
          );

          if (response.ok) {
            const etfs = await response.json();
            if (etfs && etfs.length > 0 && etfs[0].isin) {
              const isinUrl = `/etf/${etfs[0].isin}`;
              console.log(`Redirecting /etf/ticker/${ticker} → ${isinUrl}`);
              return NextResponse.redirect(new URL(isinUrl, request.url), 301);
            }
          }
        }
      } catch (error) {
        console.error('Middleware: Error fetching ISIN for ticker:', error);
        // Fall through to let Next.js handle it (will show 404 if ticker not found)
      }
    }
  }

  // Handle /srovnani-etf with ?compare query parameter
  if (pathname === '/srovnani-etf' && searchParams.has('compare')) {
    const compareParam = searchParams.get('compare');

    if (compareParam) {
      // Split by comma and clean up
      const identifiers = compareParam.split(',').map(t => t.trim()).filter(t => t.length > 0);

      // Only redirect if we have exactly 2 identifiers (standard comparison format)
      if (identifiers.length === 2) {
        const [id1, id2] = identifiers;

        // Check if these are ISINs or tickers
        const isId1ISIN = isISIN(id1);
        const isId2ISIN = isISIN(id2);

        // If both are ISINs, we need to fetch tickers from database
        if (isId1ISIN && isId2ISIN) {
          try {
            // Fetch tickers for these ISINs from Supabase
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (supabaseUrl && supabaseKey) {
              const response = await fetch(
                `${supabaseUrl}/rest/v1/etf_funds?isin=in.(${id1},${id2})&select=isin,primary_ticker`,
                {
                  headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                  },
                }
              );

              if (response.ok) {
                const etfs = await response.json();
                if (etfs && etfs.length === 2) {
                  const ticker1 = etfs.find((e: any) => e.isin === id1)?.primary_ticker;
                  const ticker2 = etfs.find((e: any) => e.isin === id2)?.primary_ticker;

                  if (ticker1 && ticker2 && ticker1 !== '-' && ticker2 !== '-') {
                    const staticUrl = `/srovnani-etf/${ticker1.toLowerCase()}-vs-${ticker2.toLowerCase()}`;
                    return NextResponse.redirect(new URL(staticUrl, request.url), 301);
                  }
                }
              }
            }
          } catch (error) {
            console.error('Middleware: Error fetching tickers for ISINs:', error);
            // Fall through to default behavior
          }
        }

        // If they're tickers (or we failed to fetch), redirect directly
        if (!isId1ISIN && !isId2ISIN) {
          const staticUrl = `/srovnani-etf/${id1.toLowerCase()}-vs-${id2.toLowerCase()}`;
          return NextResponse.redirect(new URL(staticUrl, request.url), 301);
        }
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes should trigger the middleware
export const config = {
  matcher: [
    '/etf/ticker/:ticker*',
    '/srovnani-etf',
  ],
};

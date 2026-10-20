import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/lib/supabase-config';

// Helper to detect if string is ISIN format (2 letters + 10 alphanumeric)
function isISIN(str: string): boolean {
  return /^[A-Z]{2}[A-Z0-9]{10}$/i.test(str);
}

/**
 * Platný ISIN = formát + kontrolní číslice (Luhn přes číslice z písmen A=10…Z=35).
 * Ověřeno 17. 10. 2026: všech 5 146 ISINů v databázi projde, smyšlené (ZZ000000TEST,
 * překlep v poslední číslici) ne.
 */
function isinPlatny(s: string): boolean {
  if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(s)) return false;
  const cifry = s.split('').map((c) => (c >= 'A' ? String(c.charCodeAt(0) - 55) : c)).join('');
  let sum = 0;
  let dvakrat = false;
  for (let i = cifry.length - 1; i >= 0; i--) {
    let d = cifry.charCodeAt(i) - 48;
    if (dvakrat) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dvakrat = !dvakrat;
  }
  return sum % 10 === 0;
}

/** Dvojice srovnání: „vwce-vs-iwda" – jen písmena a číslice (hodnoty jdou do dotazu na DB). */
const PAR_SROVNANI = /^[a-z0-9]{1,12}-vs-[a-z0-9]{1,12}$/i;

/**
 * Nesmyslné adresy (boti zkoušejí /etf/cokoli) → rovnou statická 404 BEZ volání databáze
 * a BEZ zápisu do ISR cache. Dřív každá taková adresa spustila funkci, dotaz do Supabase
 * a uložila si 404 do cache (free tier Vercelu má limit ISR zápisů, viz vercel-free-tier-isr).
 * Rewrite na neexistující cestu vykreslí předgenerovanou stránku 404 se stavem 404.
 */
function dekoduj(s: string): string {
  try { return decodeURIComponent(s); } catch { return s; } // rozbité %xx nesmí shodit middleware
}

function nesmysl(request: NextRequest) {
  return NextResponse.rewrite(new URL('/_neplatna-adresa', request.url));
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Kanonická doména = apex bez www (etfpruvodce.cz). www → apex.
  // NEsmí platit pro vercel.app preview/deploy URL ani localhost.
  const host = request.headers.get('host');
  if (host === 'www.etfpruvodce.cz') {
    const newUrl = request.nextUrl.clone();
    newUrl.host = 'etfpruvodce.cz';
    return NextResponse.redirect(newUrl, 301);
  }

  // /etf/<ISIN>: neplatný ISIN = stránka nemůže existovat
  const etfDetail = pathname.match(/^\/etf\/([^/]+)\/?$/);
  if (etfDetail && !isinPlatny(dekoduj(etfDetail[1]))) return nesmysl(request);

  // /srovnani/<a>-vs-<b>: jen tvar dvojice tickerů. Výjimka: statická podstránka /srovnani/porovnani
  // (kurátorská /srovnani/vwce-vs-cspx tvar dvojice splňuje).
  const dvojice = pathname.match(/^\/srovnani\/([^/]+)\/?$/);
  if (dvojice && dvojice[1] !== 'porovnani' && !PAR_SROVNANI.test(dekoduj(dvojice[1]))) return nesmysl(request);

  // Handle /etf/ticker/[ticker] - redirect to ISIN page (prevent duplicate content)
  if (pathname.startsWith('/etf/ticker/')) {
    const ticker = pathname.split('/etf/ticker/')[1];

    if (ticker) {
      try {
        // Dřív env NEXT_PUBLIC_SUPABASE_ANON_KEY = zakázaný legacy klíč → přesměrování vracelo 404.
        const supabaseUrl = SUPABASE_URL;
        const supabaseKey = SUPABASE_PUBLISHABLE_KEY;

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
            const supabaseUrl = SUPABASE_URL;
            const supabaseKey = SUPABASE_PUBLISHABLE_KEY;

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

  // Hlavička X-Robots-Tag (noindex mimo etfpruvodce.cz) je v next.config.ts – platí pro všechny cesty
  // a nestojí výpočetní čas. Dřívější přepis hlavičky Vary byl zrušen 20. 10. 2026: na stránkách z cache
  // se stejně neprojevil (produkce vracela výchozí Vary Nextu).
  return NextResponse.next();
}

/* Middleware běží JEN tam, kde má co dělat (20. 10. 2026). Dřív běžel na každém požadavku včetně
   prefetchů odkazů a API (/api/ev, /api/etf/screener) a bral 58 % „Fluid Active CPU“ free tieru Vercelu
   (1 h 49 min z 3 h 7 min za 30 dní). www → apex přesměrovává už Vercel (doména, 308) dřív, než
   požadavek dojde sem. Přidáváte-li sem logiku pro další cestu, přidejte ji i do matcheru. */
export const config = {
  matcher: ['/etf/:path*', '/srovnani/:path*', '/srovnani-etf'],
};

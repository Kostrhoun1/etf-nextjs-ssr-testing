/**
 * Odkazy na stránky dvojic (/srovnani/<a>-vs-<b>) a jejich kanonická adresa – ČISTÉ funkce bez DB (31. 10. 2026).
 *
 * Proč zvlášť: stejné funkce používá (1) detail fondu pro odkaz „srovnat s …“, (2) stránka dvojice pro kanonickou adresu
 * a výběr fondu podle tickeru a (3) seznam dvojic předgenerovaných při buildu (src/lib/prerender.ts). Kdyby seznam
 * počítal vlastní kopie pravidel, rozešel by se s odkazy a odkazované dvojice by se zase renderovaly na požádání
 * (ISR zápis + CPU free tieru Vercelu). Pravidlo kanonické adresy je popsané v src/lib/pairs.ts.
 */
import { kanonickaDvojice, kuratorskaProIsiny, dvojiceFondu, KURATORSKE, KURATORSKE_ALIASY } from '@/lib/pairs';
import { isHeadFund } from '@/lib/etf-head';
import { platnyTicker, zobrazovanyTicker } from '@/lib/ticker';

const TICKER_OK = /^[A-Za-z0-9]{1,12}$/;

/** Fond, jak ho detail potřebuje pro odkaz na dvojici (řádek etf_funds se sloupci SLOUPCE_TICKERU). */
export type FondProOdkaz = Record<string, unknown> & { isin: string; primary_ticker?: string | null; fund_size_numeric?: number | null };

/**
 * Odkaz detailu fondu na dvojici „tento fond vs. největší podobný“ (dřív přímo v src/app/etf/[isin]/page.tsx).
 * - soupeř = první podobný fond s platným primárním tickerem (getPodobneFondy),
 * - adresa rovnou KANONICKÁ (src/lib/pairs.ts) – dřív primární tickery v pořadí „tento vs. soupeř“ (SEO audit 20. 10. 2026),
 * - kolo 6b (SEO): detail z hlavy (indexovaný Googlem) neodkazuje na NEkurátorskou dvojici (ta má googlebot noindex) –
 *   místo ní porovnání obou fondů; kurátorská dvojice zůstává. Ocas odkazuje na dvojici.
 * - kurátorská srovnání, ve kterých fond je („Srovnání s …“) – jediný interní odkaz na některé z nich (audit 20. 10. 2026).
 */
export function odkazDvojiceDetailu<S extends { isin: string; primary_ticker: string | null }>(etf: FondProOdkaz, podobne: S[]) {
  const souper = podobne.find((f) => f.primary_ticker && TICKER_OK.test(f.primary_ticker));
  const parSlug = souper && etf.primary_ticker && TICKER_OK.test(etf.primary_ticker)
    ? kanonickaDvojice({ isin: etf.isin, ticker: zobrazovanyTicker(etf) }, { isin: souper.isin, ticker: platnyTicker(souper.primary_ticker) })
    : null;
  const parKuratorsky = !!(souper && kuratorskaProIsiny(etf.isin, souper.isin));
  const parHref = !parSlug || !souper ? null
    : parKuratorsky || !isHeadFund(etf.fund_size_numeric) ? `/srovnani/${parSlug}`
    : `/srovnani/porovnani?isins=${etf.isin},${souper.isin}`;
  const kuratorskaSrovnani = dvojiceFondu(etf.isin).filter((sl) => `/srovnani/${sl}` !== parHref);
  return { souper, parSlug, parKuratorsky, parHref, kuratorskaSrovnani };
}

/** "vwce-vs-iwda" → ["VWCE","IWDA"], nebo null, pokud slug nemá tvar x-vs-y. Tickery jdou do filtru .or() v dotazu
 *  na DB → jen písmena a číslice (čárka/tečka by filtr rozšířily). Stejné pravidlo hlídá middleware. */
export function parsePair(slug: string): [string, string] | null {
  const parts = slug.toLowerCase().split('-vs-');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  if (!parts.every((p) => /^[a-z0-9]{1,12}$/.test(p))) return null;
  return [parts[0].toUpperCase(), parts[1].toUpperCase()];
}

export const jeIsinSymbol = (x: string) => /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(x.toUpperCase());

export const COMPARISON_TICKER_FIELDS = [
  'primary_ticker',
  'exchange_1_ticker', 'exchange_2_ticker', 'exchange_3_ticker', 'exchange_4_ticker', 'exchange_5_ticker',
  'exchange_6_ticker', 'exchange_7_ticker', 'exchange_8_ticker', 'exchange_9_ticker', 'exchange_10_ticker',
] as const;

/**
 * Řádky, které by vrátil dotaz getComparisonETFData pro dva symboly z adresy, z jedné načtené sady (pro seznam
 * předgenerovaných dvojic). Zrcadlo filtru .or(): ISIN → `isin.eq`, jinak `<ticker sloupec>.eq` – rovnost v DB
 * rozlišuje velikost písmen, symbol je z parsePair velkými písmeny.
 */
export function hledacSymbolu<R extends Record<string, unknown>>(radky: R[]): (symboly: string[]) => R[] {
  const podleIsin = new Map<string, R[]>();
  const podleTickeru = new Map<string, R[]>();
  const pridej = (m: Map<string, R[]>, k: string, r: R) => { const a = m.get(k); if (!a) m.set(k, [r]); else if (!a.includes(r)) a.push(r); };
  for (const r of radky) {
    pridej(podleIsin, String(r.isin), r);
    for (const f of COMPARISON_TICKER_FIELDS) if (typeof r[f] === 'string') pridej(podleTickeru, r[f] as string, r);
  }
  return (symboly) => {
    const out = new Set<R>();
    for (const s of symboly) for (const r of (jeIsinSymbol(s) ? podleIsin.get(s.toUpperCase()) : podleTickeru.get(s)) ?? []) out.add(r);
    return [...out];
  };
}

/**
 * Fond pro symbol z adresy (ticker nebo ISIN) z řádků vrácených dotazem. Stejný ticker může mít víc fondů na různých
 * burzách (SPYI = SPDR MSCI ACWI IMI na XETRA, ale i opční S&P 500 fond HANetf na LSE – test s uživatelem 18. 10. 2026).
 * Pořadí z DB je náhodné → hlavní ticker fondu > ticker na XETRA > ostatní burzy; při shodě větší fond.
 */
export function vyberFondProSymbol<R extends Record<string, unknown>>(radky: R[], ticker: string): R | undefined {
  const matches = (etf: Record<string, unknown>) =>
    jeIsinSymbol(ticker)
      ? String(etf.isin) === ticker.toUpperCase()
      : COMPARISON_TICKER_FIELDS.some((f) => (etf[f] as string)?.toUpperCase() === ticker.toUpperCase());
  const skore = (etf: Record<string, unknown>) => {
    const t = ticker.toUpperCase();
    if (String(etf.primary_ticker ?? '').toUpperCase() === t) return 3;
    for (let i = 1; i <= 10; i++) {
      if (String(etf[`exchange_${i}_ticker`] ?? '').toUpperCase() === t && /xetra/i.test(String(etf[`exchange_${i}_name`] ?? ''))) return 2;
    }
    return 1;
  };
  return radky
    .filter((e) => matches(e))
    .sort((a, b) => skore(b) - skore(a) || Number(b.fund_size_numeric ?? 0) - Number(a.fund_size_numeric ?? 0))[0];
}

/**
 * Kanonická adresa dvojice (SEO audit 20. 10. 2026, pravidlo v src/lib/pairs.ts): kurátorská dvojice je kanonická
 * sama (alias → hlavní kurátorská, bez přesměrování); ostatní tvary → kurátorská pro stejné fondy, jinak zobrazované
 * tickery abecedně. `presmerovat` = adresa se liší od kanonické → trvalé přesměrování (po ověření na stránce).
 */
export function kanonikaDvojice(pair: string, etf1: { isin: string }, etf2: { isin: string }, t1: string, t2: string) {
  const slug = pair.toLowerCase();
  if (KURATORSKE[slug]) return { kanon: KURATORSKE_ALIASY[slug] ?? slug, kuratorska: true, presmerovat: null as string | null };
  const zt = (e: { isin: string }) => zobrazovanyTicker(e as unknown as Record<string, unknown>);
  let cil = kanonickaDvojice({ isin: etf1.isin, ticker: zt(etf1) }, { isin: etf2.isin, ticker: zt(etf2) });
  // Tentýž fond pod dvěma tickery mimo kurátorský seznam: tickery z adresy (tak se lidé ptají), jen abecedně.
  if (!cil && etf1.isin === etf2.isin && !jeIsinSymbol(t1) && !jeIsinSymbol(t2) && t1 !== t2) cil = [t1.toLowerCase(), t2.toLowerCase()].sort().join('-vs-');
  const kanon = cil ?? slug;
  return { kanon, kuratorska: !!KURATORSKE[kanon], presmerovat: kanon !== slug ? kanon : null };
}

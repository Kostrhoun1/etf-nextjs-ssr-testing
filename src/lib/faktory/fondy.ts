/**
 * „Jak faktor koupit“ – UCITS ETF z naší databáze (etf_funds), kolo 8, 22. 10. 2026.
 *
 * PROČ: data faktorů jsou AMERICKÁ (Russell 1000 Value, Russell 2000, MSCI USA …), tabulky ale nabízely
 * světové MSCI World faktorové ETF – manifest (src/lib/backtest/indexes.ts) to sám nazývá „míchání jablek
 * s hruškami“. Teď je nejdřív UCITS ETF na TENTÝŽ americký index (vyhledáno podle `index_name` v DB,
 * TER a velikost z DB, ne natvrdo), světové verze až potom jako „jiný index – jiný výsledek“.
 *
 * Fond se ukáže jen s čerstvými daty (stažen za posledních 30 dní = v nabídce srovnávače) a bez měnového
 * zajištění (hedged třída má jiný výnos v Kč). Ověřeno 22. 10. 2026 dotazem do etf_funds.
 */
import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import { nabidkaOd } from '@/lib/etf-data';
import type { FaktorSlug } from './vypocet';

export interface FaktorFond {
  isin: string;
  nazev: string;
  ter: number | null;          // v procentech (0,20 = 0,20 %)
  velikost: number | null;     // mil. EUR (zdroj justETF)
  index: string | null;
  akumulacni: boolean | null;
  stazeno: string | null;      // scraping_date (ISO den)
}

interface Vyber {
  /** Přesné hodnoty `index_name` v DB, které odpovídají indexu dat (stejný index). */
  stejnyIndex: string[];
  /** Index s mírně odlišnou konstrukcí (limit vah apod.) – ukáže se s poznámkou. */
  skoroStejny?: { index: string; poznamka: string }[];
  /** Když na tentýž index UCITS ETF není: nejbližší americké fondy s jinou metodikou. */
  nejblizsi?: string[];
  /** Světová (MSCI World / FTSE All-World) verze – jiný index, jiný výsledek. */
  svetove: string[];
}

export const VYBER: Record<FaktorSlug, Vyber> = {
  value: {
    stejnyIndex: ['Russell 1000® Value'],
    skoroStejny: [{ index: 'Russell 1000 Value UCITS 30/18 Capped', poznamka: 'stejný index s limitem vah 30/18 % (pravidlo UCITS)' }],
    svetove: ['IE00BP3QZB59'],
  },
  'small-cap': { stejnyIndex: ['Russell 2000®'], svetove: ['IE00BF4RFH31'] },
  'dividendove-akcie': {
    stejnyIndex: [],
    nejblizsi: ['MSCI USA High Dividend Yield Advanced Select', 'MSCI USA High Dividend Yield Low Carbon SRI Screened Select'],
    svetove: ['IE00B8GKDB10', 'IE00BK5BR626'],
  },
  'minimalni-volatilita': { stejnyIndex: ['MSCI USA Minimum Volatility'], svetove: ['IE00B8FHGS14'] },
  momentum: { stejnyIndex: ['MSCI USA Momentum'], svetove: ['IE00BP3QZ825'] },
  quality: { stejnyIndex: ['MSCI USA Sector Neutral Quality'], svetove: ['IE00BP3QZ601'] },
};

export interface FondyFaktoru {
  stejny: (FaktorFond & { poznamka?: string })[];
  nejblizsi: FaktorFond[];
  svetove: FaktorFond[];
}

const POLE = 'isin, name, ter_numeric, fund_size_numeric, index_name, distribution_policy, scraping_date, is_leveraged';
type Radek = { isin: string; name: string | null; ter_numeric: number | null; fund_size_numeric: number | null; index_name: string | null; distribution_policy: string | null; scraping_date: string | null; is_leveraged: boolean | null };

const naFond = (r: Radek): FaktorFond => ({
  isin: r.isin,
  nazev: r.name ?? r.isin,
  ter: r.ter_numeric != null && Number(r.ter_numeric) > 0 ? Number(r.ter_numeric) : null,
  velikost: r.fund_size_numeric != null ? Number(r.fund_size_numeric) : null,
  index: r.index_name,
  akumulacni: r.distribution_policy ? /accum/i.test(r.distribution_policy) : null,
  stazeno: r.scraping_date ? r.scraping_date.slice(0, 10) : null,
});
const cerstvy = (r: Radek) => !!r.name && !!r.scraping_date && r.scraping_date >= nabidkaOd().slice(0, 10) && !r.is_leveraged;
const bezZajisteni = (r: Radek) => !/hedged/i.test(`${r.name ?? ''} ${r.index_name ?? ''}`);
const podleVelikosti = (a: FaktorFond, b: FaktorFond) => (b.velikost ?? -1) - (a.velikost ?? -1);

/** Načte fondy pro všechny faktory najednou (jeden dotaz na indexy, jeden na ISINy). null = DB nedostupná. */
export const nactiFondyFaktoru = cache(async (): Promise<Record<FaktorSlug, FondyFaktoru> | null> => {
  const indexy = Object.values(VYBER).flatMap((v) => [...v.stejnyIndex, ...(v.skoroStejny ?? []).map((s) => s.index), ...(v.nejblizsi ?? [])]);
  const isiny = Object.values(VYBER).flatMap((v) => v.svetove);
  const [a, b] = await Promise.all([
    supabase.from('etf_funds').select(POLE).in('index_name', indexy),
    supabase.from('etf_funds').select(POLE).in('isin', isiny),
  ]);
  if (a.error || b.error || !a.data || !b.data) {
    console.error('[faktory] načtení fondů selhalo:', a.error?.message ?? b.error?.message);
    return null;
  }
  const radky = (a.data as Radek[]).filter((r) => cerstvy(r) && bezZajisteni(r));
  const svet = new Map((b.data as Radek[]).filter(cerstvy).map((r) => [r.isin, naFond(r)]));
  const out = {} as Record<FaktorSlug, FondyFaktoru>;
  for (const [slug, v] of Object.entries(VYBER) as [FaktorSlug, Vyber][]) {
    const stejny = [
      ...radky.filter((r) => r.index_name && v.stejnyIndex.includes(r.index_name)).map((r) => naFond(r)),
      ...(v.skoroStejny ?? []).flatMap((s) => radky.filter((r) => r.index_name === s.index).map((r) => ({ ...naFond(r), poznamka: s.poznamka }))),
    ].sort(podleVelikosti).slice(0, 4);
    const nejblizsi = radky.filter((r) => r.index_name && (v.nejblizsi ?? []).includes(r.index_name)).map(naFond).sort(podleVelikosti).slice(0, 3);
    const svetove = v.svetove.map((i) => svet.get(i)).filter((f): f is FaktorFond => !!f);
    out[slug] = { stejny, nejblizsi, svetove };
  }
  return out;
});

/** TER nejlevnějšího velkého UCITS ETF na S&P 500 (pro srovnání nákladů faktorů s indexem). */
export const nactiTerSp500 = cache(async (): Promise<{ ter: number; nazev: string } | null> => {
  const { data, error } = await supabase.from('etf_funds').select(POLE).in('index_name', ['S&P 500®']).gte('fund_size_numeric', 1000);
  if (error || !data) return null;
  const f = (data as Radek[]).filter((r) => cerstvy(r) && bezZajisteni(r)).map(naFond).filter((x) => x.ter != null).sort((x, y) => x.ter! - y.ter!);
  return f[0] ? { ter: f[0].ter!, nazev: f[0].nazev } : null;
});

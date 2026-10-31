/**
 * CO SE PŘEDGENERUJE PŘI BUILDU (31. 10. 2026): detaily fondů /etf/[isin] a dvojice /srovnani/[pair].
 *
 * Proč: každé nasazení na Vercelu má vlastní prázdnou ISR cache. Roboti (Bing, Seznam, Google) pak znovu prošli ~5 000
 * detailů a tisíce dvojic a každý render na požádání stál ~6–7 ISR zápisů a CPU Fluid → nasazení ≈ 40 000 zápisů
 * (limit Hobby 200 000 / 30 dní) a 15–20 min CPU (limit 4 h). Pokus 31. 10. 2026 na zkušebním projektu: stránky
 * předgenerované přes generateStaticParams = 0 zápisů, CPU buildu se do limitu Fluid nepočítá.
 * Rozhodnutí a důvody: ZAMERNA-ROZHODNUTI.md („Předgenerování detailů a dvojic“). Seznamy NEZKRACOVAT kvůli rychlosti buildu.
 *
 * Pojistka: chyba DB nebo podezřele krátký seznam = VÝJIMKA → build spadne a nenasadí se. Tiše kratší seznam by vrátil
 * render na požádání (a s ním zápisy a CPU) bez jediného varování.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { SLOUPCE_TICKERU } from '@/lib/ticker';
import { getPodobneFondy } from '@/lib/etf-data';
import { jednouZaBuild, sOpakovanim } from '@/lib/buildMemo';
import { isinPlatny } from '@/lib/isin';
import { POPULAR_PAIRS, SITEMAP_PAIRS, HLAVNI_DVOJICE, KURATORSKE, obracenaKuratorska } from '@/lib/pairs';
import { odkazDvojiceDetailu, parsePair, hledacSymbolu, vyberFondProSymbol, kanonikaDvojice, type FondProOdkaz } from '@/lib/odkazyDvojic';

/** Pod tímto počtem detailů je to výpadek dat, ne skutečnost (31. 10. 2026: 5 226 fondů s názvem). */
export const MIN_DETAILU = 4000;
/** Pod tímto počtem dvojic se rozbil výběr podobných fondů (31. 10. 2026: 1 464 dvojic, z toho 1 459 z odkazů detailů). */
export const MIN_DVOJIC = 1000;

/** Dvojice s vlastní statickou stránkou (statická routa má přednost před [pair]) – do seznamu nepatří. */
const VLASTNI_STRANKA = new Set(['vwce-vs-cspx', 'porovnani']);

const SLOUPCE = ['isin', 'name', 'fund_size_numeric', 'index_name', 'investment_focus', 'category', ...SLOUPCE_TICKERU].join(', ');
type Radek = FondProOdkaz & { name: string | null; index_name: string | null; investment_focus: string | null; category: string | null };

/** Všechny řádky etf_funds (bez filtru – jako dotaz stránky dvojice), stránkovaně po 1 000. */
async function vsechnyFondy(): Promise<Radek[]> {
  const out: Radek[] = [];
  for (let od = 0; od < 50000; od += 1000) {
    const { data, error } = await supabaseAdmin.from('etf_funds').select(SLOUPCE).order('isin').range(od, od + 999);
    if (error || !data) throw new Error(`předgenerování: fondy se nenačetly – ${error?.message ?? 'bez dat'}`);
    out.push(...(data as unknown as Radek[]));
    if (data.length < 1000) return out;
  }
  throw new Error('předgenerování: přes 50 000 řádků etf_funds – nečekané, zkontroluj dotaz');
}
const nactiFondy = () => jednouZaBuild('prerenderFondy', vsechnyFondy) ?? sOpakovanim('prerenderFondy', vsechnyFondy);

/** Detail se vykreslí (ne 404) = řádek s neprázdným názvem – stejná podmínka jako notFound() v src/app/etf/[isin]/page.tsx;
 *  a ISIN projde middlewarem (src/lib/isin.ts), jinak by stránka nebyla dosažitelná. */
const maDetail = (r: Radek) => !!String(r.name ?? '').trim() && isinPlatny(String(r.isin));

export async function isinyDetailuKPredgenerovani(): Promise<string[]> {
  const isiny = (await nactiFondy()).filter(maDetail).map((r) => String(r.isin));
  if (isiny.length < MIN_DETAILU) {
    throw new Error(`předgenerování: jen ${isiny.length} detailů fondů (< ${MIN_DETAILU}) – výpadek dat? Build zastaven, ať se nenasadí web bez předgenerovaných detailů.`);
  }
  process.stdout.write(`předgenerování: ${isiny.length} detailů fondů\n`);
  return isiny;
}

/** Dvojice, na které odkazuje detail fondu – TÝMIŽ funkcemi jako stránka (getPodobneFondy + odkazDvojiceDetailu). */
async function dvojiceZDetailu(fondy: Radek[]): Promise<string[]> {
  const out: string[] = [];
  for (const f of fondy.filter(maDetail)) {
    const podobne = await getPodobneFondy({ index_name: f.index_name, name: f.name, investment_focus: f.investment_focus ?? null, category: f.category, isin: f.isin });
    const { parHref, parSlug, kuratorskaSrovnani } = odkazDvojiceDetailu(f, podobne);
    if (parSlug && parHref === `/srovnani/${parSlug}`) out.push(parSlug);
    out.push(...kuratorskaSrovnani);
  }
  return out;
}

/**
 * Vykreslí se adresa jako stránka 200 (ne 404 ani přesměrování)? Zrcadlo src/middleware.ts (malá písmena, obrácená
 * kurátorská) a src/app/srovnani/[pair]/page.tsx (výběr fondů podle tickerů, kanonická adresa, ověření cíle přesměrování).
 */
function vykresliSe(slug: string, hledej: (s: string[]) => Radek[]): boolean {
  if (slug !== slug.toLowerCase() || obracenaKuratorska(slug) || VLASTNI_STRANKA.has(slug)) return false;
  const p = parsePair(slug);
  if (!p) return false;
  const [t1, t2] = p;
  const r = hledej([t1, t2]);
  const e1 = vyberFondProSymbol(r, t1), e2 = vyberFondProSymbol(r, t2);
  if (!e1 || !e2) return false; // stránka by vrátila 404
  const { presmerovat } = kanonikaDvojice(slug, e1, e2, t1, t2);
  if (!presmerovat) return true;
  if (KURATORSKE[presmerovat]) return false;
  const [c1, c2] = presmerovat.toUpperCase().split('-VS-');
  const r2 = hledej([c1, c2]);
  const o1 = vyberFondProSymbol(r2, c1), o2 = vyberFondProSymbol(r2, c2);
  // Cíl vede na tytéž fondy → stránka přesměruje (nepředgenerovat); jinak zůstane stránkou s canonicalem na sebe.
  return !(o1 && o2 && [o1.isin, o2.isin].sort().join() === [e1.isin, e2.isin].sort().join());
}

export interface SeznamDvojic { slugy: string[]; zDetailu: number; presmerovane: string[] }

/** Seznam dvojic k předgenerování + co z odkazů detailů by se přesměrovalo (pro kontrolu; má být prázdné). */
export async function seznamDvojic(): Promise<SeznamDvojic> {
  const fondy = await nactiFondy();
  const zDetailu = await dvojiceZDetailu(fondy);
  const kandidati = [...new Set([...POPULAR_PAIRS, ...SITEMAP_PAIRS, ...HLAVNI_DVOJICE, ...zDetailu])];
  const hledej = hledacSymbolu(fondy);
  const slugy: string[] = [];
  const presmerovane: string[] = [];
  for (const s of kandidati) {
    if (vykresliSe(s, hledej)) slugy.push(s);
    else if (!VLASTNI_STRANKA.has(s)) presmerovane.push(s);
  }
  return { slugy, zDetailu: new Set(zDetailu).size, presmerovane };
}

export async function slugyDvojicKPredgenerovani(): Promise<string[]> {
  const { slugy, zDetailu, presmerovane } = await seznamDvojic();
  if (slugy.length < MIN_DVOJIC) {
    throw new Error(`předgenerování: jen ${slugy.length} dvojic (< ${MIN_DVOJIC}) – rozbitý výběr podobných fondů? Build zastaven.`);
  }
  process.stdout.write(`předgenerování: ${slugy.length} dvojic (z detailů ${zDetailu}; odkazy, které by se přesměrovaly / 404: ${presmerovane.length}${presmerovane.length ? ` – ${presmerovane.slice(0, 10).join(', ')}` : ''})\n`);
  return slugy;
}

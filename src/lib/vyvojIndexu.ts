/**
 * VÝVOJ INDEXU V KČ PRO DETAIL FONDU (úkol 3.3, varianta A – majitel 11. 11. 2026; ZAMERNA-ROZHODNUTI.md „Graf vývoje
 * indexu v Kč na detailu“).
 *
 * Jen u fondů, kde `prirazeniFondu` vrátí shoda === 'stejny' (fond sleduje přesně index, ze kterého máme historii).
 * U 'blizky' a bez přiřazení graf NENÍ.
 *
 * DATA: stejná cesta jako backtest – loadIndexData (adj. close zdrojového fondu v jeho měně) → loadExchangeRates →
 * convertIndexSeriesToCurrency do Kč (kurz platný nejvýš 4 dny, za posledním kurzem žádný přenos, před 30. 12. 1999
 * bez kurzu = bez bodu). Žádný vlastní přepočet. Pak konce měsíců (src/lib/vyvojIndexuGraf.ts).
 *
 * VÝKON: počítá se při renderu stránky = při buildu (detail je předgenerovaný, src/lib/prerender.ts). Řada indexu
 * se při buildu načte JEDNOU za proces (jednouZaBuild); za běhu (vzácné ISR přegenerování / nový fond) drží engine
 * řady v paměti 6 h (zMezipameti).
 *
 * PRAVIDLO Č. 1:
 *  - build: výpadek dat = výjimka po 3 pokusech → build spadne (stejně jako předpočet backtestu; raději nenasadit
 *    než upéct 30denní stránky bez kontroly),
 *  - za běhu: výpadek nebo podezřele krátká řada → `null` = stránka BEZ grafu (nikdy prázdný/rozbitý graf).
 */
import { JE_BUILD, jednouZaBuild } from '@/lib/buildMemo';
import { loadIndexData, loadExchangeRates, convertIndexSeriesToCurrency, INDEX_SOURCE_CURRENCY } from '@/lib/backtest/engine';
import { INDEX_BY_CODE } from '@/lib/backtest/indexes';
import type { Prirazeni } from '@/lib/backtest/fondNaIndex';
import { mesicniBody, MIN_BODU, type BodGrafu } from '@/lib/vyvojIndexuGraf';

/**
 * Nadpis grafu podle indexu – JEN indexy, které `prirazeniFondu` umí přiřadit se shodou 'stejny'. Index mimo seznam
 * = bez grafu (nový index se musí přidat vědomě, s popisem). Názvy podle fondNaIndex.ts (`zdroj`) a manifestu.
 */
export const NADPIS_GRAFU: Record<string, string> = {
  sp500: 'Vývoj indexu S&P 500 v Kč',
  us_small_cap: 'Vývoj indexu Russell 2000 v Kč',
  us_value: 'Vývoj indexu Russell 1000 Value v Kč',
  us_growth: 'Vývoj indexu Russell 1000 Growth v Kč',
  msci_em: 'Vývoj indexu MSCI Emerging Markets v Kč',
  // 'stejny' jen u fondů na FTSE Global All Cap (= index VT); FTSE All-World / MSCI ACWI jsou 'blizky' → bez grafu.
  ftse_all_world: 'Vývoj indexu FTSE Global All Cap v Kč',
  gold: 'Vývoj ceny zlata v Kč',
  us_treasury_1_3y: 'Vývoj amerických státních dluhopisů 1–3 roky v Kč',
  us_treasury_7_10y: 'Vývoj amerických státních dluhopisů 7–10 let v Kč',
  us_treasury_20y: 'Vývoj amerických státních dluhopisů 20+ let v Kč',
  us_corp_bond_ig: 'Vývoj amerických firemních dluhopisů v Kč',
  eur_govt_bond_1_3y: 'Vývoj eurových státních dluhopisů 1–3 roky v Kč',
  eur_govt_bond_3_7y: 'Vývoj eurových státních dluhopisů 3–5 let v Kč',
  eur_govt_bond_15_30y: 'Vývoj eurových státních dluhopisů 15–30 let v Kč',
  eur_corp_bond: 'Vývoj eurových firemních dluhopisů v Kč',
};

export interface VyvojIndexu {
  indexCode: string;
  nadpis: string;
  /** Ticker zdrojového fondu bez burzovní přípony (SPY, IBGS…). */
  zdrojTicker: string;
  /** Data jsou ceny PŘÍMO tohoto fondu (jiný listing téže třídy) – manifest `sourceIsin`. */
  jeZdrojovyFond: boolean;
  /** Zdrojový fond nic nevyplácí (komodita – GLD) → popisek BEZ „včetně výplat“ (check-fund-data hlídá „reinvest“ u zlata). */
  bezVyplat: boolean;
  body: BodGrafu[];
}

/** Měsíční body indexu v Kč – sdílené pro všechny fondy na stejný index (při buildu jednou za proces). */
async function spocitejBody(indexCode: string): Promise<BodGrafu[]> {
  const [index, kurzy] = await Promise.all([loadIndexData(indexCode), loadExchangeRates()]);
  const vKc = convertIndexSeriesToCurrency(index.data, INDEX_SOURCE_CURRENCY[indexCode] ?? 'USD', 'CZK', kurzy);
  const body = mesicniBody(vKc);
  if (body.length < MIN_BODU) throw new Error(`vývoj indexu ${indexCode}: jen ${body.length} měsíčních bodů v Kč`);
  return body;
}

export async function vyvojIndexuProFond(isin: string, prirazeni: Prirazeni | null): Promise<VyvojIndexu | null> {
  if (!prirazeni || prirazeni.shoda !== 'stejny') return null;
  const def = INDEX_BY_CODE[prirazeni.indexCode];
  const nadpis = NADPIS_GRAFU[prirazeni.indexCode];
  if (!def || !nadpis) return null;
  const vysledek = (body: BodGrafu[]): VyvojIndexu => ({
    indexCode: def.code,
    nadpis,
    zdrojTicker: def.ticker.replace(/\.[A-Z]+$/, ''),
    jeZdrojovyFond: def.sourceIsin === isin,
    bezVyplat: def.group === 'commodity',
    body,
  });
  if (JE_BUILD) return vysledek(await jednouZaBuild(`vyvojIndexuKc:${def.code}`, () => spocitejBody(def.code))!);
  try {
    return vysledek(await spocitejBody(def.code));
  } catch (e) {
    console.warn(`vývoj indexu ${def.code}: bez grafu – ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

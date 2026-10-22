/**
 * TŘÍDY TÉHOŽ FONDU – kontrola rizikových ukazatelů zdroje (revize kola 4, 18. 10. 2026, pravidlo č. 1).
 *
 * Zdroj (justETF) má u některých tříd téhož fondu kolísavost/pokles, které nesedí s jinou třídou – např.
 * SPDR MSCI ACWI IMI: SPYI (Acc) kolísavost 10,4 %, pokles −6,9 %; SPSA (Dist) 21,1 % a −13,0 %.
 * Vanguard FTSE All-World High Dividend: VHYL 8,1 % vs VGWE 10,8 % (3 roky 10,0 vs 17,0 %).
 * Třídy drží stejné portfolio, v eurech (v nich se riziko počítá) musí kolísat stejně – liší se jen měnově
 * ZAJIŠTĚNÉ třídy, ty se proto porovnávají jen mezi sebou.
 * Nezávislé ověření z denních cen Yahoo za rok (EUR, 18. 10. 2026): kolísavost SPYI.DE 10–11 %, SPSA.DE 12 %,
 * VHYL.AS 8–9 %, VGWE.DE 9–9,5 %; max. pokles SPYI.DE i SPSA.DE −6,4 % → chybné jsou údaje SPSA a VGWE.
 * Který z dvojice je špatně, ale ze zdroje samotného poznat nejde.
 *
 * Pravidlo: třída téhož fondu = stejný poskytovatel + stejný název před „UCITS ETF“ + stejný zbytek po
 * odečtení označení třídy (měna, Acc/Dist, 1C/1D…) + stejné měnové zajištění. Údaj „nesedí“, když se od
 * ostatních liší o víc než 30 % (relativně) A zároveň aspoň o 1 p. b. (u fondů peněžního trhu s kolísavostí
 * pod 1 % je relativní rozdíl šum). Dvě třídy, které nesedí → „—“ u obou (nevíme, která je správně).
 * Tři a víc → „—“ u těch, které se liší od mediánu. Pokles od založení se NEporovnává (třídy mají různé stáří);
 * pokles za 5 let ano (zdroj ho u třídy mladší 5 let neuvádí).
 * Kontrola: scripts/check-fund-data.mjs (VAROVÁNÍ „volatilita tříd téhož fondu se liší“).
 *
 * ZPŘESNĚNÍ (kolo 6b, 21. 10. 2026): „nevíme, která je správně“ přestává platit, když máme NEZÁVISLOU KOTVU – medián
 * téhož údaje u ostatních fondů na stejný široký index (jiní emitenti, src/lib/trhy.ts `kotvyRizika`). Třída, která
 * s kotvou sedí (stejné kritérium `nesedi`), se ze skupiny, která se rozchází, NEskrývá; skryje se jen ta, která
 * s kotvou nesedí. P500 (Invesco S&P 500 Acc): max. pokles 3 roky −22,61 % (ověřil Martin; kotva trhu S&P 500 ~−22 %)
 * vs. D500 (Dist) −31,41 % → dřív „—“ u obou, teď jen u D500. Bez kotvy (fond mimo ruční seznamy trhů) nebo když
 * s kotvou nesedí ani jedna třída → původní pravidlo (obě „—“).
 */
import { detectHedging } from '@/utils/hedgingDetection';

// max_drawdown_5y od kola 6 (20. 10. 2026): VGWE −19,6 % vs VHYL −14,8 % (tentýž fond) kvůli vadnému bodu zdroje
// 25. 12. 2024 (79,05 místo ~70,3; burzy zavřené). Nezávisle Yahoo Xetra: VGWE.DE −16,4 %, VHYL.AS −16,8 %.
export const RIZIKO_POLE = ['volatility_1y', 'volatility_3y', 'volatility_5y', 'max_drawdown_1y', 'max_drawdown_3y', 'max_drawdown_5y'] as const;
export type RizikoPole = (typeof RIZIKO_POLE)[number];

/** Slova, která označují jen třídu fondu (ne jiný fond). Po odečtení musí zbytek názvu sedět. */
const TRIDA = /^(eur|usd|gbp|chf|jpy|sek|sgd|aud|cad|nok|dkk|hkd|pln|czk|mxn|cnh|euro|hedged?|unhedged|hdg|pfhdg|daily|monthly|to|acc|accumulating|accumulation|capitalisation|capitalization|dist|dis|distributing|distribution|inc|income|[a-z]|\d[a-z]|dr|class|inst|institutional|uk|ukdis|ukacc|h(eur|usd|gbp|chf))$/;

/** Klíč „stejný fond, jiná třída“; null = název nejde spolehlivě rozdělit na fond a třídu. */
export function klicTridy(name: string | null | undefined, provider: string | null | undefined): string | null {
  const n = String(name ?? '');
  const m = n.match(/^(.*)\b(?:UCITS\s+)?(?:ETF|ETC|ETP|ETN)\b(.*)$/i);
  if (!m || !m[1].trim()) return null;
  const zbytek = m[2].toLowerCase().split(/[^a-z0-9]+/).filter((w) => w && !TRIDA.test(w)).join(' ');
  return `${provider ?? ''}|${detectHedging(n).hedgingType}|${m[1].toLowerCase().replace(/\s+/g, ' ').trim()}|${zbytek}`;
}

/**
 * OVĚŘENÁ TŘÍDA (kolo 8, 22. 10. 2026): třída, jejíž rizikové údaje jsme NEZÁVISLE ověřili, slouží jako kotva tam, kde
 * kotva trhu chybí (fond mimo ruční seznamy trhů). VHYL (IE00B8GKDB10, Vanguard FTSE All-World High Dividend Dist):
 * přepočet z denní řady zdroje i Yahoo VHYL.AS kolísavost 1R 8,72 %, 3R 10,72 % = údaj zdroje u VHYL; chybná je VGWE
 * (Acc, 10,8 / 17,0 %). Dřív „—“ u obou, teď jen u VGWE. Zapsáno v ZAMERNA-ROZHODNUTI.md (kolo 8).
 */
export const OVERENA_TRIDA: Readonly<Record<string, readonly RizikoPole[]>> = {
  IE00B8GKDB10: ['volatility_1y', 'volatility_3y', 'volatility_5y', 'max_drawdown_3y', 'max_drawdown_5y'],
};

const nesedi = (a: number, b: number) => Math.abs(a - b) >= 1 && Math.max(a, b) / Math.min(a, b) > 1.3;

type Fond = { isin: string; name: string | null; fund_provider: string | null } & Partial<Record<RizikoPole, number | null>>;

/** Kotva: ISIN → nezávislý medián údaje u ostatních fondů na stejný index (absolutní hodnota). */
export type KotvyRizika = ReadonlyMap<string, Partial<Record<RizikoPole, number>>>;

/** ISIN → ukazatele, které nesedí s jinou třídou téhož fondu. Jen fondy s problémem. */
export function rizikoNesedi(fondy: Fond[], pole: readonly RizikoPole[] = RIZIKO_POLE, kotvy?: KotvyRizika): Map<string, RizikoPole[]> {
  const skupiny = new Map<string, Fond[]>();
  for (const f of fondy) {
    const k = klicTridy(f.name, f.fund_provider);
    if (k) skupiny.set(k, [...(skupiny.get(k) ?? []), f]);
  }
  const out = new Map<string, RizikoPole[]>();
  const pridej = (isin: string, o: RizikoPole) => out.set(isin, [...(out.get(isin) ?? []), o]);
  for (const g of skupiny.values()) {
    if (g.length < 2) continue;
    for (const o of pole) {
      // Pokles je záporný – porovnává se velikost.
      const s = g.map((f) => ({ isin: f.isin, v: f[o] == null ? null : Math.abs(Number(f[o])) }))
        .filter((x): x is { isin: string; v: number } => x.v != null && x.v > 0);
      if (s.length < 2) continue;
      let podezrele: { isin: string; v: number }[];
      if (s.length === 2) {
        podezrele = nesedi(s[0].v, s[1].v) ? s : [];
      } else {
        const serazene = s.map((x) => x.v).sort((a, b) => a - b);
        const med = serazene.length % 2 ? serazene[(serazene.length - 1) / 2] : (serazene[serazene.length / 2 - 1] + serazene[serazene.length / 2]) / 2;
        podezrele = s.filter((x) => nesedi(x.v, med));
      }
      if (!podezrele.length) continue;
      // Kotva (stejná pro celou skupinu – stejný trh): třída, která s ní sedí, se neskrývá – pokud aspoň jedna sedí.
      const kotva = s.map((x) => kotvy?.get(x.isin)?.[o]).find((k): k is number => k != null && k > 0);
      const sKotvou = kotva == null ? [] : s.filter((x) => !nesedi(x.v, kotva));
      // Bez kotvy trhu rozhoduje ručně ověřená třída (OVERENA_TRIDA) – správná je ona a třídy, které s ní sedí.
      const overena = sKotvou.length ? [] : s.filter((x) => OVERENA_TRIDA[x.isin]?.includes(o));
      const spravne = sKotvou.length ? sKotvou : overena.length ? s.filter((x) => overena.some((v) => !nesedi(x.v, v.v))) : [];
      for (const x of podezrele) if (!spravne.some((k) => k.isin === x.isin)) pridej(x.isin, o);
      // Rozpor se vyřešil kotvou → skrýt i třídy, které s kotvou nesedí, když je pravidlo mediánu nechalo (3+ tříd).
      if (spravne.length) for (const x of s) if (!spravne.includes(x) && !podezrele.includes(x)) pridej(x.isin, o);
    }
  }
  return out;
}

export const RIZIKO_NESEDI_TEXT = 'Údaj zdroje nesedí s jinou třídou téhož fondu (stejné portfolio musí kolísat stejně), proto ho neuvádíme.';

/* ======================================================================================================
 * VÝNOSY TŘÍD TÉHOŽ FONDU (kolo 8, 22. 10. 2026; pravidlo č. 1).
 *
 * Výnosy webu jsou S REINVESTICÍ DIVIDEND (etf-astro vynosy_z_rady.py, řada zdroje includeDividends=true) – akumulační
 * a distribuční třída téhož nezajištěného fondu proto musí ke STEJNÉMU dni (returns_as_of) vynést prakticky totéž
 * (rozdíl = TER a časování, desetiny p. b.). Rozdíl „≈ vyplacená dividenda“ proto NENÍ legitimní – je to dividenda,
 * kterou zdroj v řadě distribuční třídy nemá (stejně jako I50D/XISP v kole 7, ZAMERNA-ROZHODNUTI.md).
 * Nezávisle ověřeno 22. 10. 2026 (Yahoo adjclose = s dividendami, přepočet měny kurzem k týmž dnům):
 *   PRAR (Amundi Prime Euro Gov Acc) DB 1R −0,94 %, burza PRAR.DE −3,36 %; Dist PR1R DB −3,42 % / burza −3,45 % → chybná Acc;
 *   UBS SMI/SPI/Swiss Dividend/CHSRI „acc“ (nové třídy 2024–25) DB o 2–5 p. b. výš než burza, „dis“ sedí;
 *   QDVV, EYED, 36B1, JGHD, LCVB, LHKG (distribuční) o 1,5–14 p. b. níž než burza (chybí dividendy); QYLU/QYLE 3R obě vedle.
 * Rozdíl, který má i burza (ve skutečnosti jiná třída – skryté zajištění CHF, jiný produkt), je v ROZDIL_TRID_SKUTECNY.
 *
 * Pravidlo `vynosTridNesedi`: skupina = klicTridy (bez měnově zajištěných a pákových) + stejný returns_as_of; období
 * 1R/3R/5R; rozdíl = poměr růstu (1+a)/(1+b) − 1 nad PRAH_VYNOSU_TRID (1,5 / 3 / 5 %; poměr, ne p. b. – u +300 % jsou p. b. šum).
 *   - 3+ tříd: chybná = ta, která se od mediánu liší nad práh;
 *   - 2 třídy: rozhodne OVERENY_VYNOS_TRIDY (ručně ověřená třída a období), jinak kotva indexu (medián ostatních fondů
 *     na stejný index_name ke stejnému dni, aspoň 3 jiné fondy) – sedí-li s kotvou právě jedna, chybná je druhá;
 *     jinak „—“ u obou (nevíme, která je správně).
 * Chybná třída = VŠECHNY výnosy za období „—“ (stejný mechanismus jako odlehlý výnos, src/lib/vynosNeovereny.ts):
 * řada, která je prokazatelně vadná v jednom období, není důvěryhodná ani v ostatních. Kalendářní roky zůstávají.
 * Kontrola: scripts/check-fund-data.mjs, blok „kolo8 zebricky“ (nezávislá implementace nad DB + /api/etf/screener).
 * ====================================================================================================== */
export const VYNOS_TRID_POLE = ['return_1y', 'return_3y', 'return_5y'] as const;
export type VynosTridPole = (typeof VYNOS_TRID_POLE)[number];
/** Práh v % poměru růstu (1+a)/(1+b) − 1. */
export const PRAH_VYNOSU_TRID: Record<VynosTridPole, number> = { return_1y: 1.5, return_3y: 3, return_5y: 5 };

/** Třída a období, které jsme NEZÁVISLE ověřili (burza Yahoo s dividendami, kurz k týmž dnům; 22. 10. 2026) – rozhoduje
 *  spor dvou tříd. Hodnota = období, ve kterých třída sedí s burzou (do 1,1 p. b.). */
export const OVERENY_VYNOS_TRIDY: Readonly<Record<string, readonly VynosTridPole[]>> = {
  LU1931975152: ['return_1y'], // PR1R Amundi Prime Euro Gov Dist: DB −3,42 %, ETFGOV.MI −3,45 % (PRAR Acc DB −0,94 %, PRAR.DE −3,36 %)
  LU1931974775: ['return_1y'], // PR1J Amundi Prime Japan Dist: DB 24,26 %, ETFJAP.MI 23,41 % (PRAJ Acc DB 27,33 %)
  CH0017142719: ['return_1y'], // SMICHA UBS SMI dis: DB 16,69 %, SMICHA.SW 16,31 % CHF = 16,09 % EUR (SMIA acc DB 18,86 %, burza 15,28 % EUR)
  CH0131872431: ['return_1y'], // SPICHA UBS SPI dis: DB 16,28 %, burza 15,75 % EUR (SPIA acc DB 18,38 %, burza 14,99 % EUR)
  CH1244681594: ['return_1y'], // CHDIV UBS MSCI Swiss Dividend dis: DB 14,48 %, burza 13,40 % EUR (CHDIVA acc DB 17,17 %, burza 11,97 %)
  CH0368190739: ['return_1y', 'return_3y'], // CHSRI UBS MSCI Switzerland IMI SR dis: 1R DB 13,71 %, burza 13,75 % EUR; 3R DB 44,80 %, CHSRI.SW 41,16 % CHF = 44,53 % EUR (CHSRIA acc 1R DB 15,30 / burza 12,86 %, 3R DB 49,64 / burza 43,5 %)
  IE00BF20LF40: ['return_1y'], // 2B72 iShares MSCI Europe Mid Cap Acc: DB 18,60 %, EUMD.L (EUR) 18,42 % (QDVV Dist DB 16,05 %, EMID.L 18,42 %)
  IE00BMW42637: ['return_1y'], // ESIE iShares MSCI Europe Energy Acc: DB 68,49 %, ESIE.L 62,50 % GBP = 68,14 % EUR (EYED Dist DB 65,01 %, burza 68,24 %)
  IE00BF553838: ['return_1y'], // SLME iShares JPM Adv. USD EM Bond Acc: DB 4,16 %, EMSA.MI 4,13 % (36B1 Dist DB 2,59 %, 36B1.DE 3,92 %)
  IE00BKKCKJ46: ['return_3y'], // JGHY JPM Global HY Acc: DB 22,61 %, JGHY.L 29,77 % USD = 22,4 % EUR (JGHD Dist DB 18,52 %, burza 22,6 % EUR)
  LU2300294316: ['return_5y'], // ECR1 Amundi Euro Corp 0-1Y ESG Acc: DB 11,07 %, ECR1.MI 11,13 % (LCVB Dist DB −0,14 %)
  LU1900068914: ['return_5y'], // LCHI Amundi MSCI China ESG Sel. Extra Acc: DB −22,37 %, CINA.MI −22,27 % (LHKG Dist DB −8,42 %)
  GB00B5840F36: ['return_5y'], // XGLD Xtrackers Physical Gold: DB 137,39 %, XAD5.MI (EUR) 137,23 % (XAD5 DB 104,23 %)
};

/** Skupiny, kde rozdíl mezi „třídami“ potvrdila i burza – ve skutečnosti nejde o stejné portfolio/měnu (22. 10. 2026). */
export const ROZDIL_TRID_SKUTECNY: readonly (readonly string[])[] = [
  ['LU1291109616', 'LU1547516291'], // BNP Easy Energy & Metals Enhanced Roll GSDE vs EMEH: GSCE.MI +39,33 %, EMEH.PA +31,14 % (DB 38,31 / 30,37)
  ['CH0109967858', 'CH0116015352'], // UBS CMCI Oil SF USD vs CHF (CHF třída zajištěná, název to neříká): poměr růstu burza 1,071 = DB 1,073
  ['IE00B86MWN23', 'IE00BG13YK79'], // iShares Edge MSCI Europe Min Vol EUN0 vs IS0H: MVEU.MI +12,52 %, MVED.L cena +9,23 % + div. 0,86 % (DB 12,37 / 10,08)
];

type FondVynosTridy = {
  isin: string; name: string | null; fund_provider: string | null; returns_as_of?: string | null;
  index_name?: string | null; is_leveraged?: boolean | null;
} & Partial<Record<VynosTridPole, number | string | null>>;

export interface VynosTridNesedi { obdobi: VynosTridPole[]; proti: string[] }

const medianN = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const rust = (v: unknown) => (v == null || v === '' || !Number.isFinite(Number(v)) || Number(v) <= -100 ? null : 1 + Number(v) / 100);
const lisiSe = (a: number, b: number, o: VynosTridPole) => Math.abs(a / b - 1) * 100 > PRAH_VYNOSU_TRID[o];

/** ISIN → období, ve kterých výnos třídy nesedí s jinou třídou téhož fondu (a s kterými třídami). Jen fondy s problémem.
 *  `fondy` = celá nabídka (z ní i kotva indexu). */
export function vynosTridNesedi(fondy: FondVynosTridy[]): Map<string, VynosTridNesedi> {
  const out = new Map<string, VynosTridNesedi>();
  const den = (f: FondVynosTridy) => String(f.returns_as_of ?? '').slice(0, 10);
  const kandidati = fondy.filter((f) => f.returns_as_of && !f.is_leveraged && !detectHedging(f.name).isHedged);
  const klic = new Map(kandidati.map((f) => [f.isin, klicTridy(f.name, f.fund_provider)]));
  const skupiny = new Map<string, FondVynosTridy[]>();
  for (const f of kandidati) {
    const k = klic.get(f.isin);
    if (k) skupiny.set(`${k}|${den(f)}`, [...(skupiny.get(`${k}|${den(f)}`) ?? []), f]);
  }
  // Kotva indexu: index_name + den → fondy (sestaví se líně, jen pro spory dvou tříd bez ověřené třídy).
  let podleIndexu: Map<string, FondVynosTridy[]> | null = null;
  const kotvaIndexu = (f: FondVynosTridy, o: VynosTridPole): number | null => {
    if (!f.index_name) return null;
    if (!podleIndexu) {
      const m = new Map<string, FondVynosTridy[]>();
      for (const x of kandidati) if (x.index_name) { const k = `${x.index_name.trim().toLowerCase()}|${den(x)}`; m.set(k, [...(m.get(k) ?? []), x]); }
      podleIndexu = m;
    }
    const kf = klic.get(f.isin);
    const jine = new Map<string, number[]>();
    for (const x of podleIndexu.get(`${f.index_name.trim().toLowerCase()}|${den(f)}`) ?? []) {
      const kx = klic.get(x.isin) ?? x.isin, g = rust(x[o]);
      if (kx !== kf && g != null) jine.set(kx, [...(jine.get(kx) ?? []), g]);
    }
    return jine.size >= 3 ? medianN([...jine.values()].map(medianN)) : null;
  };
  const pridej = (isin: string, o: VynosTridPole, proti: string[]) => {
    const z = out.get(isin) ?? { obdobi: [], proti: [] };
    if (!z.obdobi.includes(o)) z.obdobi.push(o);
    for (const p of proti) if (p !== isin && !z.proti.includes(p)) z.proti.push(p);
    out.set(isin, z);
  };
  for (const g of skupiny.values()) {
    if (g.length < 2 || ROZDIL_TRID_SKUTECNY.some((par) => g.some((f) => par.includes(f.isin)))) continue;
    for (const o of VYNOS_TRID_POLE) {
      const s = g.map((f) => ({ f, g: rust(f[o]) })).filter((x): x is { f: FondVynosTridy; g: number } => x.g != null);
      if (s.length < 2) continue;
      const hodnoty = s.map((x) => x.g);
      if (!lisiSe(Math.max(...hodnoty), Math.min(...hodnoty), o)) continue;
      let chybne: typeof s;
      if (s.length >= 3) {
        const m = medianN(hodnoty);
        chybne = s.filter((x) => lisiSe(x.g, m, o));
      } else {
        const overena = s.filter((x) => OVERENY_VYNOS_TRIDY[x.f.isin]?.includes(o));
        const kotva = overena.length ? null : kotvaIndexu(s[0].f, o);
        const spravne = overena.length ? overena : kotva == null ? [] : s.filter((x) => !lisiSe(x.g, kotva, o));
        chybne = spravne.length === 1 ? s.filter((x) => x !== spravne[0]) : s;
      }
      const isiny = s.map((x) => x.f.isin);
      for (const x of chybne) pridej(x.f.isin, o, isiny);
    }
  }
  return out;
}

const OBDOBI_TEXT: Record<VynosTridPole, string> = { return_1y: '1 rok', return_3y: '3 roky', return_5y: '5 let' };
/** Vysvětlivka u „—“ (detail fondu): `proti` = zobrazované tickery tříd, se kterými výnos nesedí. */
export function vynosTridText(z: VynosTridNesedi, proti: string[]): string {
  return `Výnosy za období neukazujeme: výnos za ${z.obdobi.map((o) => OBDOBI_TEXT[o]).join(' a ')} od zdroje dat nesedí s jinou třídou téhož fondu${proti.length ? ` (${proti.join(', ')})` : ''}. Třídy drží stejné portfolio a výnos počítáme s reinvesticí dividend, takže musí vycházet stejně – rozdíl je chyba dat.`;
}

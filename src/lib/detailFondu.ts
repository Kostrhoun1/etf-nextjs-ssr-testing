/**
 * Pomocné funkce DETAILU FONDU /etf/[isin] (revize kola 6, 20. 10. 2026). Čisté funkce bez dotazů do DB –
 * detail je nejčastější stránka a běží na free tieru (CPU), proto se nic nepočítá dvakrát a nic se nedotazuje navíc.
 *
 * Co tu je a proč:
 * - typ produktu (akcie / dluhopisy / peněžní trh / komodita / krypto) – texty FAQ, vysvětlivek a věta „Co je tento
 *   produkt“ se dřív psaly jednou šablonou pro všechno (W-8BEN a „dividendy reinvestuje“ u fondu peněžního trhu),
 * - index k zobrazení s fallbackem na `index_name` (od 20. 10. 2026 čistý z řádku „Index“ u zdroje) – pravidlo
 *   „index jen když jím název fondu končí“ dávalo „—“ u QDVE, XEON, IBC1,
 * - klíč pro „Další fondy na index X“ = stejný index JAKO NADPIS + stejné měnové zajištění,
 * - úprava názvů držených pozic (přípony Inc./Corp./Co., Ltd., VERZÁLKY, dvě třídy akcií jedné firmy).
 */
import { indexFonduLabel, jeUseknutyIndex, normalizeIndexName } from '@/utils/indexNormalization';
import { detectHedging, type HedgingInfo } from '@/utils/hedgingDetection';

export type TypProduktu = 'akcie' | 'dluhopisy' | 'penezni' | 'komodita' | 'krypto';

export type FondDetailu = {
  name?: string | null;
  index_name?: string | null;
  investment_focus?: string | null;
  category?: string | null;
  description_en?: string | null;
};

/** Typ produktu z kategorie zdroje (a zaměření „Money Market“). Nemovitosti = akcie realitních firem. */
export function typProduktu(f: FondDetailu): TypProduktu {
  const c = f.category ?? '';
  if (c === 'Peněžní trh' || /\bMoney Market\b/i.test(f.investment_focus ?? '')) return 'penezni';
  if (c === 'Krypto') return 'krypto';
  if (c === 'Komodity' && !/miner/i.test(f.name ?? '')) return 'komodita';
  if (c === 'Dluhopisy') return 'dluhopisy';
  return 'akcie';
}

/** ETC/ETN/ETP = dluhový cenný papír emitenta, ne fond (BRNT, BITC, SGLN). Podle popisu zdroje („The ETC's TER…“) nebo názvu. */
export function jeDluhovyProdukt(f: FondDetailu): 'ETC' | 'ETN' | 'ETP' | null {
  const n = f.name ?? '';
  if (/\bUCITS\b/i.test(n)) return null;
  const m = n.match(/\b(ETC|ETN|ETP)\b/) ?? (f.description_en ?? '').match(/\bThe (ETC|ETN|ETP)'s\b/);
  return m ? (m[1] as 'ETC' | 'ETN' | 'ETP') : null;
}

/** Měnové zajištění třídy – JEDNA funkce webu (detectHedging), z názvu fondu, záložně z index_name („S&P 500® (EUR Hedged)“). */
export function zajisteniFondu(f: FondDetailu): HedgingInfo {
  const h = detectHedging(f.name);
  if (h.isHedged) return h;
  return /\bhedged\b/i.test(f.index_name ?? '') && !/unhedged/i.test(f.index_name ?? '') ? detectHedging(f.index_name) : h;
}

const HEDGE_V_INDEXU = /\s*\((EUR|USD|GBP|CHF|JPY|SEK|SGD|AUD|CAD|NOK|DKK|HKD|PLN|CZK|MXN|CNH)\s+Hedged\)\s*$/i;

/** Čistý zápis index_name k zobrazení (bez ®/™, sjednocené mezery). */
const cistyIndexName = (raw: string | null | undefined) => normalizeIndexName(raw).replace(/[®™]/g, '').replace(/\s+UCITS$/i, '').replace(/\s+/g, ' ').trim();

/** Aktivní fondy mají v řádku „Index“ u zdroje vlastní název strategie – to není index. */
const AKTIVNI = /\bactive\b/i;

const KOVY_2P: Record<string, string> = { gold: 'zlata', silver: 'stříbra', platinum: 'platiny', palladium: 'palladia' };

/**
 * Sledovaný index K ZOBRAZENÍ na detailu: 1) indexFonduLabel (stejná funkce jako srovnávač a porovnání),
 * 2) jinak `index_name` ze zdroje – jen když není useknutý, není to název aktivní strategie a název fondu
 * index neobsahuje (pokud ho obsahuje a indexFonduLabel ho odmítl, název pokračuje dál – „S&P 500 Energy“
 * s index_name „S&P 500“ – a index_name je nespolehlivý). Komodity/krypto: jen přeložitelné tvary
 * („Gold (EUR Hedged)“ → „Cena zlata (zajištěno do EUR)“, „Bitcoin“ → „Cena kryptoměny Bitcoin“), jinak null.
 */
export function indexDetailu(f: FondDetailu): string | null {
  const l = indexFonduLabel({ index_name: f.index_name, name: f.name, investment_focus: f.investment_focus });
  if (l) return l;
  const raw = cistyIndexName(f.index_name);
  if (!raw || raw.length < 2 || AKTIVNI.test(raw)) return null;
  if (jeUseknutyIndex(f.index_name, f.name)) return null;
  const nazev = (f.name ?? '').replace(/[®™]/g, '').toLowerCase();
  const i = nazev.indexOf(raw.toLowerCase());
  if (i >= 0 && raw.split(' ').length > 1 && !/^\s*($|ucits|etf|etc|etn|etp)/.test(nazev.slice(i + raw.length))) {
    // Název fondu obsahuje index a pokračuje dál (Energy, Top 20…) → index_name je jen začátek skutečného indexu.
    return null;
  }
  const typ = typProduktu(f);
  if (typ === 'komodita') {
    const m = raw.match(/^(Gold|Silver|Platinum|Palladium)(?:\s+\((EUR|USD|GBP|CHF) Hedged\))?$/i);
    if (m) return `Cena ${KOVY_2P[m[1].toLowerCase()]}${m[2] ? ` (zajištěno do ${m[2].toUpperCase()})` : ''}`;
    // Jednoslovné „Gold“, „Copper“ apod. bez poskytovatele indexu nepoužívat – anglické slovo by nic neřeklo.
    return raw.split(' ').length >= 2 ? raw : null;
  }
  if (typ === 'krypto') {
    if (/^[A-Z][A-Za-z0-9.]*(?:\s[A-Z][A-Za-z0-9.]*)?(?:\s\([A-Z0-9]{2,6}\))?$/.test(raw) && !/\b(index|basket|select|crypto|yield|options?|strategy|large cap)\b/i.test(raw)) {
      return `Cena kryptoměny ${raw}`;
    }
    return raw.split(' ').length >= 2 ? raw : null;
  }
  return raw;
}

/** Index s českým štítkem zajištění: „S&P 500 (EUR Hedged)“ → „S&P 500 (zajištěno do EUR)“; zajištěný fond bez údaje v indexu dostane příponu. */
export function indexSeZajistenim(label: string | null, h: HedgingInfo): string | null {
  if (!label) return null;
  const m = label.match(HEDGE_V_INDEXU);
  const zaklad = label.replace(HEDGE_V_INDEXU, '').trim();
  if (m) return `${zaklad} (zajištěno do ${m[1].toUpperCase()})`;
  if (h.isHedged && !/zajištěno/.test(label)) return `${zaklad} (zajištěno${h.hedgedCurrency ? ` do ${h.hedgedCurrency}` : ''})`;
  return label;
}

/**
 * Klíč „Další fondy na index X“: index BEZ údaje o zajištění, malými písmeny, sjednocené zápisy
 * („Investable Market (IMI)“ = „IMI“). Zajištění se porovnává zvlášť (zajisteniFondu).
 */
export function klicPodobnych(label: string | null): string | null {
  if (!label) return null;
  return label.replace(HEDGE_V_INDEXU, '').replace(/\s*\(zajištěno[^)]*\)\s*$/, '')
    .replace(/\binvestable market\s*\(imi\)/i, 'IMI').replace(/\binvestable market\b/i, 'IMI')
    .replace(/[®™]/g, '').replace(/\s+/g, ' ').trim().toLowerCase() || null;
}

/** Vzor ILIKE index_name pro dotaz na kandidáty podobných fondů: první 1–3 slova, ®/™ → „%“ („STOXX® Europe 600“
 *  i „STOXX Europe 600“ jsou tentýž index), bez zástupných znaků LIKE z dat. Končí „%“. */
export function prefixIndexu(indexName: string | null | undefined): string | null {
  const s = normalizeIndexName(indexName).replace(HEDGE_V_INDEXU, '').replace(/[%_\\]/g, '').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  return `${s.split(' ').slice(0, 3).join(' ').replace(/[®™]/g, '%')}%`.replace(/%+/g, '%');
}

/* ---------- americké akcie (W-8BEN, smlouva Irska s USA) ---------- */
/** Fond drží americké akcie: akciový/realitní a USA ve složení (≥ 5 %) nebo v zaměření (USA, svět, Severní Amerika). */
export function maAmerickeAkcie(f: FondDetailu, zeme: { name: string; weight: number | null }[]): boolean {
  if (typProduktu(f) !== 'akcie') return false;
  const us = zeme.find((z) => /^United States$/i.test(z.name));
  if (us && (us.weight ?? 0) >= 5) return true;
  if (zeme.length > 0) return false;
  return /\b(United States|World|North America)\b/i.test(f.investment_focus ?? '');
}

/* ---------- názvy držených pozic ---------- */
const PRAVNI_FORMA = /[,\s]+(?:Co\.,?\s*Ltd\.?|Co\.\s*Ltd\.?|Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|PLC|Plc|plc|S\.A\.|SA|AG|SE|N\.V\.|NV|S\.p\.A\.|SpA|Oyj|A\/S|ASA|AB|&\s*Co\.?)\s*,?$/i;

/** „Taiwan Semiconductor Manufacturing Co., Ltd.“ → „Taiwan Semiconductor Manufacturing“; „Alphabet, Inc. A“ → „Alphabet A“;
 *  „EXXONMOBIL HOLDINGS CORP.“ → „Exxonmobil Holdings“ (krátké zkratky jako SAP, AXA, UBS zůstávají). Dluhopisy (s čísly) beze změny. */
export function cistyNazevPozice(raw: string): string {
  let s = raw.trim().replace(/\s+/g, ' ');
  if (/\d/.test(s)) return s;
  // třída akcií za právní formou („Alphabet, Inc. A“, „Berkshire Hathaway Inc. B“)
  const t = s.match(/^(.*?)[,\s]+(?:Inc\.?|Corp\.?|Co\.?,?\s*Ltd\.?|Ltd\.?|Plc|SA|AG|SE|NV)\s+([A-C])$/);
  if (t) s = `${t[1]} ${t[2]}`;
  for (let i = 0; i < 3; i++) {
    const d = s.replace(PRAVNI_FORMA, '').trim();
    if (d.length < 2 || d === s) break;
    s = d;
  }
  s = s.replace(/[,\s]+$/, '');
  if (s === s.toUpperCase() && /[A-Z]{5,}/.test(s)) {
    s = s.split(' ').map((w) => (w.length >= 5 && /^[A-Z][A-Z.'-]+$/.test(w) ? w.charAt(0) + w.slice(1).toLowerCase() : w)).join(' ');
  }
  return s || raw;
}

/** Pozice se stejným (vyčištěným) názvem = dvě třídy akcií jedné firmy (Samsung kmenové + prioritní) → jeden řádek se součtem. */
export function slucPozice(holdings: { name: string; weight: number }[]): { name: string; weight: number; tridy: number }[] {
  const m = new Map<string, { name: string; weight: number; tridy: number }>();
  for (const h of holdings) {
    const n = cistyNazevPozice(h.name);
    const k = n.toLowerCase();
    const x = m.get(k);
    if (x) { x.weight += h.weight; x.tridy += 1; } else m.set(k, { name: n, weight: h.weight, tridy: 1 });
  }
  return [...m.values()].sort((a, b) => b.weight - a.weight);
}

/* ---------- datum ---------- */
/** „18. 8. 2026“ */
export const datumKratce = (d: Date) => `${d.getDate()}.${' '}${d.getMonth() + 1}.${' '}${d.getFullYear()}`;

/** Česky: 1 rok, 2–4 roky, 5+ let. */
export const roky = (n: number) => (n === 1 ? 'rok' : n >= 2 && n <= 4 ? 'roky' : 'let');

/* ---------- pořadí burz (JEDNA funkce pro detail, porovnání i stránky dvojic – kolo 6b) ----------
   XETRA první (DEGIRO, XTB, Trading 212 – tam Češi nakupují), pak ostatní EUR burzy (Amsterdam, Milán, Paříž, gettex,
   Stuttgart, Frankfurt), až potom Londýn a SIX. V rámci burzy listing v EUR před jinou měnou. Dřív 3 kopie: detail
   (tahle), porovnání jen „XETRA první“ a /srovnani/[pair] bez řazení (XETRA poslední u cspx-vs-sxr8). */
const PORADI_BURZ = [/xetra/i, /amsterdam/i, /milan|italiana/i, /paris/i, /gettex/i, /stuttgart/i, /frankfurt/i, /london/i, /six|swiss/i];
export function poradiBurzy(e: { name: string | null | undefined; currency?: string | null }): number {
  const i = PORADI_BURZ.findIndex((re) => re.test(e.name ?? ''));
  if (i === 0) return e.currency === 'EUR' || !e.currency ? 0 : 1; // XETRA vždy první
  return (e.currency === 'EUR' ? 10 : 100) + (i < 0 ? 99 : i);
}
/** Seřadí listingy podle `poradiBurzy` (stabilně – při shodě pořadí ze zdroje). */
export function seradBurzy<T>(xs: T[], burza: (x: T) => { name: string | null | undefined; currency?: string | null }): T[] {
  return xs.map((x, i) => ({ x, i, p: poradiBurzy(burza(x)) })).sort((a, b) => a.p - b.p || a.i - b.i).map((o) => o.x);
}

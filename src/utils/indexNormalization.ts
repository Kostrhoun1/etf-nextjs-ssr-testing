/**
 * Normalizace názvů indexů (index_name).
 *
 * Zdrojová data z justETF mají do pole `index_name` přilepenou metadatu třídy
 * akcií (měna / akumulace–distribuce / měnové zajištění / kód třídy), a to
 * typicky až za DVĚMA mezerami, např.:
 *   "MSCI World  USD Acc"              -> "MSCI World"
 *   "MSCI All Country World  EUR Hedged" -> "MSCI All Country World"
 *   "FTSE 100  GBP"                    -> "FTSE 100"
 *
 * To způsobuje, že jeden a tentýž index je v rozbalovacím filtru rozsekaný na
 * desítky položek. Z 764 různých hodnot tak vznikne ~150–200 reálných indexů.
 *
 * Legitimní názvy indexů používají JEDNODUCHÉ mezery ("EURO STOXX 50",
 * "MSCI Switzerland 20"), takže split na dvojité mezeře je bezpečný a nic
 * nerozbije. Měnu, akumulaci/distribuci i zajištění uživatel filtruje
 * samostatnými filtry, proto je v názvu indexu nepotřebujeme.
 */

// Sjednocení známých variant (rozdílná velikost písmen / interpunkce) na jeden
// kanonický tvar. Klíč je vždy v lowercase normalizovaného názvu.
const CANONICAL_LABELS: Record<string, string> = {
  'nasdaq-100': 'Nasdaq 100',
  'nasdaq 100': 'Nasdaq 100',
  'stoxx europe 600': 'STOXX Europe 600',
  's&p500': 'S&P 500',
  's&p 500': 'S&P 500',
  'msci all country world': 'MSCI ACWI',
  'msci ac world': 'MSCI ACWI',
  'msci acwi': 'MSCI ACWI',
  'msci em': 'MSCI Emerging Markets',
  'msci emerging markets': 'MSCI Emerging Markets',
};

/**
 * Vrátí „čistý" základ názvu indexu bez metadat třídy akcií.
 */
export function normalizeIndexName(raw?: string | null): string {
  if (!raw) return '';
  // 1) odřízni vše za dvojitou (a více) mezerou = třída akcií
  let s = raw.split(/\s{2,}/)[0];
  // 2) odřízni i variantu s pomlčkou: "MSCI ACWI - EUR Hedged"
  s = s.replace(/\s+[-–]\s+(USD|EUR|GBP|CHF|JPY|hedged|unhedged|acc|dist).*$/i, '');
  // 3) Plné tvary ze zdroje (scraper od 20. 10. 2026 čte řádek „Index“ doslova): „S&P 500® (EUR Hedged)“,
  //    „MSCI All Country World (ACWI)“, „MSCI Emerging Markets Investable Market (IMI)“. Bez sjednocení je web
  //    nepoznal (žebříčky S&P 500/World/svět poznaly index jen u části fondů, SPYI ztratil „MSCI ACWI IMI“).
  //    Zajištění třídy se určuje z názvu fondu (detectHedging), ne z indexu → „(EUR Hedged)“ pryč.
  s = s.replace(/[®™]/g, '')
    .replace(/\s*\((?:[A-Z]{3}\s+)?hedged\)\s*$/i, '')
    .replace(/\s+Investable Market\s*\((?:ACWI\s+)?IMI\)\s*$/i, ' IMI')
    .replace(/\s*\([A-Z]{2,6}(?:\s+[A-Z]{2,6})?\)\s*$/, '');
  // 4) sjednoť bílé znaky
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Kanonický klíč pro porovnávání (case-insensitive, sjednocené aliasy).
 */
export function canonicalIndexKey(raw?: string | null): string {
  const norm = normalizeIndexName(raw).toLowerCase();
  return (CANONICAL_LABELS[norm] ?? norm).toLowerCase();
}

/**
 * Zobrazovaný (kanonický) název indexu.
 */
export function canonicalIndexLabel(raw?: string | null): string {
  const norm = normalizeIndexName(raw);
  return CANONICAL_LABELS[norm.toLowerCase()] ?? norm;
}

/**
 * Zařazení indexu pod poskytovatele (pro seskupení v rozbalovacím seznamu).
 */
export function getIndexProvider(label: string): string {
  const n = label.toLowerCase();
  if (n.startsWith('msci')) return 'MSCI';
  if (n.startsWith('ftse')) return 'FTSE';
  if (n.includes('s&p') || n.startsWith('sp ')) return 'S&P';
  if (n.includes('stoxx')) return 'STOXX';
  if (n.startsWith('nasdaq')) return 'Nasdaq';
  if (n.startsWith('bloomberg')) return 'Bloomberg';
  if (n.startsWith('solactive')) return 'Solactive';
  if (n.includes('iboxx') || n.includes('markit')) return 'iBoxx';
  if (n.startsWith('dax') || n.startsWith('tecdax') || n.startsWith('mdax')) return 'DAX';
  return 'Ostatní indexy';
}

// Nejhledanější indexy – pokud jsou v datech přítomné, zobrazí se v sekci
// „Populární" nahoře. Hodnoty odpovídají kanonickým labelům.
export const POPULAR_INDEXES: string[] = [
  'MSCI World',
  'S&P 500',
  'MSCI ACWI',
  'FTSE All-World',
  'MSCI Emerging Markets',
  'Nasdaq 100',
  'MSCI Europe',
  'STOXX Europe 600',
  'EURO STOXX 50',
  'MSCI USA',
];

export interface IndexOptionGroup {
  heading: string;
  options: string[];
  /** Počet fondů (bez pákových) u každé volby – stejné pořadí jako `options`. */
  counts?: number[];
  /** Volitelný popisek volby (např. které indexy skupina obsahuje). */
  notes?: (string | null)[];
}

/* ─────────────────────────────────────────────────────────────────────────
   ČIŠTĚNÍ NABÍDKY INDEXŮ PRO SROVNÁVAČ (revize 18. 10. 2026)

   Problém: nabídka měla 537 položek se smetím („stoxx 50 Options“, „iShares“, „BEL“,
   „U3O8.M“, „WisdomTree Te“, „Government Bond“) a duplicitami („MSCI World ex USA“ vs
   „ex-USA“, „MSCI EUROPE“ vs „MSCI Europe“). Navíc 3 083 z 5 124 fondů má `index_name`
   PRÁZDNÝ – např. SPYI (MSCI ACWI IMI) tak ve filtru vůbec nebyl.

   Řešení (pravidlo č. 1 – raději fond bez indexu než se špatným):
   1) klíč indexu = normalizovaný název bez ®/™, „ex-“ = „ex “, bez koncového „Swap/SF/Index“,
      bez rozdílu velikosti písmen; zobrazí se nejčastější varianta zápisu,
   2) do nabídky jen indexy známých poskytovatelů (MSCI, FTSE, S&P…) s aspoň 2 fondy,
   3) fond bez `index_name` dostane index z NÁZVU jen tehdy, když název KONČÍ přesně
      známým indexem („Vanguard FTSE All-World“ → FTSE All-World). „iShares MSCI World ESG
      Screened“ tak NEdostane „MSCI World“ (končí „ESG Screened“, ne „MSCI World“).
   ───────────────────────────────────────────────────────────────────────── */

/** Indexy, které má smysl poznat z názvu fondu, i když v datech zatím nemají ≥ 2 fondy s `index_name`. */
const ZNAME_INDEXY = [
  'MSCI ACWI IMI', 'MSCI ACWI', 'FTSE All-World', 'MSCI World', 'S&P 500', 'Nasdaq 100',
  'MSCI Emerging Markets IMI', 'MSCI Emerging Markets', 'FTSE Emerging Markets', 'FTSE Developed World',
  'MSCI Europe', 'STOXX Europe 600', 'EURO STOXX 50', 'MSCI USA', 'MSCI EMU', 'MSCI Japan',
  'MSCI World Small Cap', 'MSCI USA Small Cap', 'MSCI Europe Small Cap', 'MSCI World Momentum',
  'MSCI World Quality', 'MSCI World Value', 'MSCI World Minimum Volatility', 'MSCI World ex USA',
  'FTSE Developed Europe', 'FTSE Japan', 'FTSE North America', 'FTSE 100', 'FTSE 250', 'DAX',
  'MSCI China', 'MSCI India', 'MSCI Korea', 'MSCI Taiwan', 'MSCI Brazil', 'MSCI Pacific ex Japan',
  'S&P 500 Equal Weight', 'Russell 2000', 'Dow Jones Industrial Average',
];

/** Aliasy (klíč lowercase → kanonický zápis). Doplněk k CANONICAL_LABELS. */
const ALIASY: Record<string, string> = {
  ...CANONICAL_LABELS,
  'msci all country world imi': 'MSCI ACWI IMI',
  'msci ac world imi': 'MSCI ACWI IMI',
  'msci all country world investable market': 'MSCI ACWI IMI',
  'msci acwi investable market': 'MSCI ACWI IMI',
  'msci acwi imi': 'MSCI ACWI IMI',
  'msci emerging': 'MSCI Emerging Markets',
  'msci em imi': 'MSCI Emerging Markets IMI',
  'msci emerging markets imi': 'MSCI Emerging Markets IMI',
  'ftse all world': 'FTSE All-World',
  'ftse all-world': 'FTSE All-World',
  'nasdaq-100': 'Nasdaq 100',
  'nasdaq100': 'Nasdaq 100',
  'euro stoxx 50': 'EURO STOXX 50',
  'stoxx europe 50': 'STOXX Europe 50',
  'msci europe': 'MSCI Europe',
  'msci world': 'MSCI World',
  'msci usa': 'MSCI USA',
  'ftse developed': 'FTSE Developed World',
  'ftse developed world': 'FTSE Developed World',
};

/** Index musí začínat jménem poskytovatele indexů – jinak je to smetí („iShares“, „Government Bond“, „U3O8.M“). */
const POSKYTOVATEL_INDEXU = /^(msci|s&p|ftse|stoxx|euro stoxx|euro istoxx|istoxx|nasdaq|bloomberg|iboxx|solactive|markit|ice|j\.?p\.? ?morgan|dow jones|russell|dax|mdax|tecdax|sdax|cac|aex|ibex|smi|spi|topix|nikkei|hang seng|csi|morningstar|indxx|marketvector|mvis)\b/i;

/** Čistý zápis indexu k zobrazení: bez metadat třídy, ®/™, „ex-“ = „ex “, bez koncového „Swap/SF/Index/NR/TR/II“. */
function cistyZapis(raw?: string | null): string {
  let s = normalizeIndexName(raw).replace(/[®™]/g, '').replace(/\bex-/gi, 'ex ')
    // „MSCI All Country World X“ = „MSCI AC World X“ = „MSCI ACWI X“ (jeden index, tři zápisy)
    .replace(/\bMSCI (All Country World|AC World)\b/gi, 'MSCI ACWI');
  // „Xtrackers“ na konci = jméno emitenta přilepené ke kódu indexu (SCWX: „MSCI AC World Xtrackers“), ne jiný index.
  for (let i = 0; i < 3; i++) s = s.replace(/\s+(swap|sf|index|nr|tr|ii|net total return|net return|total return|xtrackers)$/i, '');
  return s.replace(/\s+/g, ' ').trim();
}

/** Klíč indexu (lowercase, s aliasy) – jeden index = jeden klíč bez ohledu na zápis. */
export function klicIndexu(raw?: string | null): string {
  const k = cistyZapis(raw).toLowerCase();
  return (ALIASY[k] ?? k).toLowerCase();
}

/** Jednoslovné indexy, které jsou skutečné (jinak je jedno slovo useknutý název – „Stoxx“, „STOXX“). */
const JEDNOSLOVNE = new Set(['dax', 'mdax', 'sdax', 'tecdax', 'smi', 'topix', 'aex']);

/** Je klíč indexu dost čistý pro nabídku? (poskytovatel na začátku, nic useknutého). */
export function jeCistyIndex(klic: string): boolean {
  if (!klic || !POSKYTOVATEL_INDEXU.test(klic)) return false;
  const slova = klic.split(' ');
  if (slova.length === 1) return JEDNOSLOVNE.has(klic);
  // „Bloomberg U“ (z „U.S.“) = scraper název useknul na „.“ (další případy chytá jeUseknutyIndex)
  return slova[slova.length - 1].length > 1;
}

/**
 * Je `index_name` useknutý? Scraper ho ořezává na „.“ a „+“ („FTSE All-World Ex-U“ z „Ex-U.S.“,
 * „Bloomberg 10“ ze tří různých „10+ Year …“ indexů). Pozná se tak, že v názvu fondu po něm
 * pokračuje písmeno, číslice, tečka nebo plus.
 */
export function jeUseknutyIndex(indexName: string | null | undefined, nazev: string | null | undefined): boolean {
  const s = normalizeIndexName(indexName).toLowerCase();
  const n = (nazev ?? '').toLowerCase();
  if (!s || !n) return false;
  const i = n.indexOf(s);
  return i >= 0 && /[a-z0-9.+]/.test(n.charAt(i + s.length));
}

/** Základ názvu fondu pro hledání indexu: před „UCITS/ETF“, bez závorek, měny, „Swap“, „1C“, „II“… */
function zakladNazvu(nazev: string): string {
  let s = nazev.split(/\b(UCITS|ETF|ETC|ETN|ETP)\b/i)[0].replace(/\(.*?\)/g, ' ');
  for (let i = 0; i < 5; i++) {
    s = s.trim().replace(/\s+(swap|sf|pea|daily|1c|1d|2c|c|d|ii|iii|acc|dist|usd|eur|gbp|chf|jpy|hedged|unhedged|-)$/i, '');
  }
  return s.replace(/\s+/g, ' ').trim();
}

/** Index z názvu fondu: jen když název KONČÍ přesně známým indexem (nejdelší shoda vyhrává). */
export function indexZNazvu(nazev: string | null | undefined, zname: Set<string>): string | null {
  return konceNazvu(nazev).find((k) => zname.has(k)) ?? null;
}

/** Klíče všech „konců“ základu názvu (posledních 1–8 slov) – index musí být na konci názvu. */
function konceNazvu(nazev: string | null | undefined): string[] {
  const slova = zakladNazvu(nazev ?? '').split(' ').filter(Boolean);
  const out: string[] = [];
  for (let k = Math.min(8, slova.length); k >= 1; k--) out.push(klicIndexu(slova.slice(-k).join(' ')));
  return out;
}

/**
 * Klíč indexu fondu z `index_name` – jen když je čistý, neuseknutý a SEDÍ s názvem fondu, jinak ''.
 * `index_name` je ve zdroji často jen začátek skutečného indexu: „S&P 500“ mají i fondy na VIX futures,
 * Buffer, Top 20 nebo Scored & Screened, „MSCI Europe“ i Energy Sector a Small Cap (18. 10. 2026).
 * Proto: když název fond obsahuje text indexu, musí jím název KONČIT („iShares Core S&P 500“ ano,
 * „Amundi S&P 500 VIX Futures“ ne). Když ho neobsahuje („iShares MSCI ACWI“ × MSCI All Country World),
 * nejde to ověřit a bere se údaj ze zdroje.
 */
/** Americké indexy – fond na ně musí mít zaměření „United States“ („KraneShares China S&P 500“ je S&P China 500). */
const AMERICKE = new Set(['s&p 500', 'nasdaq 100', 'msci usa', 'russell 2000', 'dow jones industrial average']);

type FondIndexu = { index_name?: string | null; name?: string | null; investment_focus?: string | null };

function klicZDat(f: FondIndexu): string {
  const k = klicIndexu(f.index_name);
  if (!k || !jeCistyIndex(k) || jeUseknutyIndex(f.index_name, f.name)) return '';
  if (AMERICKE.has(k) && f.investment_focus && !/united states/i.test(f.investment_focus)) return '';
  const text = cistyZapis(f.index_name).toLowerCase();
  const nazev = (f.name ?? '').replace(/[®™]/g, '').replace(/\bex-/gi, 'ex ').toLowerCase();
  if (!nazev.includes(text)) return k;
  return konceNazvu(f.name).includes(k) ? k : '';
}

const ZNAME_KLICE = new Set(ZNAME_INDEXY.map((l) => klicIndexu(l)));
const ZNAME_LABEL = new Map(ZNAME_INDEXY.map((l) => [klicIndexu(l), l]));

/**
 * Sledovaný index jednoho fondu k zobrazení (porovnání fondů): čistý `index_name`, jinak index
 * poznaný z názvu (jen ze seznamu známých indexů), jinak null → „—“.
 */
export function indexFonduLabel(f: FondIndexu): string | null {
  const k = klicZDat(f);
  if (k) return ZNAME_LABEL.get(k) ?? ALIASY[k] ?? cistyZapis(f.index_name);
  const zn = indexZNazvu(f.name, ZNAME_KLICE);
  return zn && !(AMERICKE.has(zn) && f.investment_focus && !/united states/i.test(f.investment_focus)) ? ZNAME_LABEL.get(zn) ?? null : null;
}

/**
 * Indexy pro srovnávač: index každého fondu (label nebo '') + nabídka s počty.
 * Počty v nabídce jsou bez pákových produktů (ty jsou ve výchozím stavu skryté) – sedí s tím, co uživatel uvidí.
 */
export function sestavIndexy(fondy: (FondIndexu & { is_leveraged?: boolean | null })[]): {
  indexy: string[];
  skupiny: IndexOptionGroup[];
} {
  // 1) klíč z index_name (jen čisté), varianty zápisu pro výběr zobrazovaného labelu
  const klice = fondy.map(klicZDat);
  const varianty = new Map<string, Map<string, number>>();
  klice.forEach((k, i) => {
    if (!k) return;
    const label = cistyZapis(fondy[i].index_name);
    const m = varianty.get(k) ?? new Map<string, number>();
    m.set(label, (m.get(label) ?? 0) + 1);
    varianty.set(k, m);
  });
  // 2) známé indexy pro odvození z názvu = curated + z dat s ≥ 2 fondy
  const pocetKlice = new Map<string, number>();
  for (const k of klice) if (k) pocetKlice.set(k, (pocetKlice.get(k) ?? 0) + 1);
  const zname = new Set<string>([...ZNAME_KLICE, ...[...pocetKlice].filter(([, n]) => n >= 2).map(([k]) => k)]);
  const finalni = klice.map((k, i) => {
    if (k) return k;
    const zn = indexZNazvu(fondy[i].name, zname);
    return zn && !(AMERICKE.has(zn) && fondy[i].investment_focus && !/united states/i.test(fondy[i].investment_focus!)) ? zn : '';
  });

  // 3) zobrazovaný label pro klíč: alias/curated, jinak nejčastější varianta zápisu
  const labelKlice = (k: string): string => {
    if (ZNAME_LABEL.has(k)) return ZNAME_LABEL.get(k)!;
    if (ALIASY[k]) return ALIASY[k];
    const m = varianty.get(k);
    if (!m) return k;
    return [...m].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0];
  };
  const indexy = finalni.map((k) => (k ? labelKlice(k) : ''));

  // 4) nabídka: indexy s ≥ 2 fondy bez páky
  const pocty = new Map<string, number>();
  indexy.forEach((l, i) => { if (l && !fondy[i].is_leveraged) pocty.set(l, (pocty.get(l) ?? 0) + 1); });
  const vNabidce = [...pocty].filter(([, n]) => n >= 2);
  const popularni = POPULAR_INDEXES.filter((p) => pocty.has(p));
  const popSet = new Set(popularni);
  const poPoskytovateli = new Map<string, [string, number][]>();
  for (const [l, n] of vNabidce) {
    if (popSet.has(l)) continue;
    const p = getIndexProvider(l);
    poPoskytovateli.set(p, [...(poPoskytovateli.get(p) ?? []), [l, n]]);
  }
  const skupiny: IndexOptionGroup[] = [];
  if (popularni.length) skupiny.push({ heading: 'Populární indexy', options: popularni, counts: popularni.map((p) => pocty.get(p)!) });
  [...poPoskytovateli]
    .map(([heading, items]) => ({ heading, items: items.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])), celkem: items.reduce((s, [, n]) => s + n, 0) }))
    .sort((a, b) => (a.heading === 'Ostatní indexy' ? 1 : b.heading === 'Ostatní indexy' ? -1 : b.celkem - a.celkem))
    .forEach(({ heading, items }) => skupiny.push({ heading, options: items.map(([l]) => l), counts: items.map(([, n]) => n) }));
  return { indexy, skupiny };
}

/**
 * Z pole ETF sestaví seskupené možnosti pro filtr indexu:
 *   - sekce „Populární" (nejčastější indexy, pokud existují)
 *   - sekce po poskytovatelích (MSCI, FTSE, S&P, …), seřazené dle četnosti
 *
 * Vrací i plochý seznam `flat` (kanonické labely) pro případné jiné použití.
 */
export function buildIndexOptions(etfs: { index_name?: string | null }[]): {
  groups: IndexOptionGroup[];
  flat: string[];
} {
  // kanonický klíč -> { label, count }
  const byKey = new Map<string, { label: string; count: number }>();
  for (const etf of etfs) {
    const key = canonicalIndexKey(etf.index_name);
    if (!key) continue;
    const label = canonicalIndexLabel(etf.index_name);
    const existing = byKey.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      byKey.set(key, { label, count: 1 });
    }
  }

  const all = Array.from(byKey.values());
  const flat = all.map(o => o.label).sort((a, b) => a.localeCompare(b));

  // Populární – jen ty, které jsou reálně v datech
  const present = new Set(all.map(o => o.label));
  const popular = POPULAR_INDEXES.filter(p => present.has(p));
  const popularSet = new Set(popular);

  // Zbytek seskupit dle poskytovatele
  const providerMap = new Map<string, { label: string; count: number }[]>();
  for (const o of all) {
    if (popularSet.has(o.label)) continue;
    const provider = getIndexProvider(o.label);
    const arr = providerMap.get(provider) ?? [];
    arr.push(o);
    providerMap.set(provider, arr);
  }

  // Poskytovatele seřadit dle celkové četnosti (nejčetnější první),
  // „Ostatní indexy" vždy na konec.
  const providerGroups: IndexOptionGroup[] = Array.from(providerMap.entries())
    .map(([heading, items]) => ({
      heading,
      options: items.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).map(i => i.label),
      _total: items.reduce((s, i) => s + i.count, 0),
    }))
    .sort((a, b) => {
      if (a.heading === 'Ostatní indexy') return 1;
      if (b.heading === 'Ostatní indexy') return -1;
      return b._total - a._total;
    })
    .map(({ heading, options }) => ({ heading, options }));

  const groups: IndexOptionGroup[] = [];
  if (popular.length > 0) {
    groups.push({ heading: 'Populární indexy', options: popular });
  }
  groups.push(...providerGroups);

  return { groups, flat };
}

/**
 * České hledání (18. 10. 2026). Revize homepage: hledání v hero (hlavní akce stránky) vracelo na
 * „svět“, „zlato“, „dluhopisy“, „dividendové“ NULA výsledků – názvy fondů jsou anglicky a začátečník
 * ze Seznamu píše česky. Tady je:
 *  1) slovník CZ → anglické části názvů fondů (rozšíří hledání v názvech),
 *  2) přiřazení dotazu k žebříčkům (kategoriím) – našeptávač je nabídne nad fondy, takže hledání
 *     nikdy nekončí slepou uličkou.
 * Ověření: scripts/overeni-hledani-cz.mjs (dotazy, které MUSÍ vrátit žebříček / fondy).
 */

/** Malá písmena bez diakritiky. */
export const bezDiakritiky = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

/** Kmen slova pro shodu českých tvarů (dluhopisy/dluhopisové, Evropa/evropské). */
const kmen = (slovo: string) => (slovo.length <= 4 ? slovo : slovo.slice(0, Math.max(4, slovo.length - 2)));

/* Doplňková slova k žebříčkům (název kategorie se prohledává vždy). Bez diakritiky. */
const SYNONYMA_KATEGORII: Record<string, string[]> = {
  'nejlepsi-celosvetove-etf': ['svet', 'cely svet', 'globalni', 'world', 'all-world', 'all world', 'acwi'],
  'nejlepsi-msci-world-etf': ['msci world', 'rozvinute trhy', 'vyspele trhy'],
  'nejlepsi-sp500-etf': ['s&p', 'sp500', 'sp 500', 's&p 500', 'snp', 'snp 500', 'snp500'],
  'nejlepsi-americke-etf': ['usa', 'amerika', 'spojene staty'],
  'nejlepsi-evropske-etf': ['evropa', 'europe', 'euro stoxx'],
  'nejlepsi-emerging-markets-etf': ['rozvijejici', 'rozvijejici se trhy', 'emerging', 'em'],
  'nejlepsi-zlato-etf': ['gold', 'zlate'],
  'nejlepsi-stribro-etf': ['silver'],
  'nejlepsi-dluhopisove-etf': ['dluhopisy', 'bond', 'obligace'],
  'nejlepsi-vladni-dluhopisy-etf': ['statni dluhopisy', 'vladni', 'statni', 'treasury', 'government'],
  'nejlepsi-korporatni-dluhopisy-etf': ['firemni dluhopisy', 'korporatni', 'corporate'],
  'nejlepsi-dividendove-etf': ['dividend', 'dividendy'],
  'nejlepsi-technologicke-etf': ['technologie', 'tech', 'it', 'polovodice', 'cipy', 'semiconductor'],
  'nejlepsi-healthcare-etf': ['zdravotnictvi', 'zdravi', 'farmacie', 'health'],
  'nejlepsi-realitni-etf': ['nemovitosti', 'reality', 'reit'],
  'nejlepsi-bitcoin-etf': ['krypto', 'kryptomeny', 'crypto', 'btc'],
  'nejlepsi-japonske-etf': ['japonsko', 'japan'],
  'nejlepsi-cinske-etf': ['cina', 'china'],
  'nejlepsi-indicke-etf': ['indie', 'india'],
  'nejlepsi-small-cap-etf': ['male firmy', 'male spolecnosti', 'malé firmy'],
  'nejlepsi-energeticke-etf': ['energie', 'energy'],
  'nejlepsi-financni-etf': ['banky', 'finance', 'financni sektor'],
  'nejlepsi-defense-etf': ['obrana', 'obranny', 'zbrojni', 'zbrojovky', 'defense', 'defence'],
  'nejlepsi-ai-etf': ['umela inteligence', 'artificial intelligence'],
  'nejlepsi-nasdaq-etf': ['nasdaq 100'],
  'nejlevnejsi-etf': ['levne', 'nizky poplatek', 'ter'],
  'nejlepsi-akumulacni-etf': ['acc', 'akumulace'],
  'nejlepsi-distribucni-etf': ['dist', 'vyplata dividend'],
  'nejlepsi-ropa-etf': ['oil'],
  'nejlepsi-obnovitelne-zdroje-etf': ['solar', 'zelena energie', 'clean energy'],
  'nejlepsi-robotika-etf': ['robot', 'roboti'],
  'nejlepsi-kyberbezpecnost-etf': ['cyber', 'kyber'],
  'nejlepsi-asijsko-pacificke-etf': ['asie', 'asia', 'pacifik'],
};

/* CZ → anglické části názvů fondů (justETF názvy). Klíč = kmen bez diakritiky. */
const NAZVY: { kmeny: string[]; termy: string[] }[] = [
  // „Celý svět“ = vyspělé i rozvíjející se trhy (jako na homepage); MSCI World je „vyspělé trhy“, ne celý svět.
  { kmeny: ['svet', 'celosvet', 'globaln', 'all world', 'allworld', 'all-world'], termy: ['All-World', 'ACWI', 'All Country World'] },
  // Kolo 5 (19. 10. 2026): „ACWI“ nenašel IUSQ (název „MSCI All Country World“) ani SPYI („All Country World
  // Investable Market“), „ACWI IMI“ jen sektorový fond. Zkratka indexu ≠ text názvu fondu → aliasy. IMI napřed
  // (přesnější; „acwi“ ho zahrne také – IMI je celý svět i s malými firmami, patří k výsledkům „ACWI“).
  { kmeny: ['acwi imi', 'acwi investable', 'all country world investable', 'investable market'], termy: ['All Country World Investable Market', 'MSCI ACWI IMI', 'ACWI IMI', 'Investable Market'] },
  { kmeny: ['acwi', 'ac world', 'all country'], termy: ['ACWI', 'All Country World', 'AC World', 'MSCI ACWI'] },
  { kmeny: ['zlat'], termy: ['Gold'] },
  { kmeny: ['stribr'], termy: ['Silver'] },
  { kmeny: ['dluhopis', 'obligac'], termy: ['Bond'] },
  { kmeny: ['statni', 'vladni'], termy: ['Government', 'Treasury', 'Govt'] },
  { kmeny: ['dividend'], termy: ['Dividend'] },
  { kmeny: ['evrop'], termy: ['Europe', 'STOXX'] },
  { kmeny: ['americ', 'usa'], termy: ['USA', 'S&P 500'] },
  { kmeny: ['rozvij'], termy: ['Emerging'] },
  { kmeny: ['technolog'], termy: ['Technology', 'Information Tech'] },
  { kmeny: ['polovodic', 'cipy', 'cip'], termy: ['Semiconductor'] },
  { kmeny: ['nemovit', 'realit'], termy: ['Real Estate', 'Property'] },
  { kmeny: ['japon'], termy: ['Japan'] },
  { kmeny: ['cina', 'cinsk'], termy: ['China'] },
  { kmeny: ['indie', 'indick'], termy: ['India'] },
  { kmeny: ['kore'], termy: ['Korea'] },
  { kmeny: ['zdravot'], termy: ['Health'] },
  { kmeny: ['energ'], termy: ['Energy'] },
  { kmeny: ['robot'], termy: ['Robot'] },
  { kmeny: ['obran', 'zbroj'], termy: ['Defence', 'Defense'] },
  { kmeny: ['umela inteligence'], termy: ['Artificial Intelligence'] },
  { kmeny: ['ropa', 'ropn'], termy: ['Oil'] },
  { kmeny: ['krypto', 'bitcoin'], termy: ['Bitcoin', 'Crypto'] },
  { kmeny: ['sp500', 's&p500', 'sp 500', 'snp 500', 'snp500', 's and p'], termy: ['S&P 500'] },
  // „nasdaq“ = Nasdaq-100 (index fondu se pak shoduje přesně; sektorové Nasdaq indexy jdou dolů).
  { kmeny: ['nasdaq'], termy: ['Nasdaq-100', 'Nasdaq 100'] },
  // Překlepy v názvech emitentů (test s uživateli: „vangard“ nenašel nic).
  { kmeny: ['vangard', 'vanguar', 'vangaurd'], termy: ['Vanguard'] },
  { kmeny: ['ishare', 'i shares'], termy: ['iShares'] },
  { kmeny: ['xtracker', 'extracker'], termy: ['Xtrackers'] },
  { kmeny: ['amundy'], termy: ['Amundi'] },
];

/** Anglické části názvů pro rozšíření hledání (prázdné, když dotaz není česky známý výraz). */
export function anglickeTermy(dotaz: string): string[] {
  const q = bezDiakritiky(dotaz);
  if (q.length < 2) return [];
  const out = new Set<string>();
  // Celý dotaz i jednotlivá slova („akcie evropa“ → evropa): slovo začíná kmenem („zlato“ ~ „zlat“),
  // nebo kmen slova začíná kmenem slovníku.
  const casti = [q, ...q.split(/\s+/).filter((w) => w.length >= 3)];
  for (const { kmeny, termy } of NAZVY) {
    if (casti.some((c) => kmeny.some((k) => c.startsWith(k) || (c.length >= 4 && k.startsWith(kmen(c)))))) termy.forEach((t) => out.add(t));
  }
  return [...out];
}

/* Úzké varianty (sektory, ESG, opční „income“, páka) – při hledání patří za široké fondy:
   „sp 500“ nemá nahoře vrátit IT sektor ani zajištěné „Scored & Screened“. */
const UZKA = /(esg|sri|screened|climate|paris|\bpab\b|sector|information tech|premium income|covered call|leveraged|\bshort\b|daily|equal weight|\(ch\)|\bex[- ]|miners|producers)/i;

/** Text obsahuje výraz jako CELÁ slova („gold“ v „Physical Gold“ ano, v „Goldman Sachs“ ne). */
const celaSlova = (text: string, vyraz: string) => {
  if (!vyraz) return false;
  const esc = vyraz.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${esc}($|[^a-z0-9])`).test(text);
};
/** Porovnávací tvar názvu indexu: malá písmena bez diakritiky a bez mezer/interpunkce („S&P 500“ = „sp500“). */
const tvarIndexu = (s: string) => bezDiakritiky(s).replace(/&/g, '').replace(/[^a-z0-9]/g, '');

/**
 * Relevance fondu pro hledaný výraz – JEDNA logika pro našeptávač (/api/etf/search) i srovnávač.
 * Revize kola 4 (18. 10. 2026): „All-World“ dávalo VWCE (55 mld. €) na 43. místo ze 70 – nahoře byly UBS ACWI
 * třídy, protože shoda přes český slovník (ACWI) měla víc bodů než přímá shoda názvu; „gold“ vracel Goldman Sachs.
 *   4    = přesná shoda ISIN/tickeru
 *   3    = začátek tickeru (u obecného výrazu jen 0,9 – jinak by „sp500“ vyhrály švýcarské tickery SP500S/E/H)
 *   2    = název výrazem začíná, 1,6 = obsahuje ho jako celá slova, 1,4x = celá slova přes český výraz /
 *          variantu zápisu (`termy`, dřívější = přesnější), 0,6 / 0,5 = jen uvnitř slova („gold“ v „Goldman“)
 *   +1   = sledovaný index fondu JE hledaný výraz („msci world“ = MSCI World), +0,5 = index ho obsahuje
 *   −0,5 = úzká varianta (sektor, ESG, opce, páka…), −0,3 = měnově zajištěná třída (nezajištěné napřed)
 * Při shodě skóre rozhoduje volající (velikost fondu). 0 = neodpovídá. Strop 2,9 – 3 a 4 jsou jen tickery.
 * `term` = dotaz malými písmeny (oříznutý), `tickers` malými písmeny.
 */
export function skoreHledani(
  term: string, termy: string[],
  f: { isin: string; name: string; tickers: string[]; index?: string | null; zajisteno?: boolean },
): number {
  const isin = f.isin.toLowerCase();
  const name = f.name.toLowerCase();
  if (isin === term || f.tickers.includes(term)) return 4;
  if (f.tickers.some((t) => t.startsWith(term))) return termy.length ? 0.9 : 3;
  const termyL = termy.map((t) => t.toLowerCase());
  let s = 0;
  // „Začíná“ jen jako celé slovo – „gold“ nesmí vyhrát u „Goldman Sachs…“ (ten má jen 0,8 = začátek slova).
  if (name.startsWith(term) && celaSlova(name, term)) s = 2;
  else if (celaSlova(name, term)) s = 1.6;
  else {
    const i = termyL.findIndex((t) => celaSlova(name, t));
    // Slovníkový výraz jako celé slovo = stejně silná shoda jako dotaz sám (21. 10. 2026): „ACWI“ ↔ „All Country
    // World“ je totéž – dřív 1,4 < 1,6 a malé fondy se zkratkou v názvu (UBS, Invesco) vytlačily z 8 výsledků
    // největší IUSQ (31 mld. €). Při shodě skóre rozhoduje velikost fondu.
    if (i >= 0) s = 1.6 - i / 1000;
    else if (name.startsWith(term)) s = 0.8;
    else if (name.includes(term)) s = 0.6;
    else if (termyL.some((t) => name.includes(t))) s = 0.5;
  }
  // Shoda jen v indexu (název fondu ho nemá – SPYI: index MSCI ACWI IMI, v názvu „Investable Market“).
  const shodaIndexu = !!f.index && [term, ...termyL].some((v) => tvarIndexu(v) === tvarIndexu(f.index!));
  if (s === 0 && shodaIndexu) s = 1;
  if (s === 0) return 0;
  if (f.index) {
    const idx = f.index.toLowerCase();
    const varianty = [term, ...termyL];
    if (varianty.some((v) => tvarIndexu(v) === tvarIndexu(idx))) s += 1;
    // „Obsahuje“ jen pro dotaz sám (nasdaq → Nasdaq-100), ne pro slovníkové výrazy – „dluhopisy“ → Bond
    // by jinak zvýhodnil každý fond, jehož index má v názvu „Bond“.
    else if (celaSlova(idx, term)) s += 0.5;
  }
  const dividendovy = /divid/.test(term) || termy.some((t) => /dividend/i.test(t));
  if (UZKA.test(name) || (!dividendovy && /dividend/i.test(name))) s -= 0.5;
  if (f.zajisteno) s -= 0.3;
  return Math.min(2.9, Math.max(0.05, s));
}

/** Dotaz začátečníka („jaké etf koupit“, „kam investovat“, „spořit 2000 měsíčně“) → průvodce výběrem. */
export function jeDotazZacatecnika(dotaz: string): boolean {
  const q = bezDiakritiky(dotaz);
  return /\b(jak[aey]?|kter[aeyi]\w*|koupit|zacit|zacatecn\w*|vybrat|vyber|doporuc\w*|co koupit|do ceho|nejlepsi|kam|bezpecn\w*|spor\w*|mesicne|investovat|investice|pro deti)\b/.test(q);
}

export interface KategorieNavrh { href: string; label: string; typ?: 'zebricek' | 'pruvodce' }

/**
 * Žebříčky, které odpovídají dotazu (max `limit`). `kategorie` = slug → titulek (z categoryConfigs).
 * Tickery a ISINy (VWCE, IE00…) žebříčky nevrací – nezačínají žádným slovem z názvů/synonym.
 */
export function navrhniKategorie(dotaz: string, kategorie: Record<string, string>, limit = 3): KategorieNavrh[] {
  const q = bezDiakritiky(dotaz);
  if (q.length < 2) return [];
  // Dotaz začátečníka („jaké etf koupit“, „kterým začít“) → průvodce výběrem, ne nula výsledků
  // (test s uživateli 18. 10. 2026).
  const pruvodce: KategorieNavrh[] = jeDotazZacatecnika(dotaz)
    ? [{ href: '/vyber-etf', label: 'Nevíte, který ETF koupit? Pomůžeme vybrat (4 otázky, 30 s)', typ: 'pruvodce' },
       { href: '/jak-zacit', label: 'Jak začít investovat – průvodce krok za krokem', typ: 'pruvodce' }] : [];
  const qk = kmen(q);
  const vysledky: { slug: string; label: string; skore: number }[] = [];
  for (const [slug, titulek] of Object.entries(kategorie)) {
    const slovaTitulku = bezDiakritiky(titulek).split(/[^a-z0-9&-]+/).filter((w) => w && !['nejlepsi', 'etf', 'na'].includes(w));
    const klice = [...slovaTitulku, ...(SYNONYMA_KATEGORII[slug] ?? [])];
    let skore = 0;
    for (const k of klice) {
      if (k === q) skore = Math.max(skore, 3);
      else if (q.length >= 3 && k.startsWith(qk)) skore = Math.max(skore, 2);
      // Víceslovný dotaz obsahuje klíč jako CELÉ slovo („akcie evropa“ ~ evropa; ale „evropa“ ≠ „ropa“).
      else if (k.length >= 4 && ` ${q} `.includes(` ${k} `)) skore = Math.max(skore, 1);
    }
    if (skore > 0) vysledky.push({ slug, label: titulek, skore });
  }
  return [...pruvodce, ...vysledky
    // Při shodě skóre obecnější (kratší) žebříček napřed: „dluhopisy“ → Dluhopisové ETF před vládními.
    .sort((a, b) => b.skore - a.skore || a.label.length - b.label.length)
    .slice(0, limit)
    .map((v) => ({ href: `/nejlepsi-etf/${v.slug}`, label: v.label, typ: 'zebricek' as const }))];
}

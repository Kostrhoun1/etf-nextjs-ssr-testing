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
const UZKA = /(esg|sri|screened|climate|paris|\bpab\b|sector|information tech|premium income|covered call|leveraged|\bshort\b|daily|equal weight|\(ch\))/i;

/**
 * Relevance fondu pro hledaný výraz – JEDNA logika pro našeptávač (/api/etf/search) i srovnávač
 * (revize 18. 10. 2026: srovnávač na „sp500“ ukázal nahoře zajištěné UBS fondy místo SXR8/CSPX).
 *   4 = přesná shoda ISIN/tickeru, 3 = začátek tickeru, 2 = název začíná výrazem, 1 = název ho
 *   obsahuje, 1,0x = shoda přes český výraz / variantu zápisu (`termy` z anglickeTermy, dřívější =
 *   přesnější); úzké varianty −0,5. 0 = neodpovídá.
 * `term` = dotaz malými písmeny (oříznutý), `tickers` malými písmeny.
 */
export function skoreHledani(term: string, termy: string[], f: { isin: string; name: string; tickers: string[] }): number {
  const isin = f.isin.toLowerCase();
  const name = f.name.toLowerCase();
  if (isin === term || f.tickers.includes(term)) return 4;
  if (f.tickers.some((t) => t.startsWith(term))) return 3;
  const dividendovy = /divid/.test(term) || termy.some((t) => /dividend/i.test(t));
  const uzka = UZKA.test(name) || (!dividendovy && /(high dividend|dividend yield|dividend)/i.test(name)) ? 0.5 : 0;
  if (name.startsWith(term)) return 2 - uzka;
  if (name.includes(term)) return 1 - uzka;
  const i = termy.findIndex((t) => name.includes(t.toLowerCase()));
  if (i >= 0) return 1 + (termy.length - i) / 100 - uzka;
  return 0;
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

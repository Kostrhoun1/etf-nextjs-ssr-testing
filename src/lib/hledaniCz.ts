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
  'nejlepsi-celosvetove-etf': ['svet', 'cely svet', 'globalni', 'world', 'all-world', 'acwi'],
  'nejlepsi-msci-world-etf': ['msci world', 'rozvinute trhy', 'vyspele trhy'],
  'nejlepsi-sp500-etf': ['s&p', 'sp500', 'sp 500', 's&p 500'],
  'nejlepsi-americke-etf': ['usa', 'amerika', 'spojene staty'],
  'nejlepsi-evropske-etf': ['evropa', 'europe', 'euro stoxx'],
  'nejlepsi-emerging-markets-etf': ['rozvijejici', 'rozvijejici se trhy', 'emerging', 'em'],
  'nejlepsi-zlato-etf': ['gold', 'zlate'],
  'nejlepsi-stribro-etf': ['silver'],
  'nejlepsi-dluhopisove-etf': ['bond', 'obligace'],
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
  { kmeny: ['svet', 'celosvet', 'globaln'], termy: ['All-World', 'MSCI World', 'ACWI', 'Global'] },
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
  { kmeny: ['sp500', 's&p500', 'sp 500'], termy: ['S&P 500'] },
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

export interface KategorieNavrh { href: string; label: string }

/**
 * Žebříčky, které odpovídají dotazu (max `limit`). `kategorie` = slug → titulek (z categoryConfigs).
 * Tickery a ISINy (VWCE, IE00…) žebříčky nevrací – nezačínají žádným slovem z názvů/synonym.
 */
export function navrhniKategorie(dotaz: string, kategorie: Record<string, string>, limit = 3): KategorieNavrh[] {
  const q = bezDiakritiky(dotaz);
  if (q.length < 2) return [];
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
  return vysledky
    .sort((a, b) => b.skore - a.skore)
    .slice(0, limit)
    .map((v) => ({ href: `/nejlepsi-etf/${v.slug}`, label: v.label }));
}

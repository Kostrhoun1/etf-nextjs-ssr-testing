/**
 * Krátké názvy žebříčků a vzájemné odkazy mezi příbuznými žebříčky (SEO audit 6b, 21. 10. 2026).
 *
 * Proč: ~25 žebříčků mělo jediný vnitřní odkaz (z rozcestníku /zebricky) a „Největší ETF 2026“ jen dva.
 * Odkazy jsou ručně vybrané podle obsahu (stejný trh, stejná třída aktiv, stejné téma) – žádné pořadí ani
 * doporučení. Hlídá check-fund-data.mjs (blok kolo6b seo obsah): každý žebříček má odkaz z jiného žebříčku.
 */

/** Krátký název žebříčku (jeden pro rozcestník, „Související žebříčky“ i články) a volitelný podtitul. */
export const NAZVY_ZEBRICKU: Record<string, [string, string?]> = {
  'nejlepsi-etf-2026': ['Největší fondy', 'napříč všemi třídami aktiv'],
  'nejlevnejsi-etf': ['Nejlevnější fondy', 'podle poplatku TER, bez produktů s TER 0 %'],
  'nejlepsi-akciove-etf': ['Akciové'],
  'nejlepsi-dluhopisove-etf': ['Dluhopisové'],
  'nejlepsi-komoditni-etf': ['Komoditní'],
  'nejlepsi-dividendove-etf': ['Dividendové', 's výplatou dividend'],
  'nejlepsi-realitni-etf': ['Realitní', 'REITs'],
  'nejlepsi-vladni-dluhopisy-etf': ['Vládní dluhopisy'],
  'nejlepsi-korporatni-dluhopisy-etf': ['Firemní dluhopisy'],
  'nejlepsi-high-yield-etf': ['High yield', 'dluhopisy s vyšším rizikem'],
  'nejlepsi-sp500-etf': ['S&P 500', '500 největších firem USA'],
  'nejlepsi-msci-world-etf': ['MSCI World', 'vyspělé trhy'],
  'nejlepsi-nasdaq-etf': ['Nasdaq-100', 'americké technologie'],
  'nejlepsi-dax-etf': ['DAX', 'Německo'],
  'nejlepsi-stoxx600-etf': ['STOXX Europe 600', 'Evropa'],
  'nejlepsi-ftse100-etf': ['FTSE 100', 'Velká Británie'],
  'nejlepsi-celosvetove-etf': ['Celý svět', 'vyspělé i rozvíjející se trhy'],
  'nejlepsi-americke-etf': ['USA'],
  'nejlepsi-evropske-etf': ['Evropa'],
  'nejlepsi-japonske-etf': ['Japonsko'],
  'nejlepsi-cinske-etf': ['Čína'],
  'nejlepsi-indicke-etf': ['Indie'],
  'nejlepsi-emerging-markets-etf': ['Rozvíjející se trhy', 'emerging markets'],
  'nejlepsi-asijsko-pacificke-etf': ['Asie a Pacifik'],
  'nejlepsi-technologicke-etf': ['Technologie'],
  'nejlepsi-healthcare-etf': ['Zdravotnictví'],
  'nejlepsi-financni-etf': ['Finance'],
  'nejlepsi-energeticke-etf': ['Energetika'],
  'nejlepsi-prumyslove-etf': ['Průmysl'],
  'nejlepsi-spotrebitelske-etf': ['Spotřební zboží'],
  'nejlepsi-infrastrukturni-etf': ['Infrastruktura'],
  'nejlepsi-ai-etf': ['Umělá inteligence'],
  'nejlepsi-robotika-etf': ['Robotika'],
  'nejlepsi-cloud-etf': ['Cloud'],
  'nejlepsi-kyberbezpecnost-etf': ['Kyberbezpečnost'],
  'nejlepsi-obnovitelne-zdroje-etf': ['Obnovitelné zdroje'],
  'nejlepsi-biotechnologie-etf': ['Biotechnologie'],
  'nejlepsi-defense-etf': ['Obrana'],
  'nejlepsi-esg-etf': ['ESG', 'udržitelné investování'],
  'nejlepsi-zlato-etf': ['Zlato'],
  'nejlepsi-stribro-etf': ['Stříbro'],
  'nejlepsi-ropa-etf': ['Ropa'],
  'nejlepsi-bitcoin-etf': ['Bitcoin'],
  'nejlepsi-value-etf': ['Value', 'levnější firmy'],
  'nejlepsi-growth-etf': ['Growth', 'růstové firmy'],
  'nejlepsi-small-cap-etf': ['Malé firmy', 'small cap'],
  'nejlepsi-akumulacni-etf': ['Akumulační', 'dividendy zůstávají ve fondu'],
  'nejlepsi-distribucni-etf': ['Distribuční', 'dividendy se vyplácejí'],
};

/** Počet řádků tabulky fondů ve výchozím pohledu (TabulkaFondu) – žebříček podle něj vypisuje velké fondy mimo něj. */
export const RADKU_TABULKY_VYCHOZI = 20;

const S = (s: string) => `nejlepsi-${s}-etf`;

/** Příbuzné žebříčky (4–6). Pořadí = od nejbližšího. */
export const SOUVISEJICI: Record<string, string[]> = {
  'nejlepsi-etf-2026': [S('celosvetove'), S('sp500'), S('msci-world'), 'nejlevnejsi-etf', S('akciove'), S('dluhopisove')],
  'nejlevnejsi-etf': ['nejlepsi-etf-2026', S('sp500'), S('msci-world'), S('celosvetove'), S('akumulacni')],
  [S('akciove')]: ['nejlepsi-etf-2026', S('celosvetove'), S('dividendove'), S('small-cap'), S('value'), S('growth')],
  [S('dluhopisove')]: [S('vladni-dluhopisy'), S('korporatni-dluhopisy'), S('high-yield'), 'nejlepsi-etf-2026'],
  [S('komoditni')]: [S('zlato'), S('stribro'), S('ropa'), S('bitcoin')],
  [S('dividendove')]: [S('distribucni'), S('value'), S('financni'), S('realitni'), S('infrastrukturni')],
  [S('realitni')]: [S('infrastrukturni'), S('dividendove'), S('distribucni'), S('akciove')],
  [S('vladni-dluhopisy')]: [S('dluhopisove'), S('korporatni-dluhopisy'), S('high-yield')],
  [S('korporatni-dluhopisy')]: [S('dluhopisove'), S('vladni-dluhopisy'), S('high-yield')],
  [S('high-yield')]: [S('dluhopisove'), S('korporatni-dluhopisy'), S('vladni-dluhopisy')],
  [S('sp500')]: [S('americke'), S('nasdaq'), S('msci-world'), S('celosvetove'), 'nejlevnejsi-etf'],
  [S('msci-world')]: [S('celosvetove'), S('sp500'), S('evropske'), S('esg'), 'nejlepsi-etf-2026'],
  [S('nasdaq')]: [S('technologicke'), S('sp500'), S('americke'), S('growth'), S('ai')],
  [S('dax')]: [S('evropske'), S('stoxx600'), S('ftse100')],
  [S('stoxx600')]: [S('evropske'), S('dax'), S('ftse100'), S('msci-world')],
  [S('ftse100')]: [S('evropske'), S('stoxx600'), S('dax')],
  [S('celosvetove')]: [S('msci-world'), S('sp500'), S('emerging-markets'), S('esg'), 'nejlepsi-etf-2026'],
  [S('americke')]: [S('sp500'), S('nasdaq'), S('small-cap'), S('growth'), S('value')],
  [S('evropske')]: [S('stoxx600'), S('dax'), S('ftse100'), S('msci-world')],
  [S('japonske')]: [S('asijsko-pacificke'), S('cinske'), S('emerging-markets'), S('msci-world')],
  [S('cinske')]: [S('emerging-markets'), S('asijsko-pacificke'), S('indicke'), S('japonske')],
  [S('indicke')]: [S('emerging-markets'), S('cinske'), S('asijsko-pacificke')],
  [S('emerging-markets')]: [S('cinske'), S('indicke'), S('asijsko-pacificke'), S('celosvetove')],
  [S('asijsko-pacificke')]: [S('japonske'), S('cinske'), S('indicke'), S('emerging-markets')],
  [S('technologicke')]: [S('nasdaq'), S('ai'), S('cloud'), S('kyberbezpecnost'), S('robotika')],
  [S('healthcare')]: [S('biotechnologie'), S('spotrebitelske'), S('akciove')],
  [S('financni')]: [S('dividendove'), S('value'), S('akciove')],
  [S('energeticke')]: [S('obnovitelne-zdroje'), S('ropa'), S('infrastrukturni'), S('komoditni')],
  [S('prumyslove')]: [S('defense'), S('robotika'), S('infrastrukturni')],
  [S('spotrebitelske')]: [S('healthcare'), S('dividendove'), S('akciove')],
  [S('infrastrukturni')]: [S('realitni'), S('obnovitelne-zdroje'), S('energeticke'), S('prumyslove')],
  [S('ai')]: [S('technologicke'), S('robotika'), S('cloud'), S('nasdaq')],
  [S('robotika')]: [S('ai'), S('technologicke'), S('prumyslove')],
  [S('cloud')]: [S('technologicke'), S('kyberbezpecnost'), S('ai')],
  [S('kyberbezpecnost')]: [S('technologicke'), S('cloud'), S('ai'), S('defense')],
  [S('obnovitelne-zdroje')]: [S('energeticke'), S('infrastrukturni'), S('esg')],
  [S('biotechnologie')]: [S('healthcare'), S('technologicke'), S('small-cap')],
  [S('defense')]: [S('prumyslove'), S('kyberbezpecnost'), S('evropske')],
  [S('esg')]: [S('celosvetove'), S('msci-world'), S('obnovitelne-zdroje')],
  [S('zlato')]: [S('stribro'), S('komoditni'), S('bitcoin'), S('ropa')],
  [S('stribro')]: [S('zlato'), S('komoditni'), S('ropa')],
  [S('ropa')]: [S('komoditni'), S('energeticke'), S('zlato')],
  [S('bitcoin')]: [S('zlato'), S('komoditni'), S('technologicke')],
  [S('value')]: [S('growth'), S('dividendove'), S('small-cap'), S('financni'), S('akciove')],
  [S('growth')]: [S('value'), S('technologicke'), S('nasdaq'), S('akciove')],
  [S('small-cap')]: [S('value'), S('americke'), S('akciove'), S('growth')],
  [S('akumulacni')]: [S('distribucni'), S('celosvetove'), S('sp500'), 'nejlevnejsi-etf'],
  [S('distribucni')]: [S('akumulacni'), S('dividendove'), S('realitni')],
};

export function nazevZebricku(slug: string): string {
  return NAZVY_ZEBRICKU[slug]?.[0] ?? slug;
}

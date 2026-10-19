/* Česká jména zemí a sektorů z dat fondů (justETF je má anglicky). Jeden slovník pro detail fondu
   i porovnání – dřív měl detail vlastní mini-mapu (3 země) a na webu se míchalo „Spojené státy“ s „Japan“
   (revize 18. 10. 2026). Pokryté hodnoty = všechny, které se v datech vyskytují aspoň 10×. */

const ZEME: Record<string, string> = {
  'United States': 'Spojené státy', 'United Kingdom': 'Velká Británie', France: 'Francie', Germany: 'Německo',
  Japan: 'Japonsko', Canada: 'Kanada', Switzerland: 'Švýcarsko', Ireland: 'Irsko', Netherlands: 'Nizozemsko',
  Italy: 'Itálie', Spain: 'Španělsko', China: 'Čína', Taiwan: 'Tchaj-wan', 'South Korea': 'Jižní Korea',
  Australia: 'Austrálie', India: 'Indie', 'Hong Kong': 'Hongkong', Singapore: 'Singapur', Sweden: 'Švédsko',
  Mexico: 'Mexiko', Brazil: 'Brazílie', 'Saudi Arabia': 'Saúdská Arábie', Luxembourg: 'Lucembursko',
  Indonesia: 'Indonésie', Turkey: 'Turecko', Belgium: 'Belgie', Denmark: 'Dánsko', Bermuda: 'Bermudy',
  'United Arab Emirates': 'Spojené arabské emiráty', Finland: 'Finsko', 'New Zealand': 'Nový Zéland',
  Israel: 'Izrael', Philippines: 'Filipíny', 'South Africa': 'Jihoafrická republika', Poland: 'Polsko',
  Chile: 'Chile', 'Ivory Coast': 'Pobřeží slonoviny', Hungary: 'Maďarsko', Austria: 'Rakousko', Norway: 'Norsko',
  Uruguay: 'Uruguay', Greece: 'Řecko', 'Cayman Islands': 'Kajmanské ostrovy', Malaysia: 'Malajsie',
  Portugal: 'Portugalsko', 'Czech Republic': 'Česko', Czechia: 'Česko', Thailand: 'Thajsko', Vietnam: 'Vietnam',
  Other: 'Ostatní',
};

/* Sektory: zdroj dat fondů používá VLASTNÍ klasifikaci – ani GICS, ani TRBC (kolo 5, 19. 10. 2026). Má sektory
   „Business Services“, „Non-Energy Materials“, „Consumer Services“, „Finance“, které TRBC nemá (TRBC: Financials,
   Basic Materials); názvy odpovídají spíš FactSet RBICS (úroveň Economy). Čísla ze zdroje sedí (SXR8: Consumer
   Non-Cyclicals 8,88 % = údaj zdroje), jen se NEDAJÍ srovnávat s GICS od emitenta indexu (S&P 500 Consumer Staples
   ~5 %). Proto „Necyklická spotřeba“/„Cyklická spotřeba“ – ne „Spotřeba (základní)“, které svádělo ke srovnání
   s GICS Staples. JEDNA sada českých názvů pro celý web (detail, porovnání, články). Kontrola: check-fund-data.mjs
   (název sektoru v DB bez překladu = varování). Krátké tvary – vejdou se do sloupce s vahou. */
export const SEKTORY: Record<string, string> = {
  // 12 sektorů zdroje (+ Other)
  Technology: 'Technologie', Finance: 'Finance', Healthcare: 'Zdravotnictví',
  'Consumer Non-Cyclicals': 'Necyklická spotřeba', 'Consumer Cyclicals': 'Cyklická spotřeba',
  Industrials: 'Průmysl', Energy: 'Energetika', 'Non-Energy Materials': 'Materiály',
  'Consumer Services': 'Spotřebitelské služby', Utilities: 'Veřejné služby', 'Business Services': 'Služby pro firmy',
  Telecommunication: 'Telekomunikace', Telecommunications: 'Telekomunikace',
  // dluhopisy
  Sovereign: 'Státní dluhopisy', 'Non-Corporate': 'Nadnárodní a agenturní', Municipal: 'Obecní dluhopisy',
  'Government Agencies': 'Vládní agentury',
  // ojedinělé řádky v jiné (GICS) klasifikaci – vlastní názvy, ať se nemíchají se sektory zdroje
  'Information Technology': 'Technologie', IT: 'Technologie', Financials: 'Finance', 'Financial Services': 'Finance',
  'Health Care': 'Zdravotnictví', 'Consumer Staples': 'Základní spotřeba', 'Consumer Discretionary': 'Zbytná spotřeba',
  'Basic Materials': 'Materiály', Materials: 'Materiály', 'Telecommunications Services': 'Telekomunikace',
  'Communication Services': 'Komunikační služby', Communications: 'Komunikační služby', 'Real Estate': 'Nemovitosti',
  Other: 'Ostatní', Others: 'Ostatní',
};

/** Vysvětlivka u sekce sektorů (zdroj nejmenujeme). */
export const SEKTORY_POZNAMKA = 'Rozdělení podle klasifikace zdroje dat, ne podle GICS, kterou používají emitenti indexů – podíly se proto mohou lišit (např. „necyklická spotřeba“ je širší než GICS Consumer Staples).';

export const ceskaZeme = (n: string | null | undefined) => (n ? ZEME[n.trim()] ?? n : n ?? '');
export const ceskySektor = (n: string | null | undefined) => (n ? SEKTORY[n.trim()] ?? n : n ?? '');

const TRIDY: Record<string, string> = {
  Equity: 'Akcie', Bonds: 'Dluhopisy', 'Fixed Income': 'Dluhopisy', Commodities: 'Komodity', 'Real Estate': 'Nemovitosti',
  'Money Market': 'Peněžní trh', 'Precious Metals': 'Drahé kovy', Gold: 'Zlato', Silver: 'Stříbro', World: 'Celý svět',
  Europe: 'Evropa', 'Emerging Markets': 'Rozvíjející se trhy', 'North America': 'Severní Amerika', 'Asia Pacific': 'Asie a Pacifik',
  Government: 'Státní', Corporate: 'Firemní', Social: 'Sociální', Sustainability: 'Udržitelnost', 'Climate Change': 'Klima',
};
/** „Equity, United States“ → „Akcie, Spojené státy“; neznámé části nechá být. */
export const ceskeZamereni = (z: string | null | undefined) =>
  z ? z.split(/\s*,\s*/).map((c) => TRIDY[c] ?? ZEME[c] ?? SEKTORY[c] ?? c).join(', ') : z ?? '';

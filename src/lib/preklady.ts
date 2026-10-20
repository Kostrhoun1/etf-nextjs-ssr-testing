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
  // kolo 6 (20. 10. 2026): země, které se vyskytují v zaměření fondů (investment_focus)
  Bulgaria: 'Bulharsko', Croatia: 'Chorvatsko', Macedonia: 'Severní Makedonie', Romania: 'Rumunsko', Slovakia: 'Slovensko',
  Slovenia: 'Slovinsko', Serbia: 'Srbsko', Kuwait: 'Kuvajt', Pakistan: 'Pákistán', Russia: 'Rusko',
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
  // kolo 6 (20. 10. 2026): štítek zaměření na detailu fondu byl anglicky („Cryptocurrencies“, „Crude Oil“, „All maturities“,
  // „Social/Environmental“, „Dividend“). Pokryté = všechny části investment_focus v DB k 20. 10. 2026. Kontrola: check-fund-data
  // (blok kolo6 detail – část zaměření bez překladu = varování; detail nepřeložené části vynechává).
  Cryptocurrencies: 'Kryptoměny', 'Social/Environmental': 'Udržitelné (ESG)', 'All maturities': 'Všechny splatnosti',
  Aggregate: 'Státní i firemní', Dividend: 'Dividendové', 'Maturity bonds': 'S pevnou splatností', 'Small Cap': 'Malé firmy',
  'Mid Cap': 'Střední firmy', 'Large Cap': 'Velké firmy', 'Multi-Factor Strategy': 'Vícefaktorová strategie', 'Broad market': 'Široký trh',
  Value: 'Hodnotové akcie', Growth: 'Růstové akcie', 'Fundamental/Quality': 'Kvalita', Momentum: 'Momentum',
  'Low Volatility/Risk Weighted': 'Nízká kolísavost', 'Equal Weighted': 'Rovnoměrné váhy', 'Sector Strategy': 'Sektorová strategie',
  'Inflation-Linked': 'Chráněné proti inflaci', 'Covered Call': 'Opční strategie (covered call)', 'Put Write': 'Opční strategie (put write)',
  Buffer: 'Ochrana proti poklesu (buffer)', 'Credit derivatives': 'Úvěrové deriváty', 'Convertible Bonds': 'Převoditelné dluhopisy',
  'Covered Bonds': 'Kryté dluhopisy', Infrastructure: 'Infrastruktura', 'Industrial Metals': 'Průmyslové kovy', 'Crude Oil': 'Ropa',
  'Natural Gas': 'Zemní plyn', Agriculture: 'Zemědělství', Agribusiness: 'Agrobyznys', Automobile: 'Automobilový průmysl',
  'Carbon credits': 'Emisní povolenky', Copper: 'Měď', Platinum: 'Platina', Palladium: 'Palladium', Rhodium: 'Rhodium', Nickel: 'Nikl',
  Aluminium: 'Hliník', Zinc: 'Zinek', Insurance: 'Pojišťovnictví', 'Travel & Leisure': 'Cestování a volný čas', Media: 'Média',
  Retail: 'Maloobchod', Wheat: 'Pšenice', Corn: 'Kukuřice', Sugar: 'Cukr', Coffee: 'Káva', Cocoa: 'Kakao', Cotton: 'Bavlna',
  Soybeans: 'Sójové boby', 'Soybean Oil': 'Sójový olej', Livestock: 'Hospodářská zvířata', 'Live Cattle': 'Skot', 'Lean Hogs': 'Prasata',
  Gasoline: 'Benzín', 'Heating Oil': 'Topný olej', Petroleum: 'Ropné produkty', 'Eastern Europe': 'Východní Evropa',
  'Latin America': 'Latinská Amerika', Africa: 'Afrika', 'Precious Metals Basket': 'Koš drahých kovů',
  'Bloomberg Precious Metals': 'Drahé kovy', 'Gold Future': 'Futures na zlato', 'Silver Future': 'Futures na stříbro',
  'Gold Future Short': 'Futures na zlato (short)', 'Silver Future Short': 'Futures na stříbro (short)',
  'Gold Future Leverage (2x)': 'Futures na zlato s pákou 2×', 'Gold Future Leverage (3x)': 'Futures na zlato s pákou 3×',
  'Silver Future Leverage (2x)': 'Futures na stříbro s pákou 2×', 'Silver Future Leverage (3x)': 'Futures na stříbro s pákou 3×',
  'Platinum Future Leverage (2x)': 'Futures na platinu s pákou 2×',
  'Gold Future Short Leverage (-3x)': 'Futures na zlato, inverzní s pákou 3×', 'Silver Future Short Leverage (-3x)': 'Futures na stříbro, inverzní s pákou 3×',
  'IncomeShares Gold+ Yield': 'Zlato + opční výnos', 'IncomeShares Silver+ Yield': 'Stříbro + opční výnos',
};
const ZAJ_CAST = /^(.+?)\s+\((EUR|USD|GBP|CHF|JPY) Hedged\)$/;
const prelozCast = (c: string): string | null => {
  const z = c.match(ZAJ_CAST);
  if (z) { const t = prelozCast(z[1]); return t ? `${t} (zajištěno do ${z[2]})` : null; }
  return TRIDY[c] ?? ZEME[c] ?? SEKTORY[c] ?? null;
};
/** „Equity, United States“ → „Akcie, Spojené státy“; neznámé části nechá být. */
export const ceskeZamereni = (z: string | null | undefined) =>
  z ? z.split(/\s*,\s*/).map((c) => prelozCast(c) ?? c).join(', ') : z ?? '';

/**
 * Štítky zaměření pro hlavičku detailu fondu (kolo 6): jen přeložené části – nepřeložené slovo se VYNECHÁ (raději nic
 * než angličtina), kódy měn pryč (USD vedle „Spojené státy“ je navíc), „Ostatní“ pryč, splatnost česky:
 * „7-10“ → „splatnost 7–10 let“, „0-1“ → „splatnost 0–1 rok“, „10+“ → „splatnost 10+ let“.
 */
export function zamereniStitky(z: string | null | undefined): string[] {
  if (!z) return [];
  const sklon = (n: number) => (n === 1 ? 'rok' : n >= 2 && n <= 4 ? 'roky' : 'let');
  const out: string[] = [];
  for (const c of z.split(/\s*,\s*/)) {
    if (!c || /^[A-Z]{3}$/.test(c) || c === 'Other') continue;
    let m = c.match(/^(\d+)-(\d+)$/);
    if (m) { out.push(`splatnost ${m[1]}–${m[2]} ${sklon(Number(m[2]))}`); continue; }
    m = c.match(/^(\d+)\+$/);
    if (m) { out.push(`splatnost ${m[1]}+ let`); continue; }
    const t = prelozCast(c);
    if (t && !out.includes(t)) out.push(t);
  }
  return out;
}

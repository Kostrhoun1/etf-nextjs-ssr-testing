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

/* Sektory: data fondů (justETF) používají klasifikaci TRBC (Refinitiv), ne GICS – proto např. „Technology“
   u S&P 500 obsahuje i Alphabet a Meta. JEDNA sada českých názvů pro celý web (kolo 3, 18. 10. 2026: žebříček
   psal „Spotřeba (běžná)“, detail „Spotřební zboží (základní)“). Krátké tvary – vejdou se do sloupce s vahou. */
const SEKTORY: Record<string, string> = {
  Technology: 'Technologie', 'Information Technology': 'Technologie', IT: 'Technologie',
  Finance: 'Finance', Financials: 'Finance', 'Financial Services': 'Finance',
  Industrials: 'Průmysl', Healthcare: 'Zdravotnictví', 'Health Care': 'Zdravotnictví',
  'Consumer Non-Cyclicals': 'Spotřeba (základní)', 'Consumer Staples': 'Spotřeba (základní)',
  'Consumer Cyclicals': 'Spotřeba (cyklická)', 'Consumer Discretionary': 'Spotřeba (cyklická)',
  'Consumer Services': 'Spotřebitelské služby', 'Business Services': 'Služby pro firmy',
  'Non-Energy Materials': 'Materiály', 'Basic Materials': 'Materiály', Materials: 'Materiály',
  Utilities: 'Veřejné služby', Energy: 'Energetika',
  Telecommunication: 'Komunikace', Telecommunications: 'Komunikace', 'Telecommunications Services': 'Komunikace',
  'Communication Services': 'Komunikace', Communications: 'Komunikace',
  'Real Estate': 'Nemovitosti', Sovereign: 'Státní dluhopisy', 'Non-Corporate': 'Nadnárodní a agenturní',
  Municipal: 'Obecní dluhopisy', 'Government Agencies': 'Vládní agentury', Other: 'Ostatní', Others: 'Ostatní',
};

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

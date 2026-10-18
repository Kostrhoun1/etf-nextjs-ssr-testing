/**
 * Region / zaměření ETF pro filtr srovnávače.
 *
 * PŘEPSÁNO 18. 10. 2026 (revize srovnávače, pravidlo č. 1): stará verze hádala region regexy
 * z `investment_focus`, názvu a hrubého sloupce `region` a výsledek byl zavádějící – Korea
 * „Evropa“ (Korea v pravidlech chyběla → záloha na hrubý sloupec), zlato a krypto „Celosvětově“,
 * 2 420 z 5 124 fondů „Celosvětově“.
 *
 * Teď JEN z `investment_focus` (justETF ho má u všech fondů a je strukturovaný):
 *   "Equity, South Korea"                      → Jižní Korea
 *   "Equity, World, Social/Environmental"      → Celosvětově
 *   "Bonds, EUR, Europe, Government, 1-3"      → Evropa      (měna dluhopisu se přeskočí)
 *   "Precious Metals, Gold" / "Cryptocurrencies" / "Commodities, …" → null (region nedává smysl)
 * Neznámá hodnota → null (raději fond bez regionu než se špatným). Hrubý sloupec `region` se
 * nepoužívá vůbec – je v něm Korea jako „Evropa“.
 *
 * Kontrola: scripts/check-fund-data.mjs (VAROVÁNÍ, když fond s „Korea/Japan/India…“ v názvu
 * nebo komodita/krypto dostane jiný region).
 */

export interface RegionClassifiable {
  investment_focus?: string | null;
  index_name?: string | null;
  name?: string | null;
  region?: string | null;
}

/** Oblasti (víc zemí) – v nabídce nahoře, v tomhle pořadí. */
export const OBLASTI: string[] = [
  'Celosvětově', 'USA', 'Evropa', 'Rozvíjející se trhy', 'Asie a Pacifik', 'Severní Amerika',
  'Latinská Amerika', 'Východní Evropa', 'Afrika',
];

/** Token geografie z investment_focus → český název. */
const GEO: Record<string, string> = {
  World: 'Celosvětově', 'United States': 'USA', Europe: 'Evropa', 'Emerging Markets': 'Rozvíjející se trhy',
  'Asia Pacific': 'Asie a Pacifik', 'North America': 'Severní Amerika', 'Latin America': 'Latinská Amerika',
  'Eastern Europe': 'Východní Evropa', Africa: 'Afrika',
  Japan: 'Japonsko', China: 'Čína', India: 'Indie', 'South Korea': 'Jižní Korea', Taiwan: 'Tchaj-wan',
  'Hong Kong': 'Hongkong', Singapore: 'Singapur', Indonesia: 'Indonésie', Malaysia: 'Malajsie',
  Philippines: 'Filipíny', Thailand: 'Thajsko', Vietnam: 'Vietnam', Pakistan: 'Pákistán', Australia: 'Austrálie',
  'United Kingdom': 'Velká Británie', Germany: 'Německo', Switzerland: 'Švýcarsko', France: 'Francie',
  Italy: 'Itálie', Spain: 'Španělsko', Netherlands: 'Nizozemsko', Austria: 'Rakousko', Belgium: 'Belgie',
  Sweden: 'Švédsko', Greece: 'Řecko', Poland: 'Polsko', 'Czech Republic': 'Česko', Hungary: 'Maďarsko',
  Slovakia: 'Slovensko', Slovenia: 'Slovinsko', Croatia: 'Chorvatsko', Romania: 'Rumunsko', Bulgaria: 'Bulharsko',
  Serbia: 'Srbsko', Macedonia: 'Severní Makedonie', Turkey: 'Turecko', Russia: 'Rusko',
  Canada: 'Kanada', Mexico: 'Mexiko', Brazil: 'Brazílie', 'Saudi Arabia': 'Saúdská Arábie', Kuwait: 'Kuvajt',
  'South Africa': 'Jihoafrická republika',
};

/** Třídy aktiv, u kterých má region smysl. U komodit, drahých kovů a krypta ne. */
const S_REGIONEM = new Set(['Equity', 'Bonds', 'Real Estate', 'Money Market']);

/**
 * Vrátí region/zemi ETF, nebo `null` když nejde určit nebo nedává smysl.
 */
export function classifyRegion(etf: RegionClassifiable): string | null {
  const casti = (etf.investment_focus ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (casti.length < 2 || !S_REGIONEM.has(casti[0])) return null;
  // U dluhopisů a peněžního trhu je za třídou aktiv nejdřív měna („Bonds, EUR, Europe, …“).
  const geo = /^[A-Z]{3}$/.test(casti[1]) ? casti[2] : casti[1];
  return (geo && GEO[geo]) || null;
}

/**
 * Možnosti filtru regionu (jen ty, které v datech jsou): oblasti v pevném pořadí, pak země podle
 * počtu fondů (sestupně).
 */
export function buildRegionOptions(etfs: RegionClassifiable[]): string[] {
  const pocty = new Map<string, number>();
  for (const etf of etfs) {
    const r = classifyRegion(etf);
    if (r) pocty.set(r, (pocty.get(r) ?? 0) + 1);
  }
  const oblasti = OBLASTI.filter((r) => pocty.has(r));
  const zeme = [...pocty.keys()].filter((r) => !OBLASTI.includes(r))
    .sort((a, b) => pocty.get(b)! - pocty.get(a)! || a.localeCompare(b, 'cs'));
  return [...oblasti, ...zeme];
}

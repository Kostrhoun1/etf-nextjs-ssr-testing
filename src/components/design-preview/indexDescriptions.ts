/* Odborné popisy akciových, dluhopisových a krypto indexů pro žebříčky top ETF.
 *
 * Cíl: na stránce kategorie ukázat NEgenerický, faktický popis indexů, které
 * fondy v kategorii reálně sledují (co index měří, kolik má složek, jak je vážený,
 * jaké je pokrytí trhu). To je unikátní obsah = klíč k indexaci v Google.
 *
 * Klíčováno kanonickým klíčem indexu (canonicalIndexKey → lowercase). Když přesná
 * shoda chybí, getIndexInfo zkusí rodinové fallbacky (dluhopisy, krypto, sektory).
 */

import { canonicalIndexKey, canonicalIndexLabel, getIndexProvider, normalizeIndexName } from '@/utils/indexNormalization';

export interface IndexInfo {
  label: string;      // zobrazovaný název
  provider: string;   // poskytovatel indexu (S&P Dow Jones, MSCI, FTSE Russell…)
  holdings?: string;  // orientační počet složek ("~1 500 firem")
  what: string;       // 1–2 věty: co index měří, vážení, pokrytí
}

/* Klíč = canonicalIndexKey (lowercase). Držíme jen ověřené, dobře známé indexy –
   raději méně položek, ale přesných. Počty složek jsou orientační (mění se v čase). */
const EXACT: Record<string, Omit<IndexInfo, 'label'>> = {
  'msci world': {
    provider: 'MSCI',
    holdings: '~1 400 firem',
    what: 'Velké a střední firmy z 23 vyspělých trhů světa, vážené tržní kapitalizací. Pokrývá zhruba 85 % kapitalizace vyspělých trhů, ale nezahrnuje rozvíjející se ekonomiky. Váhu drtivě určují USA (kolem 70 %).',
  },
  's&p 500': {
    provider: 'S&P Dow Jones',
    holdings: '~500 firem',
    what: 'Zhruba 500 největších veřejně obchodovaných firem v USA, vážených tržní kapitalizací. Pokrývá kolem 80 % hodnoty amerického akciového trhu a je nejsledovanějším měřítkem výkonnosti americké ekonomiky.',
  },
  'msci acwi': {
    provider: 'MSCI',
    holdings: '~2 700 firem',
    what: 'MSCI All Country World – velké a střední firmy z 23 vyspělých a 24 rozvíjejících se trhů. Jedním indexem pokryje zhruba 85 % globální investovatelné kapitalizace včetně rozvíjejících se trhů.',
  },
  'ftse all-world': {
    provider: 'FTSE Russell',
    holdings: '~4 300 firem',
    what: 'Velké a střední firmy z vyspělých i rozvíjejících se trhů (přes 90 % globální investovatelné kapitalizace). Přímý konkurent MSCI ACWI, obvykle drží o něco více titulů.',
  },
  'msci emerging markets': {
    provider: 'MSCI',
    holdings: '~1 400 firem',
    what: 'Velké a střední firmy z 24 rozvíjejících se ekonomik (největší váhu mají Čína, Indie, Tchaj-wan a Jižní Korea). Vyšší růstový potenciál, ale i vyšší politické a měnové riziko.',
  },
  'nasdaq 100': {
    provider: 'Nasdaq',
    holdings: '100 firem',
    what: '100 největších nefinančních firem obchodovaných na burze Nasdaq. Silně vychýlený k technologiím – dominují Apple, Microsoft, Nvidia a další giganti. Vyšší růst i vyšší kolísavost než široký trh.',
  },
  'msci europe': {
    provider: 'MSCI',
    holdings: '~400 firem',
    what: 'Velké a střední firmy z 15 vyspělých evropských zemí (Velká Británie, Francie, Švýcarsko, Německo…), napříč eurem, librou i frankem. Pokrývá kolem 85 % evropské kapitalizace.',
  },
  'stoxx europe 600': {
    provider: 'STOXX',
    holdings: '600 firem',
    what: 'Pevně 600 velkých, středních i malých firem ze 17 evropských zemí. Nejširší běžně používané měřítko evropských akcií – zahrnuje i britské a švýcarské tituly.',
  },
  'euro stoxx 50': {
    provider: 'STOXX',
    holdings: '50 firem',
    what: '50 blue-chip firem z eurozóny (Německo, Francie, Nizozemsko a další). Koncentrovaný index největších evropských značek – ideální jako čistá sázka na eurozónu, ale nízká diverzifikace.',
  },
  'msci usa': {
    provider: 'MSCI',
    holdings: '~600 firem',
    what: 'Velké a střední americké firmy – pokrytím zhruba 85 % US trhu je o něco širší než S&P 500. Vážený tržní kapitalizací.',
  },
  'msci japan': {
    provider: 'MSCI',
    holdings: '~200 firem',
    what: 'Velké a střední japonské firmy, kolem 85 % japonského akciového trhu. Klíčová váha automobilek, elektroniky a strojírenství.',
  },
  'msci pacific ex japan': {
    provider: 'MSCI',
    holdings: '~120 firem',
    what: 'Vyspělé trhy Tichomoří bez Japonska – Austrálie, Hongkong, Singapur a Nový Zéland. Silná váha bank a surovin.',
  },
  'msci china': {
    provider: 'MSCI',
    what: 'Velké a střední čínské firmy napříč typy akcií (A, H, ADR). Vysoký růstový potenciál i výrazné regulační a politické riziko.',
  },
  'msci canada': {
    provider: 'MSCI',
    holdings: '~90 firem',
    what: 'Velké a střední kanadské firmy s velkou vahou bank a energetiky.',
  },
  'msci korea': {
    provider: 'MSCI',
    what: 'Velké a střední jihokorejské firmy; dominuje technologický sektor v čele se Samsungem.',
  },
  'msci emu': {
    provider: 'MSCI',
    holdings: '~230 firem',
    what: 'Firmy z Evropské měnové unie (eurozóny) – bez Velké Británie a Švýcarska. Čistá expozice na euro bez měnového rizika jiných evropských měn.',
  },
  'ftse 100': {
    provider: 'FTSE Russell',
    holdings: '100 firem',
    what: '100 největších firem na Londýnské burze. Silná váha těžby, energetiky, bank a farmacie; tržby často globální, ne jen britské.',
  },
  'ftse 250': {
    provider: 'FTSE Russell',
    holdings: '250 firem',
    what: 'Firmy na 101.–350. místě podle velikosti na Londýnské burze (britský mid-cap). Více navázané na domácí britskou ekonomiku než FTSE 100.',
  },
  'dax': {
    provider: 'DAX / Deutsche Börse',
    holdings: '40 firem',
    what: '40 největších německých firem na Frankfurtské burze (SAP, Siemens, Allianz…). Výkonnostní index – započítává i reinvestované dividendy.',
  },
  'msci switzerland 20': {
    provider: 'MSCI',
    what: 'Největší švýcarské firmy s omezením váhy jednotlivých titulů (Nestlé, Roche, Novartis). Obranný charakter díky farmacii a spotřebnímu zboží.',
  },
  'ftse epra nareit developed': {
    provider: 'FTSE / EPRA / NAREIT',
    what: 'Kótované nemovitostní firmy a REITs z vyspělých trhů. Zprostředkovaná expozice na komerční nemovitosti s obvykle vyšším dividendovým výnosem.',
  },
  'ftse emerging markets': {
    provider: 'FTSE Russell',
    holdings: '~2 000 firem',
    what: 'Firmy z rozvíjejících se trhů dle metodiky FTSE. Na rozdíl od MSCI EM řadí Jižní Koreu mezi vyspělé trhy, takže ji nezahrnuje.',
  },
  'euro corporate': {
    provider: 'Bloomberg / iBoxx',
    what: 'Podnikové dluhopisy investičního stupně denominované v euru. Vyšší výnos než státní dluhopisy výměnou za kreditní riziko emitentů.',
  },
  'bitcoin': {
    provider: 'Krypto',
    what: 'Sleduje spotovou cenu bitcoinu (BTC). Nejvyšší kolísavost ze všech tříd aktiv; produkt typu ETP/ETN krytý reálně drženými coiny.',
  },
  'ethereum': {
    provider: 'Krypto',
    what: 'Sleduje spotovou cenu etheru (ETH). Extrémní kolísavost; produkt typu ETP/ETN krytý reálně drženými coiny.',
  },
};

/* Rodinové fallbacky, když přesný klíč chybí – seřazeno od nejkonkrétnějšího.
   Testuje se na kanonickém klíči (lowercase). */
const FAMILY: { test: (k: string) => boolean; info: (label: string) => IndexInfo }[] = [
  {
    test: (k) => k.includes('information technology') || k.includes(' it ') || k.endsWith(' it') || k.includes('technology'),
    info: (label) => ({ label, provider: getIndexProvider(label), what: 'Sektorový index technologických firem (software, polovodiče, hardware). Vyšší růstový potenciál i větší kolísavost než široký trh.' }),
  },
  {
    test: (k) => k.startsWith('nasdaq'),
    info: (label) => ({ label, provider: 'Nasdaq', what: 'Index firem obchodovaných na burze Nasdaq s převahou technologického sektoru.' }),
  },
  {
    test: (k) => k.includes('epra') || k.includes('nareit') || k.includes('real estate'),
    info: (label) => ({ label, provider: getIndexProvider(label), what: 'Index kótovaných nemovitostních firem a REITs – zprostředkovaná expozice na nemovitosti s obvykle vyšším dividendovým výnosem.' }),
  },
  {
    test: (k) => k.includes('corporate'),
    info: (label) => ({ label, provider: getIndexProvider(label), what: 'Podnikové (korporátní) dluhopisy – vyšší výnos než státní dluhopisy výměnou za kreditní riziko emitentů.' }),
  },
  {
    test: (k) => k.includes('government') || k.includes('treasury') || k.includes('gilt') || k.includes('bund'),
    info: (label) => ({ label, provider: getIndexProvider(label), what: 'Státní dluhopisy – považované za nejbezpečnější část portfolia. Cena reaguje hlavně na pohyb úrokových sazeb (delší splatnost = větší citlivost).' }),
  },
  {
    test: (k) => k.includes('aggregate') || (k.startsWith('bloomberg') && k.includes('bond')),
    info: (label) => ({ label, provider: 'Bloomberg', what: 'Široký dluhopisový index kombinující státní i podnikové dluhopisy investičního stupně. Základní stavební kámen dluhopisové části portfolia.' }),
  },
  {
    test: (k) => k.startsWith('bloomberg'),
    info: (label) => ({ label, provider: 'Bloomberg', what: 'Dluhopisový index Bloomberg – koš dluhopisů podle dané splatnosti, měny a typu emitenta.' }),
  },
  {
    test: (k) => k === 'government bond' || k === 'bond',
    info: (label) => ({ label, provider: 'Dluhopisy', what: 'Koš dluhopisů; výnos a riziko určuje typ emitenta (stát vs. firma) a splatnost.' }),
  },
  {
    test: (k) => k.includes('crypto') || k.includes('bitcoin') || k.includes('ethereum'),
    info: (label) => ({ label, provider: 'Krypto', what: 'Kryptoaktivum s extrémní kolísavostí; produkt typu ETP/ETN krytý reálně drženými coiny.' }),
  },
];

/* Sloučí do jednoho indexu i varianty, které se liší jen replikací / třídou akcií
   (Swap, Hedged, Acc, Dist…) přilepenou JEDNOU mezerou – ty `normalizeIndexName`
   (řez na dvojité mezeře) nechytí. NEsluč strategie (Covered Call, Leveraged) ani
   sektory (Biotech, Semiconductor) – to jsou jiné indexy. Jen pro popisnou sekci. */
function cleanIndexForDescription(raw?: string | null): string {
  const base = normalizeIndexName(raw);
  return base
    .replace(/\s+(swap|synthetic|synth|hedged|unhedged|acc|dist|inc|distributing|accumulating)\b.*$/i, '')
    .replace(/\s+(usd|eur|gbp|chf|jpy)\b.*$/i, '')
    .trim();
}

/**
 * Vrátí odborný popis indexu pro zadaný surový/kanonický název, nebo null.
 */
export function getIndexInfo(rawOrLabel?: string | null): IndexInfo | null {
  if (!rawOrLabel) return null;
  const cleaned = cleanIndexForDescription(rawOrLabel);
  const key = canonicalIndexKey(cleaned);
  if (!key) return null;
  const label = canonicalIndexLabel(cleaned);
  const exact = EXACT[key];
  if (exact) return { label, ...exact };
  for (const f of FAMILY) {
    if (f.test(key)) return f.info(label);
  }
  return null;
}

/**
 * Z pole ETF sestaví nejčastější indexy kategorie (s popisem), seřazené dle počtu
 * fondů. Sloučí varianty téhož indexu (Swap/Hedged/Acc/…), vrací jen indexy s
 * popisem a s aspoň 2 fondy (kvalita před kvantitou; drobné výjimky se neukazují).
 * Vrací i `matched` = kolik fondů kategorie spadá pod zobrazené indexy, aby šlo
 * počty poctivě rámovat vůči celku.
 */
export function topIndexesForCategory(
  etfs: { index_name?: string | null }[],
  limit = 4
): { info: IndexInfo; count: number }[] {
  const byKey = new Map<string, { info: IndexInfo; count: number }>();
  for (const e of etfs) {
    const key = canonicalIndexKey(cleanIndexForDescription(e.index_name));
    if (!key) continue;
    const existing = byKey.get(key);
    if (existing) {
      existing.count += 1;
      continue;
    }
    const info = getIndexInfo(e.index_name);
    if (info) byKey.set(key, { info, count: 1 });
  }
  return [...byKey.values()]
    .filter((x) => x.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

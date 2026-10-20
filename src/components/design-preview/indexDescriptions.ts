/* Odborné popisy akciových, dluhopisových a krypto indexů pro žebříčky top ETF.
 *
 * Cíl: na stránce kategorie ukázat NEgenerický, faktický popis indexů, které
 * fondy v kategorii reálně sledují (co index měří, kolik má složek, jak je vážený,
 * jaké je pokrytí trhu). To je unikátní obsah = klíč k indexaci v Google.
 *
 * Klíčováno kanonickým klíčem indexu (canonicalIndexKey → lowercase). Když přesná
 * shoda chybí, getIndexInfo zkusí rodinové fallbacky (dluhopisy, krypto, sektory).
 */

import { canonicalIndexKey, canonicalIndexLabel, getIndexProvider, normalizeIndexName, indexFonduLabel } from '@/utils/indexNormalization';

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
    holdings: '~1 300 firem', // MSCI factsheet 6/2026: 1 283 složek
    what: 'Velké a střední firmy z 23 vyspělých trhů světa, vážené tržní kapitalizací. Pokrývá zhruba 85 % kapitalizace vyspělých trhů, ale nezahrnuje rozvíjející se ekonomiky. Váhu drtivě určují USA (kolem 70 %).',
  },
  's&p 500': {
    provider: 'S&P Dow Jones',
    holdings: '~500 firem',
    what: 'Zhruba 500 největších veřejně obchodovaných firem v USA, vážených tržní kapitalizací. Pokrývá kolem 80 % hodnoty amerického akciového trhu a je nejsledovanějším měřítkem výkonnosti americké ekonomiky.',
  },
  'msci acwi': {
    provider: 'MSCI',
    holdings: '~2 500 firem', // MSCI factsheet 8/2026: 2 458 složek
    what: 'MSCI All Country World – velké a střední firmy z 23 vyspělých a 24 rozvíjejících se trhů. Jedním indexem pokryje zhruba 85 % globální investovatelné kapitalizace včetně rozvíjejících se trhů.',
  },
  'msci acwi imi': {
    provider: 'MSCI',
    holdings: '~8 200 firem',
    // MSCI factsheet 6/2026: 8 195 složek, 23 vyspělých + 24 rozvíjejících se trhů, ~99 % investovatelného trhu.
    what: 'MSCI ACWI rozšířený o malé firmy (IMI = Investable Market Index): velké, střední i malé firmy z 23 vyspělých a 24 rozvíjejících se trhů. Pokrývá zhruba 99 % investovatelné kapitalizace světových akcií.',
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
  etfs: { index_name?: string | null; name?: string | null }[],
  limit = 4
): { info: IndexInfo; count: number }[] {
  // Index fondu stejnou funkcí jako srovnávač (indexFonduLabel): `index_name` je u ~3 000 fondů prázdný
  // nebo useknutý → index se pozná i z názvu fondu (revize 18. 10. 2026: „MSCI ACWI 6 z 24“, ve skutečnosti 14).
  const byKey = new Map<string, { info: IndexInfo; count: number }>();
  for (const e of etfs) {
    const label = indexFonduLabel(e);
    if (!label) continue;
    const key = canonicalIndexKey(cleanIndexForDescription(label));
    if (!key) continue;
    const existing = byKey.get(key);
    if (existing) {
      existing.count += 1;
      continue;
    }
    const info = getIndexInfo(label);
    if (info) byKey.set(key, { info, count: 1 });
  }
  return [...byKey.values()]
    .filter((x) => x.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/* ── DLUHOPISY PO RODINÁCH INDEXŮ (kolo 6, 20. 10. 2026) ──
   Dluhopisové indexy se tříští na desítky variant podle splatnosti, měny a poskytovatele (Bloomberg Euro Treasury,
   iBoxx EUR Sovereigns Eurozone, FTSE EMU Government, J.P. Morgan EMU…). Revize: „Euro Government 2 z 259“, chyběly
   americké státní dluhopisy, přitom fondů na eurozónu bylo přes 20 (EUNH, VGEA, XGLE, SPF0, SYBB, IEGS…).
   Pořadí pravidel je důležité: „Global Aggregate Treasuries“ je státní, ne smíšený; „Euro Short Treasury“ je eurozóna. */
const GOV = /\b(Gov|Govt|Government|Treasur(y|ies)|Sovereigns?|Gilts?|Bund|eb\.rexx|BTP|OAT|T-Bill)/i;
const CORP = /Corporate|\bCorp\b|Corporates|Credit|Investment Grade/i;
const USD = /(\bUS\b|\bUSD\b|U\.S\.|\$)/;
export const RODINY_DLUHOPISU: { id: string; test: (t: string) => boolean; info: IndexInfo }[] = [
  { id: 'konvertibilni', test: (t) => /Convertible/i.test(t),
    info: { label: 'Konvertibilní dluhopisy', provider: 'Skupina indexů', what: 'Firemní dluhopisy, které lze vyměnit za akcie emitenta. Chovají se napůl jako dluhopis, napůl jako akcie – kolísají víc než běžné dluhopisy.' } },
  { id: 'inflace', test: (t) => /Inflation|\bTIPS\b|Linker/i.test(t),
    info: { label: 'Dluhopisy chráněné proti inflaci', provider: 'Skupina indexů', what: 'Státní dluhopisy, jejichž jistina roste s inflací (americké TIPS, evropské inflační dluhopisy). Chrání proti inflaci v USA nebo eurozóně, ne proti české.' } },
  { id: 'hy', test: (t) => /High Yield|\bHY\b|Fallen Angel|Crossover/i.test(t),
    info: { label: 'Rizikové firemní dluhopisy (high yield)', provider: 'Skupina indexů', what: 'Dluhopisy firem s ratingem pod investičním stupněm. Vyšší úrok výměnou za vyšší riziko nesplácení; v krizích klesají podobně jako akcie.' } },
  { id: 'em', test: (t) => /Emerging|\bEM\b|EMBI|CEMBI|\bChina\b|Brazil|India/i.test(t),
    info: { label: 'Dluhopisy rozvíjejících se trhů', provider: 'Skupina indexů', what: 'Státní i firemní dluhopisy rozvíjejících se zemí – v dolarech nebo v místních měnách. Vyšší úrok, ale i vyšší politické a měnové riziko.' } },
  { id: 'gov-eur', test: (t) => GOV.test(t) && /\b(Euro|EUR|EMU|Eurozone|Euro Area|Germany|German|France|French|Italy|Italian|Spain|Spanish|Bund|eb\.rexx|BTP|OAT)\b/i.test(t),
    info: { label: 'Státní dluhopisy eurozóny', provider: 'Skupina indexů', what: 'Dluhopisy vlád eurozóny (Německo, Francie, Itálie, Španělsko…) – celý trh, jednotlivé splatnosti i jednotlivé země. Indexy Bloomberg, iBoxx, FTSE, J.P. Morgan či Solactive se liší hlavně výběrem a vážením zemí.' } },
  { id: 'gov-us', test: (t) => GOV.test(t) && (USD.test(t) || /Short Treasury|\bTreasuries\b/i.test(t)) && !/Global Aggregate Treasuries|Global Treasury|\bG7\b/i.test(t),
    info: { label: 'Státní dluhopisy USA', provider: 'Skupina indexů', what: 'Americké státní dluhopisy (Treasuries) – od pokladničních poukázek do 1 roku po dluhopisy se splatností přes 20 let. Čím delší splatnost, tím víc cena reaguje na změnu sazeb.' } },
  { id: 'gov-global', test: (t) => GOV.test(t) && /Global|\bG7\b|World/i.test(t) && !/Japan|\bUK\b|Gilt|Swiss|Canada|Australia/i.test(t),
    info: { label: 'Globální státní dluhopisy', provider: 'Skupina indexů', what: 'Státní dluhopisy vyspělých zemí celého světa v jednom fondu (USA, Japonsko, eurozóna, Británie…). Často ve třídách zajištěných do eura či dolaru.' } },
  { id: 'gov-jine', test: (t) => GOV.test(t),
    info: { label: 'Státní dluhopisy dalších zemí', provider: 'Skupina indexů', what: 'Státní dluhopisy jedné země mimo eurozónu a USA – britské (gilts), japonské, švýcarské a další. Výnos v korunách určuje i kurz dané měny.' } },
  { id: 'kratke', test: (t) => /Ultra-?short|Floating|\bFRN\b|Money Market/i.test(t),
    info: { label: 'Krátkodobé a s pohyblivou sazbou', provider: 'Skupina indexů', what: 'Dluhopisy se splatností do 1 roku nebo s úrokem, který se průběžně mění se sazbami. Málo kolísají, výnos sleduje krátkodobé sazby.' } },
  { id: 'corp-eur', test: (t) => CORP.test(t) && /\b(EUR|Euro)\b/i.test(t),
    info: { label: 'Firemní dluhopisy v eurech', provider: 'Skupina indexů', what: 'Dluhopisy firem s investičním ratingem vydané v eurech. Vyšší úrok než státní dluhopisy výměnou za riziko, že firma nesplatí.' } },
  { id: 'corp-usd', test: (t) => CORP.test(t) && USD.test(t),
    info: { label: 'Firemní dluhopisy v dolarech', provider: 'Skupina indexů', what: 'Dluhopisy firem s investičním ratingem vydané v dolarech (převážně americké firmy). Výnos v korunách ovlivňuje i kurz dolaru.' } },
  { id: 'corp-jine', test: (t) => CORP.test(t),
    info: { label: 'Firemní dluhopisy – globální a jiné měny', provider: 'Skupina indexů', what: 'Firemní dluhopisy investičního stupně z celého světa nebo v jiných měnách (libra, frank…).' } },
  { id: 'aggregate', test: (t) => /Aggregate|Universal|Core Bond/i.test(t),
    info: { label: 'Smíšené indexy (státní i firemní)', provider: 'Skupina indexů', what: 'Široké „aggregate“ indexy, které v jednom fondu kombinují státní, firemní a zajištěné dluhopisy investičního stupně – globální, americké i eurové.' } },
  { id: 'covered', test: (t) => /Covered|Mortgage|Pfandbrief/i.test(t),
    info: { label: 'Zástavní listy a hypotečně kryté dluhopisy', provider: 'Skupina indexů', what: 'Dluhopisy kryté zástavou (zástavní listy bank, americké MBS). Riziko nesplácení je nízké, cena reaguje hlavně na sazby.' } },
];

/** Rodina dluhopisového fondu podle názvu a indexu (null = nezařazeno). */
export function rodinaDluhopisu(e: { index_name?: string | null; name?: string | null }): (typeof RODINY_DLUHOPISU)[number] | null {
  // Měna TŘÍDY („UCITS ETF EUR (Dist)“) a zajištění („EUR Hedged“) neříkají nic o tom, čí dluhopisy fond drží.
  const bezZaj = (x: string) => x.replace(/\(?\b(?:[A-Z]{3}\s+)?Hedged\)?/gi, ' ');
  const t = `${bezZaj(String(e.name ?? '').replace(/\s+UCITS\b.*$/i, ''))} | ${bezZaj(String(e.index_name ?? ''))}`;
  return RODINY_DLUHOPISU.find((r) => r.test(t)) ?? null;
}

/** Nejčastější rodiny dluhopisových indexů (stejný tvar jako topIndexesForCategory). */
export function topBondFamilies(
  etfs: { index_name?: string | null; name?: string | null }[],
  limit = 4,
): { info: IndexInfo; count: number }[] {
  const pocty = new Map<string, { info: IndexInfo; count: number }>();
  for (const e of etfs) {
    const r = rodinaDluhopisu(e);
    if (!r) continue;
    const x = pocty.get(r.id);
    if (x) x.count += 1; else pocty.set(r.id, { info: r.info, count: 1 });
  }
  return [...pocty.values()].filter((x) => x.count >= 2).sort((a, b) => b.count - a.count).slice(0, limit);
}

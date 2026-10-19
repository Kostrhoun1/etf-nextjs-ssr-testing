import { Broker, CenikNakupu } from '../types/broker/index';

/** Kdy byly poplatky a tvrzení níže naposledy OVĚŘENY u oficiálních ceníků brokerů (pravidlo č. 1).
 *  Zdroje 18. 10. 2026: DEGIRO Přehled poplatků (1. 1. 2026), XTB tabulka poplatků (20. 10. 2026),
 *  Fio Ceník (od 1. 7. 2026), Trading 212 Terms + helpcentre (13. 10. 2026), IBKR pricing (Germany),
 *  Portu Sazebník (od 1. 9. 2026). Denní kontrola (scripts/check-fund-data.mjs) varuje po 90 dnech –
 *  XTB vydává sazebník zhruba každý měsíc. Po novém ověření datum aktualizuj. */
export const CENIKY_OVERENY = '2026-10-18';
/** „18. října 2026“ – pro texty „ceník ověřen …“ na stránkách brokerů (jediný zdroj data, ne editorial-check). */
export const cenikyOverenyStr = new Date(`${CENIKY_OVERENY}T00:00:00Z`).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const cenikyOverenyIso = CENIKY_OVERENY;

export const brokers: Broker[] = [
  {
    id: 'degiro',
    name: 'DEGIRO',
    logo: '/lovable-uploads/f9bacf3b-7b11-4c31-917d-e16803dc0887.png',
    description: 'Populární evropský broker s nízkými poplatky a širokou nabídkou ETF. Ideální pro nákladově uvědomělé investory.',
    rating: 79,
    web: 'https://www.degiro.cz',
    regulation: 'BaFin (DE), DNB/AFM (NL)',
    protection: '100 000 EUR (DE), 20 000 EUR (investice)',
    ochrana: { hotovost: '100 000 EUR (pojištění vkladů, flatexDEGIRO Bank)', cennePapiry: 'max. 20 000 EUR (německý kompenzační systém)' },
    // ETF Selection: 0 EUR provize + 1 EUR manipulační poplatek; ostatní ETF 3 EUR celkem. Směna CZK/EUR zdarma.
    // Připojení k burze: 2,50 EUR ročně za každou zahraniční burzu, nejvýš 0,25 % hodnoty účtu; NEúčtuje se u ETF
    // Selection a pražské burzy (Přehled poplatků degiro.cz/data/pdf/cs/Prehled_poplatku.pdf, str. 10, ověřeno
    // 18. 10. 2026 – ZAMERNA-ROZHODNUTI.md). Roční náklad na /kde-koupit proto rozlišuje ETF Selection (bez poplatku
    // za burzu) a ostatní ETF („+ až 2,5 EUR“ – přesná výše závisí na hodnotě účtu).
    nakup: { pasma: [{ doEur: null, procento: 0, minEur: 0, pevneEur: 1 }], smena: { procento: 0, minUsd: 0 }, ostatniEtfEur: 3, burzaRocneMaxEur: 2.5, pozn: 'ETF Selection; ostatní ETF 3 EUR', smenaPozn: 'CZK/EUR zdarma' },
    etfFee: '1 EUR (ETF Selection), 3 EUR (ostatní ETF)',
    managementFee: '0 EUR (u ETF mimo ETF Selection připojení k burze až 2,5 EUR ročně)',
    fxFee: 'CZK/EUR zdarma, ostatní 0,25 %',
    fractional: false,
    // Ověřeno 18. a znovu 19. 10. 2026 (degiro.cz/helpdesk/contact): „our Service Desk is not available in Czech, but we're
    // happy to help you out in English“ – web je česky, podpora jen anglicky (telefon +49 69 5060419 50, Po–Pá 8–22).
    czSupport: false,
    czDividends: '35 % (možnost vratky 20 %)',
    minDeposit: '0 EUR',
    platforms: ['Web', 'Android', 'iOS'],
    markets: ['EU', 'US', 'Asia'],
    etfCount: '3000+',
    languages: ['čeština', 'angličtina', 'němčina'],
    customerSupport: 'Telefon Po–Pá 8–22, e-mail (anglicky)',
    specialFeatures: ['Core ETF selection', 'Dividend reinvestment', 'Tax reports'],
    pros: [
      'ETF Selection za 0 EUR komise (200+ fondů)',
      'Pouze 1 EUR manipulační poplatek',
      'Bezplatná konverze CZK/EUR',
      'Široká nabídka UCITS ETF',
      'Nízký poplatek za ETF Selection (1 EUR)'
    ],
    cons: [
      'Omezení kvůli PRIIPS dokumentaci',
      'Nepodporuje frakční ETF',
      'Vyšší zdanění českých dividend'
    ]
  },
  {
    id: 'xtb',
    name: 'XTB',
    logo: '/lovable-uploads/a7162820-5478-4cd8-9bfd-fd04b80a42ff.png',
    description: 'Polský broker kótovaný na varšavské burze (licence KNF, v ČR organizační složka), ETF bez provize do 100 000 EUR měsíčně a česká podpora v pracovní dny.',
    rating: 94,
    web: 'https://www.xtb.com/cz',
    regulation: 'KNF (PL), v ČR organizační složka pod dohledem ČNB',
    protection: 'max. 20 100 EUR (polský systém náhrad KDPW)',
    // Garanční (kompenzační) systémy dle směrnice 97/9/ES kryjí peníze i cenné papíry klienta společným limitem.
    // Ověřeno 19. 10. 2026: XTB „Informácie o systéme ochrany investícií“ (xas-new-cdn.xtb.com/file/0103/54/…f4a31e487a.pdf,
    // čl. 2.2 a 2.4: náhrada peněz i nakoupených nástrojů, 100 % do 3 000 EUR, nad to 90 %, chráněná částka do 22 000 EUR
    // → výplata max. 20 100 EUR) a xtb.com/pl/ochrona-srodkow-klientow-kb (KDPW). Cenné papíry vede XTB odděleně od svého
    // majetku (CZ VOP čl. 4.36), při krachu se vracejí; náhrada nastupuje, jen kdyby chyběly. Části podílů (frakce) vlastní
    // právně XTB ve svěřenské správě pro klienta (VOP čl. 7.70) – zda je kryje systém náhrad, dokumenty neuvádějí.
    ochrana: { hotovost: 'max. 20 100 EUR – společný limit s cennými papíry', cennePapiry: 'max. 20 100 EUR (polský systém KDPW: 100 % do 3 000 EUR, nad to 90 %)' },
    // 0 % do 100 000 EUR objemu měsíčně (nad limit 0,2 %, min. 10 EUR); směna CZK→EUR 0,5 %.
    nakup: { pasma: [{ doEur: null, procento: 0, minEur: 0, pevneEur: 0 }], smena: { procento: 0.5, minUsd: 0 }, pozn: 'do 100 000 EUR objemu měsíčně' },
    etfFee: 'Akcie a ETF 0 % do 100 000 EUR/měs., nad limit 0,2 % (min. 10 EUR)',
    managementFee: '0 EUR',
    fxFee: '0,5 %',
    fractional: true,
    czSupport: true,
    czDividends: '35 %',
    minDeposit: '0 EUR',
    platforms: ['xStation 5', 'Web', 'Android', 'iOS'],
    markets: ['EU', 'US', 'UK'],
    etfCount: '9 600+ akcií a ETF (EU, USA)',
    languages: ['čeština', 'polština', 'angličtina'],
    customerSupport: 'Po–Pá 8–18',
    specialFeatures: ['Frakční práva', 'Demo účet 200k Kč', 'Vzdělávací sekce', 'Rychlé vklady zdarma'],
    pros: [
      'Investování do akcií a ETF bez komisí',
      'Přes 9 600 akcií a ETF z evropských a amerických burz',
      'Česká zákaznická podpora (Po–Pá 8–18)',
      'Moderní obchodní platforma xStation 5 zdarma',
      'Možnost XTB demo účtu s 200 000 Kč',
      'Frakční práva pro investice s malým kapitálem',
      'Rychlé vklady a výběry, většinou zdarma',
      'Transparentní broker kótovaný na varšavské burze',
      'Kvalitní vzdělávací sekce a webináře'
    ],
    cons: [
      'Nenabízí obchodování opcí a futures kontraktů',
      'Z dividend českých akcií srážka 35 %',
      'Platforma může být pro nováčky zpočátku nepřehledná'
    ]
  },
  {
    id: 'fio',
    name: 'Fio e-Broker',
    logo: '/lovable-uploads/55aac89b-3834-421c-8689-34fb13fad2b1.png',
    description: 'Český broker s lokální podporou a srážkou z českých dividend 15 %.',
    rating: 75,
    web: 'https://www.fio.cz/investice',
    regulation: 'ČNB (CZ)',
    protection: '100 000 EUR (hotovost, FPV), 20 000 EUR (cenné papíry, GFOCP)',
    ochrana: { hotovost: '100 000 EUR (Fond pojištění vkladů)', cennePapiry: 'max. 20 000 EUR (Garanční fond OCP)' },
    // Ceník od 1. 7. 2026, XETRA: 3,95 EUR do 1 400 EUR, 4,95 EUR do 3 000 EUR, nad 0,15 % (min. 6,95 EUR).
    // Směna bez poplatku, náklad je v kurzu banky – výši spreadu neznáme → smena: null („—“).
    nakup: {
      pasma: [
        { doEur: 1400, procento: 0, minEur: 0, pevneEur: 3.95 },
        { doEur: 3000, procento: 0, minEur: 0, pevneEur: 4.95 },
        { doEur: null, procento: 0.15, minEur: 6.95, pevneEur: 0 },
      ],
      smena: null,
      pozn: 'do 1 400 EUR; 4,95 EUR do 3 000 EUR, pak 0,15 %',
      smenaPozn: 'v kurzu banky, výši ceník neuvádí',
    },
    etfFee: '3,95 EUR do 1 400 EUR, 4,95 EUR do 3 000 EUR, nad 0,15 % (min. 6,95 EUR) – Xetra; české ETF 0,29–0,35 %',
    managementFee: '0 Kč',
    fxFee: 'Bez poplatku, náklad je v kurzu banky (spread)',
    fractional: false,
    czSupport: true,
    czDividends: '15 %',
    minDeposit: '0 Kč',
    platforms: ['Web', 'Android', 'iOS'],
    markets: ['CZ', 'EU', 'US'],
    etfCount: '200+',
    languages: ['čeština'],
    customerSupport: 'Infolinka Po–Pá 9–17, pobočky',
    specialFeatures: ['Czech dividend optimization', 'Free currency exchange', 'Local support'],
    pros: [
      'Česká společnost s lokální podporou',
      'Z českých dividend srážka 15 %',
      'Pobočky po celé ČR',
      'KID dokumentace v češtině'
    ],
    cons: [
      'Vyšší poplatky za ETF',
      'Technické problémy platformy',
      'Nepodporuje frakční ETF'
    ]
  },
  {
    id: 'trading212',
    name: 'Trading 212',
    logo: '/lovable-uploads/25c6d816-7993-40c3-abe2-e21c45cc239d.png',
    description: 'Zcela bezpoplatkový broker s moderní mobilní aplikací, frakčním investováním a AutoInvest funkcí.',
    rating: 87,
    web: 'https://www.trading212.com',
    regulation: 'CySEC (CY) pro CZ klienty, FCA (UK)',
    protection: '20 000 EUR (ICF, Kypr)',
    ochrana: { hotovost: 'max. 20 000 EUR – společný limit s cennými papíry', cennePapiry: 'max. 20 000 EUR (kyperský fond ICF)' },
    // 0 % provize; směna CZK→EUR 0,15 %. „O víkendu 0,5 %“ VYPUŠTĚNO 19. 10. 2026: oficiální zdroj se nepodařilo dohledat
    // (trading212.com/multi-currency i /terms blokují stažení ochranou proti botům) a Wise (wise.com/gb/blog/trading-212-fx-fees,
    // zdroje ověřeny 15. 7. 2026) uvádí, že se poplatek o víkendu nemění. 0,5 % platí u CFD účtu, ne u Invest.
    nakup: { pasma: [{ doEur: null, procento: 0, minEur: 0, pevneEur: 0 }], smena: { procento: 0.15, minUsd: 0 } },
    etfFee: '0 %',
    managementFee: '0 EUR',
    fxFee: '0,15 %',
    fractional: true,
    czSupport: false,
    czDividends: '—', // neověřeno, zda T212 české akcie vůbec nabízí (18. 10. 2026) → raději „—“
    minDeposit: '1 EUR',
    platforms: ['Web', 'Android', 'iOS'],
    markets: ['EU', 'US', 'UK'],
    etfCount: '1 400+ ETF, 11 000+ akcií',
    languages: ['angličtina'],
    customerSupport: '24/7 (chat)',
    specialFeatures: ['Pie charts investing', 'Commission-free', 'AutoInvest'],
    pros: [
      'Zcela bezplatné obchodování',
      'Frakční investování od 1 EUR',
      'Intuitivní mobilní aplikace',
      'Automatizované investování (Pies)'
    ],
    cons: [
      'Omezená česká podpora',
      'Méně pokročilých analytických nástrojů',
      'Závislost na mobilní aplikaci'
    ]
  },
  {
    id: 'ibkr',
    name: 'Interactive Brokers',
    logo: '/lovable-uploads/4465126c-b9d7-4fc5-b560-477d3425500d.png',
    // Rok založení a počet účtů se v textech rozcházely (1977/1978, 1,5/2,7 mil.) → vypuštěno (revize 18. 10. 2026).
    description: 'Americký broker kótovaný na Nasdaq; české klienty obsluhuje irská entita. Profesionální řešení pro zkušené investory.',
    rating: 85,
    web: 'https://www.interactivebrokers.ie',
    regulation: 'CBI (IE) pro CZ klienty, SEC (US)',
    protection: '90 % ztráty, max. 20 000 EUR (ICCL, IE); SIPC jen US entita', // interactivebrokers.ie/en/general/security-investor-protection.php, ověřeno 18. 10. 2026
    ochrana: { hotovost: '90 % ztráty, max. 20 000 EUR – společný limit s cennými papíry', cennePapiry: '90 % ztráty, max. 20 000 EUR (irský ICCL); SIPC jen US entita' },
    // Tiered: 0,05 % z objemu, min. 1,25 EUR + poplatky burzy; směna 0,002 %, min. 2 USD.
    nakup: { pasma: [{ doEur: null, procento: 0.05, minEur: 1.25, pevneEur: 0 }], plusBurza: true, smena: { procento: 0.002, minUsd: 2 }, smenaNajednou: true, pozn: '+ poplatky burzy (plán Tiered)', smenaPozn: 'stačí jednou za větší částku' },
    etfFee: 'Xetra: 0,05 % (min. 1,25 EUR) + poplatky burzy (plán Tiered), v plánu Fixed min. 3 EUR',
    managementFee: '0 EUR',
    fxFee: '0,002 % (min. 2 USD za směnu)',
    fractional: true,
    czSupport: false,
    czDividends: '35 %',
    minDeposit: '0 USD',
    platforms: ['TWS', 'Web', 'Android', 'iOS', 'Desktop'],
    // „175+ trhů“: interactivebrokers.com/en/trading/international-lp.php („more than 175 markets worldwide“, ověřeno 18. 10. 2026).
    // Dřív tu bylo „86 burz“ a „14 000+ akcií a ETF“, v recenzi „150+ burz“ a „150 mil. instrumentů“ → jedno číslo.
    markets: ['Global – 175+ trhů'],
    etfCount: 'Akcie a ETF na 175+ trzích',
    languages: ['angličtina', 'němčina', 'francouzština'],
    customerSupport: '24/7',
    specialFeatures: ['Advanced analytics', 'Global markets', 'Professional tools'],
    pros: [
      'Rozsáhlý globální přístup (175+ trhů)',
      'Nízké obchodní náklady u větších objemů',
      'Frakční obchodování a žádný min. vklad'
    ],
    cons: [
      'Komplexní rozhraní pro začátečníky',
      'Bez MetaTrader podpory',
      'Bez české jazykové podpory'
    ]
  },
  {
    id: 'portu',
    name: 'Portu',
    logo: '/portu-logo.svg',
    description: 'Česká automatizovaná investiční platforma (robo-poradce) zřízená v roce 2017. Sestaví a spravuje portfolio ETF za roční poplatek.',
    // Robo-poradce: skóre brokerů se na něj nevztahuje (jiná kategorie, revize 18. 10. 2026). Dřív 98 → nejvyšší
    // „skóre“ v tabulce brokerů, ač nejde o brokera ke svépomocnému nákupu.
    rating: null,
    robo: true,
    web: 'https://www.portu.cz',
    regulation: 'ČNB (CZ)',
    protection: '20 000 EUR (Garanční fond OCP)',
    ochrana: { hotovost: 'max. 20 000 EUR – společný limit s cennými papíry', cennePapiry: 'max. 20 000 EUR (Garanční fond OCP)' },
    etfFee: '0,24–1 % ročně (dle částky)',
    managementFee: '0,24–1 % ročně (dle objemu a fixace)',
    fxFee: 'Zahrnut v poplatku',
    fractional: true,
    czSupport: true,
    czDividends: '15 %',
    minDeposit: '500 Kč',
    platforms: ['Web', 'Android', 'iOS'],
    markets: ['ETF', 'Akcie', 'Krypto', 'české akcie'],
    etfCount: 'ETF portfolia, jednotlivé akcie, krypto',
    languages: ['čeština'],
    customerSupport: 'Pracovní dny 9–17',
    specialFeatures: ['Robo-advisor', 'Investiční rezerva', 'Dětské účty', 'Krypto portfolia'],
    pros: [
      'Velmi uživatelský přístup',
      'Roční poplatek 0,24–1 % z hodnoty',
      'Nízký minimální vklad (500 Kč)',
      'Automatická správa portfolia',
      'Flexibilní investování'
    ],
    cons: [
      'Omezený výběr akcií',
      'Nižší potenciální výnosy než aktivní obchodování',
      'Není ideální pro zkušené investory',
      'Bez aktivního obchodování'
    ]
  }
];

/* Srovnávací tabulka (/srovnani-brokeru) se GENERUJE z objektů brokerů výše (SrovnaniBrokeruClient) – jeden zdroj
   pravdy. Dřív to byla ručně vedená kopie, která se rozešla (IBKR „$0.005/akcii“ = ceník US akcií, XTB „licence ČNB“,
   revize 18. 10. 2026). */

/* ---------- Brokeři vs robo-poradce ---------- */
/** Brokeři ke svépomocnému nákupu ABECEDNĚ (bez robo-poradce). Skóre zrušeno 19. 10. 2026; řazení podle nákladů by
 *  zvýhodnilo jednu částku, proto neutrálně podle jména. */
export const brokeriAbecedne: Broker[] = brokers
  .filter((b) => !b.robo)
  .sort((a, b) => a.name.localeCompare(b.name, 'cs'));
/** Robo-poradci (Portu) – jiná kategorie, ve srovnání zvlášť. */
export const roboPoradci: Broker[] = brokers.filter((b) => b.robo);

/* ---------- Kolik stojí nákup ETF za X Kč (spočítané z ceníků výše, ne natvrdo) ---------- */
export interface Kurzy { eurCzk: number; usdCzk: number; datum: string }
export interface NakladNakupu {
  /** Poplatek za nákup v Kč (provize + manipulační poplatek). */
  provizeKc: number;
  /** Směna CZK→EUR v Kč; null = výši neznáme (spread v kurzu banky). */
  smenaKc: number | null;
  /** Součet; null, když některou složku neznáme. */
  celkemKc: number | null;
  /** K provizi se ještě připočítávají poplatky burzy (neznámá výše). */
  plusBurza: boolean;
}

/** Poplatek za pokyn v EUR podle pásma ceníku. */
export function provizeEur(c: CenikNakupu, objemEur: number): number {
  const p = c.pasma.find((x) => x.doEur == null || objemEur <= x.doEur) ?? c.pasma[c.pasma.length - 1];
  return Math.max(p.pevneEur + (p.procento / 100) * objemEur, p.minEur);
}

/** Náklad jednoho nákupu ETF (Xetra, EUR) za `castkaKc` korun: poplatek za nákup + směna CZK→EUR. */
export function nakladNakupu(b: Broker, castkaKc: number, k: Kurzy): NakladNakupu | null {
  if (!b.nakup) return null;
  const provizeKc = provizeEur(b.nakup, castkaKc / k.eurCzk) * k.eurCzk;
  const s = b.nakup.smena;
  const smenaKc = s == null ? null : Math.max((s.procento / 100) * castkaKc, s.minUsd * k.usdCzk);
  return { provizeKc, smenaKc, celkemKc: smenaKc == null ? null : provizeKc + smenaKc, plusBurza: !!b.nakup.plusBurza };
}

/* ---------- Krátké popisy ceníku – JEDINÉ znění pro /kde-koupit, /srovnani-brokeru i recenze ----------
   Denní kontrola (scripts/check-fund-data.mjs) porovnává hodnoty vykreslené na stránkách (atributy data-poplatek,
   data-smena) a při rozdílu varuje. Jednotky jednotně: poplatek za nákup v EUR (ceník Xetry), směna v %. */
const nbsp = ' ';
const cislo = (v: number) => v.toLocaleString('cs-CZ', { maximumFractionDigits: 3 });

/** „0 EUR“, „1 EUR“, „0,05 %, min. 1,25 EUR“, „od 3,95 EUR“; null = broker nemá ceník nákupu (robo-poradce). */
export function popisPoplatku(b: Broker): string | null {
  const c = b.nakup;
  if (!c) return null;
  const p = c.pasma;
  if (p.length > 1) return `od ${cislo(p[0].pevneEur)}${nbsp}EUR`;
  if (p[0].procento > 0) return `${cislo(p[0].procento)}${nbsp}%, min.${nbsp}${cislo(p[0].minEur)}${nbsp}EUR`;
  return `${cislo(p[0].pevneEur)}${nbsp}EUR`;
}

/** Směna CZK→EUR: „0 %“, „0,5 %“, „0,002 %, min. 2 USD“; „—“ = výši neznáme (Fio: náklad je v kurzu banky). */
export function popisSmeny(b: Broker): string | null {
  const c = b.nakup;
  if (!c) return null;
  if (c.smena == null) return '—';
  const z = `${cislo(c.smena.procento)}${nbsp}%`;
  return c.smena.minUsd > 0 ? `${z}, min.${nbsp}${cislo(c.smena.minUsd)}${nbsp}USD` : z;
}

/** Min. vklad jednotně: „bez minima“ místo „0 EUR / 0 Kč / 0 USD“. */
export const popisMinVkladu = (b: Broker) => (/^0\s/.test(b.minDeposit) ? 'bez minima' : b.minDeposit.replace(' ', nbsp));

/** Kryje garanční systém hotovost i cenné papíry jedním společným limitem? (na rozdíl od pojištění vkladů u banky) */
export const spolecnyLimit = (b: Broker) => !!b.ochrana?.hotovost.includes('společný limit');

/** „90 % ztráty, max. 20 000 EUR (irský ICCL); SIPC jen US entita“ → hodnota + poznámka (jednotky jednotně v EUR). */
export function rozdelOchranu(t: string | undefined): { v: string; pozn?: string } {
  if (!t) return { v: '—' };
  const v = t.split(' – ')[0].split(' (')[0];
  const pozn = t.slice(v.length).replace(/[()]/g, '').replace(/^\s*–\s*/, '').trim();
  return { v: nezlomit(v), pozn: pozn || undefined };
}
/** Čísla a jednotky se nelámou („20 000 EUR“ nikdy „20 / 000 EUR“). */
export const nezlomit = (t: string) => t.replace(/(\d) (?=\d{3}\b)/g, '$1 ').replace(/(\d) (EUR|USD|Kč|%)/g, '$1 $2');
/** Ochrana hotovosti; u společného limitu poznámka „společný limit pro hotovost i cenné papíry“. */
export function ochranaHotovosti(b: Broker) {
  const r = rozdelOchranu(b.ochrana?.hotovost);
  return spolecnyLimit(b) ? { v: r.v, pozn: 'společný limit pro hotovost i cenné papíry' } : r;
}
/** Cenné papíry při krachu brokera: vedené odděleně → VRACEJÍ SE; garanční systém jen nahrazuje, co by chybělo.
 *  Dřív „Cenné papíry při krachu: 20 100 EUR“ – četlo se jako „chráněné jen do 20 100 EUR“ (revize kola 5, 19. 10. 2026). */
export function ochranaPapiru(b: Broker): { v: string; pozn?: string } {
  const r = rozdelOchranu(b.ochrana?.cennePapiry);
  if (r.v === '—') return r;
  return { v: 'Vracejí se vám', pozn: nezlomit(`kdyby chyběly, náhrada ${r.v}${r.pozn ? ` (${r.pozn})` : ''}`) };
}

/* ---------- Roční náklad (12 nákupů) – JEDNOTNĚ s texty u brokerů ----------
   Revize kola 4: IBKR text říká „směnu stačí udělat jednou“, ale roční součet počítal směnu 12× → u vícměnového
   účtu (smenaNajednou) se počítá JEDNA směna celé roční částky. DEGIRO: ETF Selection bez poplatku za burzu,
   ostatní ETF 3 EUR za nákup + až 2,5 EUR ročně za burzu (ověřeno v Přehledu poplatků, viz ZAMERNA-ROZHODNUTI.md). */
export interface NakladRocne {
  /** Součet za rok; null = některou složku neznáme (Fio směna). */
  celkemKc: number | null;
  /** 12 × poplatek za nákup (spodní hranice, když celkem neznáme). */
  provizeKc: number;
  /** Směna se počítá jednou za rok (vícměnový účet). */
  smenaJednou: boolean;
  /** ETF mimo zvýhodněný výběr (DEGIRO): součet za rok bez poplatku za burzu + jeho strop. */
  ostatni?: { celkemKc: number; burzaMaxKc: number };
}
export function nakladRocne(b: Broker, castkaKc: number, k: Kurzy): NakladRocne | null {
  const c = b.nakup;
  const n = nakladNakupu(b, castkaKc, k);
  if (!c || !n) return null;
  const provizeKc = 12 * n.provizeKc;
  const smenaJednou = !!c.smenaNajednou && c.smena != null;
  const smenaKc = c.smena == null ? null
    : smenaJednou ? Math.max((c.smena.procento / 100) * castkaKc * 12, c.smena.minUsd * k.usdCzk)
    : 12 * (n.smenaKc ?? 0);
  const ostatni = c.ostatniEtfEur != null && smenaKc != null
    ? { celkemKc: 12 * c.ostatniEtfEur * k.eurCzk + smenaKc, burzaMaxKc: (c.burzaRocneMaxEur ?? 0) * k.eurCzk }
    : undefined;
  return { celkemKc: smenaKc == null ? null : provizeKc + smenaKc, provizeKc, smenaJednou, ostatni };
}

/** Nejlevnější nákup podle částky (úseky „do X Kč broker A, nad X Kč broker B“) – pro hero /kde-koupit.
 *  Kandidáti = brokeři se známým součtem; vítěz platí jen tehdy, když je levnější i než spodní hranice brokerů
 *  s neznámou složkou (Fio směna, IBKR poplatky burzy). Jinak úsek bez vítěze (b = null). Krok 100 Kč. */
export function nejlevnejsiPodleCastky(k: Kurzy, odKc = 100, doKc = 1_000_000, krok = 100): { b: Broker | null; odKc: number; doKc: number }[] {
  const useky: { b: Broker | null; odKc: number; doKc: number }[] = [];
  for (let a = odKc; a <= doKc; a += krok) {
    let vitez: Broker | null = null;
    let min = Infinity;
    let spodniOstatnich = Infinity;
    for (const b of brokeriAbecedne) {
      const n = nakladNakupu(b, a, k);
      if (!n) continue;
      if (n.celkemKc != null && !n.plusBurza) {
        if (n.celkemKc < min) { min = n.celkemKc; vitez = b; }
      } else {
        spodniOstatnich = Math.min(spodniOstatnich, n.celkemKc ?? n.provizeKc);
      }
    }
    if (min > spodniOstatnich) vitez = null;
    const posl = useky[useky.length - 1];
    if (posl && posl.b?.id === vitez?.id) posl.doKc = a;
    else useky.push({ b: vitez, odKc: a, doKc: a });
  }
  return useky;
}

/** Regulace jednotně na všech stránkách (dřív „CBI (IE)“ v tabulce a „CBI (IE pro CZ klienty)“ v recenzi):
 *  hlavní dohled pro české klienty + zbytek jako poznámka. */
export function popisRegulace(b: Broker): { v: string; pozn?: string } {
  const casti = b.regulation.split(', ');
  const i = Math.max(0, casti.findIndex((c) => c.includes('pro CZ klienty')));
  const proCz = casti[i].includes('pro CZ klienty');
  const v = casti[i].replace(' pro CZ klienty', '');
  const ostatni = casti.filter((_, j) => j !== i).join(', ');
  const pozn = [proCz ? 'pro české klienty' : '', ostatni].filter(Boolean).join('; ');
  return { v: nezlomit(v), pozn: pozn || undefined };
}

/** Vedení účtu jednotně: „zdarma“ (dřív „0 Kč“ u Fio a „0 EUR“ u ostatních) + podmínka jako poznámka. */
export function popisVedeniUctu(b: Broker): { v: string; pozn?: string } {
  const t = b.managementFee;
  if (!/^0\s/.test(t)) return { v: nezlomit(t) };
  const pozn = t.match(/\((.*)\)/)?.[1];
  return { v: 'zdarma', pozn: pozn ? nezlomit(pozn) : undefined };
}

/** Česká podpora jednotně. „Ne“ u brokera s českým webem (DEGIRO) mátlo („degiro.cz je přece česky“) → upřesnění. */
export function popisPodpory(b: Broker): { v: string; pozn?: string } {
  if (b.czSupport) return { v: 'Ano', pozn: b.customerSupport };
  return { v: 'Ne', pozn: b.languages.includes('čeština') ? 'web česky, podpora jen anglicky' : 'jen anglicky' };
}

/** Daň z českých dividend jednotně: „35 %“ + poznámka „možnost vratky 20 %“; „—“ = neověřeno. */
export function popisDaneDividend(b: Broker): { v: string; pozn?: string } {
  const t = b.czDividends;
  if (t === '—') return { v: '—', pozn: 'neověřeno' };
  const [v, zbytek] = t.split(' (');
  return { v: nezlomit(v), pozn: zbytek ? nezlomit(zbytek.replace(')', '')) : undefined };
}

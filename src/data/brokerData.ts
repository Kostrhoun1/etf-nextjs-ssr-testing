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
    ochrana: { hotovost: '100 000 EUR (pojištění vkladů, flatexDEGIRO Bank)', cennePapiry: '20 000 EUR (německý kompenzační systém)' },
    // ETF Selection: 0 EUR provize + 1 EUR manipulační poplatek; ostatní ETF 3 EUR celkem. Směna CZK/EUR zdarma.
    nakup: { pasma: [{ doEur: null, procento: 0, minEur: 0, pevneEur: 1 }], smena: { procento: 0, minUsd: 0 } },
    etfFee: '1 EUR (ETF Selection), 3 EUR (ostatní ETF)',
    managementFee: '0 EUR (roční popl. za burzy 2,5 EUR)',
    fxFee: 'CZK/EUR zdarma, ostatní 0,25%',
    fractional: false,
    czSupport: false, // ověřeno 18. 10. 2026 (degiro.cz/helpdesk/contact): podpora jen anglicky
    czDividends: '35% (možnost vratky 20%)',
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
    protection: '20 100 EUR (polský garanční systém)',
    // Garanční (kompenzační) systémy dle směrnice 97/9/ES kryjí peníze i cenné papíry klienta společným limitem.
    ochrana: { hotovost: 'Do 20 100 EUR – společný limit s cennými papíry', cennePapiry: '20 100 EUR (polský garanční systém)' },
    // 0 % do 100 000 EUR objemu měsíčně (nad limit 0,2 %, min. 10 EUR); směna CZK→EUR 0,5 %.
    nakup: { pasma: [{ doEur: null, procento: 0, minEur: 0, pevneEur: 0 }], smena: { procento: 0.5, minUsd: 0 } },
    etfFee: 'Akcie a ETF 0 % do 100 000 EUR/měs., nad limit 0,2 % (min. 10 EUR)',
    managementFee: '0 EUR',
    fxFee: '0,5%',
    fractional: true,
    czSupport: true,
    czDividends: '35%',
    minDeposit: '0 EUR',
    platforms: ['xStation 5', 'Web', 'Android', 'iOS'],
    markets: ['EU', 'US', 'UK'],
    etfCount: '9 600+ akcií a ETF (EU, USA)',
    languages: ['čeština', 'polština', 'angličtina'],
    customerSupport: 'Česká podpora Po–Pá 8–18',
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
      'České akcie mají vysoké zdanění dividend (35 %)',
      'Platforma může být pro nováčky zpočátku nepřehledná'
    ]
  },
  {
    id: 'fio',
    name: 'Fio e-Broker',
    logo: '/lovable-uploads/55aac89b-3834-421c-8689-34fb13fad2b1.png',
    description: 'Český broker s lokální podporou a optimálním zdaněním českých dividend (15%).',
    rating: 75,
    web: 'https://www.fio.cz/investice',
    regulation: 'ČNB (CZ)',
    protection: '100 000 EUR (hotovost, FPV), 20 000 EUR (cenné papíry, GFOCP)',
    ochrana: { hotovost: '100 000 EUR (Fond pojištění vkladů)', cennePapiry: '20 000 EUR (Garanční fond OCP)' },
    // Ceník od 1. 7. 2026, XETRA: 3,95 EUR do 1 400 EUR, 4,95 EUR do 3 000 EUR, nad 0,15 % (min. 6,95 EUR).
    // Směna bez poplatku, náklad je v kurzu banky – výši spreadu neznáme → smena: null („—“).
    nakup: {
      pasma: [
        { doEur: 1400, procento: 0, minEur: 0, pevneEur: 3.95 },
        { doEur: 3000, procento: 0, minEur: 0, pevneEur: 4.95 },
        { doEur: null, procento: 0.15, minEur: 6.95, pevneEur: 0 },
      ],
      smena: null,
    },
    etfFee: '0,29-0,35 % (CZ), 3,95 EUR do 1 400 EUR (XETRA)',
    managementFee: '0 Kč',
    fxFee: 'Bez poplatku, náklad je v kurzu banky (spread)',
    fractional: false,
    czSupport: true,
    czDividends: '15%',
    minDeposit: '0 Kč',
    platforms: ['Web', 'Android', 'iOS'],
    markets: ['CZ', 'EU', 'US'],
    etfCount: '200+',
    languages: ['čeština'],
    customerSupport: 'Infolinka Po–Pá 9–17, pobočky',
    specialFeatures: ['Czech dividend optimization', 'Free currency exchange', 'Local support'],
    pros: [
      'Česká společnost s lokální podporou',
      'Standardní 15% zdanění českých dividend',
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
    regulation: 'FCA (UK), CySEC (EU pro CZ klienty)',
    protection: '20 000 EUR (ICF, Kypr)',
    ochrana: { hotovost: 'Do 20 000 EUR – společný limit s cennými papíry', cennePapiry: '20 000 EUR (kyperský fond ICF)' },
    // 0 % provize; směna CZK→EUR 0,15 % (o víkendu 0,5 %).
    nakup: { pasma: [{ doEur: null, procento: 0, minEur: 0, pevneEur: 0 }], smena: { procento: 0.15, minUsd: 0 } },
    etfFee: '0%',
    managementFee: '0 EUR',
    fxFee: '0,15% (v aplikaci)',
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
    regulation: 'CBI (IE pro CZ klienty), SEC (US)',
    protection: '20 000 EUR (ICF, IE); SIPC jen US entita',
    ochrana: { hotovost: 'Do 20 000 EUR – společný limit s cennými papíry', cennePapiry: '20 000 EUR (irský kompenzační systém); SIPC jen US entita' },
    // Tiered: 0,05 % z objemu, min. 1,25 EUR + poplatky burzy; směna 0,002 %, min. 2 USD.
    nakup: { pasma: [{ doEur: null, procento: 0.05, minEur: 1.25, pevneEur: 0 }], plusBurza: true, smena: { procento: 0.002, minUsd: 2 } },
    etfFee: 'Xetra: 0,05 % (min. 1,25 EUR, Tiered + poplatky burzy), Fixed min. 3 EUR',
    managementFee: '0 EUR (zrušen od 2021)',
    fxFee: '0,002% (min. $2)',
    fractional: true,
    czSupport: false,
    czDividends: '35%',
    minDeposit: '0 USD',
    platforms: ['TWS', 'Web', 'Android', 'iOS', 'Desktop'],
    // „175+ trhů“: interactivebrokers.com/en/trading/international-lp.php („more than 175 markets worldwide“, ověřeno 18. 10. 2026).
    // Dřív tu bylo „86 burz“ a „14 000+ akcií a ETF“, v recenzi „150+ burz“ a „150 mil. instrumentů“ → jedno číslo.
    markets: ['Global - 175+ trhů'],
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
    ochrana: { hotovost: 'Do 20 000 EUR – společný limit s cennými papíry', cennePapiry: '20 000 EUR (Garanční fond OCP)' },
    etfFee: '0,24-1% ročně (dle částky)',
    managementFee: '0,24-1 % ročně (dle objemu a fixace)',
    fxFee: 'Zahrnut v poplatku',
    fractional: true,
    czSupport: true,
    czDividends: '15%',
    minDeposit: '500 Kč',
    platforms: ['Web', 'Android', 'iOS'],
    markets: ['ETF', 'Akcie', 'Krypto', 'české akcie'],
    etfCount: 'ETF portfolia, jednotlivé akcie, krypto',
    languages: ['čeština'],
    customerSupport: '9-17 (pracovní dny)',
    specialFeatures: ['Robo-advisor', 'Investiční rezerva', 'Dětské účty', 'Krypto portfolia'],
    pros: [
      'Velmi uživatelský přístup',
      'Nízké poplatky (0,24-1% ročně)',
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
/** Brokeři ke svépomocnému nákupu, seřazení podle skóre (bez robo-poradce). */
export const brokeriPodleSkore: Broker[] = brokers
  .filter((b) => !b.robo && b.rating != null)
  .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
/** Robo-poradci (Portu) – jiná kategorie, bez skóre. */
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

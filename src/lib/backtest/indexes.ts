/**
 * MANIFEST INDEXŮ — jediná pravda o tom, co je v `index_historical_data`.
 *
 * PROČ EXISTUJE (incident 15.7.2026): tickery byly v `etf-astro/scraper/fetch_index_data_yahoo.py`,
 * měny v `engine.ts` a proxy ETF + TER v `BacktestWidget.tsx` — tři pravdy ve dvou repech, které si
 * odporovaly. Nikdo pak nevěděl, odkud která řada pochází; noční job proto směl smazat 419 řádků
 * `sp500` a produkce půl dne ukazovala čísla o 15 % vedle. Viz memory/incident-sp500-smazana-data.
 *
 * PRAVIDLA:
 *  1. Tenhle soubor je JEDINÝ zdroj pravdy. `INDEX_SOURCE_CURRENCY` v engine.ts i nabídka v nástroji
 *     se z něj ODVOZUJÍ — nikdy se needituje na dvou místech.
 *  2. `ticker` je ověřený: hodnota v DB se shoduje se zdrojem na 0,00 % (změřeno 15.7.2026).
 *     Pokud shodu nemáme, index má `managed: false` a loader se ho NESMÍ dotknout.
 *  3. V DB se drží NATIVNÍ měna listingu. Konverzi (na CZK/EUR) dělá až engine podle `currency`.
 *     Žádný loader nikdy needituje měnu.
 *  4. Loader smí jen UPSERT (on_conflict index_code,date). Nikdy DELETE — spadlý běh nesmí ubrat data.
 */

export type IndexGroup = 'region' | 'sector' | 'factor' | 'bond' | 'commodity'

export interface IndexDef {
  /** index_code v tabulce index_historical_data */
  code: string
  /** Yahoo ticker = zdroj dat. Ověřeno shodou s DB na 0,00 %, pokud není uvedeno jinak. */
  ticker: string
  /** Nativní měna listingu. Engine podle ní převádí (INDEX_SOURCE_CURRENCY se odvozuje odsud). */
  currency: 'USD' | 'EUR'
  /** Český název do UI (nástroj i přehled trhů). */
  name: string
  /** Zařazení — určuje záložku v přehledu trhů. */
  group: IndexGroup
  /** Reprezentativní ETF pro transparentnost v nástroji („asset class → přes proxy ETF · TER x %"). */
  proxyEtf?: { isin: string; name: string; ter: number }
  /** Odkdy data reálně jsou (pro poctivé upozornění v UI). */
  since: string
  /**
   * Data jsou NAV reálného fondu, tj. poplatek je UŽ V CENĚ. `sourceTer` je roční poplatek TOHO fondu
   * (ne proxy ETF!) — engine podle něj umí data přepočítat na jiný poplatek (pokročilé nastavení) nebo
   * ukázat čistý index. Ověřený z oficiálního zdroje správce. Chybí-li, engine bere data beze změny.
   */
  sourceTer?: number
  /** Data jsou NAV reálného fondu (poplatek v ceně). Engine ho už NEodečítá podruhé (opraveno). */
  dataIsNetOfFees: true
  /** U spliced řad: odkdy jsou data z ETF. Starší část je dopočtená (Ken French) a loader ji nesmí přepsat. */
  splicedFrom?: string
  /** Poctivá poznámka do UI (omezení, na která musí být čtenář upozorněn). */
  note?: string
  /** Nabízet v backtestu? */
  inBacktest: boolean
  /** Ukazovat v přehledu trhů? */
  inDashboard: boolean
  /** Smí do něj loader zapisovat? false = původ neověřen, needitovat! */
  managed: boolean
}

export const INDEXES: IndexDef[] = [
  // ─────────────── REGIONY / AKCIOVÉ TRHY ───────────────
  { code: 'sp500', ticker: 'SPY', currency: 'USD', name: 'S&P 500 (USA)', group: 'region', since: '1993-01-29',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00B5BMR087', name: 'iShares Core S&P 500', ter: 0.0007 } },
  { code: 'us_total_market', ticker: 'VTI', currency: 'USD', name: 'Celý americký trh', group: 'region', since: '2001-06-15',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00B3XXRP09', name: 'Vanguard Total Stock Market', ter: 0.0003 } },
  { code: 'msci_eafe', ticker: 'EFA', currency: 'USD', name: 'Vyspělé trhy mimo USA', group: 'region', since: '2001-08-27',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00B4L5Y983', name: 'iShares MSCI EAFE', ter: 0.002 } },
  { code: 'ftse_europe', ticker: 'VGK', currency: 'USD', name: 'Evropa', group: 'region', since: '2005-03-10',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00B945VV12', name: 'Vanguard FTSE Developed Europe', ter: 0.001 } },
  { code: 'msci_em', ticker: 'EEM', currency: 'USD', name: 'Rozvíjející se trhy', group: 'region', since: '2003-04-14',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00BKM4GZ66', name: 'iShares Core MSCI EM', ter: 0.0018 } },
  { code: 'ftse_all_world', ticker: 'VT', currency: 'USD', name: 'Celý svět', group: 'region', since: '2008-06-26',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00BK5BQT80', name: 'Vanguard FTSE All-World', ter: 0.0022 } },
  // POZOR: VGTSX je podílový FOND, ne ETF — proto historie až od 1996 (ETF tehdy neexistovalo).
  // Dohledáno 15.7.2026 podle shody data startu (1996-04-29) a hodnoty (0,00 %). Nikde to nebylo zapsáno.
  { code: 'world_ex_us', ticker: 'VGTSX', currency: 'USD', name: 'Svět mimo USA (vyspělé i EM)', group: 'region', since: '1996-04-29',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Zdroj je podílový fond Vanguard (VGTSX) — proto sahá až do 1996.',
    proxyEtf: { isin: 'US9219097683', name: 'Vanguard Total International Stock', ter: 0.0008 } },

  // ─────────────── SEKTORY (americké, S&P 500) ───────────────
  // Nahráno 15.7.2026, metodika: 1 sektor = 1 kanonický SPDR Select Sector ETF. ŽÁDNÉ průměrování koše
  // fondů (past `sector_1_weight` — taiwanské ETF by spadly do „Technology"). Viz memory/etf-data-quality-quirks.
  ...([
    ['sector_technology', 'XLK', 'Technologie'], ['sector_health_care', 'XLV', 'Zdravotnictví'],
    ['sector_financials', 'XLF', 'Finance'], ['sector_energy', 'XLE', 'Energetika'],
    ['sector_industrials', 'XLI', 'Průmysl'], ['sector_materials', 'XLB', 'Materiály'],
    ['sector_consumer_staples', 'XLP', 'Spotřeba – základní'],
    ['sector_consumer_discretionary', 'XLY', 'Spotřeba – cyklická'], ['sector_utilities', 'XLU', 'Utility'],
  ] as const).map(([code, ticker, name]): IndexDef => ({
    code, ticker, currency: 'USD', name, group: 'sector', since: '1998-12-22',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Americký sektor (S&P 500), ne globální.',
  })),
  { code: 'sector_real_estate', ticker: 'XLRE', currency: 'USD', name: 'Nemovitosti', group: 'sector', since: '2015-10-08',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Americký sektor (S&P 500). Data až od 2015 — GICS sektor Real Estate tehdy teprve vznikl, není to díra v datech.' },
  { code: 'sector_communication', ticker: 'XLC', currency: 'USD', name: 'Komunikační služby', group: 'sector', since: '2018-06-19',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Americký sektor (S&P 500). Data až od 2018 — GICS sektor tehdy teprve vznikl, není to díra v datech.' },

  // ─────────────── FAKTORY / STYLY ───────────────
  // us_value + us_growth dohledány 15.7.2026 podle shody startu (2000-05-26 = spuštění řady iShares Russell).
  // FAKTORY JSOU AMERICKÉ: data = US indexy (Russell / MSCI USA), proto i proxy ETF musí být US, ne World.
  // Dřív tu byly World faktorové ETF → míchání jablek s hruškami. Opraveno 16.7.2026, US UCITS ověřeny z naší DB.
  { code: 'us_value', ticker: 'IWD', currency: 'USD', name: 'Value – US (hodnotové akcie)', group: 'factor', since: '2000-05-26',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Zdroj Russell 1000 Value (USA).',
    proxyEtf: { isin: 'IE000US24HF4', name: 'Vanguard Russell 1000 US Value', ter: 0.0016 } },
  { code: 'us_growth', ticker: 'IWF', currency: 'USD', name: 'Growth – US (růstové akcie)', group: 'factor', since: '2000-05-26',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Zdroj Russell 1000 Growth (USA). Protějšek k Value.',
    proxyEtf: { isin: 'IE000NITTFF2', name: 'iShares Russell 1000 Growth', ter: 0.0018 } },
  { code: 'us_small_cap', ticker: 'IWM', currency: 'USD', name: 'Small cap – US (malé firmy)', group: 'factor', since: '2000-05-26',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Zdroj Russell 2000 (USA).',
    proxyEtf: { isin: 'IE000LRGEN55', name: 'Vanguard Russell 2000 US Small-Cap', ter: 0.002 } },
  { code: 'us_dividend', ticker: 'VYM', currency: 'USD', name: 'Dividendové akcie – US', group: 'factor', since: '2006-11-16',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Zdroj FTSE High Dividend Yield (USA). Evropský ETF na přesně tento index neexistuje — nejblíž je US high-dividend s jinou metodikou.' },
  { code: 'us_min_vol', ticker: 'USMV', currency: 'USD', name: 'Minimální volatilita – US', group: 'factor', since: '2011-10-20',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Zdroj MSCI USA Minimum Volatility.',
    proxyEtf: { isin: 'IE00BDB7J586', name: 'Xtrackers MSCI USA Min Volatility', ter: 0.002 } },
  // SPLICED: data před `splicedFrom` jsou dopočtená z Kenneth French Data Library (zpětný chod od kotevní
  // ceny ETF). Yahoo tuhle historii NEMÁ → upsert ji přirozeně nepřepíše. Nikdy nemazat!
  // Viz scripts/backtest/data/README.md a build_factor_extensions.py.
  { code: 'us_momentum', ticker: 'MTUM', currency: 'USD', name: 'Momentum – US', group: 'factor', since: '1999-12-31',
    splicedFrom: '2013-04-01', dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Zdroj MSCI USA Momentum. Historie před 2013 dopočtena z Ken French (US BIG HiPRIOR, nekalibrováno — běží ~0,7 pb/rok pod ETF, konzervativní směr), po 2013 ETF MTUM.',
    proxyEtf: { isin: 'IE00BD1F4N50', name: 'iShares Edge MSCI USA Momentum Factor', ter: 0.002 } },
  { code: 'us_quality', ticker: 'QUAL', currency: 'USD', name: 'Quality – US (kvalitní firmy)', group: 'factor', since: '1999-12-31',
    splicedFrom: '2013-07-01', dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    note: 'Zdroj MSCI USA Quality. Historie před 2013 dopočtena z Ken French (Hi 30 op. ziskovost, kalibrováno −1,89 %/rok na překryv s ETF vč. poplatku), po 2013 ETF QUAL.',
    proxyEtf: { isin: 'IE00BD1F4L37', name: 'iShares Edge MSCI USA Quality Factor', ter: 0.002 } },

  // ─────────────── DLUHOPISY ───────────────
  { code: 'us_treasury_1_3y', ticker: 'SHY', currency: 'USD', name: 'US státní dluhopisy 1–3 roky', group: 'bond', since: '2002-07-30',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00BYXPSP02', name: 'iShares USD Treasury Bond 1-3yr', ter: 0.0007 } },
  { code: 'us_treasury_7_10y', ticker: 'IEF', currency: 'USD', name: 'US státní dluhopisy 7–10 let', group: 'bond', since: '2002-07-30',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00B3VWN518', name: 'iShares USD Treasury Bond 7-10yr', ter: 0.0007 } },
  { code: 'us_treasury_20y', ticker: 'TLT', currency: 'USD', name: 'US státní dluhopisy 20+ let', group: 'bond', since: '2002-07-30',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00BSKRJZ44', name: 'iShares USD Treasury Bond 20+yr', ter: 0.0007 } },
  { code: 'us_aggregate_bond', ticker: 'AGG', currency: 'USD', name: 'US agregátní dluhopisy', group: 'bond', since: '2003-09-29',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00BYXYYM63', name: 'iShares US Aggregate Bond', ter: 0.0025 } },
  { code: 'us_corp_bond_ig', ticker: 'LQD', currency: 'USD', name: 'US firemní dluhopisy (IG)', group: 'bond', since: '2002-07-30',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00BYXYYL56', name: 'iShares USD Corporate Bond', ter: 0.002 } },
  { code: 'eur_govt_bond', ticker: 'IEAG.L', currency: 'EUR', name: 'EUR vládní dluhopisy', group: 'bond', since: '2009-03-06',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00B4WXJJ64', name: 'iShares Core EUR Govt Bond', ter: 0.0007 } },
  { code: 'eur_corp_bond', ticker: 'IEAC.L', currency: 'EUR', name: 'EUR firemní dluhopisy', group: 'bond', since: '2009-03-06',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00B3F81R35', name: 'iShares Core EUR Corp Bond', ter: 0.002 } },

  // !! PŮVOD NEOVĚŘEN — loader se jich NESMÍ dotknout (managed: false) !!
  // Změřeno 15.7.2026: hodnota v DB nesedí na žádný kandidátní ticker (odchylky 2,1 % / 11,6 % / 2,4 %).
  // Starý scraper na ně měl GBP tickery (IBGS.L/IBGM.L/IBGL.L) + natvrdo gbp_eur=1,15 → nesmysl.
  // Data v DB jsou konzistentní a používají se, jen nevíme, odkud jsou. Dohledat, pak zapnout managed.
  { code: 'eur_govt_bond_1_3y', ticker: 'IBGS.AS', currency: 'EUR', name: 'EUR vládní dluhopisy 1–3 roky', group: 'bond', since: '2008-01-02',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: false,
    note: 'Původ dat neověřen (kandidát IBGS.AS se liší o 2,1 %) — loader needituje.',
    proxyEtf: { isin: 'IE00B14X4Q57', name: 'iShares EUR Govt Bond 1-3yr', ter: 0.002 } },
  { code: 'eur_govt_bond_3_7y', ticker: '', currency: 'EUR', name: 'EUR vládní dluhopisy 3–7 let', group: 'bond', since: '2008-01-02',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: false,
    note: 'Původ dat NEZNÁMÝ — nesedí na žádný kandidátní ticker (nejblíž IBGX.AS, 11,6 % mimo). Loader needituje.',
    proxyEtf: { isin: 'IE00B3VTML14', name: 'iShares EUR Govt Bond 3-7yr', ter: 0.002 } },
  { code: 'eur_govt_bond_15_30y', ticker: 'IBCL.DE', currency: 'EUR', name: 'EUR vládní dluhopisy 15–30 let', group: 'bond', since: '2008-01-02',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: false,
    note: 'Původ dat neověřen (kandidát IBCL.DE se liší o 2,4 %) — loader needituje.',
    proxyEtf: { isin: 'IE00B1FZS913', name: 'iShares EUR Govt Bond 15-30yr', ter: 0.002 } },

  // ─────────────── KOMODITY ───────────────
  { code: 'gold', ticker: 'GLD', currency: 'USD', name: 'Zlato', group: 'commodity', since: '2004-11-18',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00B4ND3602', name: 'iShares Physical Gold', ter: 0.0012 } },
  { code: 'commodities', ticker: 'DBC', currency: 'USD', name: 'Komodity (diverzifikované)', group: 'commodity', since: '2006-02-06',
    dataIsNetOfFees: true, inBacktest: true, inDashboard: true, managed: true,
    proxyEtf: { isin: 'IE00BDFL4P12', name: 'iShares Diversified Commodity', ter: 0.0019 } },
]

// ─────────────── ODVOZENÉ POHLEDY (nikdy needitovat ručně!) ───────────────

export const INDEX_BY_CODE: Record<string, IndexDef> = Object.fromEntries(INDEXES.map((i) => [i.code, i]))

/** Nahrazuje ručně udržovanou mapu v engine.ts — jediná pravda je manifest. */
export const INDEX_SOURCE_CURRENCY: Record<string, 'USD' | 'EUR'> =
  Object.fromEntries(INDEXES.map((i) => [i.code, i.currency]))

/** Indexy, do kterých smí loader zapisovat (ověřený původ). */
export const MANAGED_INDEXES = INDEXES.filter((i) => i.managed)

/** Pro přehled trhů — indexy dané skupiny. */
export const indexesInGroup = (g: IndexGroup) => INDEXES.filter((i) => i.inDashboard && i.group === g)

/** Skupiny pro záložky přehledu trhů. */
export const DASHBOARD_GROUPS: { key: IndexGroup; label: string }[] = [
  { key: 'region', label: 'Regiony' },
  { key: 'sector', label: 'Sektory' },
  { key: 'factor', label: 'Faktory' },
  { key: 'bond', label: 'Dluhopisy' },
  { key: 'commodity', label: 'Komodity' },
]

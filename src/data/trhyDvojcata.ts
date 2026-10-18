/**
 * Trhy a fondy, které je kopírují – pro homepage sekci „Nejlevnější, největší a nejvýkonnější ETF
 * podle trhu“ (18. 10. 2026, koncept 9/10).
 *
 * RUČNÍ SEZNAM, ne filtr: index_name je v datech špinavý (pod „STOXX Europe 600“ jsou sektorové
 * fondy – banky +36 %, ropa +56 %; pod „MSCI EM“ Latinská Amerika +44 %; pod „S&P 500“ VIX
 * futures) a filtry podle podřetězce jsou křehké („AccumuLATINg“ ⊃ „Latin“). Pravidlo č. 1.
 *
 * Do seznamu patří jen fondy na ŠIROKÝ index trhu: bez měnového zajištění, ESG/Paris/Climate,
 * sektorů, faktorů, Min TE / optimalizovaných variant a francouzských PEA verzí. Acc i Dist třídy
 * stejného indexu ano (celkový výnos je stejný). Ověřeno dotazem nad DB 18. 10. 2026.
 * Denní kontrola (scripts/check-fund-data.mjs) hlídá čerstvost, odlehlé hodnoty, chybějící data
 * a ÚPLNOST: velký fond (≥ 500 mil. €) na index trhu, který není v seznamu ani ve VYJIMKY = poplach.
 * (18. 10. 2026 tu chyběly fondy SPDR „USD Unhedged“ – filtr na „hedged“ je vyřadil; SPY5 s TER
 * 0,03 % a 19 mld € měl vyhrát S&P 500.)
 */

export interface Trh {
  id: string;
  label: string;
  /** Doplňující popis (index/oblast) pod názvem trhu. Názvy trhů = jeden slovník pro celou homepage. */
  index: string;
  /** Kam vede klik na trh. */
  href: string;
  isins: string[];
}

export const TRHY: Trh[] = [
  {
    id: 'svet', label: 'Celý svět', index: 'FTSE All-World, MSCI ACWI', href: '/nejlepsi-etf/nejlepsi-celosvetove-etf',
    isins: ['IE00BK5BQT80', 'IE00B3RBWM25', 'IE00B6R52259', 'IE000716YHJ7', 'IE0000QLH0G6', 'IE00BYM11H29', 'IE00BJXFZ989',
      'LU1829220216', 'LU1829220133', 'IE000L6ZMMC4', 'IE000CYC2B65', 'IE00B44Z5B48', 'IE0009HF1MK9', 'IE0003XJA0J9',
      'LU2903252349'],
  },
  {
    id: 'world', label: 'MSCI World', index: 'vyspělé trhy', href: '/nejlepsi-etf/nejlepsi-msci-world-etf',
    isins: ['IE00B4L5Y983', 'IE00BJ0KDQ92', 'IE000BI8OT95', 'IE00B4X9L533', 'IE00BD4TXV59', 'IE00B60SX394', 'FR0010315770',
      'IE00B0M62Q58', 'LU1681043599', 'LU2572257124', 'DE000ETFL508', 'LU2263803533', 'LU0274208692', 'IE00BK1PV551',
      'IE000UQND7H4', 'IE000F9IDGB5', 'IE00B7KQ7B66', 'IE000CNSFAR2', 'LU0340285161', 'FR0014003IY1', 'IE000OHHIBC6',
      'LU2655993207', 'IE000A0GH076', 'LU1681043672', 'IE00BFY0GT14', 'IE000P60WPS6'],
  },
  {
    id: 'sp500', label: 'S&P 500', index: 'USA', href: '/nejlepsi-etf/nejlepsi-sp500-etf',
    isins: ['IE00B5BMR087', 'IE00B3XXRP09', 'IE00B3YCGJ38', 'IE00BFMXXD54', 'IE0031442068', 'LU1135865084', 'IE00BMTX1Y45',
      'IE00BYML9W36', 'IE00B5KQNG97', 'IE000HY30YW6', 'LU0496786657', 'LU2009147757', 'LU0490618542', 'FR0011550177',
      'FR0011550185', 'LU0496786574', 'LU1681049018', 'LU1681048804', 'LU2993390504', 'IE000Z9SJA06', 'IE000D3BWBR2',
      'IE00BD4TXW66', 'IE00B7K93397', 'LU2997383372', 'IE000JZ473P7', 'LU2993390769', 'IE00B4JY5R22', 'FR0011550680',
      'IE000FO05UG4', 'DE000ETFL631', 'LU2993390686', 'IE00B6YX5C33', 'IE000XZSV718'],
  },
  {
    id: 'nasdaq', label: 'Nasdaq-100', index: 'USA, technologie', href: '/nejlepsi-etf/nejlepsi-nasdaq-etf',
    isins: ['IE00B53SZB19', 'IE0032077012', 'LU1829221024', 'DE000A0F5UF5', 'IE00BFZXGZ54', 'IE00BMFKG444', 'IE00BNRQM384',
      'IE000QDFFK00', 'LU1681038243', 'IE00074JV7J1', 'LU2197908721', 'IE000SB4G4I4', 'LU1681038326', 'IE000RUF4QN8',
      'IE0001ZFMLN7', 'DE000ETFL623', 'IE0003RQ9F90'],
  },
  {
    id: 'evropa', label: 'Evropa', index: 'MSCI Europe, STOXX 600', href: '/nejlepsi-etf/nejlepsi-evropske-etf',
    isins: ['LU0908500753', 'IE00B4K48X80', 'IE00B1YZSC51', 'DE0002635307', 'LU0274209237', 'LU0328475792', 'LU1437015735',
      'LU0446734104', 'LU2581375156', 'IE000MAO75G5', 'FR0011550193', 'DE000ETFL284', 'DE000A2QP4B6', 'LU0950668524',
      'FR0010261198', 'IE00B60SWW18', 'LU1737652310', 'IE00BKWQ0Q14', 'LU1242369327', 'IE00B5BD5K76', 'FR0011550672',
      'LU3046617984', 'IE000ZQOIPB1', 'IE00B60SWY32', 'LU3254395307', 'LU3086268573'],
  },
  {
    id: 'em', label: 'Rozvíjející se trhy', index: 'MSCI EM', href: '/nejlepsi-etf/nejlepsi-emerging-markets-etf',
    isins: ['IE00BTJRMP35', 'IE00B4L5YC18', 'IE00B0M63177', 'LU0950674175', 'LU2573966905', 'LU2573967036', 'LU1681045370',
      'LU1437017350', 'IE00B5SSQT16', 'LU0480132876', 'IE00B469F816', 'IE000KCS7J59', 'LU1681045453', 'LU1737652583',
      'FR0010429068', 'LU0292107645', 'IE000GWA2J58', 'IE00B3DWVS88', 'IE000S3N6R34', 'LU2675291913', 'IE00B3Z3FS74',
      'LU1126036976', 'LU2277591868'],
  },
];

/** Fondy, které kontrola úplnosti najde, ale do trhu ZÁMĚRNĚ nepatří (s důvodem). */
export const VYJIMKY: Record<string, string> = {
  XS2427355958: 'WisdomTree S&P 500 – ETP s ISIN XS, ne UCITS fond',
  IE00B3YLTY66: 'SPDR MSCI ACWI IMI (Investable Market) – jiný index (i malé firmy)',
  IE000DD75KQ5: 'SPDR MSCI ACWI IMI (Investable Market) Dist – jiný index',
  IE00BK5BQV03: 'Vanguard FTSE Developed World – jiný index než MSCI World (Korea mezi vyspělými)',
  IE00BKX55T58: 'Vanguard FTSE Developed World Dist – jiný index než MSCI World',
  IE00BFXR5S54: 'L&G Global Equity – vlastní index vyspělých trhů (Solactive), ne MSCI World',
  IE00BKM4GZ66: 'iShares Core MSCI EM IMI – širší index (i malé firmy), ne MSCI EM',
  IE00BD45KH83: 'iShares Core MSCI EM IMI Dist – širší index, ne MSCI EM',
};

/** Fond s výnosem dál než tolik p. b. od mediánu svého trhu = podezřelý (18. 10. 2026: tři třídy
 *  UBS MSCI EM +30,7 % vs. trh +23,6 % – vadná poslední cena u justETF, ověřeno na burzovních cenách).
 *  Nesmí vyhrát, nepočítá se do rozpětí; denní kontrola hlásí poplach. */
export const ODLEHLA_PB = 1.5;
/** Vítěz (nejlevnější/největší/nejvýkonnější) musí mít aspoň tolik mil. EUR. */
export const MIN_VELIKOST_VITEZE = 100;
/** Méně platných fondů → v řádku „—“. */
export const MIN_FONDU = 3;

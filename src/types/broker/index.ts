export interface Broker {
  id: string;
  name: string;
  logo: string;
  description: string;
  /* Redakční skóre brokerů zrušeno 19. 10. 2026 (rozhodnutí majitele, ZAMERNA-ROZHODNUTI.md) – nevracet. */
  /** Robo-poradce (spravuje portfolio za roční poplatek) – ve srovnání brokerů zvlášť, bez skóre. */
  robo?: boolean;
  /** Oficiální web brokera (bez affiliate parametrů). */
  web?: string;
  regulation: string;
  protection: string;
  /** Ochrana rozdělená podle typu majetku – hotovost vs cenné papíry nejsou srovnatelné (revize 18. 10. 2026). */
  ochrana?: { hotovost: string; cennePapiry: string };
  /** Strukturovaný ceník nákupu UCITS ETF (Xetra) pro výpočet „kolik stojí nákup za X Kč“. */
  nakup?: CenikNakupu;
  etfFee: string;
  managementFee: string;
  fxFee: string;
  fractional: boolean;
  czSupport: boolean;
  czDividends: string;
  minDeposit: string;
  platforms: string[];
  markets: string[];
  etfCount: string;
  languages: string[];
  customerSupport: string;
  specialFeatures: string[];
  pros: string[];
  cons: string[];
}

/** Ceník nákupu evropského ETF (Xetra, EUR) z ceníku brokera. Pásma podle objemu pokynu v EUR:
 *  poplatek = max(pevneEur + procento % z objemu, minEur). */
export interface CenikNakupu {
  pasma: { doEur: number | null; procento: number; minEur: number; pevneEur: number }[];
  /** K provizi se připočítávají poplatky burzy (výši neznáme → zobrazit „+ poplatky burzy“). */
  plusBurza?: boolean;
  /** Krátká poznámka k poplatku za nákup do srovnávací tabulky (podmínka, pásma). */
  pozn?: string;
  /** Krátká poznámka ke směně (víkend, v kurzu banky, …). */
  smenaPozn?: string;
  /** Směna CZK→EUR. null = bez samostatného poplatku, náklad je v kurzu (výši neznáme → „—“). */
  smena: { procento: number; minUsd: number } | null;
  /** Vícměnový účet: směnu stačí udělat jednou za větší částku (IBKR) → roční náklad = 1 směna, ne 12. */
  smenaNajednou?: boolean;
  /** Poplatek za ETF MIMO zvýhodněný výběr (DEGIRO: ETF Selection 1 EUR, ostatní 3 EUR). */
  ostatniEtfEur?: number;
  /** Roční poplatek za připojení k burze – jen u ETF mimo zvýhodněný výběr (DEGIRO: až 2,5 EUR za burzu). */
  burzaRocneMaxEur?: number;
}

export interface BrokerFeature {
  id: string;
  name: string;
  description?: string;
  is_available: boolean;
}

export interface BrokerFees {
  etf_transaction_fee?: number;
  stock_transaction_fee?: number;
  monthly_fee?: number;
  custody_fee?: number;
  currency_conversion_fee?: number;
  inactivity_fee?: number;
  withdrawal_fee?: number;
  deposit_fee?: number;
  free_etf_transactions?: number;
  free_stock_transactions?: number;
}

export interface BrokerComparison {
  brokers: Broker[];
  comparison_criteria: ComparisonCriterion[];
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  category: string;
  weight?: number;
  description?: string;
}

export interface BrokerReview {
  id: string;
  broker_id: string;
  user_name?: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface BrokerAnalysis {
  broker: Broker;
  score: number;
  strengths: string[];
  weaknesses: string[];
  best_for: string[];
  alternatives: Broker[];
}

// Enums
export enum BrokerType {
  DISCOUNT = 'discount',
  FULL_SERVICE = 'full_service',
  ROBO_ADVISOR = 'robo_advisor',
  CRYPTO = 'crypto',
  CFD = 'cfd'
}

export enum BrokerRegulation {
  ESMA = 'ESMA',
  FCA = 'FCA',
  BAFIN = 'BAFIN',
  CNB = 'CNB',
  CYPRUS_CySEC = 'CySEC',
  SEC = 'SEC',
  FINRA = 'FINRA'
}

export enum BrokerCategory {
  STOCKS = 'stocks',
  ETF = 'etf',
  OPTIONS = 'options',
  FUTURES = 'futures',
  FOREX = 'forex',
  CRYPTO = 'crypto',
  BONDS = 'bonds',
  COMMODITIES = 'commodities'
}

export interface ComparisonRow {
  feature: string;
  degiro: string;
  xtb: string;
  fio: string;
  trading212: string;
  ibkr: string;
  portu: string;
}
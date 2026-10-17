export interface HedgingInfo {
  isHedged: boolean;
  hedgedCurrency: string | null;
  hedgingType: 'unhedged' | 'eur_hedged' | 'usd_hedged' | 'gbp_hedged' | 'chf_hedged' | 'other_hedged';
}

/**
 * Detekuje měnové zajištění ETF ze jména fondu nebo currency risk pole
 * VYLEPŠENO: Prioritně používá currency_risk pole z databáze pro 100% přesnost
 */
export function detectHedging(etfName: string, currencyRisk?: string): HedgingInfo {
  if (!etfName) {
    return {
      isHedged: false,
      hedgedCurrency: null,
      hedgingType: 'unhedged'
    };
  }

  // Pokud máme přímé currency risk info z JustETF, použijeme to
  if (currencyRisk) {
    const risk = currencyRisk.toLowerCase();
    
    if (risk.includes('unhedged') || risk.includes('not hedged')) {
      return {
        isHedged: false,
        hedgedCurrency: null,
        hedgingType: 'unhedged'
      };
    }

    if (risk.includes('eur') && risk.includes('hedged')) {
      return {
        isHedged: true,
        hedgedCurrency: 'EUR',
        hedgingType: 'eur_hedged'
      };
    }

    if (risk.includes('usd') && risk.includes('hedged')) {
      return {
        isHedged: true,
        hedgedCurrency: 'USD',
        hedgingType: 'usd_hedged'
      };
    }

    if (risk.includes('hedged')) {
      return {
        isHedged: true,
        hedgedCurrency: null,
        hedgingType: 'other_hedged'
      };
    }
  }

  // Fallback na detekci ze jména
  const name = etfName.toLowerCase();

  // „Unhedged" obsahuje „hedged" – dřív se proto 94 výslovně NEzajištěných fondů (např.
  // „… USD Unhedged", nejlevnější S&P 500) hlásilo jako zajištěné (audit 17. 10. 2026).
  if (/\b(unhedged|not hedged)\b/.test(name)) {
    return { isHedged: false, hedgedCurrency: null, hedgingType: 'unhedged' };
  }

  // Měna zajištění: „EUR Hedged", „EUR Hdg", „EUR-Hedged", „Hedged to EUR". Zkratku „Hdg"
  // (Invesco, …) kód dřív neznal → 17 zajištěných fondů vedl jako nezajištěné.
  const mena = name.match(/\b(eur|usd|gbp|chf)[\s-]*(?:hedged|hdg)\b/) || name.match(/\b(?:hedged|hdg)\s+(?:to\s+)?(eur|usd|gbp|chf)\b/);
  if (mena) {
    const m = mena[1].toUpperCase() as 'EUR' | 'USD' | 'GBP' | 'CHF';
    return { isHedged: true, hedgedCurrency: m, hedgingType: `${m.toLowerCase()}_hedged` as HedgingInfo['hedgingType'] };
  }

  // Obecné hedging patterny
  if (/\b(hedged|hdg)\b/.test(name)) {
    return {
      isHedged: true,
      hedgedCurrency: null,
      hedgingType: 'other_hedged'
    };
  }

  // Default: nezajištěný
  return {
    isHedged: false,
    hedgedCurrency: null,
    hedgingType: 'unhedged'
  };
}

/**
 * Filtruje ETF podle hedging kritérií
 */
export function filterByHedging(etfs: any[], hedgingFilter: string): any[] {
  if (!hedgingFilter || hedgingFilter === 'all') {
    return etfs;
  }

  return etfs.filter(etf => {
    const hedgingInfo = detectHedging(etf.name);
    
    switch (hedgingFilter) {
      case 'unhedged':
        return !hedgingInfo.isHedged;
      case 'hedged':
        return hedgingInfo.isHedged;
      case 'eur_hedged':
        return hedgingInfo.hedgingType === 'eur_hedged';
      case 'usd_hedged':
        return hedgingInfo.hedgingType === 'usd_hedged';
      case 'gbp_hedged':
        return hedgingInfo.hedgingType === 'gbp_hedged';
      case 'chf_hedged':
        return hedgingInfo.hedgingType === 'chf_hedged';
      default:
        return true;
    }
  });
}

/**
 * Získá lidsky čitelný popis hedgingu
 */
export function getHedgingDescription(hedgingInfo: HedgingInfo): string {
  if (!hedgingInfo.isHedged) {
    return 'Nezajištěno';
  }

  if (hedgingInfo.hedgedCurrency) {
    return `${hedgingInfo.hedgedCurrency} zajištěno`;
  }

  return 'Zajištěno';
}

/**
 * Získá hedging badge variantu pro UI
 */
export function getHedgingBadgeVariant(hedgingInfo: HedgingInfo): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (!hedgingInfo.isHedged) {
    return 'outline';
  }

  switch (hedgingInfo.hedgingType) {
    case 'eur_hedged':
      return 'default';
    case 'usd_hedged':
      return 'secondary';
    default:
      return 'outline';
  }
}
/**
 * „A jak by to dopadlo doopravdy?“ v investiční kalkulačce – STEJNÉ vklady na skutečných historických datech.
 * Čistý modul (server i prohlížeč): sestaví tělo požadavku pro /api/backtest/simulate (resp. simulateAndSerialize
 * při ISR) a odkaz do /backtest se STEJNÝMI vstupy – číslo v kalkulačce = číslo v backtestu (revize 18. 10. 2026:
 * karta dřív jen slibovala odpověď a ukazovala odkaz).
 *
 * „Celý svět“ = fond VT (index FTSE Global All Cap) od 7/2008 – stejně jako preset „Celý svět“ v backtestu.
 * Začne-li období dřív, backtest celosvětový fond nemá a počítá „USA + zbytek světa“ (60 % S&P 500 + 40 % svět
 * mimo USA) – karta to tak i pojmenuje. Stejně 60/40: od 7/2008 60 % VT + 40 % AGG, dřív 36/24/40 (odkaz do backtestu
 * vždy jako explicitní složení – preset „60/40“ v backtestu má od 18. 10. 2026 dluhopisy eurozóny).
 */
import { STROJ_PRESETY, slozeniProStart } from '@/lib/strojCasuVypocet';
import { zhodnoceniVkladu } from '@/lib/backtest/zhodnoceniVkladu';

export interface SkutecnostVstup {
  presetId: string;
  roky: number;
  jednorazove: number;
  pravidelne: number;
  frekvence: 'monthly' | 'yearly';
}

export interface SkutecnostScenar {
  klic: string;
  body: {
    portfolio: { isin: string; name: string; weight: number; ter: number; indexCode: string }[];
    startDate: string; endDate: string; initialAmount: number; rebalancingStrategy: 'yearly'; currency: 'CZK';
    contributions?: { amount: number; frequency: 'monthly' | 'yearly' };
  };
  /** „do S&P 500“, „do akcií celého světa“, „do portfolia USA + zbytek světa“ – správný pád pro větu. */
  doCeho: string;
  /** Krátký název pro souhrn. */
  nazev: string;
  /** První měsíc výpočtu (YYYY-MM). */
  start: string;
  /** Start posunut na první měsíc s daty (horizont delší než historie v Kč). */
  zkraceno: boolean;
  /** Celý svět začínající před 7/2008 → počítá se přiblížení USA + zbytek světa. */
  priblizeni: boolean;
  backtestHref: string;
}

const PRED_VT = '2008-07';

export function scenarSkutecnosti(v: SkutecnostVstup, dnes = new Date()): SkutecnostScenar {
  const preset = STROJ_PRESETY.find((x) => x.id === v.presetId) ?? STROJ_PRESETY.find((x) => x.id === 'sp500')!;
  let start = `${dnes.getUTCFullYear() - v.roky}-${String(dnes.getUTCMonth() + 1).padStart(2, '0')}`;
  const zkraceno = start < preset.od;
  if (zkraceno) start = preset.od;
  const slozeni = slozeniProStart(preset, start);
  const priblizeni = (preset.id === 'svet' || preset.id === 'vyvazene') && start < PRED_VT;

  const q = new URLSearchParams();
  let doCeho: string, nazev: string;
  if (preset.id === 'sp500') { q.set('portfolio', 'sp500-100'); doCeho = 'do S&P 500'; nazev = 'S&P 500'; }
  else if (preset.id === 'svet' && !priblizeni) { q.set('portfolio', 'cely-svet'); doCeho = 'do akcií celého světa'; nazev = 'Celý svět'; }
  else if (preset.id === 'svet') { q.set('portfolio', 'global-since-2000'); doCeho = 'do portfolia USA + zbytek světa'; nazev = 'USA + zbytek světa'; }
  // 60/40 kalkulačky = stroj času (60 % VT + 40 % AGG v USD). Preset „60/40“ v backtestu má od kola 5 dluhopisy eurozóny
  // (= modelové portfolio) → odkaz nese explicitní složení, aby číslo karty = číslo backtestu.
  else if (preset.id === 'vyvazene' && !priblizeni) { q.set('slozeni', slozeni.map((s) => `${s.indexCode}:${Math.round(s.weight * 100)}`).join(',')); doCeho = 'do portfolia 60/40 (s americkými dluhopisy)'; nazev = '60/40'; }
  else { q.set('slozeni', slozeni.map((s) => `${s.indexCode}:${Math.round(s.weight * 100)}`).join(',')); doCeho = `do ${preset.nazev2p}`; nazev = preset.nazev; }

  const startDate = `${start}-01`;
  const endDate = dnes.toISOString().slice(0, 10);
  const contributions = v.pravidelne > 0 ? { amount: Math.round(v.pravidelne), frequency: v.frekvence } : undefined;
  q.set('start', startDate);
  q.set('amount', String(Math.round(v.jednorazove)));
  if (contributions) { q.set('vklad', String(contributions.amount)); if (v.frekvence !== 'monthly') q.set('freq', v.frekvence); }
  else q.set('freq', 'none');

  const body: SkutecnostScenar['body'] = {
    portfolio: slozeni.map((s) => ({ isin: s.indexCode, name: s.indexCode, weight: s.weight, ter: 0, indexCode: s.indexCode })),
    startDate, endDate, initialAmount: Math.round(v.jednorazove), rebalancingStrategy: 'yearly', currency: 'CZK',
    ...(contributions ? { contributions } : {}),
  };
  return {
    klic: JSON.stringify([slozeni, startDate, body.initialAmount, contributions ?? null]),
    body, doCeho, nazev, start, zkraceno, priblizeni,
    backtestHref: `/backtest?${q.toString().replace(/%3A/g, ':').replace(/%2C/g, ',')}`,
  };
}

/** Co z výsledku backtestu karta potřebuje (do HTML jen tohle, ne celá řada). */
export interface SkutecnostVysledek {
  klic: string;
  hodnota: number;
  vlozeno: number;
  /** Zhodnocení vkladů (XIRR), null když nejde spočítat. */
  irr: number | null;
  maxPokles: number;
  dnoPoklesu: string;
  prvniDen: string;
  posledniDen: string;
}

/** Výsledek backtestu (tvar API /api/backtest/simulate) → údaje pro kartu. */
export function shrnSkutecnost(
  s: SkutecnostScenar,
  r: { evolution: { date: string; value: number }[]; summary: { netAssetValue: number; amountInvested: number }; risk: { maxDrawdown: { depth: number; troughDate: string } } },
): SkutecnostVysledek | null {
  const ev = r.evolution;
  if (!ev?.length) return null;
  const c = s.body.contributions;
  return {
    klic: s.klic,
    hodnota: r.summary.netAssetValue,
    vlozeno: r.summary.amountInvested,
    irr: zhodnoceniVkladu(ev, s.body.initialAmount, c?.amount ?? 0, c?.frequency ?? 'none', r.summary.amountInvested),
    maxPokles: r.risk.maxDrawdown.depth,
    dnoPoklesu: r.risk.maxDrawdown.troughDate,
    prvniDen: ev[0].date,
    posledniDen: ev[ev.length - 1].date,
  };
}

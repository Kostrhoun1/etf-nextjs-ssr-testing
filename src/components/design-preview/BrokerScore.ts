/**
 * Dílčí skóre recenze brokera + výpočet váženého agregátu.
 * Server-safe (žádné 'use client'). Číslo 79/100 v heru i v závěru
 * musí přesně odpovídat tomuto výpočtu – metodika je transparentní.
 */
export type ScoreRow = {
  label: string;
  /** dílčí skóre 0–100 */
  score: number;
  /** váha v celkovém hodnocení (0–1, suma = 1) */
  weight: number;
  /** krátké zdůvodnění známky */
  note: string;
};

export const degiroScores: ScoreRow[] = [
  { label: 'Poplatky za ETF', score: 86, weight: 0.25, note: 'Core Selection 1 EUR, ostatní 3 EUR – levné pro dlouhodobé nákupy.' },
  { label: 'Regulace a ochrana', score: 90, weight: 0.20, note: 'Banka flatexDEGIRO pod BaFin (DE) a DNB/AFM (NL), ochrana 100 000 EUR.' },
  { label: 'Nabídka a platforma', score: 84, weight: 0.20, note: '3000+ ETF, 31 burz, WebTrader a aplikace; chybí demo účet.' },
  { label: 'Čeština a podpora', score: 68, weight: 0.15, note: 'Částečná čeština, podpora jen 9–17 v pracovní dny (ne 24/7).' },
  { label: 'Daně pro českého investora', score: 62, weight: 0.12, note: '35% srážka z dividend CZ akcií (vratka 20 % možná); ETF řešitelné akumulací.' },
  { label: 'Flexibilita (frakce, DCA)', score: 60, weight: 0.08, note: 'Nepodporuje frakční ETF ani automatické investiční plány.' },
];

/** Vážený průměr zaokrouhlený na celé číslo – jediný zdroj pravdy pro skóre. */
export const degiroOverall = Math.round(
  degiroScores.reduce((sum, r) => sum + r.score * r.weight, 0),
);

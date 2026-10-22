/* ===== PŘEDPOKLADY VÝNOSŮ (22. 10. 2026) =====
   Dřív natvrdo 7,7 / 8,8 / 9,8 % nominálně bez zdroje („1995–2024“ z portfoliovisualizer.com, nedoložené):
   portfolio s 60 % dluhopisů tak „vydělávalo“ víc, než web jinde uvádí pro čisté akcie (7 % na
   /kolik-investovat-mesicne, ~5 % reálně na /fire). Nově REÁLNÝ (po inflaci ČSÚ) roční výnos a kolísání
   z vlastních historických dat v Kč – stejné složení jako modelové portfolio 60/40 na webu:
   akcie celého světa = Vanguard FTSE All-World (VT, index ftse_all_world), dluhopisy = státní dluhopisy
   eurozóny (Xtrackers XGLE, index eur_govt_bond), roční rebalancování, nejdelší společné období 7/2008–9/2026.
   Spočteno enginem (/api/backtest/simulate, currency CZK): reálně 2,00 / 4,57 / 6,19 % (nominálně
   5,19 / 7,84 / 9,51 %, inflace 3,13 % ročně).
   KOLÍSÁNÍ je REÁLNÉ (audit nástrojů 22. 10. 2026, V2): směrodatná odchylka měsíčních logaritmických výnosů
   PO INFLACI (měsíční CPI) × √12 = 7,6 / 9,2 / 11,0 % ročně. Dřív 6,9 / 8,8 / 10,7 % = nominální kolísání,
   přitom simulace běží v reálných korunách (měsíční inflace kolísání přidává). Nezávisle: Python z holých dat
   (Yahoo VT + XGLE.DE × ČNB, HICP do 2014 + ČSÚ CEN0101E) 7,58 / 9,24 / 11,04 %, prostý výnos 7,57 / 9,21 / 11,00 %.
   Nezávisle ověřeno z holých dat (Yahoo adj. close × kurzy ČNB, inflace ČSÚ/Eurostat):
   scripts/overeni-fire-predpoklady.mjs. Rozhodnutí: ZAMERNA-ROZHODNUTI.md („FIRE kalkulačka – předpoklady“).
   Kalkulačka počítá v dnešních korunách: nominální výnos = (1 + reálný) × (1 + zadaná inflace) − 1. */
export type FireStrategie = 'conservative' | 'moderate' | 'aggressive';

export const FIRE_PREDPOKLADY = {
  obdobi: '7/2008–9/2026',
  dataK: '30. 9. 2026',
  akcie: 'Vanguard FTSE All-World',
  dluhopisy: 'Xtrackers Eurozone Government Bond',
  strategie: {
    conservative: { realnyVynos: 2.0, volatilita: 0.076, stockAllocation: 0.30 },
    moderate: { realnyVynos: 4.6, volatilita: 0.092, stockAllocation: 0.60 },
    aggressive: { realnyVynos: 6.2, volatilita: 0.110, stockAllocation: 0.80 },
  },
} as const;

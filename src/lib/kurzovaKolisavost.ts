/* ===== KOLÍSAVOST KURZŮ KORUNY (audit nástrojů 22. 10. 2026, V7) =====
   Kalkulačka kurzového dopadu měla natvrdo „USD 12 %, EUR 8 %, korelace 0,6“ bez zdroje → hodnota v riziku
   nadsazená (100 % EUR: 132 000 Kč místo ~85 000 Kč na 1 mil. Kč). Teď z kurzů ČNB:
   - zdroj: denní kurzy devizového trhu ČNB (rok.txt), kurz posledního obchodního dne v měsíci,
   - období: 1/1999–9/2026 (nejdelší možné – EUR/CZK od zavedení eura), 332 měsíčních změn,
   - kolísavost = směrodatná odchylka měsíčních log změn kurzu × √12, korelace = Pearson týchž změn.
   Výpočet a kontrola: scripts/kurzovy-dopad-predpoklady.mjs (exit 1, když konstanty neodpovídají ČNB).
   Nezávisle ověřeno 22. 10. 2026 (Python z odděleně stažených souborů ČNB): USD/CZK 11,35 %, EUR/CZK 5,14 %,
   korelace 0,61; pro kontext denní změny × √252: 11,1 % / 5,4 %; posledních 10 let jen 9,2 % / 4,2 %
   (koruna je od konce intervencí 2017 klidnější) – proto „odhad“ a uvedené období. */
export const KURZ_KOLISAVOST = {
  obdobi: '1/1999–9/2026',
  dataK: '30. 9. 2026',
  zdroj: 'kurzy ČNB (poslední den v měsíci)',
  usd: 0.1135,
  eur: 0.0514,
  korelace: 0.61,
} as const;

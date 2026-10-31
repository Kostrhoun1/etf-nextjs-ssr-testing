/**
 * Platný ISIN = formát + kontrolní číslice (Luhn přes číslice z písmen A=10…Z=35).
 * Ověřeno 17. 10. 2026: všech 5 146 ISINů v databázi projde, smyšlené (ZZ000000TEST,
 * překlep v poslední číslici) ne. Sdílí middleware (neplatný ISIN = statická 404 bez DB) a seznam
 * předgenerovaných detailů (src/lib/prerender.ts) – nepředgenerovávat stránku, ke které middleware nepustí.
 */
export function isinPlatny(s: string): boolean {
  if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(s)) return false;
  const cifry = s.split('').map((c) => (c >= 'A' ? String(c.charCodeAt(0) - 55) : c)).join('');
  let sum = 0;
  let dvakrat = false;
  for (let i = cifry.length - 1; i >= 0; i--) {
    let d = cifry.charCodeAt(i) - 48;
    if (dvakrat) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dvakrat = !dvakrat;
  }
  return sum % 10 === 0;
}

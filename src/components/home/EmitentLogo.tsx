/* Logo (ikona) emitenta fondu – vizuální kotva u názvu fondu (art director 18. 10. 2026: „na tohle
   oko u justETF a extraETF čeká“). Ikony z oficiálních webů emitentů (favicon / apple-touch-icon),
   převedené na 64×64 v public/loga-emitentu (stažené se souhlasem majitele 18. 10. 2026).
   Emitent se pozná podle začátku názvu fondu; neznámý emitent = nic (žádný zástupný obrázek). */

const EMITENTI: [RegExp, string][] = [
  [/^vanguard\b/i, 'vanguard'], [/^ishares\b/i, 'ishares'], [/^amundi\b/i, 'amundi'], [/^invesco\b/i, 'invesco'],
  [/^(state street )?spdr\b/i, 'spdr'], [/^ubs\b/i, 'ubs'], [/^(xtrackers\b|scalable .*xtrackers)/i, 'xtrackers'],
  [/^hsbc\b/i, 'hsbc'], [/^bnp\b/i, 'bnp'], [/^deka\b/i, 'deka'], [/^wisdomtree\b/i, 'wisdomtree'],
  [/^l&g\b/i, 'lgim'], [/^franklin\b/i, 'franklin'],
];

export function emitentFondu(nazev: string | null | undefined): string | null {
  const n = (nazev ?? '').trim();
  return EMITENTI.find(([re]) => re.test(n))?.[1] ?? null;
}

export default function EmitentLogo({ nazev, size = 20, className = '' }: { nazev: string | null | undefined; size?: number; className?: string }) {
  const k = emitentFondu(nazev);
  if (!k) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/loga-emitentu/${k}.png`} alt="" width={size} height={size} loading="lazy"
      className={`shrink-0 rounded-[4px] bg-white object-contain ${className}`} style={{ width: size, height: size }} />
  );
}

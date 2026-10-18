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

/** Neutrální monogram (první písmeno emitenta v kroužku) – jen kde bez loga rozpadá zarovnání řádků
 *  (srovnávač, porovnání; art director 18. 10. 2026: řádky Xetra-Gold, Ossiam „vypadly“ z mřížky). */
function Monogram({ text, size, className }: { text: string; size: number; className: string }) {
  const p = (text.trim().match(/[A-Za-zÀ-ž0-9]/)?.[0] ?? '·').toUpperCase();
  return (
    <span aria-hidden="true" className={`shrink-0 inline-flex items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-200 font-semibold text-slate-500 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}>
      {p}
    </span>
  );
}

export default function EmitentLogo({ nazev, size = 20, className = '', monogram }: {
  nazev: string | null | undefined; size?: number; className?: string;
  /** Text (emitent), ze kterého se udělá monogram, když logo nemáme. Bez něj neznámý emitent = nic. */
  monogram?: string | null;
}) {
  const k = emitentFondu(nazev);
  if (!k) return monogram ? <Monogram text={monogram} size={size} className={className} /> : null;
  // Jednotná bílá dlaždice s rámečkem – loga mají různé poměry a optickou váhu (art director 18. 10. 2026).
  // iShares nemá čtvercovou značku (favicon je jen „i“, vypadalo jako ikona info) → wordmark SVG z Wikimedia Commons.
  const src = k === 'ishares' ? '/loga-emitentu/ishares.svg' : `/loga-emitentu/${k}.png`;
  return (
    <span aria-hidden="true" className={`shrink-0 inline-flex items-center justify-center rounded-md bg-white ring-1 ring-slate-200 ${className}`} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" className="object-contain" style={{ width: k === 'ishares' ? '88%' : '70%', height: k === 'ishares' ? '88%' : '70%' }} />
    </span>
  );
}

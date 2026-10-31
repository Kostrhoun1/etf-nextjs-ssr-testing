/**
 * BUILD: detaily fondů a dvojice se předgenerují při `next build` (31. 10. 2026, ZAMERNA-ROZHODNUTI.md „Předgenerování
 * detailů a dvojic“). To je ~8 000 renderů v jednom buildu. Každý render detailu i dvojice potřebuje stejné velké
 * datové sady (celá nabídka pro třídy fondů ~1,5 MB, fondy trhů, kandidáti podobných fondů…). React `cache` platí jen
 * v rámci JEDNOHO renderu → bez téhle paměti by build stáhl ze Supabase ~12 GB (naměřeno 31. 10. 2026: jen třídy fondů = 6 dotazů, ~1,5 MB na render).
 *
 * `jednouZaBuild` = výsledek se při buildu načte jednou za proces (worker) a sdílí mezi všemi stránkami. Mimo build
 * (runtime na Vercelu, dev) se NEPOUŽÍVÁ – tam by paměť v teplé lambdě držela stará data přes ISR přegenerování.
 * Chyba se při buildu NEspolkne: po 3 pokusech výjimka → build spadne (raději nenasadit než upéct 30denní stránky
 * bez kontroly výnosů – pravidlo č. 1). Neúspěch se nepamatuje (další stránka zkusí znovu).
 */
export const JE_BUILD = process.env.NEXT_PHASE === 'phase-production-build';

type Pamet = Map<string, Promise<unknown>>;
// Na globalThis: Turbopack může mít v jednom procesu víc instancí téhož modulu (různé routy) – paměť má být jedna.
const pamet = (): Pamet => {
  const g = globalThis as unknown as { __etfBuildMemo?: Pamet };
  return (g.__etfBuildMemo ??= new Map());
};

const POKUSY = 3;
const pauza = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Načte `nacti()` s opakováním (1 s, 3 s); poslední chybu vyhodí. */
export async function sOpakovanim<T>(popis: string, nacti: () => Promise<T>): Promise<T> {
  let posledni: unknown;
  for (let i = 0; i < POKUSY; i++) {
    try {
      return await nacti();
    } catch (e) {
      posledni = e;
      if (i < POKUSY - 1) await pauza(i === 0 ? 1000 : 3000);
    }
  }
  throw new Error(`build: ${popis} se nenačetlo ani na ${POKUSY}. pokus – ${posledni instanceof Error ? posledni.message : String(posledni)}`);
}

/** Při buildu jednou za proces (s opakováním, chyba = výjimka); jinak `null` (volající použije svou běžnou cestu). */
export function jednouZaBuild<T>(klic: string, nacti: () => Promise<T>): Promise<T> | null {
  if (!JE_BUILD) return null;
  const m = pamet();
  let p = m.get(klic) as Promise<T> | undefined;
  if (!p) {
    p = sOpakovanim(klic, nacti);
    m.set(klic, p);
    p.catch(() => m.delete(klic));
  }
  return p;
}

/**
 * Fetch pro Supabase klienty stránek. Při BUILDU původní (nezáplatovaný) fetch Nextu – dotazy se tak nezapisují do datové
 * cache Nextu (na Vercelu vzdálená cache, která přežívá nasazení; ~8 000 stránek × několik dotazů by byly desítky tisíc
 * zápisů s nejasným dopadem na limit ISR zápisů free tieru). Stránka tím o nic nepřijde: ISR interval jí dává `revalidate`
 * segmentu (detail 30 dní, dvojice 7 dní), ne fetch. Mimo build beze změny (běžný fetch). Stejný postup jako
 * src/lib/backtest/engine.ts (`fetch._nextOriginalFetch`); zjišťuje se až při volání (Next záplatuje fetch při startu renderu).
 */
export const fetchProSupabase = (...a: Parameters<typeof fetch>): ReturnType<typeof fetch> => {
  const f = JE_BUILD
    ? (globalThis.fetch as unknown as { _nextOriginalFetch?: typeof fetch })._nextOriginalFetch ?? globalThis.fetch
    : globalThis.fetch;
  return f(...a);
};

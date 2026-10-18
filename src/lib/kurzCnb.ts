/**
 * Aktuální kurz ČNB (EUR/CZK, USD/CZK) pro přepočty poplatků brokerů do korun (/kde-koupit, recenze).
 *
 * Zdroj: denní kurzovní lístek ČNB (veřejný TXT). Čte se při ISR renderu (cache 1 den), ne při každém
 * zobrazení. Pravidlo č. 1: když lístek nejde načíst nebo je starší než 7 dní, vrací null a stránka
 * ukáže poplatky jen v EUR a částky v Kč jako „—“ – nikdy tichý fallback na natvrdo zapsaný kurz.
 */
import type { Kurzy } from '@/data/brokerData';

const URL_CNB = 'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt';
const MAX_STARI_DNI = 7;

/** Rozparsuje lístek: 1. řádek „16.10.2026 #200“, dál „EMU|euro|1|EUR|24,325“. Export kvůli testu. */
export function parsujListek(txt: string, ted = new Date()): Kurzy | null {
  const radky = txt.trim().split('\n');
  const m = radky[0]?.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (!m) return null;
  const datum = `${m[3]}-${m[2]}-${m[1]}`;
  const kurz = (kod: string) => {
    const r = radky.find((x) => x.split('|')[3] === kod);
    if (!r) return null;
    const [, , mnozstvi, , hodnota] = r.split('|');
    const v = parseFloat(hodnota.replace(',', '.')) / parseFloat(mnozstvi);
    return Number.isFinite(v) && v > 0 ? v : null;
  };
  const eurCzk = kurz('EUR');
  const usdCzk = kurz('USD');
  if (eurCzk == null || usdCzk == null) return null;
  // Kontrola smyslu: koruna se proti EUR/USD v posledních dekádách pohybuje zhruba 17–35 Kč.
  if (eurCzk < 15 || eurCzk > 40 || usdCzk < 12 || usdCzk > 40) return null;
  const stariDni = (ted.getTime() - new Date(`${datum}T12:00:00Z`).getTime()) / 864e5;
  if (stariDni > MAX_STARI_DNI) return null;
  return { eurCzk, usdCzk, datum };
}

export async function nactiKurzCnb(): Promise<Kurzy | null> {
  try {
    const r = await fetch(URL_CNB, { next: { revalidate: 86400 } });
    if (!r.ok) return null;
    return parsujListek(await r.text());
  } catch (e) {
    console.error('[kurzCnb] kurzovní lístek ČNB se nepodařilo načíst:', e);
    return null;
  }
}

/** „16. 10. 2026“ */
export const datumKurzu = (k: Kurzy) =>
  new Date(`${k.datum}T00:00:00Z`).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });

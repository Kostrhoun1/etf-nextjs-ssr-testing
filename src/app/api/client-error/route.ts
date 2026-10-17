/**
 * Příjem chyb z prohlížečů návštěvníků → tabulka client_errors v Supabase.
 * Proč a jak: src/lib/client-error.ts. Čte je denní kontrola (scripts/check-fund-data.mjs).
 *
 * PROČ TABULKA, NE LOGY: Vercel Hobby drží runtime logy jen 1 HODINU (zjištěno 17. 10. 2026
 * při ověřování) – chyba, kterou nikdo nepřečetl do hodiny, by zmizela. Do logů se píše dál
 * (značka [client-error]) jen pro živé ladění.
 *
 * Nenastavuje cookies, IP nezapisuje.
 */
import { createClient } from '@supabase/supabase-js';

// Zápis jde VEŘEJNÝM (publishable) klíčem: tabulka má RLS politiku „anon smí jen INSERT" –
// nikdy SELECT/UPDATE/DELETE (ověřeno 17. 10. 2026: zápis 201, čtení [], smazání nic nesmaže,
// příliš dlouhé pole 400). Služební klíč nejde: produkční SUPABASE_SERVICE_ROLE_KEY je starý
// legacy JWT, který Supabase 26. 4. 2026 zakázal. Až se vymění za sb_secret_, použije se ten.
const sluzebniKlic = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, '');
const db = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  sluzebniKlic?.startsWith('sb_secret_') ? sluzebniKlic : 'sb_publishable_IrdFtruv53Z2RbXNRRWCcw_K0TD4_ml',
  { auth: { persistSession: false } },
);

const POVOLENE_HOSTY = /^(etfpruvodce\.cz|www\.etfpruvodce\.cz|localhost(:\d+)?|[a-z0-9-]+\.vercel\.app)$/i;
const MAX_TELO = 8000;

const kratce = (v: unknown, n: number) => (v == null ? undefined : String(v).slice(0, n));
const cislo = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : undefined);

export async function POST(req: Request) {
  // Jen z našeho webu – ať endpoint nejde snadno zneužít k zahlcení logů.
  const puvod = req.headers.get('origin') || req.headers.get('referer') || '';
  let host = '';
  try { host = new URL(puvod).host; } catch { /* bez původu */ }
  if (!POVOLENE_HOSTY.test(host)) return new Response(null, { status: 403 });

  const text = await req.text();
  if (text.length > MAX_TELO) return new Response(null, { status: 413 });

  let d: Record<string, unknown>;
  try { d = JSON.parse(text); } catch { return new Response(null, { status: 400 }); }

  const zaznam = {
    kind: kratce(d.kind, 30),
    message: kratce(d.message, 500),
    page: kratce(d.page, 300),
    source: kratce(d.source, 300),
    line: cislo(d.line),
    col: cislo(d.col),
    digest: kratce(d.digest, 100),
    stack: kratce(d.stack, 2000),
    ua: kratce(req.headers.get('user-agent'), 200),
  };
  console.error('[client-error]', JSON.stringify(zaznam));
  const { error } = await db.from('client_errors').insert(zaznam);
  // Selhání zápisu hlásíme do logu, ale prohlížeči vracíme pořád 204 – nemá to ovlivnit.
  if (error) console.error('[client-error] zápis do client_errors selhal:', error.message);
  return new Response(null, { status: 204 });
}

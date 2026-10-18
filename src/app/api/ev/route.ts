/**
 * Měření chování návštěvníků (18. 10. 2026) → tabulka web_events v Supabase.
 *
 * BEZ COOKIES A BEZ IDENTIFIKÁTORŮ V PROHLÍŽEČI: klient (src/components/Mereni.tsx) posílá události
 * jednoho zobrazení stránky s náhodným pv (žije jen v paměti stránky). IP ani user-agent neukládáme;
 * user-agent jen čteme kvůli vyřazení botů. Proto nepotřebuje souhlas ani cookie lištu (rozhodnutí
 * majitele: žádné nástroje vyžadující souhlas).
 *
 * Zápis veřejným klíčem: RLS „anon smí jen INSERT“ (jako client_errors). Report: scripts/chovani-report.mjs.
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/lib/supabase-config';

const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });

const POVOLENE_HOSTY = /^(etfpruvodce\.cz|www\.etfpruvodce\.cz|localhost(:\d+)?|[a-z0-9-]+\.vercel\.app)$/i;
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|curl|wget|python|axios|node-fetch|playwright|puppeteer/i;
const UDALOSTI = new Set(['zobrazeni', 'sekce', 'klik', 'hledani', 'hledani_vyber', 'zalozka', 'scroll', 'cas', 'faq']);
const MAX_TELO = 16000;
const MAX_UDALOSTI = 60;

const kratce = (v: unknown, n: number) => (v == null || v === '' ? null : String(v).slice(0, n));
const cislo = (v: unknown) => (v == null || !Number.isFinite(Number(v)) ? null : Number(v));

export async function POST(req: Request) {
  const puvod = req.headers.get('origin') || req.headers.get('referer') || '';
  let host = '';
  try { host = new URL(puvod).host; } catch { /* bez původu */ }
  if (!POVOLENE_HOSTY.test(host)) return new Response(null, { status: 403 });
  if (BOT.test(req.headers.get('user-agent') || '')) return new Response(null, { status: 204 });
  // Ukládá se jen ostrý web – náhledy (*.vercel.app, revize agentů) a lokální vývoj by čísla zkreslily.
  // Lokální test: MERENI_LOKALNE=1 npx next start.
  if (!/(^|\.)etfpruvodce\.cz$/i.test(host) && process.env.MERENI_LOKALNE !== '1') return new Response(null, { status: 204 });

  const text = await req.text();
  if (text.length > MAX_TELO) return new Response(null, { status: 413 });
  let d: { pv?: unknown; path?: unknown; ref?: unknown; device?: unknown; vw?: unknown; e?: unknown };
  try { d = JSON.parse(text); } catch { return new Response(null, { status: 400 }); }
  if (!Array.isArray(d.e)) return new Response(null, { status: 400 });

  const spolecne = {
    pv: kratce(d.pv, 16) ?? 'x',
    path: kratce(d.path, 200),
    ref: kratce(d.ref, 100),
    device: kratce(d.device, 10),
    vw: cislo(d.vw),
  };
  const radky = (d.e as Record<string, unknown>[])
    .slice(0, MAX_UDALOSTI)
    .filter((x) => x && UDALOSTI.has(String(x.t)))
    .map((x) => ({
      ...spolecne,
      event: String(x.t),
      sekce: kratce(x.s, 40),
      target: kratce(x.c, 200),
      value: cislo(x.v),
      meta: x.m && typeof x.m === 'object' && JSON.stringify(x.m).length <= 1500 ? x.m : null,
    }));
  if (radky.length) {
    const { error } = await db.from('web_events').insert(radky);
    if (error) console.error('[ev] zápis selhal:', error.message);
  }
  return new Response(null, { status: 204 });
}

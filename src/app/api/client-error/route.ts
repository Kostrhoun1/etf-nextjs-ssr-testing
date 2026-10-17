/**
 * Příjem chyb z prohlížečů návštěvníků → logy Vercelu (značka [client-error]).
 * Proč a jak: src/lib/client-error.ts. Čte se přes Vercel runtime logs, hledáním „[client-error]".
 *
 * Neukládá nic dalšího a nenastavuje cookies. IP adresu sami nezapisujeme.
 */

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
  return new Response(null, { status: 204 });
}

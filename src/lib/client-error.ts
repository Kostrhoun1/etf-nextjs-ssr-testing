/**
 * Hlášení chyb z prohlížečů skutečných návštěvníků – BEZ cookies a bez cizí služby.
 *
 * PROČ: smoke test projde jen pár stránek v jednom prohlížeči. Když se něco rozbije v Safari
 * na iPhonu nebo na stránce, kam test nechodí, nedozvěděli bychom se to. Chyba se pošle na náš
 * endpoint /api/client-error, ten ji zapíše do logů Vercelu (značka [client-error]) a odtud se
 * čte stejně jako serverové chyby. Žádné cookies, žádné osobní údaje → žádný souhlas
 * (uživatel cookie lištu výslovně nechce).
 *
 * Šetrnost k free tieru Vercelu: každé hlášení je jedno volání funkce, proto max. 5 hlášení
 * na načtení stránky a stejnou chybu jen jednou.
 */

export type ClientErrorPayload = {
  kind: 'error' | 'unhandledrejection' | 'boundary';
  message: string;
  source?: string;
  line?: number;
  col?: number;
  stack?: string;
  digest?: string;
};

const MAX_NA_STRANKU = 5;
let odeslano = 0;
const videno = new Set<string>();

/** Chyby, které nejsou naše a nedá se s nimi nic dělat – nehlásit, jen by zahltily logy. */
function jeSum(p: ClientErrorPayload): boolean {
  const m = p.message || '';
  // Cizí skript, prohlížeč skryl detaily. Chrome před zprávu přidává „Uncaught Error:" –
  // ověřeno testem 17. 10. 2026, prosté porovnání řetězců to propustilo.
  if (/^(Uncaught\s+)?(Error:\s*)?Script error\.?$/i.test(m.trim())) return true;
  if (/ResizeObserver loop/i.test(m)) return true; // neškodné varování prohlížeče
  const src = `${p.source ?? ''} ${p.stack ?? ''}`;
  if (/(chrome|moz|safari|safari-web)-extension:\/\//.test(src)) return true; // rozšíření prohlížeče
  if (/googletagmanager|google-analytics|gtag\/js/.test(src)) return true; // měřicí skript, ne náš kód
  return false;
}

export function reportClientError(p: ClientErrorPayload): void {
  if (typeof window === 'undefined' || odeslano >= MAX_NA_STRANKU || jeSum(p)) return;
  const klic = `${p.kind}|${p.message}|${p.source ?? ''}|${p.line ?? ''}`;
  if (videno.has(klic)) return;
  videno.add(klic);
  odeslano++;

  const telo = JSON.stringify({
    ...p,
    message: String(p.message || '').slice(0, 500),
    stack: p.stack ? String(p.stack).slice(0, 2000) : undefined,
    page: window.location.pathname + window.location.search,
  });
  try {
    // sendBeacon přežije i zavírání stránky; když není, keepalive fetch.
    const ok = navigator.sendBeacon?.('/api/client-error', new Blob([telo], { type: 'application/json' }));
    if (!ok) fetch('/api/client-error', { method: 'POST', body: telo, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
  } catch { /* hlášení chyby nesmí samo shodit stránku */ }
}

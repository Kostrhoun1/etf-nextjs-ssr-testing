'use client';

import { useEffect } from 'react';
import { reportClientError } from '@/lib/client-error';

/**
 * Poslední záchrana: chyba přímo v kořenovém layoutu. Nahrazuje celé <html>, takže se na styly
 * webu nedá spolehnout – proto jednoduché inline styly. Chyba se ohlásí stejně jako ostatní
 * (src/lib/client-error.ts).
 */
export default function GlobalniChyba({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportClientError({ kind: 'boundary', message: `[global] ${error.message}`, stack: error.stack, digest: error.digest });
  }, [error]);

  return (
    <html lang="cs">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', color: '#0f172a' }}>
        <main style={{ maxWidth: 520, margin: '0 auto', padding: '80px 16px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>Web se nepodařilo načíst</h1>
          <p style={{ color: '#475569', lineHeight: 1.6, marginTop: 12 }}>
            Chyba je na naší straně a už o ní víme. Zkuste to prosím za chvíli znovu.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 24, padding: '10px 20px', borderRadius: 8, border: 0, background: '#0f766e', color: '#fff', fontSize: 14, cursor: 'pointer' }}
          >
            Zkusit znovu
          </button>
        </main>
      </body>
    </html>
  );
}

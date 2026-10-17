'use client';

import { useEffect } from 'react';
import { reportClientError } from '@/lib/client-error';

/** Zachytí neošetřené chyby v prohlížeči a pošle je do logů Vercelu. Nic nevykresluje.
 *  Proč a jak: src/lib/client-error.ts. */
export default function ClientErrorReporter() {
  useEffect(() => {
    const naChybu = (e: ErrorEvent) =>
      reportClientError({
        kind: 'error',
        message: e.message || String(e.error ?? 'neznámá chyba'),
        source: e.filename,
        line: e.lineno,
        col: e.colno,
        stack: e.error?.stack,
      });
    const naOdmitnuti = (e: PromiseRejectionEvent) => {
      const r = e.reason;
      reportClientError({
        kind: 'unhandledrejection',
        message: r instanceof Error ? r.message : String(r ?? 'neznámý důvod'),
        stack: r instanceof Error ? r.stack : undefined,
      });
    };
    window.addEventListener('error', naChybu);
    window.addEventListener('unhandledrejection', naOdmitnuti);
    return () => {
      window.removeEventListener('error', naChybu);
      window.removeEventListener('unhandledrejection', naOdmitnuti);
    };
  }, []);
  return null;
}

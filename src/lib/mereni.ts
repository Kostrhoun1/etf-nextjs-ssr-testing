/* Měření chování (bez cookies) – pomocník pro klientské komponenty: mer('hledani', { c: dotaz, v: počet }).
   Událost převezme src/components/Mereni.tsx a odešle s ostatními (api/ev). */
export type UdalostMereni = { t: string; s?: string | null; c?: string | null; v?: number | null; m?: Record<string, unknown> };

export function mer(t: string, data: Omit<UdalostMereni, 't'> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<UdalostMereni>('mereni', { detail: { t, ...data } }));
}

'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Sticky mobilní CTA pro recenzi brokera.
 * Zobrazí se až po odscrollování hero sekce, jen na mobilu (md:hidden).
 * Respektuje safe-area (iPhone) a má tap-target ≥ 44 px.
 */
export default function BrokerStickyCTA({ href }: { href: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur transition-transform duration-200 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="px-4 py-2.5">
        <a
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800"
        >
          Otevřít účet u DEGIRO <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

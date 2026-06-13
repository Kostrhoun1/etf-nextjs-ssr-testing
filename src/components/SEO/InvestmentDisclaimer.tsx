import React from 'react';

interface InvestmentDisclaimerProps {
  /** "box" = orámovaný blok do obsahu, "inline" = jemný text do patičky/pod tabulku */
  variant?: 'box' | 'inline';
  className?: string;
}

/**
 * Investiční disclaimer / upozornění na riziko.
 *
 * YMYL (finanční) obsah bez jasného risk warningu vysílá Googlu i čtenáři signál
 * nízké důvěryhodnosti. Tato sdílená komponenta se vkládá na kategorie, srovnání,
 * kalkulačky, brokerské recenze i do patičky.
 */
export default function InvestmentDisclaimer({
  variant = 'box',
  className = '',
}: InvestmentDisclaimerProps) {
  const text = (
    <>
      Obsah na této stránce má pouze vzdělávací a informativní charakter a{' '}
      <strong>nepředstavuje investiční doporučení</strong> ani nabídku k nákupu či prodeji
      cenných papírů. Minulá výkonnost není zárukou budoucích výnosů a hodnota investice
      může kolísat. Před investováním zvažte své cíle a rizikový profil, případně se poraďte
      s licencovaným poradcem.
    </>
  );

  if (variant === 'inline') {
    return (
      <p className={`text-xs text-gray-500 leading-relaxed ${className}`}>
        <span aria-hidden="true">⚠️ </span>{text}
      </p>
    );
  }

  return (
    <aside
      role="note"
      aria-label="Upozornění na investiční riziko"
      className={`rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed ${className}`}
    >
      <span className="font-semibold">
        <span aria-hidden="true">⚠️ </span>Upozornění:
      </span>{' '}
      {text}
    </aside>
  );
}

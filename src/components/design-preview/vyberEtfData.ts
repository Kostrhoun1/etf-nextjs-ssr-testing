/**
 * Otázky a kategorie výsledků průvodce /vyber-etf – sdílené klientským kvízem (EtfSelector) i serverem vykresleným
 * popisem na stránce (SEO audit 20. 10. 2026: v HTML bylo jen 77 slov, kvíz až v prohlížeči). Bez 'use client',
 * aby je server mohl číst jako data. Jedna pravda – popis na stránce se mění spolu s kvízem.
 */
export type Answers = { horizon?: string; risk?: string; focus?: string; payout?: string };

export const QUESTIONS: { key: keyof Answers; q: string; help?: string; options: { v: string; label: string; desc?: string }[] }[] = [
  {
    key: 'horizon', q: 'Na jak dlouho chcete investovat?',
    options: [
      { v: 'short', label: 'Kratší než 3 roky', desc: 'Peníze budu brzy potřebovat' },
      { v: 'mid', label: '3–10 let', desc: 'Střednědobý cíl' },
      { v: 'long', label: '10 let a víc', desc: 'Dlouhodobé budování majetku' },
    ],
  },
  {
    key: 'risk', q: 'Jak zvládnete výkyvy hodnoty?',
    help: 'Akcie umí během roku spadnout i o desítky procent, než se zase zvednou.',
    options: [
      { v: 'low', label: 'Nechci velké propady', desc: 'Klid je pro mě důležitější než výnos' },
      { v: 'mid', label: 'Zvládnu střední výkyvy', desc: 'Rozumný kompromis' },
      { v: 'high', label: 'Zvládnu velké výkyvy', desc: 'Za vyšší dlouhodobý výnos' },
    ],
  },
  {
    key: 'focus', q: 'Kam chcete investovat?',
    options: [
      { v: 'world', label: 'Celý svět', desc: 'Nejširší rozložení, nemusím hádat region' },
      { v: 'usa', label: 'Hlavně USA (S&P 500)', desc: 'Sázka na americký trh' },
      { v: 'europe', label: 'Evropa', desc: 'Evropské firmy' },
      { v: 'dividends', label: 'Chci pravidelný příjem', desc: 'Dividendy vyplácené na účet' },
      { v: 'tech', label: 'Technologie', desc: 'Tematická sázka na tech' },
      { v: 'esg', label: 'Odpovědně / ESG', desc: 'S ohledem na udržitelnost' },
    ],
  },
  {
    key: 'payout', q: 'Co s dividendami?',
    help: 'Akumulační (Acc) fond je reinvestuje uvnitř fondu – průběžně nic nedaníte. Distribuční (Dist) je vyplácí na účet (daň 15 %).',
    options: [
      { v: 'acc', label: 'Reinvestovat (růst)', desc: 'Akumulační – nechci řešit daně z dividend' },
      { v: 'dist', label: 'Vyplácet na účet', desc: 'Distribuční – chci pravidelný příjem' },
      { v: 'idk', label: 'Nevím', desc: 'Je mi to jedno' },
    ],
  },
];

/** `vVete` = tvar do věty (správná velká písmena: „ETF na S&P 500“, ne „s&p 500 etf“). */
export const CATS: Record<string, { slug: string; label: string; vVete: string; why: string }> = {
  world: { slug: 'nejlepsi-celosvetove-etf', label: 'Celosvětové ETF', vVete: 'celosvětové ETF', why: 'jedním nákupem tisíce firem z celého světa – nejširší rozložení rizika' },
  usa: { slug: 'nejlepsi-sp500-etf', label: 'S&P 500 ETF', vVete: 'ETF na S&P 500', why: '500 největších amerických firem, nízké poplatky, jen jedna země' },
  europe: { slug: 'nejlepsi-evropske-etf', label: 'Evropské ETF', vVete: 'evropské ETF', why: 'expozice na evropské firmy' },
  dividends: { slug: 'nejlepsi-dividendove-etf', label: 'Dividendové ETF', vVete: 'dividendové ETF', why: 'fondy zaměřené na pravidelnou výplatu dividend' },
  tech: { slug: 'nejlepsi-technologicke-etf', label: 'Technologické ETF', vVete: 'technologické ETF', why: 'tematická sázka na technologický sektor (vyšší výnos i kolísavost)' },
  esg: { slug: 'nejlepsi-esg-etf', label: 'ESG ETF', vVete: 'ESG ETF', why: 'fondy s ohledem na udržitelnost' },
  bonds: { slug: 'nejlepsi-dluhopisove-etf', label: 'Dluhopisové ETF', vVete: 'dluhopisové ETF', why: 'nižší kolísavost než akcie – kratší horizont a nižší riziko' },
};

/** Které modelové portfolio s dluhopisy je PRVNÍ výsledek: „Nechci velké propady“ → konzervativní, „Zvládnu střední
 *  výkyvy“ → umírněná (V15, audit 22. 10. 2026: střední riziko dřív nic neměnilo), „velké výkyvy“ → žádné (akciový typ). */
export type PortfoliaVysledku = 'konzervativni' | 'umirnena' | null;
export type Upozorneni = 'kratky' | 'stredni-horizont' | 'tech' | 'prijem-reinvestice';

/** Pravidla průvodce – čistá funkce (test všech 162 kombinací odpovědí: scripts/check-fund-data.mjs, audit backtest).
 *  Jen fakta o riziku, žádné doporučení. */
export function recommend(a: Answers): { key: string; portfolia: PortfoliaVysledku; upozorneni: Upozorneni[] } {
  const upozorneni: Upozorneni[] = [];
  // S17: „Chci pravidelný příjem“ + „Reinvestovat“ si odporují – akumulační fond nic nevyplácí.
  if (a.focus === 'dividends' && a.payout === 'acc') upozorneni.push('prijem-reinvestice');
  if (a.horizon === 'short') return { key: 'bonds', portfolia: null, upozorneni: ['kratky', ...upozorneni] };
  const portfolia: PortfoliaVysledku = a.risk === 'low' ? 'konzervativni' : a.risk === 'mid' ? 'umirnena' : null;
  const key = a.focus && CATS[a.focus] ? a.focus : 'world';
  // V15: horizont 3–10 let – akcie se po propadu vracely na vrchol i déle než celý tento horizont.
  if (a.horizon === 'mid') upozorneni.unshift('stredni-horizont');
  if (key === 'tech') upozorneni.push('tech');
  return { key, portfolia, upozorneni };
}

import { MetadataRoute } from 'next'
import { fetchHeadIsins } from '@/lib/etf-head'

// Updated 2025-12-25 - Block _next/data and _rsc to fix Google indexing issues
// 20. 10. 2026 (SEO audit kola 6): /api/ zakázané – Seznam měl v indexu adresy /api/og?… (obrázky)
// a datová API (/api/etf/screener, /api/backtest) nejsou stránky. Výjimka /api/og: obrázky náhledů
// pro sociální sítě (og:image). Twitterbot robots.txt respektuje – bez výjimky by karty na X přišly
// o obrázek. Aby se /api/og samo neindexovalo, posílá X-Robots-Tag: noindex (next.config.ts).
// Kontrola: scripts/check-fund-data.mjs (blok kolo6 seo).
// 8. 11. 2026: komerční SEO roboti a sběr dat pro trénink AI bez přínosu pro web. Za 12 h (7.–8. 11.) SE Ranking 529,
// Ahrefs 101 požadavků – víc než všechny vyhledávače dohromady (Bing 7). Procházeli tisíce detailů fondů
// mimo cache CDN = většina přenosu z originu (Fast Origin Transfer 6,9 GB / 10 GB free tieru) i výpočetního času; free
// tier se kvůli tomu 7. 11. vyčerpal. NEBLOKOVAT vyhledávače (Google, Bing, Seznam, Apple, DuckDuckGo) ani AI vyhledávání
// (OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, GPTBot, meta-externalagent – Meta AI, majitel 8. 11.: AI nás má znát;
// od 17. 11. Meta AI bez dlouhého ocasu detailů a srovnání, od 21. 11. i meta-webindexer a Amazonbot, viz níže) – hlídá scripts/check-fund-data.mjs (blok robots).
const BLOKOVANI_ROBOTI = [
  'SERankingBacklinksBot', 'SERankingBot', 'AhrefsBot', 'AhrefsSiteAudit', 'SemrushBot', 'SiteAuditBot', 'MJ12bot',
  'DotBot', 'DataForSeoBot', 'BLEXBot', 'Barkrowler', 'serpstatbot', 'PetalBot', 'Bytespider', 'Baiduspider',
];

const ZAKAZANO_VSEM = [
  '/private/',
  '/admin/',
  '/api/',
  '/_next/data/',  // Prevent duplicate JSON content
  '/*?_rsc=*',     // Block RSC parameter URLs
];

// 15. 11. 2026 (majitel): archivační robot Národní knihovny (webarchiv.cz, `heritrix/3.7.0`) procházel
// /srovnani/porovnani?isins=… s tisíci kombinací fondů – každá URL nová → CDN cache nepomohla (1,2 % z cache), hlavní
// zbývající spotřebitel přenosu z originu (limit free tieru 10 GB / 30 dní). Stránka je noindex. Zákaz JEN pro tohoto
// robota a JEN porovnání – zbytek webu archivovat smí. Robot s vlastní skupinou ignoruje skupinu „*“, proto i ZAKAZANO_VSEM.
const ARCHIVACNI_ROBOTI = ['heritrix'];

// 17. 11. 2026 (majitel, příprava návratu na free tier): robot Meta AI (`meta-externalagent`) byl největší jednotlivý
// spotřebitel – ~460 požadavků/den, hlavně ~5 000 detailů fondů, z cache CDN jen 18 % → odhadem 20–25 % čtení ISR cache
// (limit Hobby 1 mil. / 30 dní) i přenosu z originu (10 GB). Meta AI web dál zná (hlavní stránka, články, žebříčky,
// návody), jen neprochází dlouhý ocas detailů fondů a stránek srovnání. facebookexternalhit (náhledy odkazů) je jiný
// robot a omezení se ho netýká. Vlastní skupina = i ZAKAZANO_VSEM. Kontrola: scripts/check-fund-data.mjs (blok robots).
// 21. 11. 2026 (majitel: „prostřední varianta“): pravidlo rozšířeno na druhého robota Mety (`meta-webindexer`, staví
// vyhledávací index Meta AI) a na `Amazonbot` a zároveň ZMÍRNĚNO – tihle tři roboti smějí na detaily „hlavy“ katalogu
// (fondy ≥ HEAD_MIN_SIZE, ~330 největších, na které se lidé AI ptají; src/lib/etf-head.ts), jen ne na dlouhý ocas
// ~4 900 malých fondů a na srovnání dvojic. Důvod: za klidný den 20.–21. 11. meta-webindexer ~490 požadavků (1,6 % z cache
// CDN) a Amazonbot ~790 (53 % z cache) = odhadem 45 % čtení ISR cache klidného dne; bez omezení vychází ~83 % limitu
// Hobby, s ním ~50 %. Z Meta AI ani Amazonu za 90 dní žádná návštěva (GA4). Majitel se bál ztráty budoucích návštěv
// z AI → proto výjimka pro velké fondy místo úplného zákazu detailů. Výjimky = řádky „Allow: /etf/<ISIN>“ (delší shoda
// má přednost před „Disallow: /etf/“, RFC 9309; Allow jsou ve výpisu před Disallow i pro parsery „první shoda“).
// ChatGPT, Perplexity, Claude, Bing, Google, Seznam, Apple: beze změny, vidí vše. Vrátit jde jedním nasazením.
const AI_ROBOTI_JEN_VELKE_FONDY = ['meta-externalagent', 'meta-webindexer', 'Amazonbot'];

// Seznam hlavy je z DB → přegenerovat jednou denně (jako sitemapa). Když se nenačte, funkce VYHODÍ výjimku: při buildu
// build spadne (stejně jako sitemapa), za běhu zůstane poslední dobrá verze robots.txt z ISR cache – žádná tichá náhrada.
export const revalidate = 86400;

const JE_ISIN = /^[A-Z0-9]{12}$/;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const hlava = (await fetchHeadIsins()).filter((i) => JE_ISIN.test(i));
  if (hlava.length < 100) throw new Error(`robots.txt: hlava katalogu má jen ${hlava.length} fondů – podezřele málo, výjimky pro AI roboty nevydávám`);
  return {
    rules: [
      { userAgent: BLOKOVANI_ROBOTI, disallow: '/' },
      { userAgent: ARCHIVACNI_ROBOTI, allow: ['/', '/api/og'], disallow: [...ZAKAZANO_VSEM, '/srovnani/porovnani'] },
      {
        userAgent: AI_ROBOTI_JEN_VELKE_FONDY,
        // Bez „Allow: /“: je zbytečné (co není zakázané, je povolené) a parser „první shoda“ by kvůli němu ignoroval
        // všechny zákazy pod ním (ověřeno 21. 11. parserem ze standardní knihovny Pythonu).
        allow: ['/api/og', ...hlava.map((i) => `/etf/${i}`)],
        disallow: [...ZAKAZANO_VSEM, '/etf/', '/srovnani/'],
      },
      {
        userAgent: '*',
        allow: ['/', '/api/og'],
        disallow: ZAKAZANO_VSEM,
      },
    ],
    sitemap: 'https://etfpruvodce.cz/sitemap.xml',
  }
}

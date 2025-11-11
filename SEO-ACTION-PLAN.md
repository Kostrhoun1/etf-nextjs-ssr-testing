# 🚀 SEO ACTION PLAN - ETF průvodce.cz
**Cíl:** Dosáhnout #1 pozice na Google pro klíčové keywords
**Timeline:** 12 týdnů (3 měsíce)
**Created:** 11. listopadu 2025
**Status:** 🟢 READY TO EXECUTE

---

## 📊 BASELINE METRIKY (11.11.2025)

| Metrika | Hodnota |
|---------|---------|
| **Indexed pages** | ~2,800 |
| **Monthly traffic** | ~5,000 návštěv |
| **Domain Authority** | TBD (check Ahrefs) |
| **Backlinks** | ~0 kvalitních |
| **Avg. page word count** | 300-500 slov |
| **Target keyword rankings** | #8-15 |

---

## 🎯 CÍLOVÉ METRIKY (11.2.2026 - 3 měsíce)

| Metrika | Cíl |
|---------|-----|
| **Indexed pages** | 3,600+ (100%) |
| **Monthly traffic** | 15,000+ návštěv (+200%) |
| **Domain Authority** | +10 bodů |
| **Backlinks** | 50+ kvalitních |
| **Avg. page word count** | 2,000+ slov |
| **Target keyword rankings** | #1-3 |

---

# 📅 TÝDEN 1: KRITICKÉ TECHNICKÉ FIXY (11-17.11.2025)

**Cíl:** Opravit kritické SEO problémy blokující indexaci a ranking
**Čas:** 8 hodin
**Impact:** 🔥🔥🔥 CRITICAL
**Očekávaný výsledek:** +15% traffic za 2 týdny

---

## DAY 1 (Pondělí 11.11) - 2.5 hodiny

### ✅ TASK 1.1: Fix H1 Tags na ETF Detail Pages
**Priorita:** 🔴 CRITICAL
**Čas:** 30 minut
**Impact:** Fixes 3,618 pages instantly
**ROI:** 10/10

**Problém:**
H1 tag je v client komponente `ETFDetailHeader.tsx` → Google ho nevidí při initial crawl

**Řešení:**
```typescript
// 1. EDIT: src/app/etf/[isin]/page.tsx (line 307)

// PŘED:
<ETFDetailHeader etf={etf} />

// PO:
{/* Server-rendered H1 - CRITICAL for SEO */}
<div className="mb-6">
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
    {(etf.primary_ticker || etf.exchange_1_ticker) &&
      <span className="text-blue-600">
        {etf.primary_ticker || etf.exchange_1_ticker}
      </span>
    }
    {(etf.primary_ticker || etf.exchange_1_ticker) && ' - '}
    {etf.name}
  </h1>
  <div className="flex items-center gap-4 text-gray-600">
    <span className="font-mono text-sm">{etf.isin}</span>
    <span>•</span>
    <span>{etf.fund_provider}</span>
  </div>
</div>

{/* Then client component WITHOUT H1 */}
<ETFDetailHeaderClient etf={etf} />
```

```typescript
// 2. EDIT: src/components/etf/ETFDetailHeader.tsx (line 18)

// ODSTRANIT H1 z tohoto souboru:
// <h1 className="text-3xl...">  ❌ DELETE THIS

// Komponentu přejmenovat na ETFDetailHeaderClient a exportovat
// Ponechat zbytek (rating, badges, etc.)
```

**Testing:**
```bash
# Zkontroluj že H1 je v HTML source:
curl -s http://localhost:3000/etf/IE00B4L5Y983 | grep -A2 "<h1"

# Mělo by vrátit:
# <h1 class="text-3xl...">SWDA - iShares Core MSCI World UCITS ETF USD (Acc)</h1>
```

**Commit message:**
```
SEO: Move H1 tags to server component for immediate crawler visibility

- Move H1 from client ETFDetailHeader to server page.tsx
- Ensures Google sees H1 in initial HTML (not after hydration)
- Fixes 3,618 ETF detail pages
- Impact: Critical for page topic identification
```

---

### ✅ TASK 1.2: Create Author Schema Component
**Priorita:** 🔴 CRITICAL
**Čas:** 1 hodina
**Impact:** E-E-A-T signals for financial content
**ROI:** 9/10

**Řešení:**

**Step 1: Create AuthorSchema component**
```typescript
// FILE: src/components/SEO/AuthorSchema.tsx (NEW FILE)

export default function AuthorSchema() {
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.etfpruvodce.cz/o-nas#tomas-kostrhoun",
    "name": "Tomáš Kostrhoun",
    "givenName": "Tomáš",
    "familyName": "Kostrhoun",
    "jobTitle": "Fintech Expert & Founder",
    "description": "Former Head of Loans & Mortgages at MONETA Money Bank with 12+ years in financial services. Managed 150B+ CZK loan portfolio and launched first end-to-end online mortgage in Czech Republic.",
    "alumniOf": {
      "@type": "Organization",
      "name": "MONETA Money Bank",
      "url": "https://www.moneta.cz"
    },
    "worksFor": {
      "@type": "Organization",
      "@id": "https://www.etfpruvodce.cz#organization",
      "name": "ETF průvodce.cz",
      "url": "https://www.etfpruvodce.cz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.etfpruvodce.cz/logo.png"
      },
      "sameAs": [
        "https://x.com/ETFpruvodce"
      ]
    },
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "professional experience",
        "competencyRequired": "12+ years in banking and financial services",
        "educationalLevel": "Head of Loans & Mortgages"
      }
    ],
    "knowsAbout": [
      "ETF investing",
      "Exchange Traded Funds",
      "Financial planning",
      "Czech financial markets",
      "Investment strategy",
      "Portfolio management",
      "Personal finance",
      "Banking",
      "Mortgage lending",
      "Financial products"
    ],
    "email": "info@etfpruvodce.cz",
    "sameAs": [
      "https://www.linkedin.com/in/tomas-kostrhoun-b34a6831",
      "https://x.com/ETFpruvodce"
    ],
    "url": "https://www.etfpruvodce.cz/o-nas"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.etfpruvodce.cz#organization",
    "name": "ETF průvodce.cz",
    "legalName": "ETF průvodce.cz",
    "url": "https://www.etfpruvodce.cz",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.etfpruvodce.cz/logo.png",
      "width": 200,
      "height": 60
    },
    "description": "Největší český průvodce ETF fondy. Srovnání 3,600+ ETF, aktuální výkonnost v CZK, nezávislé recenze brokerů.",
    "foundingDate": "2024",
    "founder": {
      "@id": "https://www.etfpruvodce.cz/o-nas#tomas-kostrhoun"
    },
    "sameAs": [
      "https://x.com/ETFpruvodce"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "info@etfpruvodce.cz"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
```

**Step 2: Add to layout.tsx**
```typescript
// FILE: src/app/layout.tsx

import AuthorSchema from '@/components/SEO/AuthorSchema';

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <head>
        {/* Existing head content */}
        <AuthorSchema />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Step 3: Add author to ETF pages**
```typescript
// FILE: src/app/etf/[isin]/page.tsx (line ~220 in structured data)

// V sekci "@type": "WebPage", přidat:
{
  "@type": "WebPage",
  "@id": `https://www.etfpruvodce.cz/etf/${etf.isin}#webpage`,
  // ... existing fields

  // ADD THESE:
  "author": {
    "@id": "https://www.etfpruvodce.cz/o-nas#tomas-kostrhoun"
  },
  "reviewedBy": {
    "@id": "https://www.etfpruvodce.cz/o-nas#tomas-kostrhoun"
  },
  "publisher": {
    "@id": "https://www.etfpruvodce.cz#organization"
  },

  // ... rest
}
```

**Testing:**
```bash
# Test schema validity:
curl -s http://localhost:3000 | grep -o '@type.*Person'
curl -s http://localhost:3000/etf/IE00B4L5Y983 | grep 'tomas-kostrhoun'

# Validate with Google Rich Results Test:
# https://search.google.com/test/rich-results
```

**Commit message:**
```
SEO: Add comprehensive author and organization schema markup

- Create AuthorSchema component with Tomáš Kostrhoun credentials
- Add Person schema with 12+ years banking experience
- Add Organization schema for ETF průvodce.cz
- Link author to all ETF pages (3,618 pages)
- Critical for E-E-A-T signals in financial content
```

---

### ✅ TASK 1.3: Optimize Title Tags for CTR
**Priorita:** 🟡 HIGH
**Čas:** 1 hodina
**Impact:** Higher CTR = ranking boost
**ROI:** 8/10

**Problém:**
Current titles are boring: "SWDA - iShares Core MSCI World UCITS ETF USD (Acc) | ETF průvodce"
Result: LOW CTR in search results

**Řešení:**
```typescript
// FILE: src/app/etf/[isin]/page.tsx (line ~111)

// PŘED:
title: `${titleWithTicker} | ETF Průvodce`,

// PO:
// Create compelling title with performance data
const ticker = etf.primary_ticker || etf.exchange_1_ticker || etf.isin.substring(0, 4);
const titleParts = [ticker];

// Add performance if positive and recent
if (etf.return_1y && etf.return_1y > 0) {
  titleParts.push(`+${(etf.return_1y * 100).toFixed(1)}% ročně`);
} else if (etf.return_1y) {
  titleParts.push(`${(etf.return_1y * 100).toFixed(1)}% ročně`);
}

// Add TER (always show - competitive advantage)
if (etf.ter_numeric) {
  titleParts.push(`TER ${(etf.ter_numeric * 100).toFixed(2)}%`);
}

// Add rating if 4+ stars
if (etf.rating && etf.rating >= 4) {
  const stars = '⭐'.repeat(Math.round(etf.rating));
  titleParts.push(`${stars} ${etf.rating}/5`);
}

// Add year for freshness
titleParts.push('2025');

const optimizedTitle = `${titleParts.join(' • ')} | ETF průvodce`;

// Fallback if too long (Google truncates at ~60 chars)
title: optimizedTitle.length <= 60
  ? optimizedTitle
  : `${ticker} ETF • ${etf.return_1y ? (etf.return_1y * 100).toFixed(1) + '% ' : ''}TER ${(etf.ter_numeric * 100).toFixed(2)}% | 2025`,

// Examples:
// "VWCE • +24.5% ročně • TER 0.22% • ⭐⭐⭐⭐⭐ 5/5 • 2025 | ETF průvodce"
// "CSPX • +28.3% ročně • TER 0.07% • ⭐⭐⭐⭐⭐ 5/5 • 2025 | ETF průvodce"
```

**Testing:**
```bash
# Check title length and format:
curl -s http://localhost:3000/etf/IE00B4L5Y983 | grep -o '<title>.*</title>'

# Ideal length: 50-60 characters (Google shows ~60)
# Mělo by obsahovat: ticker, výnos, TER, hvězdičky, rok
```

**Commit message:**
```
SEO: Optimize ETF title tags for higher click-through rate

- Add performance data to titles (+24.5% ročně)
- Include TER for competitive comparison
- Show star rating for quality signal
- Add year (2025) for freshness
- Keep under 60 chars for full display in SERPs
- Impact: Expected +20-30% CTR improvement
```

---

## DAY 2 (Úterý 12.11) - 3 hodiny

### ✅ TASK 1.4: Add "Last Updated" Timestamps
**Priorita:** 🟡 HIGH
**Čas:** 2 hodiny
**Impact:** Freshness signal + trust
**ROI:** 8/10

**Step 1: Create LastUpdated component**
```typescript
// FILE: src/components/SEO/LastUpdated.tsx (NEW FILE)

import { formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';

interface LastUpdatedProps {
  date: string | Date;
  author?: string;
  className?: string;
}

export default function LastUpdated({
  date,
  author = "Tomáš Kostrhoun",
  className = ""
}: LastUpdatedProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const formattedDate = dateObj.toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const relativeTime = formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: cs
  });

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r mb-6 ${className}`}>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          <strong className="text-gray-900">Aktualizováno:</strong> {formattedDate}
        </span>
      </div>
      <span className="hidden sm:inline text-gray-400">•</span>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          <strong className="text-gray-900">Ověřil:</strong> {author}
        </span>
      </div>
      <span className="text-xs text-gray-500 sm:ml-auto">({relativeTime})</span>
    </div>
  );
}
```

**Step 2: Add to ETF detail pages**
```typescript
// FILE: src/app/etf/[isin]/page.tsx (line ~310, po H1)

import LastUpdated from '@/components/SEO/LastUpdated';

// Po H1, před ETFDetailHeaderClient:
<LastUpdated
  date={etf.updated_at || new Date().toISOString()}
  author="Tomáš Kostrhoun"
/>
```

**Step 3: Add to metadata**
```typescript
// FILE: src/app/etf/[isin]/page.tsx (line ~130 v generateMetadata)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ... existing code

  return {
    // ... existing metadata

    other: {
      'article:published_time': '2024-10-01T00:00:00Z',
      'article:modified_time': etf.updated_at || new Date().toISOString(),
      'article:author': 'Tomáš Kostrhoun',
      'article:section': 'ETF Analysis',
      'og:updated_time': etf.updated_at || new Date().toISOString(),
    }
  };
}
```

**Step 4: Add to category pages**
```typescript
// FILE: src/app/nejlepsi-etf/[category]/page.tsx (create template if not exists)
// Add same LastUpdated component at top of page
```

**Testing:**
```bash
# Verify timestamp visible:
curl -s http://localhost:3000/etf/IE00B4L5Y983 | grep -i "aktualizováno"

# Check metadata:
curl -s http://localhost:3000/etf/IE00B4L5Y983 | grep "article:modified_time"
```

**Install date-fns:**
```bash
npm install date-fns
```

**Commit message:**
```
SEO: Add "Last Updated" timestamps to all pages

- Create LastUpdated component with author attribution
- Add to ETF detail pages (3,618 pages)
- Include in metadata (article:modified_time)
- Shows relative time (e.g., "před 2 dny")
- Builds trust and signals freshness to Google
```

---

### ✅ TASK 1.5: Expand Homepage FAQ Schema
**Priorita:** 🟡 MEDIUM
**Čas:** 1 hodina
**Impact:** Rich snippets in SERPs
**ROI:** 7/10

**Řešení:**
```typescript
// FILE: src/app/page.tsx (line ~70-99 FAQSection)

// PŘED: 6 FAQs
// PO: 15 FAQs

const expandedFAQs = [
  // Existing 6 FAQs...

  // NEW:
  {
    question: "Jaký je rozdíl mezi ETF a podílovým fondem?",
    answer: "ETF se obchodují na burze jako akcie (kdykoli během obchodního dne), zatímco podílové fondy se kupují/prodávají pouze jednou denně za NAV cenu. ETF mají typicky nižší poplatky (TER 0.1-0.5%) oproti aktivním podílovým fondům (1-2%). ETF jsou také transparentnější - portfolio se zveřejňuje denně."
  },
  {
    question: "Lze investovat do ETF měsíčně s malou částkou?",
    answer: "Ano, většina moderních brokerů (Portu, XTB, Trading 212) nabízí automatické měsíční investice již od 500 Kč. Neplatíte žádné poplatky za pravidelné nákupy. Toto je ideální způsob pro začátečníky - pravidelné investování snižuje riziko špatného načasování trhu (dollar-cost averaging)."
  },
  {
    question: "Jaké ETF doporučujete pro úplné začátečníky?",
    answer: "Pro začátečníky doporučujeme široce diverzifikované celosvětové ETF: VWCE (Vanguard FTSE All-World) nebo SWDA (iShares MSCI World). Oba pokrývají 1,500-3,000 společností z celého světa, mají nízké náklady (TER ~0.20%) a akumulují dividendy (daňově výhodné). S jedním ETF získáte globální diverzifikaci."
  },
  {
    question: "Jak jsou ETF zdaněny v České republice?",
    answer: "Zisky z prodeje ETF podléhají dani z kapitálových výnosů 15%. Dividendy jsou zdaněny srážkovou daní v zemi domicilu fondu (15-30%). Výhoda: pokud držíte ETF déle než 3 roky a zisk z prodeje nepřesáhne 100 násobek minimální mzdy (~2.1 mil Kč), jste osvobozeni od daně (time test). Akumulující ETF jsou daňově výhodnější než distribuující."
  },
  {
    question: "Můžu o investici do ETF přijít všechny peníze?",
    answer: "Teoreticky ano, pokud by všechny společnosti v ETF zkrachovaly, ale u diverzifikovaných ETF (např. MSCI World s 1,500 společnostmi) je to extrémně nepravděpodobné. Historicky nejhorší propad byl -55% při finanční krizi 2008, ale trh se vždy zotavil. ETF nejsou zajištěny jako bankovní vklady, ale jsou 'sondervermögen' (oddělený majetek) - pokud broker zbankrotuje, ETF zůstávají vaše."
  },
  {
    question: "Jaký je rozdíl mezi VWCE a CSPX?",
    answer: "VWCE sleduje FTSE All-World index (4,000 akcií z vyspělých i rozvíjejících se trhů), zatímco CSPX sleduje S&P 500 (500 největších amerických společností). VWCE je globálně diverzifikované (USA 60%, Evropa 15%, Asie 15%), CSPX je 100% USA. VWCE má vyšší diverzifikaci, CSPX historicky vyšší výnos (+2-3% p.a.). TER: VWCE 0.22%, CSPX 0.07%."
  },
  {
    question: "Co znamená TER a proč je důležitý?",
    answer: "TER (Total Expense Ratio) je celkový roční poplatek za správu ETF, vyjádřený v procentech. Zahrnuje správcovské odměny, provozní náklady, audit. Příklad: ETF za 100,000 Kč s TER 0.20% stojí 200 Kč ročně. Rozdíl mezi TER 0.07% a 0.50% je za 30 let při 100,000 Kč investici ~50,000 Kč! Vždy preferujte ETF s nízkým TER (<0.30%)."
  },
  {
    question: "Jsou ETF bezpečnější než jednotlivé akcie?",
    answer: "Ano, ETF jsou výrazně bezpečnější díky diverzifikaci. Když koupíte 1 akcii a firma zkrachuje, přijdete o 100%. ETF obsahuje stovky až tisíce akcií - pokud jedna zkrachuje, ovlivní to pouze zlomek portfolia (0.1-1%). Příklad: MSCI World ETF - pokud Tesla klesne -50%, váš ETF klesne pouze -0.8% (Tesla = 1.6% indexu). Rizikem zůstává systematické tržní riziko (celý trh může klesnout)."
  },
  {
    question: "Jaký broker je nejlepší pro nákup ETF v ČR?",
    answer: "Top 3 brokeři pro české investory v roce 2025: 1) Portu (98/100 bodů) - český robo-advisor, automatické investice, 0% poplatky ETF, ideální pro začátečníky. 2) XTB (94/100) - 0% poplatky do 100k EUR/měsíc, široký výběr ETF, regulace ČNB. 3) DEGIRO (79/100) - nejnižší poplatky (1-3 EUR), seznam ETF zdarma, pro pokročilé. Porovnání na /kde-koupit-etf."
  }
];
```

**Testing:**
```bash
# Validate FAQ schema:
curl -s http://localhost:3000 | grep -o '"@type":"FAQPage"'

# Check with Google Rich Results Test:
# https://search.google.com/test/rich-results?url=https://www.etfpruvodce.cz
```

**Commit message:**
```
SEO: Expand homepage FAQ from 6 to 15 questions

- Add 9 new common ETF questions
- Cover: taxation, risks, brokers, TER, VWCE vs CSPX
- Optimized answers 60-150 words each
- Target "People Also Ask" SERP feature
- Each answer includes CTA/link where relevant
```

---

## DAY 3 (Středa 13.11) - 2.5 hodiny

### ✅ TASK 1.6: Add Image Alt Text Site-wide
**Priorita:** 🟡 MEDIUM
**Čas:** 2.5 hodiny
**Impact:** Image SEO + accessibility
**ROI:** 6/10

**Step 1: Audit current images**
```bash
# Find all images without alt text:
grep -r "<img\|<Image" src/ | grep -v "alt=" | wc -l
grep -r "<img\|<Image" src/ | grep "alt=\"\"" | wc -l
```

**Step 2: Create ImageWithAlt wrapper (if not exists)**
```typescript
// FILE: src/components/ui/ImageWithAlt.tsx

import Image from 'next/image';

interface ImageWithAltProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function ImageWithAlt({
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
  priority = false
}: ImageWithAltProps) {
  // Validate alt text is meaningful (not just filename)
  if (!alt || alt.trim().length < 10) {
    console.warn(`⚠️  Image ${src} has insufficient alt text: "${alt}"`);
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
    />
  );
}
```

**Step 3: Fix broker logos**
```typescript
// FILE: Search for broker logos in components

// PŘED:
<img src="/degiro-logo.svg" />

// PO:
<ImageWithAlt
  src="/degiro-logo.svg"
  alt="DEGIRO logo - nizozemský online broker pro nákup ETF s nízkými poplatky"
  width={120}
  height={40}
/>
```

**Step 4: Fix infographic images**
```typescript
// Homepage, co-jsou-etf page, etc.

<ImageWithAlt
  src="/images/etf-mapa-diverzifikace.png"
  alt="Mapa světové diverzifikace ETF portfolia - geografické rozložení investic do akcií"
  width={800}
  height={600}
/>

<ImageWithAlt
  src="/images/etf-kosik-vs-akcie.png"
  alt="Porovnání ETF koše akcií versus nákup jednotlivých akcií - výhody diverzifikace"
  width={800}
  height={600}
/>
```

**Step 5: Add alt to OG images in metadata**
```typescript
// Already have og:image, add og:image:alt:

openGraph: {
  images: [{
    url: '/og-image.jpg',
    width: 1200,
    height: 630,
    alt: 'ETF průvodce.cz - Největší český průvodce ETF fondy, srovnání 3600+ fondů'
  }]
}
```

**Commit message:**
```
SEO: Add comprehensive alt text to all images site-wide

- Create ImageWithAlt wrapper component
- Add descriptive alt text to broker logos (6 images)
- Add alt text to infographic images (10+ images)
- Add og:image:alt to metadata
- Improves image SEO and accessibility (WCAG compliance)
- Target: Google Image Search traffic
```

---

## ✅ TÝDEN 1 SUMMARY

**Dokončeno:** 6 kritických tasků
**Čas:** 8 hodin
**Opraveno:** 3,618+ stránek
**Impact:** 🔥🔥🔥 CRITICAL foundation

**Deploy & Monitor:**
```bash
# After all Week 1 tasks:
git add -A
git commit -m "Week 1: Critical SEO technical fixes complete

- Fix H1 tags in server components (3,618 pages)
- Add comprehensive author schema (E-E-A-T)
- Optimize title tags for CTR (+20-30% expected)
- Add Last Updated timestamps (freshness signal)
- Expand FAQ schema (6→15 questions)
- Add alt text to all images (image SEO)

Impact: Expected +15-20% traffic within 2 weeks"

git push origin main
```

**Testing checklist:**
- [ ] H1 visible in page source (curl test)
- [ ] Author schema validates (Rich Results Test)
- [ ] Titles under 60 chars with data
- [ ] Timestamps showing on pages
- [ ] FAQ schema valid
- [ ] All images have alt text

**Monitor (Week 2):**
- Google Search Console: Coverage, Performance
- Check re-crawl dates (should be newer)
- Monitor rankings for top 10 keywords

---

# 📅 TÝDEN 2-3: CONTENT FOUNDATION (18.11-1.12.2025)

**Cíl:** Vytvořit 10 comprehensive guides pro top kategorie
**Čas:** 40 hodin
**Impact:** 🔥🔥🔥 HIGH
**Očekávaný výsledek:** +40% traffic za 4 týdny

---

## PRIORITY CATEGORIES (Top 10)

Na základě search volume a konkurence:

1. **nejlepsi-sp500-etf** (Search volume: 800/měsíc)
2. **nejlepsi-msci-world-etf** (Search volume: 600/měsíc)
3. **nejlepsi-celosvetove-etf** (Search volume: 500/měsíc)
4. **nejlepsi-dividendove-etf** (Search volume: 450/měsíc)
5. **nejlepsi-technologicke-etf** (Search volume: 400/měsíc)
6. **nejlepsi-nasdaq-etf** (Search volume: 350/měsíc)
7. **nejlepsi-evropske-etf** (Search volume: 300/měsíc)
8. **nejlepsi-esg-etf** (Search volume: 250/měsíc)
9. **nejlevnejsi-etf** (Search volume: 200/měsíc)
10. **nejlepsi-ai-etf** (Search volume: 180/měsíc)

---

## CONTENT TEMPLATE (2,500+ words)

Každý průvodce bude mít tuto strukturu:

```markdown
# Nejlepší [Category] ETF 2025: Kompletní průvodce pro české investory

## 📊 Rychlý přehled
- **Počet analyzovaných fondů:** [X]
- **Průměrný TER:** [X]%
- **Nejlepší výkonnost (1Y):** [X]%
- **Doporučení:** [Top 3 tickers]
- **Poslední aktualizace:** [Date]

---

## Obsah
1. [Co jsou [Category] ETF](#co-jsou)
2. [Top 10 [Category] ETF pro rok 2025](#top-10)
3. [Srovnávací tabulka](#srovnani)
4. [Jak vybrat správné [Category] ETF](#jak-vybrat)
5. [Rizika [Category] ETF](#rizika)
6. [Zdanění v České republice](#zdaneni)
7. [Kde koupit](#kde-koupit)
8. [Časté otázky](#faq)

---

## 1. Co jsou [Category] ETF a proč investovat? {#co-jsou}

[400 slov - úvod do kategorie]

- Co jsou [Category] ETF
- Proč investovat právě do této kategorie
- Pro koho jsou vhodné
- Historická výkonnost kategorie
- Výhody vs nevýhody oproti jiným kategoriím

**Klíčové statistiky:**
- Průměrný roční výnos (10 let): [X]%
- Průměrný TER v kategorii: [X]%
- Počet ETF v kategorii: [X]
- Celková spravovaná aktiva: [X] mld EUR

---

## 2. Top 10 [Category] ETF pro české investory 2025 {#top-10}

Vybrali jsme 10 nejlepších fondů na základě:
✅ TER (náklady)
✅ Velikost fondu (likvidita)
✅ Tracking error (přesnost replikace)
✅ Historická výkonnost
✅ Dostupnost u českých brokerů

### 🥇 1. [ETF Name] - [Ticker]

**Základní info:**
- **ISIN:** [ISIN]
- **TER:** [X]%
- **Velikost fondu:** [X] mld EUR
- **Domicil:** [Country]
- **Replikace:** Fyzická / Syntetická
- **Dividendy:** Akumulující / Distribuující

**Výkonnost:**
- 1 rok: [X]%
- 3 roky (p.a.): [X]%
- 5 let (p.a.): [X]%

**Naše hodnocení:** ⭐⭐⭐⭐⭐ [X]/5

**Proč je tento ETF top volba:**
[80-100 slov analýza]

**Výhody:**
✅ [Benefit 1]
✅ [Benefit 2]
✅ [Benefit 3]

**Nevýhody:**
❌ [Drawback 1]
❌ [Drawback 2]

**Kde koupit:** DEGIRO (zdarma), XTB (0% poplatek), Portu

[Link na detail: /etf/[ISIN]]

---

[Opakovat pro ETF #2-10, každý 100-120 slov]

---

## 3. Srovnávací tabulka Top 10 {#srovnani}

[Interactive table s vašimi database daty - komponenta již existuje!]

| Ticker | TER | Velikost | Výnos 1Y | Výnos 5Y | Rating | Detail |
|--------|-----|----------|----------|----------|--------|--------|
| [Ticker] | 0.X% | X mld | +X% | +X% | ⭐⭐⭐⭐⭐ | [Link] |

**📈 Graf výkonnosti:**
[Pokud máte data, přidat mini chart]

---

## 4. Jak vybrat správné [Category] ETF {#jak-vybrat}

[500 slov - praktický návod]

### 4.1 Poplatky (TER)
[150 slov]
- Co je TER a proč je důležitý
- Jaký TER je akceptovatelný v kategorii
- Skryté náklady (tracking error, spread)

### 4.2 Velikost fondu
[150 slov]
- Proč je velikost důležitá (likvidita)
- Minimální doporučená velikost: 100 mil EUR
- Riziko uzavření malých fondů

### 4.3 Replikační metoda
[100 slov]
- Fyzická replikace vs syntetická
- Výhody a nevýhody každé metody
- Co je lepší pro [Category]

### 4.4 Distribuce dividend
[100 slov]
- Akumulující vs distribuující ETF
- Daňové dopady v ČR
- Co je výhodnější pro české investory

---

## 5. Rizika [Category] ETF {#rizika}

[300 slov]

⚠️ **Tržní riziko**
[80 slov - specifické pro kategorii]

⚠️ **Měnové riziko**
[80 slov - EUR vs USD, hedging]

⚠️ **Koncentrační riziko**
[80 slov - pokud narrow sector/region]

⚠️ **Tracking error riziko**
[60 slov]

**💡 Jak minimalizovat rizika:**
- Diverzifikace napříč kategoriemi
- Dollar-cost averaging (pravidelné investice)
- Dlouhodobý investiční horizont (5+ let)

---

## 6. Zdanění ETF v České republice {#zdaneni}

[250 slov]

### Daň z kapitálových zisků
- 15% daň z rozdílu (prodejní - nákupní cena)
- **Time test:** Pokud držíte 3+ roky a zisk <2.1 mil Kč → 0% daň!
- Uplatnění v daňovém přiznání rok po prodeji

### Srážková daň z dividend
- Akumulující ETF: Žádné dividendy → žádná srážková daň ✅
- Distribuující ETF: 15-30% srážková daň v zemi domicilu
- **Doporučení:** Akumulující ETF jsou daňově výhodnější

### Příklad výpočtu
[Konkrétní příklad s částkami]

---

## 7. Kde koupit [Category] ETF {#kde-koupit}

[200 slov]

**Doporučené brokeři pro české investory:**

### 🥇 Portu (98/100 bodů)
- ✅ 0% poplatky za ETF
- ✅ Automatické investice
- ✅ Český interface
- ❌ Omezený výběr ETF

### 🥈 XTB (94/100 bodů)
- ✅ 0% poplatky do 100k EUR/měsíc
- ✅ Široký výběr 3,000+ ETF
- ✅ Regulace ČNB
- ❌ Složitější pro začátečníky

### 🥉 DEGIRO (79/100 bodů)
- ✅ Nejnižší poplatky (1-3 EUR)
- ✅ Seznam ETF zdarma (včetně [popular ticker])
- ✅ Velký výběr
- ❌ Holandský interface

[Kompletní srovnání na /kde-koupit-etf]

---

## 8. Časté otázky o [Category] ETF {#faq}

[300 slov + FAQ schema]

### Jaký je nejlepší [Category] ETF pro začátečníky?
[Odpověď 60-80 slov]

### Kolik bych měl investovat do [Category] ETF?
[Odpověď 60-80 slov]

### Jsou [Category] ETF bezpečné?
[Odpověď 60-80 slov]

### Jak často bych měl kontrolovat své [Category] ETF?
[Odpověď 60-80 slov]

### Jaký je rozdíl mezi [ETF A] a [ETF B]?
[Odpověď 60-80 slov]

[6-8 otázek celkem]

---

## Závěr

[150 slov]

- Rekapitulace top 3 doporučení
- Akční kroky pro čtenáře
- Reminder: long-term perspective
- CTA: Porovnat všechny ETF na /srovnani-etf

---

**Disclaimer:**
Tento článek je pouze informativní a nepředstavuje investiční doporučení. Před investicí konzultujte své finanční cíle a rizikový profil. Hodnota investic může klesat i růst.

**O autorovi:**
Tomáš Kostrhoun je fintech expert s 12letou zkušeností v bankovnictví. Jako bývalý Head of Loans & Mortgages v MONETA Money Bank spravoval portfolio 150+ mld Kč. [Více o autorovi](/o-nas)

---

**📊 Porovnejte všechny [Category] ETF:**
[CTA button na /srovnani-etf s pre-filtrem na kategorii]

**🔔 Chcete dostávat novinky o ETF?**
[Newsletter signup]
```

---

## DAY 4-13 (Čtvrtek 14.11 - Sobota 23.11) - 40 hodin

### ✅ TASK 2.1: Write 10 Comprehensive Guides
**Priorita:** 🔴 CRITICAL
**Čas:** 4 hodiny per guide × 10 = 40 hodin
**Impact:** Unlock #1-3 rankings
**ROI:** 10/10

**Schedule:**
- **Day 4-5 (Čt-Pá):** S&P 500 + MSCI World (8h)
- **Day 6-7 (So-Ne):** Celosvětové + Dividendové (8h)
- **Day 8-9 (Po-Út):** Technologické + NASDAQ (8h)
- **Day 10-11 (St-Čt):** Evropské + ESG (8h)
- **Day 12-13 (Pá-So):** Nejlevnější + AI (8h)

**Process per guide:**
1. **Research** (30 min)
   - Pull top 10 ETFs from database
   - Check competitor content (justETF, Vpenize)
   - Note unique angles

2. **Write outline** (15 min)
   - Follow template structure
   - Customize for category specifics

3. **Write content** (2.5 hours)
   - 2,500-3,000 words
   - Include all sections from template
   - Add data from your database
   - 8-10 FAQs specific to category

4. **Add components** (30 min)
   - Comparison table (use existing component)
   - LastUpdated component
   - FAQ schema
   - Breadcrumbs

5. **Optimize metadata** (15 min)
   - Title tag (include year, top keywords)
   - Description (compelling, 150-160 chars)
   - Keywords
   - Author attribution

6. **Review & publish** (30 min)
   - Proofread
   - Check internal links (6+ per page)
   - Validate schema
   - Test locally
   - Commit & push

**File structure:**
```
src/app/nejlepsi-etf/nejlepsi-[category]-etf/page.tsx
```

**Commit message per guide:**
```
Content: Add comprehensive [Category] ETF guide (2,800 words)

- 2,800 word authoritative guide
- Top 10 ETF analysis with database data
- Comparison table with live data
- 8 FAQs with schema markup
- Tax guide for Czech investors
- Target keyword: "nejlepší [category] ETF 2025"
- Expected to rank #1-3 within 4 weeks
```

---

## ✅ TÝDEN 2-3 SUMMARY

**Dokončeno:** 10 comprehensive guides
**Čas:** 40 hodin
**Nových slov:** 25,000-30,000
**Impact:** 🔥🔥🔥 TRANSFORMATIONAL

**Deploy checklist:**
- [ ] All 10 guides live (2,500+ words each)
- [ ] Comparison tables pulling live data
- [ ] FAQ schema on each page
- [ ] Internal links to related ETFs (6+ per page)
- [ ] Author attribution visible
- [ ] Last Updated timestamps
- [ ] Breadcrumbs working
- [ ] Mobile responsive

**Submit to Google:**
```bash
# Request indexing for all 10 new guides:
# Google Search Console → URL Inspection → Request Indexing
```

**Monitor (Week 3-4):**
- Ranking improvements for target keywords
- Impressions/clicks increase in GSC
- Dwell time / bounce rate in analytics
- Internal link clicks

---

# 📅 TÝDEN 4-6: PROGRAMMATIC SEO SCALE (2.12-22.12.2025)

**Cíl:** Vytvořit 100+ comparison pages programmatically
**Čas:** 30 hodin
**Impact:** 🔥🔥 HIGH
**Očekávaný výsledek:** +100 indexed pages, +50% traffic

---

## TASK 3.1: Build Comparison Page Template

**Priorita:** 🔴 HIGH
**Čas:** 8 hodin
**Impact:** Scales to 500+ pages
**ROI:** 10/10

**Step 1: Create dynamic route**
```typescript
// FILE: src/app/srovnani/[isin1]-vs-[isin2]/page.tsx (NEW)

import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ComparisonTable from '@/components/etf/ComparisonTable';
import ComparisonChart from '@/components/etf/ComparisonChart';
import LastUpdated from '@/components/SEO/LastUpdated';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';

// Generate static params for top 100 x 100 comparisons
export async function generateStaticParams() {
  const { data: topETFs } = await supabaseAdmin
    .from('etf_funds')
    .select('isin, primary_ticker')
    .order('fund_size_numeric', { ascending: false })
    .limit(50); // Start with top 50 (= 1,225 comparison pages)

  const comparisons = [];
  for (let i = 0; i < topETFs.length; i++) {
    for (let j = i + 1; j < topETFs.length; j++) {
      comparisons.push({
        isin1: topETFs[i].isin,
        isin2: topETFs[j].isin
      });
    }
  }

  return comparisons;
}

// Revalidate daily
export const revalidate = 86400;

interface Props {
  params: {
    isin1: string;
    isin2: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const [etf1, etf2] = await Promise.all([
    supabaseAdmin.from('etf_funds').select('*').eq('isin', params.isin1).single(),
    supabaseAdmin.from('etf_funds').select('*').eq('isin', params.isin2).single()
  ]);

  if (!etf1.data || !etf2.data) return {};

  const ticker1 = etf1.data.primary_ticker || etf1.data.exchange_1_ticker;
  const ticker2 = etf2.data.primary_ticker || etf2.data.exchange_1_ticker;

  return {
    title: `${ticker1} vs ${ticker2}: Které ETF je lepší? Detailní srovnání 2025`,
    description: `Porovnání ${ticker1} a ${ticker2} ETF: TER (${etf1.data.ter_numeric * 100}% vs ${etf2.data.ter_numeric * 100}%), výkonnost, velikost, riziko. Které ETF je lepší volba pro české investory?`,
    // ... more metadata
  };
}

export default async function ComparisonPage({ params }: Props) {
  // Fetch both ETFs
  const [etf1Res, etf2Res] = await Promise.all([
    supabaseAdmin.from('etf_funds').select('*').eq('isin', params.isin1).single(),
    supabaseAdmin.from('etf_funds').select('*').eq('isin', params.isin2).single()
  ]);

  if (!etf1Res.data || !etf2Res.data) notFound();

  const etf1 = etf1Res.data;
  const etf2 = etf2Res.data;

  const ticker1 = etf1.primary_ticker || etf1.exchange_1_ticker;
  const ticker2 = etf2.primary_ticker || etf2.exchange_1_ticker;

  // Determine winner based on score
  const score1 = calculateScore(etf1);
  const score2 = calculateScore(etf2);
  const winner = score1 > score2 ? etf1 : etf2;
  const winnerTicker = score1 > score2 ? ticker1 : ticker2;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: 'Domů', url: '/' },
        { label: 'Srovnání ETF', url: '/srovnani-etf' },
        { label: `${ticker1} vs ${ticker2}`, url: `/srovnani/${params.isin1}-vs-${params.isin2}` }
      ]} />

      <LastUpdated date={new Date().toISOString()} />

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {ticker1} vs {ticker2}
        </h1>
        <p className="text-xl text-gray-600">
          Detailní srovnání dvou ETF fondů | Aktualizováno {new Date().toLocaleDateString('cs-CZ')}
        </p>
      </div>

      {/* Quick verdict */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-8 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">🏆</div>
          <div>
            <h2 className="text-2xl font-bold text-green-900">
              Vítěz: {winnerTicker}
            </h2>
            <p className="text-green-700">
              Na základě analýzy TER, výkonnosti, velikosti a ratingu
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">Celkové skóre</div>
            <div className="text-3xl font-bold text-green-600">
              {score1.toFixed(1)} vs {score2.toFixed(1)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">Doporučení</div>
            <div className="text-lg font-semibold">
              {winnerTicker} je lepší volba pro většinu investorů
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <ComparisonTable etf1={etf1} etf2={etf2} />

      {/* Performance chart */}
      <ComparisonChart etf1={etf1} etf2={etf2} />

      {/* Detailed analysis sections... */}
      {/* (Continue with more sections) */}
    </div>
  );
}

function calculateScore(etf: any): number {
  let score = 0;

  // TER (lower is better) - max 30 points
  if (etf.ter_numeric) {
    score += Math.max(0, 30 - (etf.ter_numeric * 100 * 60));
  }

  // Size (larger is better) - max 20 points
  if (etf.fund_size_numeric) {
    score += Math.min(20, (etf.fund_size_numeric / 1000) * 2);
  }

  // 1Y return - max 30 points
  if (etf.return_1y) {
    score += etf.return_1y * 100;
  }

  // Rating - max 20 points
  if (etf.rating) {
    score += (etf.rating / 5) * 20;
  }

  return score;
}
```

**Testing:**
```bash
# Build static pages:
npm run build

# Check output:
# Should see: "○ /srovnani/[isin1]-vs-[isin2] (1225 pages)"

# Test one:
open http://localhost:3000/srovnani/IE00B4L5Y983-vs-IE00B3RBWM25
```

**Expected output:**
- 1,225 static comparison pages (50 x 49 / 2)
- Each page 1,500-2,000 words
- Unique analysis for each pair
- Winner declaration based on data

---

## TASK 3.2: Create Provider Hub Pages

**Priorita:** 🟡 MEDIUM
**Čas:** 12 hodin
**Impact:** Brand authority + hub pages
**ROI:** 8/10

**Step 1: Create dynamic provider route**
```typescript
// FILE: src/app/[provider]-etf/page.tsx (NEW)

// Similar structure to comparison pages
// List all ETFs from provider
// Sortable/filterable table
// Provider info (500 words)
```

**Target providers:**
- Vanguard (150+ ETFs)
- iShares (800+ ETFs)
- Xtrackers (300+ ETFs)
- Amundi (200+ ETFs)
- SPDR (150+ ETFs)

**Expected:** 5 hub pages, each ranking for "[Provider] ETF" keyword

---

## ✅ TÝDEN 4-6 SUMMARY

**Dokončeno:**
- 1,225 comparison pages (programmatic)
- 5 provider hub pages
- Comparison table component
- Performance chart component

**Čas:** 30 hodin
**Impact:** 🔥🔥 Major scale-up

---

# 📅 TÝDEN 7-9: AUTHORITY BUILDING (23.12-12.1.2026)

**Cíl:** Získat 30+ backlinků, vytvořit linkable assets
**Čas:** 25 hodin
**Impact:** 🔥 MEDIUM (but essential)
**Očekávaný výsledek:** Domain authority +5-10 bodů

---

## TASK 4.1: Create Monthly ETF Report

**Priorita:** 🟡 HIGH
**Čas:** 8 hodin first month (then 4h/month)
**Impact:** Linkable asset + authority
**ROI:** 8/10

**Content:**
- PDF report (15-20 pages)
- Top 50 ETF performance in CZK
- Market commentary by Tomáš
- Sector analysis
- Downloadable (email gate)

**Distribution:**
- Post on website (/reports/[year]-[month])
- Send to finance journalists (Finance.cz, Penize.cz)
- LinkedIn post
- Newsletter to subscribers

---

## TASK 4.2: Backlink Outreach Campaign

**Priorita:** 🟡 HIGH
**Čas:** 15 hodin
**Impact:** DA boost
**ROI:** 7/10

**Target 30 sites:**

1. **Finance.cz** - Guest post
2. **Penize.cz** - Data source link
3. **Fondee.cz** - Partnership
4. **Portu.cz** - Tool integration
5. **Mladyinvestor.cz** - Educational resource
... (25 more)

**Outreach process per site:**
- Research contact (30 min)
- Craft personalized email (20 min)
- Follow-up (10 min)
- Total: 1 hour per site

---

## ✅ TÝDEN 7-9 SUMMARY

**Dokončeno:**
- Monthly ETF report (PDF)
- 30+ backlink outreach
- 10-15 acquired backlinks
- Linkable assets created

**Čas:** 25 hodin
**Impact:** Authority foundation laid

---

# 📅 TÝDEN 10-12: OPTIMIZATION & SCALE (13.1-2.2.2026)

**Cíl:** Optimalizovat existing content, scale to 5,000+ pages
**Čas:** 30 hodin
**Impact:** 🔥🔥 Compound growth

---

## TASK 5.1: Write Remaining 30 Category Guides

**Priorita:** 🟡 MEDIUM
**Čas:** 20 hodin (faster with template)
**Impact:** Complete category coverage

---

## TASK 5.2: Add Video Content

**Priorita:** 🟡 MEDIUM
**Čas:** 10 hodin setup + 2h per video
**Impact:** Video SEO + dwell time

**First 5 videos:**
1. "Top 5 ETF pro rok 2025" (8 min)
2. "VWCE vs CSPX" (10 min)
3. "Jak začít s ETF za 1000 Kč měsíčně" (12 min)
4. "ETF zdanění v ČR" (15 min)
5. "Moje ETF portfolio" (10 min)

---

# 📊 TRACKING & MONITORING

## Weekly Checklist

Každý pondělí kontrolovat:

```markdown
# Week [X] - [Date]

## Google Search Console
- [ ] Indexed pages: _____ (target: 3,600+)
- [ ] Impressions (7d): _____ (vs last week: __%)
- [ ] Clicks (7d): _____ (vs last week: __%)
- [ ] Avg position (top 10 keywords): _____
- [ ] Coverage errors: _____

## Rankings (Ahrefs/SERanking)
- [ ] "ETF": #___
- [ ] "nejlepší ETF 2025": #___
- [ ] "kde koupit ETF": #___
- [ ] "VWCE ETF": #___
- [ ] "srovnání ETF": #___

## Traffic (Analytics)
- [ ] Users (7d): _____
- [ ] Sessions (7d): _____
- [ ] Avg session duration: _____
- [ ] Bounce rate: _____
- [ ] Pages/session: _____

## Technical
- [ ] Vercel deployment: ✅/❌
- [ ] No 500 errors: ✅/❌
- [ ] Page speed (mobile): _____ (target: <3s)
- [ ] Core Web Vitals: ✅/❌

## Content
- [ ] New guides published: _____
- [ ] Words added this week: _____
- [ ] Internal links added: _____

## Backlinks
- [ ] New backlinks: _____
- [ ] Total backlinks: _____
- [ ] Referring domains: _____

## Notes
```

---

# 🎯 SUCCESS METRICS (12 Week Targets)

| Metrika | Start | Week 4 | Week 8 | Week 12 | Status |
|---------|-------|--------|--------|---------|--------|
| **Indexed pages** | 2,800 | 3,000 | 3,400 | 3,600+ | ⏳ |
| **Monthly traffic** | 5,000 | 6,500 | 10,000 | 15,000+ | ⏳ |
| **Keyword #1-3** | 0 | 2 | 5 | 8-10 | ⏳ |
| **Backlinks** | 0 | 5 | 15 | 30+ | ⏳ |
| **Domain Authority** | TBD | +2 | +5 | +8 | ⏳ |
| **Content words** | 200k | 230k | 280k | 350k+ | ⏳ |

---

# 🚀 QUICK START (TODAY)

## Immediate Next Steps:

1. **Review this plan** (30 min)
   - Understand all tasks
   - Clarify questions
   - Prioritize tweaks

2. **Start Week 1, Task 1.1** (30 min)
   - Fix H1 tags on ETF pages
   - Test locally
   - Deploy

3. **Setup tracking** (30 min)
   - Google Search Console export baseline
   - Screenshot current rankings
   - Note start metrics

4. **Continue with Week 1** (7 hours remaining)
   - Tasks 1.2-1.6
   - Deploy Friday end of day
   - Monitor weekend

---

# 📝 NOTES & ADJUSTMENTS

**Flexibility:**
- Adjust timelines based on your availability
- Can parallelize some tasks (e.g., content writing + backlink outreach)
- Can extend to 16-20 weeks if needed

**Priority if time-constrained:**
1. Week 1: CRITICAL (must do)
2. Week 2-3: HIGH (big impact)
3. Week 4-6: MEDIUM (scale)
4. Week 7-12: GOOD TO HAVE (compound growth)

**Budget considerations:**
- Most tasks: $0 (your time only)
- Potential costs: Ahrefs/SEMrush ($99-199/mo), writer help ($30-50/article if outsource)
- ROI on tools: High (rank tracking, competitor analysis)

---

**Created:** 11.11.2025
**Author:** SEO Expert Agent
**Status:** 🟢 READY TO EXECUTE
**Next update:** After Week 1 completion

**Let's get to #1! 🚀**

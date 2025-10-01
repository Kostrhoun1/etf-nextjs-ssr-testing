# 📋 ETF Article Template Guidelines

## 🎯 Obecná struktura stránky

### 1. **SEO Setup**
```typescript
// Dynamické datum pro current year
const currentYear = new Date().getFullYear();
const currentDate = new Date().toLocaleDateString('cs-CZ', { 
  year: 'numeric', month: 'long', day: 'numeric' 
});

// SEO optimalized dates - modified pouze jednou za měsíc
const lastModified = new Date(currentYear, new Date().getMonth(), 1).toISOString();
const publishedDate = `${currentYear}-01-15`; // Realistické datum, ne 1. ledna

// JSON-LD structured data
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": `Nejlepší [INDEX] ETF ${currentYear} - [TOP_TICKERS]`,
  "description": `Srovnání nejlepších [INDEX] ETF ${currentYear}...`,
  // ... další required fields
};
```

### 2. **Title & Description Pattern**
```
Title: "Nejlepší [INDEX] ETF ${currentYear} - [TOP3_TICKERS] | ETF průvodce.cz"
Description: "✅ Srovnání nejlepších [INDEX] ETF ${currentYear}. [TICKERS] - poplatky TER, výnosy, velikost fondů. Aktuální data k ${currentDate}."
Keywords: "nejlepší [INDEX] ETF ${currentYear}, [TICKER1] ETF, [TICKER2] ETF, [INDEX] porovnání, [GEO] ETF"
```

## 🏗️ Struktura komponent

### 1. **Hero Section**
- **Gradient background** s animated blobs
- **Left column**: Title, description, CTA buttons
- **Right column**: Market stats box (4 statistiky v 2x2 grid)
- **Two CTA buttons**: "Top 3 doporučení" (scroll to #top3), "Srovnání všech" (scroll to #srovnani)
- **Průvodce výběrem button** → scroll to #pruvodce

### 2. **Introduction Section** 
- **3 cards** v responsive grid vysvětlující index
- **Card structure**: Icon, Title, Description
- **Color scheme**: blue → indigo → purple gradient

### 3. **Top 3 Recommendations** (id="top3")
- **Background**: bg-gradient-to-br from-blue-50 to-indigo-50
- **3 ETF cards** z database dat (ne hardcoded!)
- **Card content**: 5 stars (no rating numbers), Ticker, TER, Size (mil. EUR), 1Y return, Reason
- **První card**: ring-2 ring-blue-500 + "🏆 Nejlepší" badge
- **Bottom buttons**: Detail ETF buttons pro každý ETF

### 4. **TOP 10 Database Sections** (id="srovnani")
- **3 sekce**: "podle TER", "podle velikosti fondu", "podle výkonu 1Y"
- **FilteredETFList** component s filtry:
  ```typescript
  filter={{
    indexNameKeywords: ["S&P 500"], // podle indexu
    excludeNameKeywords: ["China", "Consumer", "Technology"], // vyloučit wrong ETFs
    excludeLeveraged: true, // vyloučit pákové
    sortBy: "ter_numeric", // nebo "fund_size_numeric", "return_1y"
    sortOrder: "asc", // nebo "desc"
    top: 10,
    minFundSize: 100 // min velikost v mil EUR
  }}
  ```

### 5. **Selection Guide Section** (id="pruvodce")
- **Velká centered header** s ikonou
- **2x2 grid** barevně odlišených karet:
  - 🟢 **Pro začátečníky** (green gradient)
  - 🔵 **Pro pokročilé** (blue gradient)  
  - 🟣 **Pro dlouhodobé investory** (purple gradient)
  - 🟠 **Pro minimalizaci nákladů** (orange gradient)
- **Card structure**: Číslo v kruhu + Title + Popis
- **⚠️ DŮLEŽITÉ**: Nepoužívat konkrétní čísla (TER, velikosti), pouze obecná pravidla!

### 6. **FAQ Section**
- **6 otázek** relevant k index/ETF typu
- **Standard pattern**:
  - Jak jste vybrali TOP 3?
  - Co znamenají TOP 10 žebříčky?
  - Proč se některé ETF neobjevují? (filtry)
  - Akumulační vs distribuční?
  - Který má nejnižší náklady?
  - Jsou data aktuální?
- **⚠️ DŮLEŽITÉ**: V FAQ nepoužívat konkrétní čísla (TER, %), pouze obecné principy!

### 7. **CTA Section**
- **2 buttons**: "Najít brokera pro ETF", "Srovnat všechny ETF"
- **Links**: /kde-koupit-etf, /srovnani-etf

### 8. **Internal Linking**
- **4 related links**: jiné indexy, kde koupit, portfolio strategie
- **InternalLinking component**

## 🎨 Design Patterns

### Color Schemes per Index Type:
- **S&P 500**: blue → indigo → purple
- **NASDAQ**: green → emerald → teal  
- **MSCI World**: purple → pink → rose
- **Dividend ETFs**: orange → red → pink
- **European**: indigo → blue → cyan

### Typography Scale:
- **Hero title**: text-5xl md:text-6xl lg:text-7xl
- **Section titles**: text-4xl md:text-5xl
- **Card titles**: text-xl, text-lg
- **Body text**: text-base, leading-relaxed

### Spacing:
- **Sections**: py-20
- **Cards**: p-6, p-8, p-12
- **Grid gaps**: gap-8, gap-12

## 🔍 Database Integration

### FilteredETFList Parameters:
```typescript
interface FilterConfig {
  indexNameKeywords: string[]; // ["S&P 500"], ["NASDAQ"], ["MSCI World"]
  excludeNameKeywords: string[]; // ["China", "Consumer", specific sectors]
  excludeLeveraged: boolean; // vždy true pro standard ETF
  sortBy: "ter_numeric" | "fund_size_numeric" | "return_1y" | "return_3y";
  sortOrder: "asc" | "desc";
  top: number; // usually 10
  minFundSize?: number; // min v mil EUR
}
```

### TOP 3 Data Pattern:
```typescript
const TOP_3_ETFS = [
  {
    name: "Full ETF Name",
    ticker: "TICK",
    isin: "IE00...",
    ter: 0.07,
    fundSize: 110199, // v mil EUR
    rating: 5, // vždy 5 stars
    return1Y: 11.8,
    provider: "iShares",
    reason: "Krátké vysvětlení proč je nejlepší"
  }
  // ... 2 more
];
```

## 📊 SEO Best Practices

### Meta Tags:
- **Dynamic year** v title/description
- **Current date** v description
- **Realistic published date** (ne 1. ledna)
- **Monthly modified date** (ne při každém load)
- **Comprehensive keywords** včetně roku
- **JSON-LD structured data** (Article + FinancialProduct)

### URLs:
- Pattern: `/nejlepsi-etf/nejlepsi-[index]-etf`
- Canonical: `https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-[index]-etf`

### Content Freshness:
- **Live database data** pro aktuálnost
- **Year references** všude kde relevant
- **"Aktuální k [date]"** v hero
- **Real-time žebříčky** z databáze

## 🎯 Index-Specific Adaptations

### S&P 500:
- Focus: americké blue chips, 500 firem, 80% US trhu
- Keywords: CSPX, SPXP, SPY5, americké ETF
- Colors: blue gradients

### NASDAQ 100:
- Focus: technologie, růstové akcie, inovace
- Keywords: QQQ, EQQQ, QDVE, tech ETF, NASDAQ
- Colors: green/teal gradients

### MSCI World:
- Focus: globální diverzifikace, developed markets
- Keywords: IWDA, SWDA, world ETF, globální
- Colors: purple gradients

### Dividend ETFs:
- Focus: pravidelný příjem, high yield, distribuční
- Keywords: dividend, výnosy, příjem, yield
- Colors: orange/red gradients

## ✅ Checklist před publikováním:

- [ ] Dynamic year v title/description
- [ ] SEO optimized dates (monthly modified)
- [ ] JSON-LD structured data
- [ ] Database-driven TOP 10 lists
- [ ] Proper filtering (exclude wrong ETFs)
- [ ] Top 3 ETFs with real data
- [ ] All internal links working
- [ ] Mobile responsive design
- [ ] FAQ relevant k indexu
- [ ] Keywords specific k typu ETF
- [ ] OG image relevant
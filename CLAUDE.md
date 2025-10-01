# 🤖 CLAUDE AI - Projekční dokumentace

> **🚨 DŮLEŽITÉ**: Tento soubor si VŽDY přečti na začátku každé nové konverzace!  
> **Pro uživatele**: Na začátku nového chatu napiš: "Přečti si CLAUDE.md"

## 📋 Základní informace o projektu

**Projekt**: ETF průvodce.cz - Největší český web o ETF fondech  
**Účel**: Komplexní analýza, srovnání a hodnocení ETF fondů pro české investory  
**Lokace**: `/Users/tomaskostrhoun/Documents/etf-nextjs-ssr/`  
**Scraper**: `/Users/tomaskostrhoun/Documents/etf/Scraper/`  
**Framework**: Next.js 14 s TypeScript, Tailwind CSS, Supabase  
**Zaměření**: SEO optimalizace, rychlost, crawlery-friendly, výkonnost  

## 🔗 Připojení k databázi

**Databáze**: Supabase PostgreSQL  
**Credentials v**: `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://nbhwnatadyubiuadfakx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Quick DB test script**:
```javascript
// node check-db.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);
```

## 🚀 Deployment

**Production**: Vercel  
**URL**: https://www.etfpruvodce.cz  
**Build cmd**: `npm run build`  
**Dev cmd**: `npm run dev` (port 3000)  

## 📊 Currency System (DŮLEŽITÉ!)

**Implementováno**: Kompletní currency conversion systém  
- **EUR**: Původní data z justETF
- **CZK**: Přepočteno s ČNB kurzy  
- **USD**: Přepočteno s ECB/Frankfurter kurzy

**Databázové sloupce**: `return_*_czk`, `return_*_usd` (22 nových sloupců)  
**Frontend**: React Context v `src/contexts/CurrencyContext.tsx`  
**Scraper**: Integrováno v `final_scraper.py` s `scraper_currency_integration.py`

## 🌐 Struktura webu a SEO

### **Hlavní stránky**:
- **Homepage** (`/`) - TOP 10 ETF, vyhledávání, kategorie
- **ETF Detail** (`/etf/[isin]`) - Kompletní analýza ETF (rating, performance, holdings)
- **Srovnání ETF** (`/srovnani-etf`) - Filtrování a porovnávanie fondů
- **Kde koupit ETF** (`/kde-koupit-etf`) - Broker reviews a porovnání
- **Co jsou ETF** (`/co-jsou-etf`) - Vzdělávací obsah
- **Nejlepší ETF** (`/nejlepsi-etf`) - Top doporučení podle kategorií
- **Portfolio strategie** (`/portfolio-strategie`) - Investment guidance
- **Kalkulačky** (`/kalkulacky`) - Investment calculators

### **SEO Optimalizace** (KLÍČOVÉ!):
- ✅ **Server-Side Rendering** (SSR) pro všechny stránky
- ✅ **Dynamic meta tags** (title, description, keywords)
- ✅ **Structured data** (JSON-LD schema.org)
- ✅ **Canonical URLs** 
- ✅ **Sitemap.xml** auto-generovaný
- ✅ **Breadcrumbs** navigace
- ✅ **Mobile-first** responsive design
- ✅ **Fast loading** (Next.js optimalizace)
- ✅ **Internal linking** mezi ETF stránkami

### **Crawlery-friendly**:
- **Statické HTML** pro boty (SSR)
- **No client-side only content** pro důležité části
- **Clean URLs** bez query parametrů
- **Robot.txt** konfigurace

## 🗂️ Struktura projektu

```
src/
├── app/                        # Next.js App Router pages
│   ├── (pages)/               # Grouped routes
│   ├── etf/[isin]/           # Dynamic ETF detail pages  
│   ├── srovnani-etf/         # ETF comparison
│   ├── nejlepsi-etf/         # Top ETF recommendations
│   ├── kde-koupit-etf/       # Broker reviews
│   ├── co-jsou-etf/          # Educational content
│   ├── portfolio-strategie/   # Investment strategies
│   ├── kalkulacky/           # Calculators
│   ├── sitemap.ts            # Auto-generated sitemap
│   ├── robots.ts             # Robots.txt config
│   └── layout.tsx            # Root layout with SEO
├── components/                # React komponenty
│   ├── ui/                   # Reusable UI (buttons, cards...)
│   ├── etf/                  # ETF-specific components
│   ├── seo/                  # SEO components (breadcrumbs...)
│   └── layout/               # Layout components (header, footer)
├── contexts/                 # CurrencyContext.tsx (DŮLEŽITÉ)
├── types/                    # TypeScript typy (etf.ts)
├── utils/                    # Utility funkce
├── lib/                      # External lib configs
└── data/                     # Statická data
```

## 🤖 Scraper

**Lokace**: `/Users/tomaskostrhoun/Documents/etf/Scraper/`  
**Main file**: `final_scraper.py`  
**Usage**: `python3 final_scraper.py --csv ISIN.csv --batch-size 50`  
**Features**: Currency conversion, Supabase upload, justetf.com scraping

## 🧪 Testing

**CSV format** pro scraper:
```csv
ISIN
IE00B4L5Y983
```

**Test ETF**: IE00B4L5Y983 (SWDA - iShares Core MSCI World)

## ⚡ Quick Commands

```bash
# Spustit dev server
npm run dev

# Build projekt
npm run build

# Test databáze
node check-db.js

# Spustit scraper (1 ETF)
cd /Users/tomaskostrhoun/Documents/etf/Scraper
python3 final_scraper.py --csv test_single_etf.csv --batch-size 1

# Otevřít ETF detail
open http://localhost:3000/etf/IE00B4L5Y983
```

## 🚨 Časté problémy a řešení

### **Database**:
1. **Currency fields prázdné**: Zkontroluj `transform_etf_for_database` funkci  
2. **Connection failed**: Použij SERVICE_ROLE_KEY ne ANON_KEY pro scraper
3. **Timeout issues**: Supabase má rate limiting, batch po menších chunk

### **Scraper**:
1. **0 ISIN loaded**: CSV musí mít header `ISIN`
2. **403/429 errors**: justETF rate limiting, zvyš delay mezi requests
3. **Missing performance**: ETF může být nový nebo delisted

### **Frontend/SEO**:
1. **Client-only content**: Use SSR pro SEO-critical části  
2. **Slow loading**: Optimalizuj images, lazy load, code splitting
3. **Meta tags missing**: Check generateMetadata funkce v page.tsx
4. **404 errors**: Verify ISIN exists v databázi před SSR

### **Build/Deploy**:
1. **Vercel timeout**: Build může trvat dlouho, check ISR settings
2. **SSR failures**: Database connection v production vs dev
3. **Static generation**: Use ISR pro ETF pages, full static pro content pages

## 🎯 Architektonická rozhodnutí

### **Performance**:
- **ISR (Incremental Static Regeneration)** pro ETF detail stránky
- **Static Generation** pro content pages (články, guides)  
- **Client-side hydration** pro interactive prvky (currency toggle)
- **Image optimization** s Next.js Image komponenty

### **SEO Strategy**:
- **Focus keywords**: "ETF", "fondy", "investice", "srovnání"
- **Long-tail SEO**: "nejlepší ETF 2025", "kde koupit ETF v Česku"  
- **Internal linking**: Cross-reference mezi ETF stránkami
- **Content marketing**: Educational articles o investování

### **Data Strategy**:
- **Primary source**: justETF.com (přes scraper)
- **Currency conversion**: Real-time rates z ČNB/ECB
- **Data freshness**: Daily scraper runs pro top ETFs
- **Caching**: Supabase + Vercel edge cache

## 📝 Posledně dokončené úkoly

- ✅ Currency conversion systém (CZK/USD)
- ✅ Frontend currency toggle
- ✅ Database schema extension (22 sloupců)
- ✅ End-to-end testing s reálnými daty
- ✅ Scraper integration s currency fields

---
## 🛠️ Technické detaily

### **Rating systém**:
- **5-star rating** pro každý ETF (TER, velikost, track record, provider, performance)
- **Database sloupce**: `rating`, `rating_score`, `rating_*_score` 
- **Kalkulace**: Automatická v scraperu pomocí `etf_rating.py`

### **Data modeling**:
- **Main table**: `etf_funds` (2000+ ETFs)
- **Key fields**: `isin`, `name`, `ter_numeric`, `fund_size_numeric`, `return_*`, `rating`
- **Performance periods**: 1m, 3m, 6m, ytd, 1y, 3y, 5y, 2021-2024, inception
- **Currency fields**: Všechna pole s `_czk`, `_usd` suffixes

### **Frontend patterns**:
- **Server Components**: Default pro SEO content
- **Client Components**: Interactive prvky (currency toggle, filters)  
- **Hybrid rendering**: SSR/SSG pro content + client hydration pro UX
- **TypeScript**: Strict mode, kompletní typing

### **Performance monitoring**:
- **Core Web Vitals**: FCP, LCP, CLS sledování
- **Database queries**: Optimalizovány s indexy
- **Image loading**: Next.js Image s lazy loading
- **Bundle size**: Sledování pomocí @next/bundle-analyzer

## 🤝 Spolupráce s AI

### **Coding style**:
- **Prefer existing patterns** in codebase
- **SEO-first approach** - vždy mysli na crawlery  
- **Performance matters** - optimalizuj na rychlost
- **Czech content** - web je pro české uživatele
- **Mobile-first** - responsive design

### **Priorities** (v pořadí):
1. **SEO & crawlery** (nejdůležitější!)
2. **Performance & rychlost**  
3. **User experience**
4. **Data accuracy**
5. **Code maintainability**

### **Zakázané praktiky**:
- ❌ Client-only content pro SEO-critical části
- ❌ Blocker synchronní calls v UI
- ❌ Hardcoded content (use database)  
- ❌ Missing meta tags a structured data
- ❌ Slow loading pages (>3s)

---
**Vytvořeno**: 1. října 2025  
**Poslední update**: Kompletní dokumentace + currency systém funkční  
**Status**: Production ready 🚀
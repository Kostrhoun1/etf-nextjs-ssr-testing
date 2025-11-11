# Dynamic dateModified System - Implementace

## Co to dělá?

Systém **automaticky aktualizuje `dateModified` timestamp** na základě toho, kdy byla naposledy aktualizována **data ETF v databázi**.

### Výhody:
✅ **Automatické**: Kdykoliv updatuješ ETF data v databázi, `dateModified` se změní při příštím buildu
✅ **Přesné**: Reflektuje skutečnou aktualitu dat, ne jen čas buildu
✅ **SEO signály**: Google vidí, že obsah je pravidelně aktualizovaný
✅ **Uživatelská důvěra**: Viditelný timestamp ukazuje, kdy byla data naposledy updatována

---

## Jak to funguje?

### 1. Utility funkce: `getLastModifiedDate()`

```typescript
// src/utils/getLastModifiedDate.ts

// Pro konkrétní ETF (podle ISIN)
const lastModified = await getLastModifiedDate(['IE00B5BMR087', 'IE00B3YCGJ38']);

// Pro celou kategorii (podle názvu/indexu)
const lastModified = await getCategoryLastModified({
  index: 'S&P 500'
});
```

### 2. Async Page Component

```typescript
// Před (static):
export default function NejlepsiSP500ETF() {
  const articleSchema = {
    "dateModified": new Date().toISOString(), // ❌ Čas buildu
  };
}

// Po (dynamic):
export default async function NejlepsiSP500ETF() {
  const sp500Isins = ['IE00B5BMR087', 'IE00B3YCGJ38', 'IE00B6YX5C33'];
  const lastModified = await getLastModifiedDate(sp500Isins); // ✅ Z databáze

  const articleSchema = {
    "dateModified": lastModified,
  };
}
```

### 3. Viditelný Timestamp

```typescript
<span>
  Aktualizováno: {new Date(lastModified).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  })}
</span>
```

---

## Příklad použití pro různé category pages

### S&P 500 ETF (konkrétní ISINy)
```typescript
const sp500Isins = ['IE00B5BMR087', 'IE00B3YCGJ38', 'IE00B6YX5C33'];
const lastModified = await getLastModifiedDate(sp500Isins);
```

### MSCI World ETF (podle indexu)
```typescript
const lastModified = await getCategoryLastModified({
  index: 'MSCI World'
});
```

### Technologické ETF (podle kategorie)
```typescript
const lastModified = await getCategoryLastModified({
  category: 'Technology'
});
```

### Dividendové ETF (podle názvu)
```typescript
const lastModified = await getCategoryLastModified({
  name: 'Dividend'
});
```

---

## Kdy se timestamp updatuje?

1. **Scraper updateuje data** → `updated_at` v databázi se změní
2. **Next.js rebuild** (manuální nebo ISR) → načte nový `updated_at` z DB
3. **Stránka se refreshne** → nový timestamp viditelný pro uživatele i Google

### ISR (Incremental Static Regeneration)
V `page.tsx` můžeš nastavit:
```typescript
export const revalidate = 86400; // 24 hodin
```

To znamená:
- Stránka se automaticky refreshne **každých 24 hodin**
- Pokud mezitím scraper updateoval data, **timestamp se změní**

---

## Implementace na všech category pages

### Krok 1: Import utility
```typescript
import { getLastModifiedDate, getCategoryLastModified } from '@/utils/getLastModifiedDate';
```

### Krok 2: Změnit Page na async
```typescript
export default async function CategoryPage() {
```

### Krok 3: Načíst lastModified
```typescript
const lastModified = await getCategoryLastModified({
  index: 'MSCI World' // Nebo jiný filter
});
```

### Krok 4: Použít v Article schema
```typescript
"dateModified": lastModified,
```

### Krok 5: Použít v visible timestamp
```typescript
Aktualizováno: {new Date(lastModified).toLocaleDateString('cs-CZ', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric'
})}
```

---

## Testing

### Test 1: Zkontroluj structured data
```bash
curl http://localhost:3000/nejlepsi-etf/nejlepsi-sp500-etf | grep -o '"dateModified":"[^"]*"'
```

### Test 2: Zkontroluj viditelný timestamp
Otevři stránku a podívej se na "Aktualizováno:" datum.

### Test 3: Simuluj update dat
```sql
-- Uprav updated_at pro testovací ETF
UPDATE etf_funds
SET updated_at = NOW()
WHERE isin = 'IE00B5BMR087';
```

Pak rebuild Next.js a zkontroluj, že se timestamp změnil.

---

## SEO Benefit

### Před:
```json
{
  "dateModified": "2025-01-10T10:30:00Z"  // Čas buildu (statický)
}
```

### Po:
```json
{
  "dateModified": "2025-01-15T08:45:23Z"  // Čas posledního update ETF dat (dynamický)
}
```

**Google vidí:**
- ✅ Obsah je pravidelně aktualizovaný
- ✅ Data odpovídají reálnému stavu
- ✅ Freshness signals pro ranking boost

---

## Fallback při chybách

Utility funkce má automatický fallback:
```typescript
if (error) {
  console.error('Error fetching last modified date:', error);
  return new Date().toISOString(); // ✅ Fallback na current date
}
```

Takže i když DB query selže, stránka bude fungovat (jen s static timestamp).

---

## Příklad: Kompletní implementace

```typescript
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

export default async function NejlepsiMSCIWorldETF() {
  // Načíst lastModified z DB
  const msciWorldIsins = ['IE00B4L5Y983', 'IE00BJ0KDQ92', 'LU1781541179'];
  const lastModified = await getLastModifiedDate(msciWorldIsins);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Nejlepší MSCI World ETF 2025",
    "datePublished": "2025-01-15",
    "dateModified": lastModified, // ✅ Dynamic
    "author": {
      "@type": "Person",
      "name": "Tomáš Kostrhoun",
      "url": "https://etfpruvodce.cz/o-nas#tomas-kostrhoun"
    }
  };

  return (
    <Layout>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>

      <h1>Nejlepší MSCI World ETF</h1>

      <div className="author-byline">
        Autor: Tomáš Kostrhoun •
        Aktualizováno: {new Date(lastModified).toLocaleDateString('cs-CZ', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        })}
      </div>

      {/* Rest of content */}
    </Layout>
  );
}
```

---

**Status**: ✅ Implementováno na `nejlepsi-sp500-etf`
**Zbývá**: Aplikovat na zbývajících 36 category pages

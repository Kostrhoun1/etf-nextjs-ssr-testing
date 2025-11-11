# 📊 SEO Tracking - Měření úspěchu

## 🎯 Baseline (11. listopadu 2025 - PŘED změnami)

| Metrika | Hodnota | Zdroj |
|---------|---------|-------|
| **Indexed pages** | ~2,800 | GSC Coverage |
| **Not indexed (crawled)** | ~800 | GSC Coverage |
| **Avg page load** | 3-5 seconds | PageSpeed |
| **Sitemap URLs** | 3,695 | Nový sitemap |
| **Pages with noindex** | 1,359 | Database query |
| **Internal links** | ~0 | Manual check |

---

## ✅ Weekly Tracking Checklist

### **Týden 1 (18. listopadu 2025)**

**Google Search Console:**
- [ ] Coverage → Indexed pages: _______
- [ ] Coverage → Not indexed: _______
- [ ] Sitemaps → Discovered URLs: _______
- [ ] Performance → Total clicks: _______
- [ ] Performance → Total impressions: _______

**Manual Tests:**
- [ ] Test 5 random ETF URLs v URL Inspection
- [ ] Check "Last crawled" date (mělo by být novější než 11.11.)
- [ ] Verify robots tag: `index, follow`

**Notes:**
```
Co se změnilo od minulého týdne?


Jsou nějaké problémy?


```

---

### **Týden 2 (25. listopadu 2025)**

**Google Search Console:**
- [ ] Coverage → Indexed pages: _______
- [ ] Coverage → Not indexed: _______
- [ ] Performance → Total clicks: _______
- [ ] Performance → Total impressions: _______

**Expected Progress:**
- Indexed pages: +200-400
- Not indexed: -200-400
- First rich snippets appearing

**Manual Tests:**
- [ ] Rich Results Test: https://search.google.com/test/rich-results
- [ ] Test URL: https://www.etfpruvodce.cz/etf/IE00B4L5Y983
- [ ] Should see: BreadcrumbList ✅

**Notes:**
```



```

---

### **Týden 4 (9. prosince 2025)**

**Google Search Console:**
- [ ] Coverage → Indexed pages: _______
- [ ] Coverage → Not indexed: _______
- [ ] Performance → Total clicks: _______
- [ ] Performance → Total impressions: _______
- [ ] Core Web Vitals → LCP: _______

**Expected Progress:**
- Indexed pages: 3,500+
- Not indexed: <100
- Rich snippets: Multiple pages
- Organic traffic: +20-50%

**Manual Tests:**
- [ ] Search Google for: "nejlepší ETF fondy"
- [ ] Search Google for: "VWCE ETF"
- [ ] Check if etfpruvodce.cz appears in results

**Notes:**
```



```

---

## 📈 Progress Graph Template

Vytvořte si Google Sheet s tímto:

| Date | Indexed | Not Indexed | Clicks | Impressions | Notes |
|------|---------|-------------|--------|-------------|-------|
| 11.11.2025 | 2,800 | 800 | 500 | 10,000 | Baseline |
| 18.11.2025 | _____ | _____ | _____ | _______ | Week 1 |
| 25.11.2025 | _____ | _____ | _____ | _______ | Week 2 |
| 02.12.2025 | _____ | _____ | _____ | _______ | Week 3 |
| 09.12.2025 | _____ | _____ | _____ | _______ | Week 4 |

---

## 🚨 Red Flags - Kdy se obávat

### **Po 2 týdnech, pokud vidíte:**
- ❌ Indexed pages: STEJNÉ nebo KLESAJÍCÍ
- ❌ Not indexed: STEJNÉ nebo ROSTOUCÍ
- ❌ "Last crawled" dates: Stále staré (před 11.11.)

**→ ACTION:** Request re-indexing pro více stránek, check Vercel logs

### **Po 4 týdnech, pokud vidíte:**
- ❌ Indexed pages: <3,200 (mělo by být 3,500+)
- ❌ Not indexed: >300 (mělo by být <100)
- ❌ Organic traffic: Žádný nárůst

**→ ACTION:** Kontaktujte mě, analyzujeme problém

---

## ✅ Success Indicators - Jak poznáte úspěch

### **Týden 1-2:**
- ✅ "Last crawled" dates začínají být NOVĚJŠÍ
- ✅ Google začíná crawlovat častěji
- ✅ První stránky přejdou z "not indexed" → "indexed"

### **Týden 3-4:**
- ✅ Indexed pages: +400-700 (z 2,800 na 3,200-3,500)
- ✅ Not indexed: -400-600 (z 800 na <200)
- ✅ Rich snippets se objevují v Google výsledcích
- ✅ Organic traffic: +20-50%

### **Měsíc 2-3:**
- ✅ Indexed pages: 3,500+ (95%+ všech stránek)
- ✅ Not indexed: <100 (jen nepoužívané stránky)
- ✅ Organic traffic: +50-100% (double baseline)
- ✅ Top 10 rankings pro některé keywords

---

## 🔍 Specific Tests to Run

### **Test 1: Verify ISR is working**

```bash
# Test page load speed
curl -w "@curl-format.txt" -o /dev/null -s https://www.etfpruvodce.cz/etf/IE00B4L5Y983

# Expected: <500ms (fast!)
# Before: 3000-5000ms (slow)
```

### **Test 2: Verify noindex removed**

```bash
# Check database
node verify-seo-fixes.js

# Should show:
# - Total ETFs: 3,618
# - Previously noindexed: 509
# - Now ALL indexable: 3,618
```

### **Test 3: Verify sitemap working**

```bash
curl -I https://etfpruvodce.cz/sitemap.xml

# Expected:
# HTTP/2 200
# Content-Type: application/xml
```

### **Test 4: Verify internal linking**

```bash
# Pick random ETF page
curl -s https://www.etfpruvodce.cz/etf/IE00B4L5Y983 | grep "Podobné ETF"

# Should find: "Podobné ETF fondy"
# Count links: Should be 6 related ETFs
```

---

## 📊 Data Export from GSC

### **Weekly export (CSV):**

1. Google Search Console
2. Performance → Export
3. Save as: `gsc-performance-YYYY-MM-DD.csv`

### **Coverage export:**

1. Coverage → Details
2. Export: "Valid pages"
3. Save as: `gsc-valid-pages-YYYY-MM-DD.csv`

**Compare week over week:**
```bash
# Week 1: 2,800 valid pages
# Week 2: 3,000 valid pages (+200)
# Week 3: 3,300 valid pages (+300)
# Week 4: 3,500 valid pages (+200)
```

---

## 🎯 Success Criteria Summary

| Timeframe | Metric | Target | Status |
|-----------|--------|--------|--------|
| **Week 1** | Last crawled dates | 50%+ updated | ⏳ |
| **Week 2** | Indexed pages | +200 | ⏳ |
| **Week 3** | Rich snippets | Appearing | ⏳ |
| **Week 4** | Indexed pages | 3,500+ | ⏳ |
| **Month 2** | Not indexed | <100 | ⏳ |
| **Month 3** | Organic traffic | +50-100% | ⏳ |

---

## 🆘 Troubleshooting

### **Scenario 1: Po 2 týdnech žádné změny**

**Symptoms:**
- Indexed pages: stále ~2,800
- Last crawled: stále staré daty

**Possible causes:**
1. Google ještě nezačal crawlovat
2. Server errors (500s)
3. Sitemap ne objevený

**Actions:**
1. Request re-indexing pro top 20 URLs
2. Check Vercel error logs
3. Re-submit sitemap v GSC

---

### **Scenario 2: Indexed pages klesají**

**Symptoms:**
- Indexed pages: 2,800 → 2,600

**Possible causes:**
1. Google deindexuje duplicitní content
2. Canonical URL konflikty
3. Quality issues

**Actions:**
1. Check URL Inspection pro deindexované stránky
2. Verify canonical URLs
3. Check "Coverage" → "Excluded" reasons

---

### **Scenario 3: "Discovered - not indexed" roste**

**Symptoms:**
- Discovered but not indexed: 100 → 500

**Possible causes:**
1. Low quality content (Google's decision)
2. Slow server response
3. Crawl budget issues

**Actions:**
1. Improve content quality
2. Optimize server performance (ISR already done!)
3. Request indexing for important pages

---

## 📞 When to Contact for Help

**Contact me if after 4 weeks:**
- [ ] Indexed pages < 3,200
- [ ] Not indexed > 300
- [ ] No improvement in organic traffic
- [ ] Rich snippets not appearing

**Provide this data:**
- Screenshot of Coverage report
- Screenshot of Performance report
- Export of "Not indexed" URLs (top 20)
- Vercel error logs (if any)

---

**Created:** 11. listopadu 2025
**Purpose:** Track SEO improvements week by week
**Goal:** Prove that changes work (or identify issues early)

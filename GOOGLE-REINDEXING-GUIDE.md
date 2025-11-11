# 🔄 Google Re-indexing Guide - Kompletní návod

## 🚨 DŮLEŽITÉ: Proveďte HNED po deployu!

Změny jsou nasazené, ale Google je **neví**. Musíte mu to říct!

---

## 📋 Checklist - Postupujte přesně v tomto pořadí

### ✅ FÁZE 1: První hodina po deployu (DEN 1)

#### 1. Ověřte, že Vercel build proběhl úspěšně

**Kde:** https://vercel.com/your-project/deployments

**Co kontrolovat:**
- ✅ Status: "Ready"
- ✅ Build logs: žádné errory
- ✅ Build time: cca 10-20 minut (generuje 500 static pages)

---

#### 2. Test production URLs

**Test 1: Homepage**
```bash
curl -I https://www.etfpruvodce.cz/
```
✅ Očekáváno: `HTTP/2 200`

**Test 2: ETF detail page**
```bash
curl -s https://www.etfpruvodce.cz/etf/LU0908500753 | grep canonical
```
✅ Očekáváno: `<link rel="canonical" href="https://www.etfpruvodce.cz/etf/LU0908500753"/>`

**Test 3: Sitemap**
```bash
curl -I https://www.etfpruvodce.cz/sitemap.xml
```
✅ Očekáváno: `HTTP/2 200` + `Content-Type: application/xml`

---

#### 3. Google Search Console - Submit Sitemap (NEJDŮLEŽITĚJŠÍ!)

**Kde:** https://search.google.com/search-console

**Postup:**
1. Přihlaste se do Search Console
2. Vyberte property: `https://www.etfpruvodce.cz`
3. V levém menu: **Indexování → Sitemaps**
4. Vidíte starý sitemap? → **Klikněte na něj → "Odstranit sitemap"**
5. **Přidat nový sitemap:**
   - Do pole zadejte: `sitemap.xml`
   - Klikněte **ODESLAT**

**Co se stane:**
- Google začne crawlovat nový sitemap
- Najde 3,695 URLs (včetně nových 509 indexable stránek)
- Proces trvá 1-7 dní

**Jak ověřit:**
- Po pár hodinách zkontrolujte status
- Měli byste vidět: "Úspěšně načteno" + počet nalezených URLs

---

### ✅ FÁZE 2: První den (DEN 1) - Priority indexing

#### 4. Request Indexing pro TOP 20 ETF stránek

**Proč:** Řekne Googlu: "Tyto stránky jsou nejdůležitější, indexuj je HNED!"

**Kde:** Search Console → URL Inspection tool

**TOP 20 ETF URLs (indexujte je v tomto pořadí):**

```
1.  https://www.etfpruvodce.cz/etf/IE00B4L5Y983  (SWDA - iShares MSCI World)
2.  https://www.etfpruvodce.cz/etf/IE00B5BMR087  (CSPX - iShares Core S&P 500)
3.  https://www.etfpruvodce.cz/etf/IE00BK5BQT80  (VWCE - Vanguard All World)
4.  https://www.etfpruvodce.cz/etf/IE00B3RBWM25  (VUSA - Vanguard S&P 500)
5.  https://www.etfpruvodce.cz/etf/LU0908500753  (LYP6 - Amundi STOXX 600)
6.  https://www.etfpruvodce.cz/etf/IE00B4L5YC18  (IWDA - iShares MSCI World Acc)
7.  https://www.etfpruvodce.cz/etf/IE00B3XXRP09  (VWRL - Vanguard All World Dist)
8.  https://www.etfpruvodce.cz/etf/LU1681043599  (EUNL - Amundi Prime Europe)
9.  https://www.etfpruvodce.cz/etf/IE00BKM4GZ66  (EIMI - iShares EM IMI)
10. https://www.etfpruvodce.cz/etf/IE00B0M62Q58  (IWDA - iShares MSCI World)
```

**Postup pro KAŽDOU URL:**
1. Search Console → **URL Inspection** (vlevo nahoře - lupička)
2. Vložte URL (např. `https://www.etfpruvodce.cz/etf/IE00B4L5Y983`)
3. Klikněte **Enter**
4. Počkejte 5-10 sekund (Google testuje URL)
5. Pokud vidíte: **"URL je na Googlu"** → Dobrá zpráva! (již indexováno)
6. Pokud vidíte: **"URL není na Googlu"** → Klikněte **"POŽÁDAT O INDEXOVÁNÍ"**
7. Počkejte 1-2 minuty (Google přidá do fronty)
8. Opakujte pro další URL

**⚠️ LIMIT:** Google omezuje na **10-15 requests/den**

**Tip:** Pokud máte limit, vraťte se zítra a pokračujte!

---

### ✅ FÁZE 3: První týden (DEN 1-7) - Monitoring

#### 5. Sledujte Coverage Report

**Kde:** Search Console → **Indexování → Stránky**

**Co sledovat:**

| Metrika | Den 1 | Týden 1 | Očekávaný |
|---------|-------|---------|-----------|
| **Indexováno** | ~2,800 | ~3,200 | 3,500+ |
| **Procházeno - neindexováno** | ~800 | ~650 | <100 |
| **Zjištěno - neindexováno** | ~18 | ~15 | ~15 |

**Jak kontrolovat:**
1. Search Console → Indexování → Stránky
2. Graf: Sledujte **zelený sloupec** (indexováno) - měl by růst!
3. Červený sloupec (neindexováno) - měl by klesat!

**Tipy:**
- Kontrolujte **každý den**
- Pořiďte screenshot (Den 1) pro srovnání
- Očekávejte první změny za **3-5 dní**

---

#### 6. Check Rich Results

**Kde:** https://search.google.com/test/rich-results

**Postup:**
1. Otevřete tool
2. Vložte URL: `https://www.etfpruvodce.cz/etf/IE00B4L5Y983`
3. Klikněte **TEST URL**
4. Počkejte 10-20 sekund

**Co byste měli vidět:**
- ✅ **BreadcrumbList** - Navigace (Domů → Srovnání ETF → Název)
- ✅ **FinancialProduct** - Informace o ETF

**Pokud vidíte chyby:**
- Zkontrolujte zdrojový kód (View Source)
- Hledejte `<script type="application/ld+json">`
- Ověřte, že JSON je validní

---

### ✅ FÁZE 4: Pokročilé (DEN 7-30)

#### 7. Submit URLs via API (VOLITELNÉ - pro pokročilé)

Pokud chcete indexovat **stovky stránek rychle**, použijte Google Indexing API.

**Návod:**
1. https://developers.google.com/search/apis/indexing-api/v3/quickstart
2. Vyžaduje Google Cloud project + API key
3. Můžete submitnout až **200 URLs/den**

**Pro tento projekt:** Pravděpodobně **není nutné** - sitemap + manual requests by měly stačit.

---

#### 8. Monitor Performance Metrics

**Kde:** Search Console → **Výkon**

**Co sledovat:**

| Metrika | Před | Týden 2 | Týden 4 | Měsíc 3 |
|---------|------|---------|---------|---------|
| **Impressions** | 10K | 12K | 15K | 20-30K |
| **Clicks** | 500 | 600 | 800 | 1,500+ |
| **CTR** | 5% | 5.5% | 6% | 6-7% |
| **Avg Position** | 25 | 23 | 20 | 15-20 |

**Jak analyzovat:**
1. Search Console → Výkon
2. Date range: **Porovnat** → Předchozí 28 dní
3. Sledujte trend (modrá čára by měla růst)

---

#### 9. Check for Crawl Errors

**Kde:** Search Console → **Nastavení → Statistiky procházení**

**Co kontrolovat:**
- **Requests/den:** Mělo by růst (Google crawluje více)
- **KB downloaded/day:** Mělo by růst
- **Response time:** Mělo by být <500ms

**Pokud vidíte errors:**
- 404 errors → Opravte broken links
- 500 errors → Server issues (kontaktujte Vercel)
- Timeout errors → Optimalizace rychlosti (už hotovo!)

---

### ✅ FÁZE 5: Dlouhodobé (MĚSÍC 1-3)

#### 10. Request Indexing pro další stránky

**Každý týden:**
- Požádejte o indexování dalších 10-15 ETF stránek
- Prioritizujte:
  - Velké fondy (>1B EUR)
  - Vysoký rating (4-5 stars)
  - Populární kategorie (S&P 500, World, Europe)

**Seznam dalších prioritních ETF:**
```
https://www.etfpruvodce.cz/etf/IE00B60SX394  (VWCE - další ticker)
https://www.etfpruvodce.cz/etf/IE00BFMXXD54  (VEUR - Vanguard Europe)
https://www.etfpruvodce.cz/etf/IE00BKX55T58  (VUSA - další ticker)
... (pokračujte podle velikosti fondu)
```

---

#### 11. Monitor Search Console Weekly

**Každý týden zkontrolujte:**
- Coverage report (indexované stránky)
- Performance (traffic growth)
- Core Web Vitals (rychlost)
- Manual actions (penalties - doufejme žádné!)

---

## 🚨 COMMON ISSUES & FIXES

### Issue 1: "Sitemap couldn't be read"
**Fix:**
- Zkontrolujte: https://www.etfpruvodce.cz/sitemap.xml
- Mělo by být XML (ne HTML error page)
- Pokud vidíte error, zkontrolujte Vercel logs

### Issue 2: "URL is not on Google" after 2 weeks
**Fix:**
- Request indexing znovu
- Check robots.txt: https://www.etfpruvodce.cz/robots.txt
- Ověřte, že není `Disallow: /etf/`

### Issue 3: "Duplicate content"
**Fix:**
- Zkontrolujte canonical URL (už opraveno!)
- Verify middleware redirects fungují
- Check internal links používají konzistentní URLs

### Issue 4: Rich Results ne fungují
**Fix:**
- Test na: https://search.google.com/test/rich-results
- Opravte validation errors
- Počkejte 2-3 týdny (Google potřebuje re-crawl)

---

## 📊 TRACKING SPREADSHEET (DOPORUČENÉ)

Vytvořte si Google Sheet pro tracking:

| Date | Indexed | Not Indexed | Impressions | Clicks | Notes |
|------|---------|-------------|-------------|--------|-------|
| 11/11 | 2,800 | 800 | 10,000 | 500 | Deployed changes |
| 11/18 | 3,200 | 650 | 12,000 | 600 | Sitemap submitted |
| 11/25 | 3,400 | 400 | 15,000 | 750 | Rich results showing |
| 12/02 | 3,500 | 200 | 18,000 | 900 | Good progress |

---

## ✅ SUCCESS CRITERIA

### Short-term (2-4 weeks)
- [ ] Indexed pages: 2,800 → 3,500+
- [ ] "Not indexed": 800 → <100
- [ ] Rich snippets appear in Google
- [ ] Page load <2s (check PageSpeed Insights)

### Medium-term (1-3 months)
- [ ] Organic traffic: +50-100%
- [ ] Average position: improves 5-10 ranks
- [ ] CTR: +1-2%
- [ ] Top 10 for some keywords

### Long-term (3-6 months)
- [ ] Organic traffic: 2x baseline
- [ ] Featured snippets
- [ ] Domain authority increase
- [ ] Consistent top 10 rankings

---

## 🎯 TIMELINE SUMMARY

| When | What to Do | Time Required |
|------|------------|---------------|
| **Day 1** | Submit sitemap + Request top 10 pages | 30 min |
| **Day 2-7** | Request 10 more pages/day | 10 min/day |
| **Week 2** | Check Coverage report progress | 15 min |
| **Week 3-4** | Monitor performance metrics | 15 min/week |
| **Month 2-3** | Continue requesting + analyze growth | 30 min/week |

---

## 📞 HELP & SUPPORT

**Pokud máte problémy:**
1. Check Vercel logs
2. Test URLs manually (curl)
3. Google Search Console → Coverage → Check errors
4. Search "Google Search Console [your error]"
5. Ask me for help! 😊

---

**Vytvořeno:** 11. listopadu 2025
**Status:** ✅ Ready to Execute
**Priorita:** 🔥 HIGH - Proveďte ASAP!

**Odhadovaný čas celého procesu:** 30-60 minut první den, pak 10-15 min/týden

---

## 🎉 GOOD LUCK!

Po 2-4 týdnech byste měli vidět **dramatické zlepšení**. Sledujte Search Console denně první týden, pak týdně. Buďte trpěliví - Google potřebuje čas na re-crawl!

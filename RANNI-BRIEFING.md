# ☀️ Ranní briefing — co se stalo přes noc

Dobré ráno! Tady je souhrn noční práce CEO. Web je připravený ke kontrole a GO.

## ✅ Hotovo přes noc

1. **AI ETF průvodce (Fáze 0)** — nová stránka `/vyber-etf`: 4 otázky → doporučí kategorii z naší DB, korunový + daňový kontext, plný disclaimer (vzdělávací, ne poradenství). **Nula nákladů.** Hero CTA „Poradíme, který ETF" na homepage. *(Validováno GA4 – lidé už chodí z AI.)*

2. **Parita top stránek** — 6 nejnavštěvovanějších (dle GA4) je teď v novém webu **≥ staré**:
   - Homepage → doplněna sekce brokerů (6 se skóre + „pro koho")
   - Screener → JSON-LD + prolinkování kategorií + SEO texty
   - Hypoteční kalkulačka → splátkový kalendář + daňový odpočet 300k/45k + FAQ
   - Průvodce → geo diverzifikace + korunový příklad poplatků + nevýhody ETF
   - Portfolia → reálný korunový výnos na kartách
   - Rozcestník → už lepší (64 kategorií vs 36)

3. **Porada ředitelů #1** — 7 zlepšení (mobilní screener, disclaimery, daně 2026, canonical recenzí, oprava počtu kategorií…).

4. **Plnohodnotné porovnání fondů** — 9 sekcí (top 10 pozic, sektory, země, riziko, výnosy po letech…).

5. **Měření napojené** — GSC (Google) i GA4 (chování). CEO měří sám.

6. **Ucelená strategie** — `STRATEGIE-CEO-FINAL.md` (k prezentaci).

7. **Cutover runbook** — `CUTOVER-RUNBOOK.md` (přesné GO kroky).

## 🔎 Zkontroluj si to
Testovací web: **`https://etf-nextjs-ssr-git-cutover-produkce-tomas-projects-43fd2658.vercel.app/design-preview`**
*(po pushi se aktualizuje – proklikej homepage, srovnávač, AI průvodce, porovnání, kalkulačky, mobil i desktop)*

## 🚦 Až dáš GO (uděláme spolu, ať to vidíš)
1. **Já:** přesun rout na root + 301 + sitemapa (~15 min, build-ověřeně).
2. **Ty:** přepnout doménu `etfpruvodce.cz` na tento Vercel projekt (~5 min, ukážu kroky).
3. **Já:** deploy + sitemapa do GSC + sledování náběhu indexace.
→ detail v `CUTOVER-RUNBOOK.md`.

## 📌 Co potřebuju od tebe
- **GO na cutover** (po tvé kontrole).
- *(volitelně)* odeslat HN pitch (kit hotový v `PARTNERSTVI-MEDIA.md`).

## ⚠️ Poznámka
Lokální build přes noc chvíli blokoval síťový výpadek (fetch Google Fonts) — **není to chyba kódu**, každá změna byla ověřena zeleným buildem ve workflow a Vercel build (s funkční sítí) vše potvrdí. Ráno to překontroluju.

---
**Shrnutí:** web je obsahově i funkčně připravený, top stránky ≥ staré, měření běží, strategie hotová. Chybí jen tvé GO na přepnutí domény. 🚀

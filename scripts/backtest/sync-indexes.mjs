#!/usr/bin/env node
/**
 * SYNC INDEXŮ → `index_historical_data`. Jediný loader, jediná pravda (src/lib/backtest/indexes.ts).
 *
 * Nahrazuje `etf-astro/scraper/fetch_index_data_yahoo.py` (odstaven 15.7.2026 po incidentu, kdy
 * smazal 419 řádků sp500 a produkce půl dne ukazovala čísla o 15 % vedle).
 *
 * ZÁSADY (každá je reakcí na konkrétní chybu toho starého):
 *  1. NIKDY DELETE. Jen upsert (on_conflict=index_code,date). Spadlý běh nesmí ubrat data —
 *     starý dělal DELETE + INSERT po dávkách a když dávkování spadlo, zůstal usek (8000 = 16×500).
 *  2. ŽÁDNÁ KONVERZE MĚN. Ukládá se nativní měna listingu; převod dělá engine dle manifestu.
 *     Starý cpal všechno do EUR → doběhlý běh by zkorumpoval 21 dolarových indexů.
 *  3. POJISTKA NA MĚNU. Když Yahoo vrátí jinou měnu, než čeká manifest, index se PŘESKOČÍ a běh
 *     skončí chybou. Starý měl GBP tickery a přepočet natvrdo ×1,15.
 *  4. JEN `managed: true`. Indexy s neověřeným původem se nesmí přepsat.
 *  5. SPLICE SE NEPŘEPISUJE. U řad s `splicedFrom` (Ken French historie 1999–2013) se zapisují
 *     jen data od toho data dál.
 *  6. PŘÍRŮSTKOVĚ. Denně jen posledních ~30 dnů (~37 × 20 řádků). Plný resync (`--full`) srovná
 *     dividendový drift adj-close — ten mění historii zpětně, takže samotný append nestačí.
 *  7. SPADNE NAHLAS (exit 1) → CI to musí zařvat, ne spolknout.
 *  8. GRANULARITA (17. 10. 2026): Yahoo pro `range=max` TIŠE vrací MĚSÍČNÍ data i při interval=1d
 *     (SPY 406 bodů místo ~8 500). Plný resync tak každou neděli zapsal měsíční svíčky mezi denní
 *     (US k 1. dni měsíce, EUR k poslednímu dni předchozího) → ~1 800 „vadných bodů“, které engine
 *     odfiltrovával. Plný resync proto stahuje přes period1/period2 (vrací denní) a každá odpověď
 *     musí mít `dataGranularity` = požadovaný interval, jinak se NIC nezapíše.
 *  9. ÚKLID (`--full --uklid`, jednorázově po opravě 8): smaže řádky, které v čerstvé úplné denní
 *     historii NEJSOU (vmíchané měsíční svíčky, víkendy). Pojistky: jen u úplné historie, max 20 %
 *     řádků indexu, nikdy v dopočtené části (splicedFrom).
 *
 * SPUŠTĚNÍ:
 *   set -a && . ./.secrets/supabase.env && set +a
 *   node scripts/backtest/sync-indexes.mjs           # přírůstkově (denně)
 *   node scripts/backtest/sync-indexes.mjs --full    # plný resync (týdně)
 *   node scripts/backtest/sync-indexes.mjs --dry-run # nic nezapíše, jen ukáže
 */

import { execSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const FULL = process.argv.includes('--full')
const DRY = process.argv.includes('--dry-run')
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1]
const UKLID = process.argv.includes('--uklid')
if (UKLID && !FULL) { console.error('❌ --uklid jen spolu s --full (potřebuje úplnou čerstvou historii).'); process.exit(1) }

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nbhwnatadyubiuadfakx.supabase.co'
const KEY = process.env.SUPABASE_KEY
if (!KEY) { console.error('❌ Chybí SUPABASE_KEY (viz .secrets/supabase.env).'); process.exit(1) }

/** Manifest je v TS → přeložíme ho projektovým tsc, ať existuje jen JEDNA pravda (žádná kopie v JS). */
async function loadManifest() {
  const out = mkdtempSync(join(tmpdir(), 'mfst-'))
  execSync(`npx tsc src/lib/backtest/indexes.ts --outDir ${out} --module esnext --target es2022 --moduleResolution bundler --skipLibCheck`, { stdio: 'pipe' })
  return import(join(out, 'indexes.js'))
}

/**
 * fetch s opakováním pro PŘECHODNÉ chyby.
 *
 * PROČ: 14. 9. 2026 shodil celý workflow jediný `upsert 504: Gateway Timeout`
 * u us_total_market. Data přitom byla v pořádku (běhy před i po prošly) a kvůli
 * jednomu výpadku na straně Supabase padl noční sync i kontrola integrity.
 * Přechodná chyba sítě není důvod hlásit poplach o ztrátě dat.
 *
 * Opakujeme jen to, co má smysl opakovat: 408/429 a 5xx plus síťové výjimky.
 * 4xx (špatný klíč, špatné schéma) se NEOPAKUJE – to je skutečná chyba a má
 * spadnout hned, ať ji nezamaskujeme.
 */
async function fetchRetry(url, init = {}, { pokusy = 4, popis = 'požadavek' } = {}) {
  let posledni
  for (let i = 1; i <= pokusy; i++) {
    try {
      const res = await fetch(url, init)
      if (res.ok) return res
      const prechodna = res.status === 408 || res.status === 429 || res.status >= 500
      if (!prechodna || i === pokusy) return res
      posledni = `HTTP ${res.status}`
    } catch (e) {
      if (i === pokusy) throw e
      posledni = e.message
    }
    const cekat = 2000 * 2 ** (i - 1) // 2 s, 4 s, 8 s
    console.error(`   ↻ ${popis}: ${posledni} – pokus ${i}/${pokusy}, zkouším znovu za ${cekat / 1000} s`)
    await new Promise((r) => setTimeout(r, cekat))
  }
  throw new Error(`${popis}: vyčerpány pokusy (${posledni})`)
}

/** Denní adj-close z Yahoo. Vrací i měnu, ať ji můžeme ověřit proti manifestu. */
async function fetchYahoo(ticker, range, interval = '1d') {
  // range=max vrací i u interval=1d měsíční data → celé období zadáváme explicitně (zásada 8).
  const obdobi = range === 'max' ? `period1=0&period2=${Math.floor(Date.now() / 1000)}` : `range=${range}`
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${interval}&${obdobi}`
  const res = await fetchRetry(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, { popis: `Yahoo ${ticker}` })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const r = (await res.json())?.chart?.result?.[0]
  if (!r) throw new Error('prázdná odpověď')
  if (r.meta?.dataGranularity && r.meta.dataGranularity !== interval) {
    throw new Error(`Yahoo vrátil granularitu ${r.meta.dataGranularity} místo ${interval} – nic nezapisuji`)
  }
  const adj = r.indicators?.adjclose?.[0]?.adjclose || r.indicators?.quote?.[0]?.close || []
  // DATUM V ČASE BURZY, ne v UTC. Měsíční svíčka má časovou značku = půlnoc 1. dne měsíce v čase
  // burzy (Amsterdam: 23:00/22:00 UTC předchozího dne), ale cenu z KONCE měsíce. Dřív se datum bralo
  // v UTC → svíčka za leden se zapsala jako „31. 12.“ a celé měsíční řady eurových dluhopisů byly
  // posunuté o měsíc (ověřeno 17. 10. 2026: DB „2022-12-31“ = 164,27 = skutečná cena IBGL k 31. 1. 2023;
  // skutečnost k 30. 12. 2022 = 156,27). Měsíční svíčku proto zapisujeme k POSLEDNÍMU dni jejího měsíce
  // (u rozběhlého měsíce ke dni poslední ceny).
  const posun = (r.meta?.gmtoffset ?? 0) * 1000
  const denBurzy = (t) => new Date(t * 1000 + posun).toISOString().slice(0, 10)
  const posledniCena = r.meta?.regularMarketTime ? denBurzy(r.meta.regularMarketTime) : null
  const konecMesice = (d) => { const [y, m] = d.split('-').map(Number); return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10) }
  const rows = (r.timestamp || [])
    .map((t, i) => {
      let date = denBurzy(t)
      if (interval === '1mo') {
        date = konecMesice(date)
        if (posledniCena && date > posledniCena) date = posledniCena
      }
      return { date, price: adj[i] }
    })
    .filter((x) => Number.isFinite(x.price) && x.price > 0)
  // ROZPRACOVANÝ DEN NEZAPISOVAT (20. 10. 2026). GitHub plánovaný běh (06:30 UTC) se zdržuje o hodiny – 19. 10.
  // běžel 13:47 UTC, po otevření US burzy, a uložil pro 19. 10. průběžnou cenu jako „close“. Další běh ji sice
  // přepsal (upsert), ale předpočty stránek (portfolia, kvíz) mezitím vznikly z rozpracovaného dne a nesouhlasily
  // s backtestem (kontrola kolo5 A). Denní svíčku dnešní seance proto zahodíme, dokud seance neskončila.
  const seance = r.meta?.currentTradingPeriod?.regular
  if (interval === '1d' && seance?.start && seance?.end && Date.now() < seance.end * 1000) {
    const dnesniSeance = denBurzy(seance.start)
    if (rows.length && rows[rows.length - 1].date >= dnesniSeance) rows.pop()
  }
  return { currency: r.meta?.currency, rows }
}

/** Upsert po dávkách. Bez DELETE → i spadlá dávka nechá data konzistentní, jen o kus starší. */
async function upsert(rows) {
  if (DRY || !rows.length) return rows.length
  for (let i = 0; i < rows.length; i += 500) {
    const res = await fetchRetry(
      `${SUPABASE_URL}/rest/v1/index_historical_data?on_conflict=index_code,date`,
      {
        method: 'POST',
        headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(rows.slice(i, i + 500)),
      },
      { popis: `upsert dávky ${i / 500 + 1}` },
    )
    if (!res.ok) throw new Error(`upsert ${res.status}: ${(await res.text()).slice(0, 160)}`)
  }
  return rows.length
}

/** Zásada 9: smaže řádky indexu, které v čerstvé úplné historii nejsou. */
async function uklid(idx, payload) {
  const cerstve = new Set(payload.map((r) => r.date))
  const od = payload[0]?.date
  if (!od || payload.length < 100) throw new Error('úklid: čerstvá historie je podezřele krátká')
  const ulozene = []
  for (let i = 0; ; i += 1000) {
    const res = await fetchRetry(`${SUPABASE_URL}/rest/v1/index_historical_data?select=date&index_code=eq.${idx.code}&date=gte.${od}&order=date`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Range: `${i}-${i + 999}` } }, { popis: `úklid čtení ${idx.code}` })
    if (!res.ok) throw new Error(`úklid čtení ${res.status}`)
    const dav = await res.json(); ulozene.push(...dav.map((x) => x.date)); if (dav.length < 1000) break
  }
  const smazat = ulozene.filter((d) => !cerstve.has(d) && (!idx.splicedFrom || d >= idx.splicedFrom))
  // Po upsertu jsou v DB všechny čerstvé řádky → základ = sjednocení (v --dry-run se nezapisuje, proto max).
  const zaklad = Math.max(ulozene.length, new Set([...ulozene, ...cerstve]).size)
  if (smazat.length > 0.2 * zaklad) throw new Error(`úklid: ${smazat.length} z ${zaklad} řádků je moc – nemažu`)
  if (DRY) { console.log(`   úklid ${idx.code}: smazal bych ${smazat.length} (např. ${smazat.slice(0, 3).join(', ')})`); return }
  for (let i = 0; i < smazat.length; i += 100) {
    const res = await fetchRetry(`${SUPABASE_URL}/rest/v1/index_historical_data?index_code=eq.${idx.code}&date=in.(${smazat.slice(i, i + 100).join(',')})`,
      { method: 'DELETE', headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'return=minimal' } }, { popis: `úklid mazání ${idx.code}` })
    if (!res.ok) throw new Error(`úklid mazání ${res.status}: ${(await res.text()).slice(0, 120)}`)
  }
  console.log(`   úklid ${idx.code}: smazáno ${smazat.length} řádků mimo denní historii`)
}

const main = async () => {
  const { MANAGED_INDEXES, INDEXES } = await loadManifest()
  let targets = MANAGED_INDEXES
  if (ONLY) targets = targets.filter((i) => i.code === ONLY)

  const skipped = INDEXES.filter((i) => !i.managed).map((i) => i.code)
  console.log(`SYNC INDEXŮ — režim: ${FULL ? 'PLNÝ RESYNC' : 'přírůstkově (30 dnů)'}${DRY ? ' [DRY-RUN]' : ''}`)
  console.log(`indexů ke zpracování: ${targets.length}${skipped.length ? ` | přeskočeno (neověřený původ): ${skipped.join(', ')}` : ''}\n`)
  console.log(`${'index_code'.padEnd(30)} ${'ticker'.padEnd(8)} ${'řádků'.padStart(6)}  stav`)
  console.log('-'.repeat(74))

  const problems = []
  for (const idx of targets) {
    try {
      // Měsíční indexy (Yahoo nemá čistou denní historii) fetchujeme vždy interval=1mo, range=max —
      // je to jen ~223 řádků (levné) a drží se tak správně adjclose drift po výplatách kupónů.
      const range = idx.monthly ? 'max' : (FULL ? 'max' : '1mo')
      const interval = idx.monthly ? '1mo' : '1d'
      const { currency, rows } = await fetchYahoo(idx.ticker, range, interval)

      // POJISTKA: měna musí sedět na manifest, jinak bychom zapsali nesmysl (past starého scraperu).
      if (currency && currency !== idx.currency) {
        throw new Error(`měna nesedí: Yahoo=${currency}, manifest=${idx.currency}`)
      }
      if (!rows.length) throw new Error('žádná data')

      // SPLICE: dopočtenou historii (Ken French) nikdy nepřepisovat.
      const usable = idx.splicedFrom ? rows.filter((r) => r.date >= idx.splicedFrom) : rows
      const payload = usable.map((r) => ({ index_code: idx.code, date: r.date, close_price: Number(r.price.toFixed(6)) }))

      const n = await upsert(payload)
      if (UKLID) await uklid(idx, payload)
      const last = payload.at(-1)?.date ?? '-'
      console.log(`${idx.code.padEnd(30)} ${idx.ticker.padEnd(8)} ${String(n).padStart(6)}  OK (do ${last})`)
    } catch (e) {
      problems.push(`${idx.code} (${idx.ticker}): ${e.message}`)
      console.log(`${idx.code.padEnd(30)} ${idx.ticker.padEnd(8)} ${'-'.padStart(6)}  !! ${e.message}`)
    }
    await new Promise((r) => setTimeout(r, 250)) // slušnost k Yahoo
  }

  console.log('-'.repeat(74))
  if (problems.length) {
    console.error(`\n❌ ${problems.length} problémů:`)
    problems.forEach((p) => console.error('   -', p))
    console.error('\nData zůstala netknutá (upsert bez delete) – jen se nedoplnila.')
    process.exit(1)
  }
  console.log(`\n✅ Hotovo – ${targets.length} indexů aktuálních.`)
}

main().catch((e) => { console.error('❌ Fatální:', e.message); process.exit(1) })

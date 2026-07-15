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

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nbhwnatadyubiuadfakx.supabase.co'
const KEY = process.env.SUPABASE_KEY
if (!KEY) { console.error('❌ Chybí SUPABASE_KEY (viz .secrets/supabase.env).'); process.exit(1) }

/** Manifest je v TS → přeložíme ho projektovým tsc, ať existuje jen JEDNA pravda (žádná kopie v JS). */
async function loadManifest() {
  const out = mkdtempSync(join(tmpdir(), 'mfst-'))
  execSync(`npx tsc src/lib/backtest/indexes.ts --outDir ${out} --module esnext --target es2022 --moduleResolution bundler --skipLibCheck`, { stdio: 'pipe' })
  return import(join(out, 'indexes.js'))
}

/** Denní adj-close z Yahoo. Vrací i měnu, ať ji můžeme ověřit proti manifestu. */
async function fetchYahoo(ticker, range) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=${range}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const r = (await res.json())?.chart?.result?.[0]
  if (!r) throw new Error('prázdná odpověď')
  const adj = r.indicators?.adjclose?.[0]?.adjclose || r.indicators?.quote?.[0]?.close || []
  const rows = (r.timestamp || [])
    .map((t, i) => ({ date: new Date(t * 1000).toISOString().slice(0, 10), price: adj[i] }))
    .filter((x) => Number.isFinite(x.price) && x.price > 0)
  return { currency: r.meta?.currency, rows }
}

/** Upsert po dávkách. Bez DELETE → i spadlá dávka nechá data konzistentní, jen o kus starší. */
async function upsert(rows) {
  if (DRY || !rows.length) return rows.length
  for (let i = 0; i < rows.length; i += 500) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/index_historical_data?on_conflict=index_code,date`, {
      method: 'POST',
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(rows.slice(i, i + 500)),
    })
    if (!res.ok) throw new Error(`upsert ${res.status}: ${(await res.text()).slice(0, 160)}`)
  }
  return rows.length
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
      const { currency, rows } = await fetchYahoo(idx.ticker, FULL ? 'max' : '1mo')

      // POJISTKA: měna musí sedět na manifest, jinak bychom zapsali nesmysl (past starého scraperu).
      if (currency && currency !== idx.currency) {
        throw new Error(`měna nesedí: Yahoo=${currency}, manifest=${idx.currency}`)
      }
      if (!rows.length) throw new Error('žádná data')

      // SPLICE: dopočtenou historii (Ken French) nikdy nepřepisovat.
      const usable = idx.splicedFrom ? rows.filter((r) => r.date >= idx.splicedFrom) : rows
      const payload = usable.map((r) => ({ index_code: idx.code, date: r.date, close_price: Number(r.price.toFixed(6)) }))

      const n = await upsert(payload)
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

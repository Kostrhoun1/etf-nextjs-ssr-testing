import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prirazeniFondu } from '@/lib/backtest/fondNaIndex'
import { INDEX_BY_CODE } from '@/lib/backtest/indexes'

/* Konkrétní fondy pro backtest (17. 10. 2026):
   GET ?q=VWCE        → hledání podle tickeru / názvu / ISIN (max 8 výsledků)
   GET ?isin=A,B      → dohledání fondů ze sdíleného odkazu (?fondy=ISIN:váha,…)
   Každý výsledek říká, jestli ho umíme spočítat (přiřazení k historii indexu, fondNaIndex.ts),
   a pokud ne, proč. Poplatek (TER) bereme z DB – výpočet se na něj přepočítá. */

const ISIN = /^[A-Z]{2}[A-Z0-9]{10}$/
// Tickery z ostatních burz: lidé hledají „IWDA“, v DB je hlavní ticker „EUNL“.
const BURZY = Array.from({ length: 10 }, (_, i) => `exchange_${i + 1}_ticker`)
const SLOUPCE = ['isin', 'primary_ticker', 'name', 'index_name', 'is_leveraged', 'currency_risk', 'ter_numeric', ...BURZY].join(',')

type Radek = { isin: string; primary_ticker: string | null; name: string | null; index_name: string | null; is_leveraged: boolean | null; currency_risk: string | null; ter_numeric: number | string | null } & Record<string, unknown>

function vystup(f: Radek, hledanyTicker?: string) {
  const p = prirazeniFondu(f)
  const ter = f.ter_numeric == null || f.ter_numeric === '' ? null : Number(f.ter_numeric) / 100
  // Když uživatel hledal ticker z jiné burzy (IWDA), ukážeme ho – podle něj fond zná.
  const naBurze = hledanyTicker && BURZY.some((k) => String(f[k] ?? '').toUpperCase() === hledanyTicker) ? hledanyTicker : null
  const ticker = naBurze ?? (f.primary_ticker && f.primary_ticker !== '-' ? f.primary_ticker : null)
  const base = { isin: f.isin, ticker, name: f.name }
  if (!p) return { ...base, ok: false as const, duvod: 'Pro tento fond nemáme historii indexu (např. MSCI World, sektory, měnově zajištěné třídy).' }
  if (ter === null || !Number.isFinite(ter) || ter < 0 || ter > 0.03) return { ...base, ok: false as const, duvod: 'Neznáme poplatek fondu.' }
  if (INDEX_BY_CODE[p.indexCode]?.sourceTer === undefined) return { ...base, ok: false as const, duvod: 'Pro tento index zatím neumíme přepočet poplatku.' }
  // Přesně zdrojový fond (data jsou on sám) → poplatek se nepřepočítává.
  const prepocet = f.isin !== INDEX_BY_CODE[p.indexCode].sourceIsin
  return { ...base, ok: true as const, ter, indexCode: p.indexCode, indexName: INDEX_BY_CODE[p.indexCode].name, shoda: p.shoda, zdroj: p.zdroj, prepocet }
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') ?? '').trim().slice(0, 40)
  const isiny = (request.nextUrl.searchParams.get('isin') ?? '').split(',').map((x) => x.trim().toUpperCase()).filter((x) => ISIN.test(x)).slice(0, 15)

  try {
    if (isiny.length) {
      const { data, error } = await supabase.from('etf_funds').select(SLOUPCE).in('isin', isiny)
      if (error) throw error
      return NextResponse.json({ fondy: (data as unknown as Radek[]).map((f) => vystup(f)) }, { headers: { 'Cache-Control': 'public, s-maxage=3600' } })
    }
    if (q.length < 2) return NextResponse.json({ fondy: [] })
    const bezpecne = q.replace(/[%,().*]/g, ' ').trim()
    const jeTicker = /^[A-Za-z0-9]{2,8}$/.test(bezpecne)
    const filtr = [`primary_ticker.ilike.${bezpecne}%`, `isin.ilike.${bezpecne}%`, `name.ilike.%${bezpecne}%`,
      ...(jeTicker ? BURZY.map((k) => `${k}.ilike.${bezpecne}`) : [])].join(',')
    const { data, error } = await supabase.from('etf_funds').select(SLOUPCE)
      .not('name', 'is', null)
      .or(filtr)
      .order('fund_size_numeric', { ascending: false, nullsFirst: false })
      .limit(40)
    if (error) throw error
    const hledany = jeTicker ? bezpecne.toUpperCase() : undefined
    const vse = (data as unknown as Radek[]).map((f) => vystup(f, hledany))
    // Spočítatelné napřed, pak pár nespočítatelných (ať uživatel ví, proč tam jeho fond není).
    const fondy = [...vse.filter((f) => f.ok).slice(0, 8), ...vse.filter((f) => !f.ok).slice(0, 3)]
    return NextResponse.json({ fondy }, { headers: { 'Cache-Control': 'public, s-maxage=3600' } })
  } catch (e) {
    console.error('[backtest/fondy]', e)
    return NextResponse.json({ error: 'Hledání fondů se nepodařilo.' }, { status: 500 })
  }
}

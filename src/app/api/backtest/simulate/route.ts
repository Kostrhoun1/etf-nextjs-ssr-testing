import { NextRequest, NextResponse } from 'next/server'
import { simulateAndSerialize, type SimulateRequestBody } from '@/lib/backtest/simulate'
import { INDEX_BY_CODE } from '@/lib/backtest/indexes'

/* Limity: endpoint je veřejný a bez přihlášení. Bez nich šel jedním požadavkem zatížit CPU
   (libovolně dlouhé portfolio, forecastYears=1000 drží v paměti 12 mil. čísel) – na free tieru
   Vercelu přímá cesta k vyčerpání Fluid CPU. Zjištěno 17. 10. 2026. */
const MAX_SLOZEK = 15
const MAX_LET_PROGNOZY = 50

/** Chyby enginu (anglicky) → česky a s radou, co změnit. Ostatní obecně – nevracet interní detaily. */
function srozumitelne(e: unknown): string {
  const m = e instanceof Error ? e.message : ''
  if (/No overlapping data|No valid ETF data/i.test(m))
    return 'Pro zvolené období nemají všechny složky data. Zkuste pozdější počáteční datum – každý index začíná jinak.'
  return 'Výpočet se nepodařil. Zkuste prosím jiné období nebo složení.'
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulateRequestBody = await request.json()

    // Validate required fields
    if (!Array.isArray(body.portfolio) || body.portfolio.length === 0 || body.portfolio.length > MAX_SLOZEK) {
      return NextResponse.json(
        { error: `Portfolio musí mít 1 až ${MAX_SLOZEK} složek.` },
        { status: 400 }
      )
    }
    // Jen indexy z manifestu – ať nejde z venku poslat libovolný kód do dotazů nad databází.
    // Poplatek konkrétního fondu: jen rozumné číslo (0–3 % ročně), a jen u indexu se známým poplatkem
    // zdroje (sourceTer) – jinak by se poplatek odečetl dvakrát (pravidlo č. 1).
    const spatnyPoplatek = body.portfolio.find((item) => item.feeOverride !== undefined && (
      typeof item.feeOverride !== 'number' || !Number.isFinite(item.feeOverride) || item.feeOverride < 0 || item.feeOverride > 0.03 ||
      INDEX_BY_CODE[item.indexCode]?.sourceTer === undefined))
    if (spatnyPoplatek) {
      return NextResponse.json({ error: 'Neplatný poplatek fondu' }, { status: 400 })
    }
    const neznamy = body.portfolio.find((item) => !INDEX_BY_CODE[item.indexCode])
    if (neznamy) {
      return NextResponse.json({ error: `Neznámá třída aktiv: ${String(neznamy.indexCode).slice(0, 40)}` }, { status: 400 })
    }
    if (body.forecastYears != null) {
      body.forecastYears = Math.min(Math.max(Math.round(Number(body.forecastYears) || 10), 1), MAX_LET_PROGNOZY)
    }

    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Chybí počáteční nebo koncové datum.' },
        { status: 400 }
      )
    }

    // Váhy: jen konečná nezáporná čísla. Složky s vahou 0 engine vynechá (výsledek = portfolio bez nich);
    // dřív 0 % shodilo výsledek na null a UI ukázalo „0 Kč, ztráta −100 %“ (revize 19. 10. 2026).
    if (body.portfolio.some((item) => typeof item.weight !== 'number' || !Number.isFinite(item.weight) || item.weight < 0)) {
      return NextResponse.json({ error: 'Váha složky musí být číslo od 0 do 100 %.' }, { status: 400 })
    }
    if (!body.portfolio.some((item) => item.weight > 0)) {
      return NextResponse.json({ error: 'Alespoň jedna složka musí mít nenulovou váhu.' }, { status: 400 })
    }

    // Validate weights sum to 1
    const totalWeight = body.portfolio.reduce((sum, item) => sum + item.weight, 0)
    if (Math.abs(totalWeight - 1) > 0.01) {
      return NextResponse.json(
        { error: `Váhy složek musí dát dohromady 100 % (teď ${Math.round(totalWeight * 100)} %).` },
        { status: 400 }
      )
    }

    const serializedResult = await simulateAndSerialize(body)
    return NextResponse.json(serializedResult)
  } catch (error) {
    console.error('Backtest error:', error)
    return NextResponse.json(
      { error: srozumitelne(error) },
      { status: 500 }
    )
  }
}

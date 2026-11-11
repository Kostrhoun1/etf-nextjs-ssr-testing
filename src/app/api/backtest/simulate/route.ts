import { NextRequest, NextResponse } from 'next/server'
import { simulateAndSerialize, pripravPozadavek, type SimulateRequestBody } from '@/lib/backtest/simulate'

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

    // Validace a normalizace vah jsou ve sdíleném jádru (pripravPozadavek) – stejnou cestou jde i serverový
    // předpočet stránky /backtest, takže předpočtená čísla jsou totožná s odpovědí API (úkol 3.1, 11. 11. 2026).
    const pripraveno = pripravPozadavek(body)
    if (!pripraveno.ok) {
      return NextResponse.json({ error: pripraveno.error }, { status: 400 })
    }

    const serializedResult = await simulateAndSerialize(pripraveno.body)
    return NextResponse.json(serializedResult)
  } catch (error) {
    console.error('Backtest error:', error)
    return NextResponse.json(
      { error: srozumitelne(error) },
      { status: 500 }
    )
  }
}

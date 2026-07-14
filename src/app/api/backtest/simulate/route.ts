import { NextRequest, NextResponse } from 'next/server'
import { simulateAndSerialize, type SimulateRequestBody } from '@/lib/backtest/simulate'

export async function POST(request: NextRequest) {
  try {
    const body: SimulateRequestBody = await request.json()

    // Validate required fields
    if (!body.portfolio || body.portfolio.length === 0) {
      return NextResponse.json(
        { error: 'Portfolio is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      )
    }

    // Validate weights sum to 1
    const totalWeight = body.portfolio.reduce((sum, item) => sum + item.weight, 0)
    if (Math.abs(totalWeight - 1) > 0.01) {
      return NextResponse.json(
        { error: `Portfolio weights must sum to 1 (got ${totalWeight})` },
        { status: 400 }
      )
    }

    const serializedResult = await simulateAndSerialize(body)
    return NextResponse.json(serializedResult)
  } catch (error) {
    console.error('Backtest error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { getAvailableIndexes } from '@/lib/backtest/engine'

export async function GET() {
  try {
    const indexes = await getAvailableIndexes()

    return NextResponse.json({
      indexes,
      count: indexes.length,
    })
  } catch (error) {
    console.error('Error fetching indexes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available indexes' },
      { status: 500 }
    )
  }
}

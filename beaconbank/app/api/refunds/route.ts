import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, amount, reason, type = 'full' } = body

    if (!transactionId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid refund details' },
        { status: 400 }
      )
    }

    // TODO: Process refund through payment processor
    const refundId = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    return NextResponse.json(
      {
        success: true,
        refundId,
        transactionId,
        amount,
        reason,
        type,
        status: 'processing',
        createdAt: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 3600000).toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Refund failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch user's refunds from database
    const mockRefunds = [
      {
        id: 'REF-001',
        transactionId: 'TXN-123',
        amount: 50.00,
        reason: 'Product defect',
        status: 'completed',
        date: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: 'REF-002',
        transactionId: 'TXN-124',
        amount: 150.00,
        reason: 'Duplicate charge',
        status: 'processing',
        date: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    return NextResponse.json({ refunds: mockRefunds }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch refunds' },
      { status: 500 }
    )
  }
}

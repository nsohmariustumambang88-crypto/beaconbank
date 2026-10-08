import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipientEmail, amount, memo } = body

    if (!recipientEmail || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid transfer details' },
        { status: 400 }
      )
    }

    // TODO: Process transfer through payment processor
    const transferId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    return NextResponse.json(
      {
        success: true,
        transferId,
        recipient: recipientEmail,
        amount,
        memo,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Transfer failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch user's transfer history from database
    const mockTransfers = [
      {
        id: 'TXN-001',
        recipient: 'john@example.com',
        amount: 250,
        status: 'completed',
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'TXN-002',
        recipient: 'jane@example.com',
        amount: 1500,
        status: 'completed',
        date: new Date(Date.now() - 172800000).toISOString(),
      },
    ]

    return NextResponse.json({ transfers: mockTransfers }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    )
  }
}

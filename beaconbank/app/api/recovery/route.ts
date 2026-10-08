import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, amount, fraudType, description } = body

    if (!transactionId || !amount || !fraudType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Create recovery case in database, assign to specialist
    const caseId = `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    return NextResponse.json(
      {
        success: true,
        caseId,
        transactionId,
        amount,
        fraudType,
        status: 'investigation',
        assignedSpecialist: 'John Smith',
        createdAt: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create recovery case' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const caseId = request.nextUrl.searchParams.get('caseId')

    // TODO: Fetch recovery case details from database
    const mockCase = {
      caseId: caseId || 'REC-001',
      transactionId: 'TXN-123',
      amount: 5000,
      fraudType: 'Unauthorized transaction',
      status: 'investigation',
      progress: 65,
      assignedSpecialist: 'John Smith',
      updates: [
        { date: new Date(Date.now() - 86400000).toISOString(), message: 'Case opened and assigned' },
        { date: new Date(Date.now() - 43200000).toISOString(), message: 'Initial investigation completed' },
        { date: new Date().toISOString(), message: 'Contacting merchant for information' },
      ],
      estimatedResolution: new Date(Date.now() + 604800000).toISOString(),
    }

    return NextResponse.json({ case: mockCase }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recovery case' },
      { status: 500 }
    )
  }
}

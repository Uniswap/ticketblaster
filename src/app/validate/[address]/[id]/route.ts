import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params: { address, id } }: { params: { address: string; id: string } },
) {
  const signature = request.json()
  console.log(signature, address, id)
  return NextResponse.json({}, { status: 200 })
  /**
   * return NextResponse.json({ reason: 'Invalid signature' }, { status: 403 })
   * return NextResponse.json({ reason: 'Not found' }, { status: 404 })
   * return NextResponse.json({ reason: 'Already checked in' }, { status: 409 })
   */
}

import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function DELETE() {
  await kv.flushdb()
  return NextResponse.json({}, { status: 200 })
}

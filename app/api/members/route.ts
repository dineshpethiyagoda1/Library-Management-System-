// app/api/members/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Fetch all members with their membership details
export async function GET() {
  try {
    const members = await db.user.findMany({
      where: { role: 'MEMBER' },
      include: { membership: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: members })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
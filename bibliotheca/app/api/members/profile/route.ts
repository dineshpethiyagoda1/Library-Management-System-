// app/api/members/profile/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const body   = await req.json()
  const { firstName, lastName, phone, address } = body

  const user = await db.user.update({
    where: { id: userId },
    data: { firstName, lastName, phone: phone || null, address: address || null },
  })

  return NextResponse.json({ success: true, data: { id: user.id } })
}


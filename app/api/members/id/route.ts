// app/api/members/[id]/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH: Update a specific member's information or membership status
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const memberId = params.id
    const body = await req.json()
    const { firstName, lastName, phone, address, status, type } = body

    // Update User core info
    const updatedUser = await db.user.update({
      where: { id: memberId },
      data: {
        firstName,
        lastName,
        phone,
        address,
        membership: {
          update: {
            status,
            type,
          },
        },
      },
      include: { membership: true },
    })

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
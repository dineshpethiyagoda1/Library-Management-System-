// app/api/books/[id]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const book = await db.book.findUnique({ where: { id: params.id } })
  if (!book) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: book })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const role    = (session?.user as any)?.role
  if (!['ADMIN','STAFF'].includes(role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  try {
    const body = await req.json()
    const { title, author, isbn, category, publisher, publishYear, totalCopies } = body

    const book = await db.book.update({
      where: { id: params.id },
      data: {
        ...(title       !== undefined && { title }),
        ...(author      !== undefined && { author }),
        ...(isbn        !== undefined && { isbn }),
        ...(category    !== undefined && { category }),
        ...(publisher   !== undefined && { publisher }),
        ...(publishYear !== undefined && { publishYear }),
        ...(totalCopies !== undefined && { totalCopies }),
      },
    })

    return NextResponse.json({ success: true, data: book })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const role    = (session?.user as any)?.role
  if (role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  try {
    await db.book.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

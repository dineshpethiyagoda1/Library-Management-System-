// app/api/books/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q        = searchParams.get('q')
  const category = searchParams.get('category')

  const where: any = {}
  if (q) where.OR = [{ title: { contains: q } }, { author: { contains: q } }, { isbn: { contains: q } }]
  if (category && category !== 'All Books') where.category = category

  const books = await db.book.findMany({ where, orderBy: { title: 'asc' } })
  return NextResponse.json({ success: true, data: books })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const role    = (session?.user as any)?.role
  if (!['ADMIN','STAFF'].includes(role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  try {
    const body = await req.json()
    const { title, author, isbn, category, publisher, publishYear, totalCopies, description } = body

    if (!title || !author || !isbn) return NextResponse.json({ success: false, error: 'Title, author, and ISBN are required.' }, { status: 400 })

    const existing = await db.book.findUnique({ where: { isbn } })
    if (existing) return NextResponse.json({ success: false, error: 'A book with this ISBN already exists.' }, { status: 409 })

    const book = await db.book.create({
      data: { title, author, isbn, category: category || 'General', publisher: publisher || null, publishYear: publishYear || null, totalCopies: totalCopies || 1, availableCopies: totalCopies || 1, description: description || null, coverEmoji: '📕', status: 'AVAILABLE' },
    })

    return NextResponse.json({ success: true, data: book })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

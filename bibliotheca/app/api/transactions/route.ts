// app/api/transactions/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getDefaultDueDate } from '@/lib/utils'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const role   = (session.user as any)?.role
  const userId = (session.user as any)?.id

  const where = ['ADMIN','STAFF'].includes(role)
    ? {}
    : { userId }

  const transactions = await db.transaction.findMany({
    where,
    include: { book: true, user: { select: { firstName: true, lastName: true, membershipId: true } }, fine: true },
    orderBy: { issueDate: 'desc' },
  })

  return NextResponse.json({ success: true, data: transactions })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const role    = (session?.user as any)?.role
  if (!['ADMIN','STAFF'].includes(role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  try {
    const { membershipId, isbn, bookId, userId: directUserId } = await req.json()

    // Look up member by membershipId or direct userId
    let member = directUserId
      ? await db.user.findUnique({ where: { id: directUserId } })
      : await db.user.findUnique({ where: { membershipId } })

    if (!member) return NextResponse.json({ success: false, error: 'Member not found.' }, { status: 404 })
    if (member.status === 'SUSPENDED') return NextResponse.json({ success: false, error: 'Member account is suspended.' }, { status: 400 })

    // Look up book
    const book = bookId
      ? await db.book.findUnique({ where: { id: bookId } })
      : await db.book.findUnique({ where: { isbn } })

    if (!book) return NextResponse.json({ success: false, error: 'Book not found.' }, { status: 404 })
    if (book.availableCopies === 0) return NextResponse.json({ success: false, error: 'No available copies.' }, { status: 400 })

    // Check member borrow limit (5 at a time)
    const activeBorrows = await db.transaction.count({ where: { userId: member.id, status: 'ACTIVE' } })
    if (activeBorrows >= 5) return NextResponse.json({ success: false, error: 'Member has reached the 5-book borrow limit.' }, { status: 400 })

    // Create transaction and decrement available copies atomically
    const [transaction] = await db.$transaction([
      db.transaction.create({
        data: {
          userId: member.id, bookId: book.id,
          dueDate: getDefaultDueDate(),
          status: 'ACTIVE',
          issuedBy: (session?.user as any)?.id,
        },
      }),
      db.book.update({
        where: { id: book.id },
        data: { availableCopies: { decrement: 1 }, status: book.availableCopies === 1 ? 'BORROWED' : 'AVAILABLE' },
      }),
    ])

    return NextResponse.json({ success: true, data: transaction })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

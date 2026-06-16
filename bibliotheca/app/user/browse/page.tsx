// app/user/browse/page.tsx
// Book catalog — search, filter by category, request books

import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import BrowseBooksClient from '@/components/user/BrowseBooksClient'

const CATEGORIES = ['All Books', 'Science Fiction', 'Non-fiction', 'Literary Fiction', 'History', 'Psychology', 'Philosophy', 'Technology', 'Fiction', 'Science']

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; author?: string }
}) {
  const session = await getServerSession(authOptions)
  const userId  = (session?.user as any)?.id as string

  const where: any = {}
  if (searchParams.q) {
    where.OR = [
      { title:  { contains: searchParams.q } },
      { isbn:   { contains: searchParams.q } },
      { author: { contains: searchParams.q } },
    ]
  }
  if (searchParams.author) {
    where.author = { contains: searchParams.author }
  }
  if (searchParams.category && searchParams.category !== 'All Books') {
    where.category = searchParams.category
  }

  const books = await db.book.findMany({ where, orderBy: { title: 'asc' } })

  // Which books does this user currently have borrowed?
  const activeTx = await db.transaction.findMany({
    where: { userId, status: 'ACTIVE' },
    select: { bookId: true },
  })
  const borrowedBookIds = new Set(activeTx.map(t => t.bookId))

  return (
    <BrowseBooksClient
      books={books}
      borrowedBookIds={[...borrowedBookIds]}
      categories={CATEGORIES}
      userId={userId}
    />
  )
}


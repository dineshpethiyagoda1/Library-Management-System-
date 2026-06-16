// app/user/return-books/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import ReturnBooksClient from '@/components/user/ReturnBooksClient'

export default async function ReturnBooksPage() {
  const session = await getServerSession(authOptions)
  const userId  = (session?.user as any)?.id as string

  const borrowed = await db.transaction.findMany({
    where: { userId, status: 'ACTIVE' },
    include: { book: true },
    orderBy: { dueDate: 'asc' },
  })

  return <ReturnBooksClient borrowed={borrowed.map(t => ({
    id: t.id, bookId: t.bookId, dueDate: t.dueDate.toISOString(),
    issueDate: t.issueDate.toISOString(),
    book: { title: t.book.title, author: t.book.author },
  }))} />
}


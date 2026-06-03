// app/admin/issue-return/page.tsx
import { db } from '@/lib/db'
import IssueReturnClient from '@/components/admin/IssueReturnClient'
import { calculateFine } from '@/lib/utils'

export default async function IssueReturnPage() {
  const transactions = await db.transaction.findMany({
    where: { status: { in: ['ACTIVE','OVERDUE'] } },
    include: { user: true, book: true, fine: true },
    orderBy: { issueDate: 'desc' },
  })

  const stats = {
    issued:       transactions.filter(t => t.status === 'ACTIVE').length,
    overdue:      transactions.filter(t => t.status === 'OVERDUE').length,
    returnedToday: await db.transaction.count({ where: { status: 'RETURNED', returnDate: { gte: new Date(new Date().setHours(0,0,0,0)) } } }),
    totalFines:   transactions.reduce((s, t) => s + (t.fine?.amount ?? calculateFine(t.dueDate)), 0),
  }

  return <IssueReturnClient
    transactions={transactions.map(t => ({
      id: t.id, status: t.status,
      issueDate: t.issueDate.toISOString(), dueDate: t.dueDate.toISOString(),
      fine: t.fine ? t.fine.amount : null,
      user: { firstName: t.user.firstName, lastName: t.user.lastName, membershipId: t.user.membershipId },
      book: { title: t.book.title, isbn: t.book.isbn },
    }))}
    stats={stats}
  />
}

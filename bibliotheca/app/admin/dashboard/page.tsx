// app/admin/dashboard/page.tsx
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import AdminCharts from '@/components/admin/AdminCharts'

export default async function AdminDashboard() {
  const [totalBooks, activeMembers, booksIssued, overdueBooks, recentTx, overdueTx] = await Promise.all([
    db.book.aggregate({ _sum: { totalCopies: true } }),
    db.user.count({ where: { role: 'MEMBER', status: 'ACTIVE' } }),
    db.transaction.count({ where: { status: 'ACTIVE' } }),
    db.transaction.count({ where: { status: 'OVERDUE' } }),
    db.transaction.findMany({ include: { user: true, book: true }, orderBy: { issueDate: 'desc' }, take: 5 }),
    db.transaction.findMany({ where: { status: 'OVERDUE' }, include: { book: true }, orderBy: { dueDate: 'asc' }, take: 5 }),
  ])

  const stats = [
    { label: 'Total Books',    value: (totalBooks._sum.totalCopies ?? 0).toLocaleString(), sub: '+45 this month',   accent: 'border-blue-500' },
    { label: 'Active Members', value: activeMembers.toLocaleString(),                      sub: '+28 new this week', accent: 'border-teal-500' },
    { label: 'Books Issued',   value: booksIssued.toLocaleString(),                        sub: 'Currently borrowed', accent: 'border-green-500' },
    { label: 'Overdue Books',  value: overdueBooks.toLocaleString(),                       sub: 'Requires attention', accent: 'border-red-500' },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, Admin! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`card border-t-2 ${s.accent}`}>
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-green-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AdminCharts />

      {/* Bottom split */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent activities */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentTx.map(tx => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0
                  ${tx.status === 'RETURNED' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {tx.status === 'RETURNED' ? '↩' : '📘'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">
                    {tx.user.firstName} {tx.user.lastName} {tx.status === 'RETURNED' ? 'returned' : 'issued'} &quot;{tx.book.title}&quot;
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(tx.issueDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue books */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Overdue Books</h2>
          <div className="space-y-2">
            {overdueTx.length === 0 && <p className="text-sm text-gray-400">No overdue books 🎉</p>}
            {overdueTx.map(tx => {
              const days = Math.ceil((Date.now() - tx.dueDate.getTime()) / 86400000)
              return (
                <div key={tx.id} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <p className="text-sm font-semibold text-gray-800">{tx.book.title}</p>
                  <p className="text-xs text-amber-700">Due: {formatDate(tx.dueDate)} | Status: {days} day{days !== 1 ? 's' : ''} overdue</p>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
            <p>Available Books: {(totalBooks._sum.totalCopies ?? 0) - booksIssued} | Issued Today: {booksIssued} | New Members: 28</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// app/user/dashboard/page.tsx
// Member dashboard — overview of borrows, requests, fines, reading stats

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function UserDashboard() {
  const session = await getServerSession(authOptions)
  const userId  = (session?.user as any)?.id as string

  // Parallel data fetching for performance
  const [user, transactions, requests] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.transaction.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { issueDate: 'desc' },
      take: 20,
    }),
    db.bookRequest.findMany({
      where: { userId, status: 'PENDING' },
    }),
  ])

  const active    = transactions.filter(t => t.status === 'ACTIVE')
  const totalRead = transactions.filter(t => t.status === 'RETURNED').length
  const fineTotal = await db.fine.aggregate({
    where: { userId, paid: false },
    _sum: { amount: true },
  })

  // Reading by category
  const catMap: Record<string, number> = {}
  for (const tx of transactions.filter(t => t.status === 'RETURNED')) {
    const cat = tx.book.category
    catMap[cat] = (catMap[cat] ?? 0) + 1
  }
  const topCats = Object.entries(catMap).sort((a,b) => b[1]-a[1]).slice(0,4)

  // Recent activity (last 5)
  const recent = transactions.slice(0, 4)

  const firstName = user?.firstName ?? 'Reader'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // Upcoming due date
  const nextDue = active.sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime())[0]
  const daysUntilDue = nextDue
    ? Math.ceil((nextDue.dueDate.getTime() - Date.now()) / 86400000)
    : null

  const stats = [
    { label: 'Books Read',         value: totalRead + active.length, sub: 'This year', color: 'border-blue-400' },
    { label: 'Currently Borrowed', value: active.length,             sub: 'Active loans', color: 'border-teal-500' },
    { label: 'Pending Requests',   value: requests.length,           sub: 'Awaiting approval', color: 'border-amber-400' },
    { label: 'Fines Outstanding',  value: `$${(fineTotal._sum.amount ?? 0).toFixed(2)}`, sub: fineTotal._sum.amount ? 'Please pay' : 'All clear', color: 'border-red-400' },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {firstName} ✦
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {active.length > 0
              ? `You have ${active.length} active borrow${active.length > 1 ? 's' : ''}${daysUntilDue !== null ? ` and 1 return due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}` : ''}.`
              : 'Welcome back to your library portal.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/user/browse" className="btn-primary text-sm px-4 py-2">
            📚 Browse Catalog
          </Link>
          <Link href="/user/request-book" className="btn-secondary text-sm px-4 py-2">
            Request Book
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`card border-t-2 ${s.color}`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent activity + reading progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recent.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No activity yet.</p>
            )}
            {recent.map(tx => (
              <div key={tx.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0
                  ${tx.status === 'RETURNED' ? 'bg-green-100' : tx.status === 'OVERDUE' ? 'bg-red-100' : 'bg-blue-100'}`}>
                  {tx.status === 'RETURNED' ? '✓' : tx.status === 'OVERDUE' ? '!' : ''}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {tx.status === 'RETURNED' ? 'Returned' : 'Borrowed'} <em>{tx.book.title}</em>
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(tx.issueDate)} ·{' '}
                    {tx.status === 'ACTIVE' ? `Due ${formatDate(tx.dueDate)}` : 'No fine'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reading progress */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Reading Progress</h2>

          {/* Active books progress bars */}
          <div className="space-y-4 mb-6">
            {active.map((tx, i) => {
              const total = tx.dueDate.getTime() - tx.issueDate.getTime()
              const elapsed = Date.now() - tx.issueDate.getTime()
              const pct = Math.min(Math.round((elapsed / total) * 100), 100)
              return (
                <div key={tx.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-800 truncate">{tx.book.title}</span>
                    <span className="text-gray-400 text-xs shrink-0 ml-2">{pct}%</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1.5">Due {formatDate(tx.dueDate)}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: i === 0 ? '#0d9488' : '#14b8a6',
                      }}
                    />
                  </div>
                </div>
              )
            })}
            {active.length === 0 && (
              <p className="text-sm text-gray-400">No active borrows. <Link href="/user/browse" className="text-teal-600 hover:underline">Browse books →</Link></p>
            )}
          </div>

          {/* Books by category */}
          {topCats.length > 0 && (
            <>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Books Read by Category</p>
              <div className="space-y-2">
                {topCats.map(([cat, count]) => {
                  const max = topCats[0][1]
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-28 truncate">{cat}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${(count/max)*100}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


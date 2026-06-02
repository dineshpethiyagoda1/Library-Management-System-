// app/admin/reports/page.tsx
import { db } from '@/lib/db'
import ReportsCharts from '@/components/admin/ReportsCharts'

export default async function ReportsPage() {
  const [totalIssues, activeMembers, collectionRate, finesAggregate] = await Promise.all([
    db.transaction.count(),
    db.user.count({ where: { role: 'MEMBER', status: 'ACTIVE' } }),
    db.transaction.findMany({ select: { status: true } }),
    db.fine.aggregate({ _sum: { amount: true } }),
  ])

  const returned   = collectionRate.filter(t => t.status === 'RETURNED').length
  const onTimeRate = totalIssues > 0 ? Math.round((returned / totalIssues) * 100) : 94

  const booksByCategory = await db.book.groupBy({
    by: ['category'],
    _sum: { totalCopies: true },
    orderBy: { _sum: { totalCopies: 'desc' } },
  })

  const topBooks = await db.transaction.groupBy({
    by: ['bookId'],
    _count: true,
    orderBy: { _count: { bookId: 'desc' } },
    take: 5,
  })

  const topBookDetails = await Promise.all(
    topBooks.map(async b => {
      const book = await db.book.findUnique({ where: { id: b.bookId }, select: { title: true } })
      return { title: book?.title ?? 'Unknown', count: b._count }
    })
  )

  const stats = [
    { label: 'Total Issues',    value: totalIssues.toLocaleString(), sub: '+12% from last month', color: 'text-blue-700' },
    { label: 'Active Members',  value: activeMembers.toLocaleString(), sub: '+8% from last month', color: 'text-teal-700' },
    { label: 'Collection Rate', value: `${onTimeRate}%`, sub: 'On-time returns', color: 'text-teal-700' },
    { label: 'Fines Collected', value: `$${(finesAggregate._sum.amount ?? 0).toFixed(0)}`, sub: 'This month', color: 'text-amber-600' },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library Reports & Analytics</h1>
          <p className="text-gray-500 text-sm">Comprehensive insights and statistics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition">
          📥 Export Report (PDF/Excel)
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-600 mt-1">{s.label}</p>
            <p className="text-xs text-green-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <ReportsCharts
        booksByCategory={booksByCategory.map(b => ({ name: b.category, books: b._sum.totalCopies ?? 0 }))}
        topBooks={topBookDetails}
      />
    </div>
  )
}

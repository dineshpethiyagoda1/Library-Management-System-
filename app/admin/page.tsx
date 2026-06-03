// app/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'

interface DashboardData {
  summary: {
    totalTitles: number
    totalCopies: number
    availableCopies: number
    totalMembers: number
    totalFines: number
    collectedFines: number
    outstandingFines: number
  }
  recentTransactions: Array<{
    id: string
    user: { firstName: string; lastName: string; email: string }
    book: { title: string }
    status: string
    fine: number
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Demo mock data for layout configuration before live API testing
    const mockData: DashboardData = {
      summary: {
        totalTitles: 11,
        totalCopies: 54,
        availableCopies: 36,
        totalMembers: 6,
        totalFines: 1.50,
        collectedFines: 1.50,
        outstandingFines: 0.00,
      },
      recentTransactions: [
        {
          id: 'tx_demo_1',
          user: { firstName: 'Aisha', lastName: 'Rahman', email: 'aisha@example.com' },
          book: { title: 'The Midnight Library' },
          status: 'ACTIVE',
          fine: 0,
          createdAt: '2026-05-28'
        },
        {
          id: 'tx_demo_2',
          user: { firstName: 'Michael', lastName: 'Chen', email: 'michael@example.com' },
          book: { title: 'Sapiens' },
          status: 'RETURNED',
          fine: 0,
          createdAt: '2026-05-26'
        }
      ]
    }
    setData(mockData)
    setLoading(false)
  }, [])

  if (loading || !data) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold font-serif mb-8 text-gray-800">Admin Overview</h1>
      
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Book Titles</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{data.summary.totalTitles}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Copies</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{data.summary.availableCopies} / {data.summary.totalCopies}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Members</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{data.summary.totalMembers}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Collected Fines</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">${data.summary.collectedFines.toFixed(2)}</div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 font-serif font-bold text-lg text-gray-800">Recent Transactions</div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-xs uppercase tracking-wider">
              <th className="p-4">Member</th>
              <th className="p-4">Book Title</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Fine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {data.recentTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/40">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{tx.user.firstName} {tx.user.lastName}</div>
                  <div className="text-xs text-gray-400">{tx.user.email}</div>
                </td>
                <td className="p-4 font-medium text-gray-800">{tx.book.title}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tx.status === 'ACTIVE' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                  }`}>{tx.status}</span>
                </td>
                <td className="p-4 text-right font-medium text-gray-900">${tx.fine.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}